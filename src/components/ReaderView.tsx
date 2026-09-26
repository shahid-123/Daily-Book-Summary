import React, { useState, useEffect, useRef } from 'react';
import {
  BookSummary,
  ReaderTheme,
  ReaderFont,
  ReaderFontSize,
  ReaderLineHeight,
} from '../types';
import { SUPPORTED_LANGUAGES, getUIStrings } from '../data/languages';
import { getInstantTranslatedBook, PRESET_BOOK_TRANSLATIONS } from '../data/bookTranslations';
import { useSpeechReader } from '../utils/useSpeechReader';
import { exportSummaryToPdf } from '../utils/pdfExport';
import { SneakPeekCard } from './SneakPeekCard';
import {
  BookOpen,
  Volume2,
  VolumeX,
  Play,
  Pause,
  FileDown,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  Sliders,
  Sparkles,
  Share2,
  Compass,
  Target,
  Quote,
  CheckSquare,
  Square,
  ArrowLeft,
  ChevronDown,
  Loader2,
  HelpCircle,
  HardDriveDownload,
  HardDrive,
  Check,
} from 'lucide-react';

interface Props {
  book: BookSummary;
  isRead: boolean;
  isFavorite: boolean;
  isSavedOffline: boolean;
  onMarkRead: (book: BookSummary) => void;
  onToggleFavorite: (bookId: string) => void;
  onToggleSaveOffline: (book: BookSummary) => void;
  onBack?: () => void;
  onPreviewTomorrow?: () => void;
  onLanguageChanged?: (langCode: string) => void;
}

export const ReaderView: React.FC<Props> = ({
  book,
  isRead,
  isFavorite,
  isSavedOffline,
  onMarkRead,
  onToggleFavorite,
  onToggleSaveOffline,
  onBack,
  onPreviewTomorrow,
  onLanguageChanged,
}) => {
  // Reading settings state
  const [theme, setTheme] = useState<ReaderTheme>('dark');
  const [font, setFont] = useState<ReaderFont>('lora');
  const [fontSize, setFontSize] = useState<ReaderFontSize>('md');
  const [lineHeight, setLineHeight] = useState<ReaderLineHeight>('normal');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [showTypographyMenu, setShowTypographyMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showImageDetails, setShowImageDetails] = useState(false);
  const [checkedChecklist, setCheckedChecklist] = useState<Record<number, boolean>>({});

  // Dynamic translated summary state
  const [currentSummary, setCurrentSummary] = useState<BookSummary>(book);
  const [isTranslating, setIsTranslating] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Speech Reader hook
  const {
    isPlaying,
    isPaused,
    rate,
    progressPercent,
    setRate,
    setVoiceForLanguage,
    playChunks,
    togglePauseResume,
    stop,
  } = useSpeechReader();

  // Reset or update current summary when prop book changes
  useEffect(() => {
    setCurrentSummary(book);
    setSelectedLanguage('en');
    stop();
    setCheckedChecklist({});
  }, [book.id]);

  // Construct audio chunks in the selected language
  const buildAudioChunks = (summaryToRead: BookSummary, langCode: string) => {
    const ui = getUIStrings(langCode);
    const chunks: string[] = [
      `${summaryToRead.title}. ${ui.byAuthor} ${summaryToRead.author}.`,
      summaryToRead.hook,
      `${ui.audioMainIdea} ${summaryToRead.coreThesis}`,
    ];

    if (summaryToRead.keyTakeaways && summaryToRead.keyTakeaways.length > 0) {
      summaryToRead.keyTakeaways.forEach((k, i) => {
        chunks.push(`${ui.audioLesson} ${i + 1}: ${k.title}.`);
        chunks.push(k.insight);
        chunks.push(`${ui.audioDrill} ${k.practicalDrill}`);
      });
    }

    if (summaryToRead.realLifeExample) {
      chunks.push(
        `${ui.audioStory} ${summaryToRead.realLifeExample.title}. ${summaryToRead.realLifeExample.story}.`
      );
      if (summaryToRead.realLifeExample.takeawayLesson) {
        chunks.push(`${ui.whatThisTeachesUs} ${summaryToRead.realLifeExample.takeawayLesson}`);
      }
    }

    if (summaryToRead.dailyMicroHabit) {
      chunks.push(`${ui.audioHabit} ${summaryToRead.dailyMicroHabit}`);
    }

    if (summaryToRead.memorableQuote && summaryToRead.memorableQuote.quote) {
      chunks.push(`${ui.audioQuote} ${summaryToRead.memorableQuote.quote}`);
    }

    return chunks;
  };

  // Handle language switch
  const handleSelectLanguage = async (langCode: string) => {
    setSelectedLanguage(langCode);
    setShowLanguageMenu(false);
    setVoiceForLanguage(langCode);
    onLanguageChanged?.(langCode);

    const wasPlaying = isPlaying;
    stop();

    if (langCode === 'en') {
      setCurrentSummary(book);
      if (wasPlaying) {
        setTimeout(() => {
          const chunks = buildAudioChunks(book, 'en');
          playChunks(chunks, 'en', rate);
        }, 150);
      }
      return;
    }

    // 1. Check instant preset translations (0ms delay for Hindi, Spanish, French, German, Japanese, etc.)
    const instantBook = getInstantTranslatedBook(book, langCode);
    const hasPreset = !!PRESET_BOOK_TRANSLATIONS[book.id]?.[langCode];

    if (hasPreset) {
      setCurrentSummary(instantBook);
      if (wasPlaying) {
        setTimeout(() => {
          const chunks = buildAudioChunks(instantBook, langCode);
          playChunks(chunks, langCode, rate);
        }, 150);
      }
      return;
    }

    // 2. Fallback to server translation endpoint for dynamic books or other languages
    try {
      setIsTranslating(true);
      const targetLangName =
        SUPPORTED_LANGUAGES.find((l) => l.code === langCode)?.name || langCode;

      const res = await fetch('/api/translate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary: book,
          targetLanguage: targetLangName,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.translatedSummary) {
          setCurrentSummary(data.translatedSummary);
          if (wasPlaying) {
            const chunks = buildAudioChunks(data.translatedSummary, langCode);
            playChunks(chunks, langCode, rate);
          }
        }
      }
    } catch (e) {
      console.warn('Translation failed or offline, retaining current book content', e);
    } finally {
      setIsTranslating(false);
    }
  };

  // Toggle checklist item
  const toggleChecklistItem = (idx: number) => {
    setCheckedChecklist((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Start or pause audio narration
  const handleStartAudio = () => {
    if (isPlaying) {
      togglePauseResume();
      return;
    }

    const chunks = buildAudioChunks(currentSummary, selectedLanguage);
    playChunks(chunks, selectedLanguage, rate);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Read "${currentSummary.title}" by ${currentSummary.author} on Shahid's BookPulse!\n"${currentSummary.hook}"`
      );
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Styling theme classes
  const themeClasses: Record<
    ReaderTheme,
    {
      container: string;
      card: string;
      text: string;
      subText: string;
      highlight: string;
      border: string;
      headerBg: string;
    }
  > = {
    dark: {
      container: 'bg-slate-950 text-slate-100',
      card: 'bg-slate-900/90 border-slate-800 text-slate-200',
      text: 'text-slate-100',
      subText: 'text-slate-400',
      highlight: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
      border: 'border-slate-800',
      headerBg: 'bg-slate-950/90',
    },
    sepia: {
      container: 'bg-[#fbf0d9] text-[#2c2214]',
      card: 'bg-[#f4e4c1]/70 border-[#dfcaa7] text-[#2c2214]',
      text: 'text-[#2b1f0f]',
      subText: 'text-[#6b583f]',
      highlight: 'bg-[#e4cb98]/50 border-[#cca868] text-[#553609]',
      border: 'border-[#dfcaa7]',
      headerBg: 'bg-[#fbf0d9]/90',
    },
    light: {
      container: 'bg-[#fafafa] text-slate-900',
      card: 'bg-white border-slate-200 text-slate-800 shadow-sm',
      text: 'text-slate-900',
      subText: 'text-slate-500',
      highlight: 'bg-amber-50 border-amber-300 text-amber-900',
      border: 'border-slate-200',
      headerBg: 'bg-white/90',
    },
  };

  // Font family styles
  const fontClass = {
    lora: 'font-serif [font-family:"Lora",serif]',
    playfair: 'font-serif [font-family:"Playfair Display",serif]',
    jakarta: 'font-sans [font-family:"Plus Jakarta Sans",sans-serif]',
    mono: 'font-mono [font-family:"JetBrains Mono",monospace]',
  }[font];

  // Font size styles
  const fontSizeClass = {
    sm: 'text-sm md:text-base leading-relaxed',
    md: 'text-base md:text-lg leading-relaxed',
    lg: 'text-lg md:text-xl leading-relaxed',
    xl: 'text-xl md:text-2xl leading-relaxed',
  }[fontSize];

  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage) || SUPPORTED_LANGUAGES[0];

  const currentTheme = themeClasses[theme];
  const ui = getUIStrings(selectedLanguage);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${currentTheme.container}`}>
      {/* Top Floating Control Bar - Spans full width */}
      <header
        className={`sticky top-0 z-30 border-b backdrop-blur-md transition-colors ${currentTheme.border} ${currentTheme.headerBg}`}
      >
        <div className="w-full max-w-[1720px] mx-auto flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3">
          {/* Back button and Book Title */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {onBack && (
              <button
                onClick={onBack}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all ${currentTheme.border} hover:bg-black/5 active:scale-95`}
                title="Back to Daily Showcase"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
                  {currentSummary.category}
                </span>
                <span className="text-slate-500 text-xs hidden sm:inline">•</span>
                <span className={`text-[11px] hidden sm:inline ${currentTheme.subText}`}>
                  {currentSummary.readTimeMinutes} {ui.minRead}
                </span>
              </div>
              <h2 className="text-xs sm:text-sm font-bold truncate max-w-[180px] sm:max-w-xs md:max-w-md">
                {currentSummary.title}
              </h2>
            </div>
          </div>

          {/* Quick Header Actions: Language, Typography, Save, Bookmark, PDF */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Language Switcher Button */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition-all ${
                  selectedLanguage !== 'en'
                    ? 'border-amber-500/60 bg-amber-500/10 text-amber-400'
                    : `${currentTheme.border} hover:bg-black/5`
                } active:scale-95`}
                title="Change Language & Voice"
              >
                <span className="text-base leading-none">{currentLangObj.flag}</span>
                <span className="hidden sm:inline font-medium">{currentLangObj.nativeName}</span>
                <ChevronDown className="h-3 w-3 opacity-70" />
              </button>

              {showLanguageMenu && (
                <div
                  className={`absolute right-0 mt-2 w-52 rounded-2xl border p-2 shadow-2xl backdrop-blur-xl z-50 ${
                    theme === 'dark'
                      ? 'bg-slate-900 border-slate-800'
                      : theme === 'sepia'
                      ? 'bg-[#f4e4c1] border-[#dfcaa7] text-[#2c2214]'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Select Language & Audio
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-1">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleSelectLanguage(lang.code)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-all ${
                          selectedLanguage === lang.code
                            ? 'bg-amber-500/20 text-amber-500 font-bold'
                            : 'hover:bg-black/5 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-base">{lang.flag}</span>
                          <span className="font-medium">{lang.name}</span>
                        </span>
                        <span className="text-[11px] opacity-75">{lang.nativeName}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Typography & Aesthetics Settings */}
            <div className="relative">
              <button
                onClick={() => setShowTypographyMenu(!showTypographyMenu)}
                className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all ${currentTheme.border} hover:bg-black/5 active:scale-95`}
                title="Reader Typography & Theme Settings"
              >
                <Sliders className="h-4 w-4" />
              </button>

              {showTypographyMenu && (
                <div
                  className={`absolute right-0 mt-2 w-72 rounded-2xl border p-4 shadow-2xl backdrop-blur-xl z-50 ${
                    theme === 'dark'
                      ? 'bg-slate-900 border-slate-800 text-slate-100'
                      : theme === 'sepia'
                      ? 'bg-[#f4e4c1] border-[#dfcaa7] text-[#2c2214]'
                      : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Reading Aesthetics
                  </h4>

                  {/* Themes */}
                  <div className="mb-4">
                    <span className="text-[11px] opacity-75 block mb-1.5 font-medium">Theme</span>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setTheme('dark')}
                        className={`rounded-xl border py-2 text-xs font-medium bg-slate-950 text-slate-100 border-slate-800 flex flex-col items-center gap-1 ${
                          theme === 'dark' ? 'ring-2 ring-amber-500' : ''
                        }`}
                      >
                        <span>Dark</span>
                      </button>
                      <button
                        onClick={() => setTheme('sepia')}
                        className={`rounded-xl border py-2 text-xs font-medium bg-[#fbf0d9] text-[#2c2214] border-[#dfcaa7] flex flex-col items-center gap-1 ${
                          theme === 'sepia' ? 'ring-2 ring-amber-500' : ''
                        }`}
                      >
                        <span>Sepia</span>
                      </button>
                      <button
                        onClick={() => setTheme('light')}
                        className={`rounded-xl border py-2 text-xs font-medium bg-white text-slate-900 border-slate-300 flex flex-col items-center gap-1 ${
                          theme === 'light' ? 'ring-2 ring-amber-500' : ''
                        }`}
                      >
                        <span>Light</span>
                      </button>
                    </div>
                  </div>

                  {/* Font Family */}
                  <div className="mb-4">
                    <span className="text-[11px] opacity-75 block mb-1.5 font-medium">Font</span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        onClick={() => setFont('lora')}
                        className={`rounded-xl border p-2 text-left font-serif ${
                          font === 'lora'
                            ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-bold'
                            : 'border-slate-700/50'
                        }`}
                      >
                        Lora Serif
                      </button>
                      <button
                        onClick={() => setFont('playfair')}
                        className={`rounded-xl border p-2 text-left font-serif ${
                          font === 'playfair'
                            ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-bold'
                            : 'border-slate-700/50'
                        }`}
                      >
                        Playfair
                      </button>
                      <button
                        onClick={() => setFont('jakarta')}
                        className={`rounded-xl border p-2 text-left font-sans ${
                          font === 'jakarta'
                            ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-bold'
                            : 'border-slate-700/50'
                        }`}
                      >
                        Jakarta Sans
                      </button>
                      <button
                        onClick={() => setFont('mono')}
                        className={`rounded-xl border p-2 text-left font-mono ${
                          font === 'mono'
                            ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-bold'
                            : 'border-slate-700/50'
                        }`}
                      >
                        Mono Code
                      </button>
                    </div>
                  </div>

                  {/* Font Size Scaling */}
                  <div>
                    <span className="text-[11px] opacity-75 block mb-1.5 font-medium">Text Size</span>
                    <div className="flex items-center justify-between gap-1 rounded-xl bg-black/10 p-1 border border-black/10">
                      {(['sm', 'md', 'lg', 'xl'] as ReaderFontSize[]).map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setFontSize(sz)}
                          className={`flex-1 py-1 rounded-lg text-xs font-semibold uppercase transition-all ${
                            fontSize === sz ? 'bg-amber-500 text-slate-950 font-bold' : 'hover:bg-black/5'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Offline Vault Save Button */}
            <button
              onClick={() => onToggleSaveOffline(currentSummary)}
              className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all ${
                isSavedOffline
                  ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                  : `${currentTheme.border} hover:bg-black/5`
              } active:scale-95`}
              title={isSavedOffline ? ui.offlineSaved : ui.saveOffline}
            >
              {isSavedOffline ? <HardDrive className="h-4 w-4" /> : <HardDriveDownload className="h-4 w-4" />}
            </button>

            {/* Favorite Bookmark */}
            <button
              onClick={() => onToggleFavorite(currentSummary.id)}
              className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all ${
                isFavorite
                  ? 'border-rose-500 bg-rose-500/20 text-rose-400'
                  : `${currentTheme.border} hover:bg-black/5`
              } active:scale-95`}
              title={isFavorite ? 'In Favorites' : 'Add to Favorites'}
            >
              {isFavorite ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            </button>

            {/* PDF Export Button */}
            <button
              onClick={() => exportSummaryToPdf(currentSummary)}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-1.5 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 active:scale-95 transition-all"
              title="Download Clean PDF Summary"
            >
              <FileDown className="h-4 w-4" />
              <span className="hidden sm:inline">{ui.pdfExport}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Translation in progress indicator */}
      {isTranslating && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-center text-xs font-semibold flex items-center justify-center gap-2 animate-pulse">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Translating summary into {currentLangObj.name} in simple everyday language...</span>
        </div>
      )}

      {/* Main Full-Width Two-Section Container (Utilizing Entire Space) */}
      <main className="w-full max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
          
          {/* ======================================================== */}
          {/* LEFT SECTION (Col 5): Pictures, Real-Life Examples, Habits, Quotes, Checklist */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-5">
            {/* 1. AI Generated Visual Context Metaphor Picture */}
            <section>
              <div className={`overflow-hidden rounded-2xl border shadow-lg ${currentTheme.card}`}>
                <div className="h-56 sm:h-64 xl:h-72 w-full overflow-hidden flex items-center justify-center bg-slate-950">
                  {currentSummary.contextImage ? (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      dangerouslySetInnerHTML={{ __html: currentSummary.contextImage }}
                    />
                  ) : (
                    <div className="text-slate-500 text-sm flex items-center gap-2">
                      <Compass className="h-5 w-5" /> Visual metaphor rendering
                    </div>
                  )}
                </div>

                <div className="px-4 py-3 flex items-center justify-between border-t border-slate-800/60 bg-black/15">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                    <span className="font-semibold text-amber-400">Context Visual Metaphor</span>
                    <span className="text-slate-400 hidden sm:inline">• Visualized concept</span>
                  </div>
                  <button
                    onClick={() => setShowImageDetails(!showImageDetails)}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-medium"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Metaphor Idea</span>
                  </button>
                </div>

                {showImageDetails && (
                  <div className="px-4 pb-3.5 text-xs text-slate-400 border-t border-slate-800/40 pt-2.5">
                    <p className="italic">
                      "{currentSummary.visualContextPrompt || 'Symbolic representation of compound growth and discipline'}"
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* 2. Real-Life Story & Example Card */}
            {currentSummary.realLifeExample && (
              <section className={`rounded-2xl border p-5 sm:p-6 shadow-md ${currentTheme.card}`}>
                <div className="flex items-center justify-between border-b pb-3 mb-3 border-slate-700/30">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                    <Compass className="w-4 h-4" />
                    {ui.realStoryTitle}
                  </span>
                  <span className="text-[11px] opacity-70 font-sans">{ui.trueExample}</span>
                </div>

                <h3 className="text-base sm:text-lg font-bold font-serif mb-2.5">
                  {currentSummary.realLifeExample.title}
                </h3>

                <div className="whitespace-pre-line text-sm leading-relaxed opacity-90 mb-4 font-sans">
                  {currentSummary.realLifeExample.story}
                </div>

                <div className="rounded-xl bg-amber-500/10 border border-amber-500/25 p-3.5 text-xs sm:text-sm">
                  <strong className="text-amber-400 font-bold block mb-1">
                    {ui.whatThisTeachesUs}
                  </strong>
                  <p className="opacity-95 font-sans leading-relaxed">
                    {currentSummary.realLifeExample.takeawayLesson}
                  </p>
                </div>
              </section>
            )}

            {/* 3. Daily 60-Second Micro-Habit */}
            {currentSummary.dailyMicroHabit && (
              <section className="rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 p-5 sm:p-6 shadow-md">
                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {ui.microHabitTitle}
                  </span>
                </div>
                <p className="text-sm sm:text-base font-medium text-emerald-100 leading-relaxed font-sans">
                  {currentSummary.dailyMicroHabit}
                </p>
              </section>
            )}

            {/* 4. Memorable Quote Card */}
            {currentSummary.memorableQuote && (
              <section className="relative rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 p-5 sm:p-6 text-center shadow-md">
                <Quote className="h-6 w-6 mx-auto text-amber-400 opacity-60 mb-1.5" />
                <blockquote className="text-base sm:text-lg font-serif italic text-amber-100 font-medium leading-relaxed mb-2.5">
                  “{currentSummary.memorableQuote.quote}”
                </blockquote>
                <cite className="text-[11px] font-sans uppercase tracking-widest text-amber-400/80 not-italic block">
                  — {currentSummary.author}
                  {currentSummary.memorableQuote.context
                    ? `, ${currentSummary.memorableQuote.context}`
                    : ''}
                </cite>
              </section>
            )}

            {/* 5. Immediate Action Checklist */}
            {currentSummary.actionChecklist && currentSummary.actionChecklist.length > 0 && (
              <section className={`rounded-2xl border p-5 shadow-md ${currentTheme.card}`}>
                <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-amber-500 mb-3">
                  <CheckSquare className="w-4 h-4" />
                  {ui.checklistTitle}
                </h3>
                <div className="space-y-2">
                  {currentSummary.actionChecklist.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => toggleChecklistItem(idx)}
                      className={`w-full flex items-start gap-2.5 rounded-xl border p-3 text-left text-xs sm:text-sm transition-all font-sans ${
                        checkedChecklist[idx]
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 line-through'
                          : 'hover:border-amber-500/40 bg-black/10'
                      }`}
                    >
                      <span className="mt-0.5 shrink-0 text-emerald-400">
                        {checkedChecklist[idx] ? (
                          <CheckSquare className="w-4 h-4" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500" />
                        )}
                      </span>
                      <span>{item}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ======================================================== */}
          {/* RIGHT SECTION (Col 7): Book Summary, Audio Player, Key Lessons, Sneak Peek */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-5">
            {/* 1. Book Header & Hook Banner */}
            <div className={`rounded-2xl border p-5 sm:p-6 shadow-md ${currentTheme.card}`}>
              <div className="flex flex-wrap items-center gap-2 text-xs mb-3">
                <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 font-bold text-amber-500 border border-amber-500/30">
                  {currentSummary.category}
                </span>
                <span className={currentTheme.subText}>•</span>
                <span className={currentTheme.subText}>
                  {currentSummary.readTimeMinutes} {ui.minRead}
                </span>
                {currentSummary.year && (
                  <>
                    <span className={currentTheme.subText}>•</span>
                    <span className={currentTheme.subText}>{currentSummary.year}</span>
                  </>
                )}
                {isSavedOffline && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/30">
                    <HardDrive className="w-3 h-3" /> {ui.offlineReady}
                  </span>
                )}
              </div>

              <h1 className={`text-2xl sm:text-3xl xl:text-4xl font-extrabold tracking-tight mb-2 ${fontClass}`}>
                {currentSummary.title}
              </h1>

              <p className={`text-sm sm:text-base font-medium mb-4 ${currentTheme.subText}`}>
                {ui.byAuthor} <span className="font-bold text-amber-500">{currentSummary.author}</span>
              </p>

              {/* Motivational Hook Banner */}
              <div className={`rounded-xl border p-4 transition-all ${currentTheme.highlight}`}>
                <p className="text-sm sm:text-base font-serif italic leading-relaxed">
                  "{currentSummary.hook}"
                </p>
              </div>
            </div>

            {/* 2. Interactive Audio Narration Bar */}
            <div
              className={`rounded-2xl border p-4 shadow-md backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 ${currentTheme.card}`}
            >
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleStartAudio}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30 hover:bg-amber-400 active:scale-95 transition-all"
                  title={isPlaying && !isPaused ? ui.pausedNarration : ui.listenButton}
                >
                  {isPlaying && !isPaused ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5 translate-x-0.5" />
                  )}
                </button>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1">
                      <Volume2 className="h-3.5 w-3.5" />
                      {ui.voiceReader}
                    </span>
                    <span className="text-[11px] text-slate-400 truncate">
                      {isPlaying
                        ? isPaused
                          ? ui.pausedNarration
                          : ui.playingNarration
                        : `${ui.listenInLang} (${currentLangObj.nativeName})`}
                    </span>
                  </div>
                  <p className="text-xs truncate font-medium opacity-80">
                    {currentSummary.title} • {rate}x speed
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {/* Speed toggle pills */}
                <div className="flex items-center rounded-xl bg-black/10 p-0.5 border border-black/10 text-xs">
                  {[0.8, 1.0, 1.25, 1.5].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => {
                        setRate(spd);
                        if (isPlaying) {
                          stop();
                          setTimeout(handleStartAudio, 100);
                        }
                      }}
                      className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                        rate === spd ? 'bg-amber-500 text-slate-950 font-bold' : 'hover:opacity-80'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>

                {isPlaying && (
                  <button
                    onClick={stop}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    title="Stop Audio"
                  >
                    <VolumeX className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* 3. Section 1: The Main Idea */}
            <section className={`rounded-2xl border p-5 sm:p-6 shadow-md ${currentTheme.card}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/20 text-xs font-bold text-amber-500">
                  1
                </span>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                  {ui.mainIdeaTitle}
                </h2>
              </div>
              <div className={`whitespace-pre-line leading-relaxed opacity-95 ${fontClass} ${fontSizeClass}`}>
                {currentSummary.coreThesis}
              </div>
            </section>

            {/* 4. Section 2: Key Lessons & Easy Action Steps */}
            <section className={`rounded-2xl border p-5 sm:p-6 shadow-md ${currentTheme.card}`}>
              <div className="flex items-center gap-2 mb-4">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/20 text-xs font-bold text-amber-500">
                  2
                </span>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                  {ui.keyLessonsTitle}
                </h2>
              </div>

              <div className="space-y-4">
                {currentSummary.keyTakeaways.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-700/40 bg-black/10 p-4 sm:p-5 transition-all hover:border-amber-500/40"
                  >
                    <h3 className="text-base sm:text-lg font-bold text-amber-500 mb-1.5 flex items-center gap-2">
                      <span>{idx + 1}.</span>
                      <span>{item.title}</span>
                    </h3>
                    <p className={`opacity-90 leading-relaxed mb-3 ${fontClass} ${fontSizeClass}`}>
                      {item.insight}
                    </p>

                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs sm:text-sm">
                      <span className="font-bold text-amber-400 block mb-1 flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5" />
                        {ui.actionDrillTitle}
                      </span>
                      <p className="opacity-95 font-sans leading-relaxed">
                        {item.practicalDrill}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Tomorrow's Sneak Peek Card */}
            {currentSummary.nextDaySneakPeek && (
              <SneakPeekCard
                sneakPeek={currentSummary.nextDaySneakPeek}
                onPreviewTomorrow={onPreviewTomorrow}
              />
            )}

            {/* 6. Milestone Progress Celebration & Action Buttons */}
            <div className={`rounded-2xl border p-4 sm:p-5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 ${currentTheme.card}`}>
              <button
                onClick={() => onMarkRead(currentSummary)}
                className={`w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-xl px-5 py-3 text-xs sm:text-sm font-bold shadow-lg transition-all active:scale-95 ${
                  isRead
                    ? 'bg-emerald-600 text-white shadow-emerald-600/30 hover:bg-emerald-500'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-amber-500/25 hover:from-amber-400 hover:to-amber-500'
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{isRead ? ui.markedRead : ui.markRead}</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => exportSummaryToPdf(currentSummary)}
                  className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition-all ${currentTheme.border} hover:bg-black/5 active:scale-95`}
                >
                  <FileDown className="h-4 w-4 text-amber-500" />
                  <span>{ui.pdfExport}</span>
                </button>

                <button
                  onClick={handleShare}
                  className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition-all ${currentTheme.border} hover:bg-black/5 active:scale-95`}
                >
                  <Share2 className="h-4 w-4" />
                  <span>{copiedLink ? 'Copied Quote!' : 'Share'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};
