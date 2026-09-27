import { useState, useEffect, useRef, useCallback } from 'react';
import { SUPPORTED_LANGUAGES } from '../data/languages';

export function useSpeechReader() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState<number>(1.0);
  const [progressPercent, setProgressPercent] = useState<number>(0);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const textQueueRef = useRef<string[]>([]);
  const currentIndexRef = useRef<number>(0);

  // Load available voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Set voice based on language code
  const setVoiceForLanguage = useCallback(
    (langCode: string) => {
      const voices =
        availableVoices.length > 0
          ? availableVoices
          : typeof window !== 'undefined' && 'speechSynthesis' in window
          ? window.speechSynthesis.getVoices()
          : [];
      if (voices.length === 0) return;

      const langConfig = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
      const prefix = langConfig ? langConfig.speechLocale.split('-')[0].toLowerCase() : 'en';
      const locale = langConfig ? langConfig.speechLocale.toLowerCase() : 'en-us';
      const langName = langConfig ? langConfig.name.toLowerCase() : '';

      // 1. Exact locale match (e.g. hi-IN or hi_IN)
      let match = voices.find(
        (v) =>
          v.lang.toLowerCase() === locale ||
          v.lang.toLowerCase().replace('_', '-') === locale
      );

      // 2. Starts with language prefix (e.g. 'hi')
      if (!match) {
        match = voices.find((v) => v.lang.toLowerCase().startsWith(prefix));
      }

      // 3. Name contains language name (e.g. "Google हिन्दी" or "Lekha" or "Hindi")
      if (!match && langName) {
        match = voices.find(
          (v) =>
            v.name.toLowerCase().includes(langName) ||
            v.lang.toLowerCase().includes(langCode.toLowerCase())
        );
      }

      // 4. Fallback to first available
      if (!match) {
        match = voices[0];
      }

      if (match) {
        setSelectedVoice(match);
      }
    },
    [availableVoices]
  );

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setProgressPercent(0);
  }, []);

  const playChunks = useCallback(
    (chunks: string[], langCode: string = 'en', playbackRate: number = 1.0) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

      stop();
      textQueueRef.current = chunks.filter((c) => c && c.trim().length > 0);
      currentIndexRef.current = 0;

      if (textQueueRef.current.length === 0) return;

      const langConfig = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
      const prefix = langConfig ? langConfig.speechLocale.split('-')[0].toLowerCase() : 'en';
      const locale = langConfig ? langConfig.speechLocale.toLowerCase() : 'en-us';
      const langName = langConfig ? langConfig.name.toLowerCase() : '';

      // Pick best voice for this language
      const voices = window.speechSynthesis.getVoices();
      let voice =
        voices.find(
          (v) =>
            v.lang.toLowerCase() === locale ||
            v.lang.toLowerCase().replace('_', '-') === locale
        ) ||
        voices.find((v) => v.lang.toLowerCase().startsWith(prefix)) ||
        (langName ? voices.find((v) => v.name.toLowerCase().includes(langName)) : null) ||
        selectedVoice ||
        voices[0];

      if (voice) {
        setSelectedVoice(voice);
      }

      const speakNextChunk = () => {
        if (currentIndexRef.current >= textQueueRef.current.length) {
          setIsPlaying(false);
          setIsPaused(false);
          setProgressPercent(100);
          return;
        }

        const chunkText = textQueueRef.current[currentIndexRef.current];
        const utterance = new SpeechSynthesisUtterance(chunkText);
        utteranceRef.current = utterance;

        if (voice) {
          utterance.voice = voice;
        }
        utterance.rate = playbackRate;
        utterance.lang = langConfig?.speechLocale || 'en-US';

        utterance.onstart = () => {
          setIsPlaying(true);
          setIsPaused(false);
          const percent = Math.round(
            (currentIndexRef.current / textQueueRef.current.length) * 100
          );
          setProgressPercent(percent);
        };

        utterance.onend = () => {
          currentIndexRef.current += 1;
          speakNextChunk();
        };

        utterance.onerror = (e) => {
          console.warn('Speech synthesis error or canceled:', e);
          setIsPlaying(false);
          setIsPaused(false);
        };

        window.speechSynthesis.speak(utterance);
      };

      speakNextChunk();
    },
    [selectedVoice, stop]
  );

  const togglePauseResume = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    } else if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, [isPlaying, isPaused]);

  return {
    isPlaying,
    isPaused,
    availableVoices,
    selectedVoice,
    rate,
    progressPercent,
    setRate,
    setVoiceForLanguage,
    playChunks,
    togglePauseResume,
    stop,
  };
}
