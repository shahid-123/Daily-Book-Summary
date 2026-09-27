import { BookSummary } from '../types';

export const POPULAR_BOOK_PRESETS: Record<string, Partial<BookSummary>> = {
  'thinking, fast and slow': {
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    category: 'Mindset',
    readTimeMinutes: 8,
    hook: 'Your mind runs on two engines: a fast gut-feeling engine and a slow logical engine. Knowing when to switch between them protects you from costly life and financial mistakes.',
    coverGradient: 'from-amber-600 via-orange-600 to-slate-900',
    accentColor: '#f59e0b',
    contextImage: `<svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover">
      <defs>
        <radialGradient id="systemGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.9"/>
          <stop offset="60%" stop-color="#b45309" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#0f172a" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="400" height="240" fill="#0b0f19"/>
      <circle cx="140" cy="120" r="65" fill="#f59e0b" fill-opacity="0.15" stroke="#f59e0b" stroke-width="2"/>
      <circle cx="260" cy="120" r="65" fill="#38bdf8" fill-opacity="0.15" stroke="#38bdf8" stroke-width="2"/>
      <text x="100" y="115" fill="#fbbf24" font-weight="bold" font-size="12" font-family="sans-serif">SYSTEM 1</text>
      <text x="95" y="135" fill="#fde68a" font-size="10" font-family="sans-serif">Fast &amp; Intuitive</text>
      <text x="220" y="115" fill="#38bdf8" font-weight="bold" font-size="12" font-family="sans-serif">SYSTEM 2</text>
      <text x="215" y="135" fill="#bae6fd" font-size="10" font-family="sans-serif">Slow &amp; Logical</text>
      <path d="M 180 85 L 220 85 M 220 155 L 180 155" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    visualContextPrompt: 'A dual-mind visual showing System 1 (fast emotional intuition) balancing with System 2 (slow, rigorous logic).',
    coreThesis: `Daniel Kahneman, who won the Nobel Prize in Economics, reveals that our choices are shaped by two distinct modes of thought: System 1 (fast, automatic, effortless) and System 2 (slow, deliberate, analytical).

Because System 2 is lazy and consumes heavy mental energy, our brains default to System 1 heuristics. While heuristics help us survive daily life, they produce predictable cognitive biases—like jumping to conclusions (WYSIATI), anchoring on first numbers, and letting loss aversion paralyze our growth. By learning to recognize these traps, we can intentionally slow down when it matters most.`,
    keyTakeaways: [
      {
        title: 'System 1 (Autopilot) vs System 2 (Effortful)',
        insight: 'System 1 reads facial emotions and dodges obstacles automatically. System 2 solves complex math and parses difficult contracts. Do not let your tired autopilot make life-changing decisions.',
        practicalDrill: 'When facing a high-stakes decision, sleep on it for 24 hours so System 2 can review the numbers with a fresh mind.'
      },
      {
        title: 'WYSIATI (What You See Is All There Is)',
        insight: 'Our brains quickly construct complete stories from whatever few facts are immediately visible, completely ignoring everything we do not know.',
        practicalDrill: 'Before signing or agreeing to an offer today, write down 3 critical facts you might be missing.'
      },
      {
        title: 'Loss Aversion (Pain Outweighs Pleasure)',
        insight: 'Psychologically, the pain of losing $100 feels twice as intense as the joy of winning $100. This fear often causes people to avoid smart, calculated risks.',
        practicalDrill: 'Ask yourself: "If I did not already own or run this, would I choose to invest in it today?"'
      },
      {
        title: 'The Premortem Technique',
        insight: 'Overconfidence blinds us to future stumbling blocks. Asking teams to imagine that a plan has already failed reveals hidden blind spots before work begins.',
        practicalDrill: 'Imagine your current biggest project failed 6 months from now. Write down the top 2 reasons why.'
      }
    ],
    realLifeExample: {
      title: 'Daniel Kahneman\'s Israeli Flight Instructor Feedback Study',
      story: 'While coaching Israeli Air Force flight instructors, Kahneman argued that praise improves performance more than punishment. An instructor strongly disagreed, saying that whenever he yelled at a cadet after a bad landing, the cadet flew better the next time, but whenever he praised a superb landing, the cadet flew worse next time. Kahneman proved that this was not praise or punishment at work—it was simple "regression to the mean." Extreme high and low performances naturally drift back toward the average by pure statistical probability. The instructor\'s fast brain had created a false story of cause and effect where only statistics existed.',
      takeawayLesson: 'Do not confuse natural statistical fluctuations with cause and effect. Exceptional highs and lows naturally drift back to average.'
    },
    dailyMicroHabit: 'The 60-Second Anchor Shield: Whenever someone states a price, deadline, or number, cross it out and calculate your own independent estimate first.',
    memorableQuote: {
      quote: 'We can be blind to the obvious, and we are also blind to our blindness.',
      context: 'Chapter 1: The Characters of the Story'
    },
    actionChecklist: [
      'Write down your top priority today and conduct a 2-minute premortem on what could derail it.',
      'Check whether loss aversion is stopping you from leaving a bad situation.',
      'Pause for 5 seconds before replying to urgent emotional emails.'
    ]
  },
  'the 7 habits of highly effective people': {
    title: 'The 7 Habits of Highly Effective People',
    author: 'Stephen R. Covey',
    category: 'Leadership',
    readTimeMinutes: 9,
    hook: 'True effectiveness does not come from superficial tricks or charm. It comes from character, aligning your daily actions with timeless principles, and shifting from dependence to interdependence.',
    coverGradient: 'from-blue-700 via-indigo-800 to-slate-950',
    accentColor: '#3b82f6',
    contextImage: `<svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover">
      <defs>
        <linearGradient id="coveyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#3b82f6"/>
          <stop offset="100%" stop-color="#10b981"/>
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="#090d16"/>
      <circle cx="200" cy="120" r="80" stroke="#334155" stroke-width="2" stroke-dasharray="4 4"/>
      <circle cx="200" cy="120" r="50" fill="url(#coveyGrad)" fill-opacity="0.25" stroke="#38bdf8" stroke-width="2"/>
      <circle cx="200" cy="120" r="20" fill="#38bdf8"/>
      <text x="140" y="125" fill="#f8fafc" font-weight="bold" font-size="11" font-family="sans-serif">CIRCLE OF INFLUENCE</text>
      <text x="135" y="35" fill="#94a3b8" font-size="10" font-family="sans-serif">Circle of Concern (Worry)</text>
    </svg>`,
    visualContextPrompt: 'The Circle of Influence expanding outwards, showing proactive character replacing passive worry.',
    coreThesis: `Stephen Covey demonstrates that lasting personal and professional triumph begins with private victories (self-mastery) before public victories (teamwork and communication).

Instead of focusing on reactive excuses and external circumstances, effective people expand their Circle of Influence. By beginning with the end in mind and putting first things first, they build trust, seek mutual benefit, and renew their mental and physical energy consistently.`,
    keyTakeaways: [
      {
        title: 'Habit 1: Be Proactive (Circle of Influence)',
        insight: 'Between stimulus and response lies your freedom to choose. Reactive people complain about things they cannot change; proactive people channel their energy into things they control.',
        practicalDrill: 'Catch yourself saying "I have to" today, and replace it with "I choose to."'
      },
      {
        title: 'Habit 2: Begin with the End in Mind',
        insight: 'All things are created twice: first in the mind, then in physical reality. Ensure that the ladder you are climbing is leaning against the right wall.',
        practicalDrill: 'Write down the single sentence you want loved ones and colleagues to remember you for.'
      },
      {
        title: 'Habit 3: Put First Things First',
        insight: 'Urgent things scream for attention, while important things whisper. High performers spend their best energy on Quadrant II tasks—preparation, prevention, and relationship-building.',
        practicalDrill: 'Schedule two 90-minute blocks this week strictly for important, non-urgent strategic goals.'
      },
      {
        title: 'Habit 5: Seek First to Understand, Then to Be Understood',
        insight: 'Most people do not listen with the intent to understand; they listen with the intent to reply. Empathetic listening unlocks true collaboration.',
        practicalDrill: 'In your next conversation, summarize the other person’s point of view to their satisfaction before sharing your own opinion.'
      }
    ],
    realLifeExample: {
      title: 'Stephen Covey\'s New York Subway Paradigm Shift',
      story: 'On a quiet Sunday morning on a New York subway, a man boarded with his young children. The kids immediately began yelling, throwing things, and disturbing peaceful passengers while the father sat motionless with his head in his hands. Irritated by the lack of discipline, Covey turned to the father and said firmly that his children were bothering everyone. The father softly looked up and said: "You are right. I guess I should do something about it. We just came from the hospital where their mother died an hour ago. I don\'t know what to think, and I guess they don\'t know how to handle it either." In an instant, Covey experienced a total paradigm shift. Irritation vanished and was replaced by deep compassion and an eagerness to help.',
      takeawayLesson: 'Before judging someone\'s actions, understand their perspective. Shifting your paradigm changes how you view the entire world.'
    },
    dailyMicroHabit: 'The Proactive Pause: When an annoying obstacle happens, pause for 3 seconds and ask: "What is within my power to fix right now?"',
    memorableQuote: {
      quote: 'I am not a product of my circumstances. I am a product of my decisions.',
      context: 'Habit 1: Principles of Personal Vision'
    },
    actionChecklist: [
      'List one thing you worried about yesterday that was outside your control, and let it go.',
      'Plan your top 3 Quadrant II (important, not urgent) priorities for tomorrow.',
      'Practice listening without interrupting in your next discussion.'
    ]
  },
  'start with why': {
    title: 'Start With Why',
    author: 'Simon Sinek',
    category: 'Leadership',
    readTimeMinutes: 7,
    hook: 'People do not buy what you do; they buy why you do it. Inspiring leaders and companies communicate from the inside out, starting with their core purpose.',
    coverGradient: 'from-amber-600 via-rose-700 to-slate-900',
    accentColor: '#f43f5e',
    contextImage: `<svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover">
      <defs>
        <radialGradient id="goldenCircle" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#f43f5e"/>
          <stop offset="100%" stop-color="#881337"/>
        </radialGradient>
      </defs>
      <rect width="400" height="240" fill="#0c0a09"/>
      <circle cx="200" cy="120" r="90" stroke="#44403c" stroke-width="2"/>
      <circle cx="200" cy="120" r="60" stroke="#f59e0b" stroke-width="2"/>
      <circle cx="200" cy="120" r="30" fill="url(#goldenCircle)"/>
      <text x="185" y="125" fill="#ffffff" font-weight="bold" font-size="12" font-family="sans-serif">WHY</text>
      <text x="185" y="75" fill="#f59e0b" font-weight="bold" font-size="11" font-family="sans-serif">HOW</text>
      <text x="182" y="42" fill="#a8a29e" font-weight="bold" font-size="11" font-family="sans-serif">WHAT</text>
    </svg>`,
    visualContextPrompt: 'The Golden Circle diagram with WHY glowing brightly at the center, radiating outward to HOW and WHAT.',
    coreThesis: `Simon Sinek discovered that all inspiring leaders throughout history—from Martin Luther King Jr. to the Wright Brothers and Apple—think, act, and communicate in the exact same way: from the inside out.

Most businesses communicate from the outside in (What they make, then How they make it, rarely knowing Why). But human decision-making is governed by the limbic brain, which controls gut feelings, emotion, and loyalty, but lacks capacity for language. When you start with Why, you speak directly to the emotional center of decision-making.`,
    keyTakeaways: [
      {
        title: 'The Golden Circle Framework',
        insight: 'WHY is your purpose, cause, or belief. HOW are the guiding principles and values. WHAT is the tangible product or service you sell. Always lead with WHY.',
        practicalDrill: 'Write down your personal WHY in one simple sentence: "To inspire people to do the things that inspire them so that together we can change the world."'
      },
      {
        title: 'Inspiration Over Manipulation',
        insight: 'Manipulations (price drops, promos, fear tactics) create transactions, but inspiration creates fierce, lasting loyalty.',
        practicalDrill: 'Audit your resume or company pitch: remove fear or feature lists and articulate the core conviction first.'
      },
      {
        title: 'The Celery Test for Decision Making',
        insight: 'If your Why is to be healthy, you buy celery and water at the store, not cookies. Your Why acts as a razor to filter out bad opportunities.',
        practicalDrill: 'Evaluate your current project ideas against your core Why; drop anything that fails the Celery Test.'
      },
      {
        title: 'Why-Types Need How-Types',
        insight: 'Visionaries with wild dreams (Why-types) need disciplined, detail-oriented operators (How-types) to build lasting institutions.',
        practicalDrill: 'Identify whether you are a Why-type visionary or a How-type builder, and partner with your counterpart.'
      }
    ],
    realLifeExample: {
      title: 'The Wright Brothers vs. Samuel Pierpont Langley',
      story: 'In the early 1900s, Samuel Pierpont Langley had everything needed to conquer human flight: a $50,000 government grant, a fellowship at the Smithsonian, Harvard backing, and national press coverage. Meanwhile, Orville and Wilbur Wright had zero funding, no college degrees, and paid for their experiments from their humble bicycle shop profits. The difference was their starting point: Langley wanted fame, glory, and wealth (his drive was the WHAT). The Wright brothers believed passionately that if humans could fly, it would unite the world (their drive was the WHY). Their team worked through freezing cold and repeated crashes because they believed in the mission. On December 17, 1903, the Wright brothers took to the skies, and Langley quit the same day because he lost the chance for fame.',
      takeawayLesson: 'When you are driven by a compelling belief, you inspire people to stick with you through setbacks until breakthrough is achieved.'
    },
    dailyMicroHabit: 'The "Why First" Agenda: Before opening any meeting or email thread, state the underlying purpose in one clear sentence.',
    memorableQuote: {
      quote: 'People don’t buy what you do; they buy why you do it.',
      context: 'Chapter 3: The Golden Circle'
    },
    actionChecklist: [
      'Draft your core Why statement.',
      'Check whether your marketing leads with benefits or belief.',
      'Find a partner whose skills complement your natural Why or How orientation.'
    ]
  },
  'essentialism: the disciplined pursuit of less': {
    title: 'Essentialism: The Disciplined Pursuit of Less',
    author: 'Greg McKeown',
    category: 'Productivity',
    readTimeMinutes: 7,
    hook: 'If you don’t prioritize your life, someone else will. Essentialism is not about getting more things done; it’s about getting the right things done.',
    coverGradient: 'from-slate-800 via-cyan-900 to-slate-950',
    accentColor: '#06b6d4',
    contextImage: `<svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover">
      <rect width="400" height="240" fill="#090d16"/>
      <circle cx="120" cy="120" r="18" fill="#64748b"/>
      <path d="M 120 120 L 70 80 M 120 120 L 170 80 M 120 120 L 70 160 M 120 120 L 170 160 M 120 120 L 60 120 M 120 120 L 180 120 M 120 120 L 120 60 M 120 120 L 120 180" stroke="#64748b" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="280" cy="120" r="18" fill="#06b6d4"/>
      <line x1="280" y1="120" x2="280" y2="35" stroke="#06b6d4" stroke-width="5" stroke-linecap="round"/>
      <polygon points="280,25 273,42 287,42" fill="#06b6d4"/>
      <text x="65" y="210" fill="#94a3b8" font-size="10" font-family="sans-serif">Scattered energy on many things</text>
      <text x="235" y="210" fill="#67e8f9" font-weight="bold" font-size="10" font-family="sans-serif">Massive momentum on ONE thing</text>
    </svg>`,
    visualContextPrompt: 'Two circles comparing scattered multidirectional effort with a single powerful arrow advancing in one direction.',
    coreThesis: `The way of the Essentialist is the relentless pursuit of less, but better. When we try to do it all and say yes to everyone, we make a millimeter of progress in a million directions.

By applying rigorous criteria to what matters, courageously saying no to the non-essential, and creating buffers and boundaries, we channel our highest contribution toward what truly moves the needle.`,
    keyTakeaways: [
      {
        title: 'The 90 Percent Rule',
        insight: 'When evaluating an opportunity, rate it from 0 to 100 on your criteria. If it scores below 90, reject it. If it is not a clear YES, it should be a NO.',
        practicalDrill: 'Look at your calendar invites for this week. Politely decline one event that is not an absolute 90%+ priority.'
      },
      {
        title: 'The Trade-off Reality',
        insight: 'We cannot have it all. Instead of asking "How can I do both?", ask "Which problem do I want to solve?" Choosing what to give up is the essence of strategy.',
        practicalDrill: 'Pick between two competing tasks on your desk right now; drop one entirely for today.'
      },
      {
        title: 'The Graceful "No"',
        insight: 'Saying no is uncomfortable for five seconds; saying yes to the wrong thing causes weeks of regret. Separate the decision from the relationship.',
        practicalDrill: 'Practice this phrase: "I would love to help, but I am fully committed to finishing [X] right now."'
      }
    ],
    realLifeExample: {
      title: 'How a Silicon Valley Executive Saved His Health by Saying No',
      story: 'A senior tech executive was completely burned out, working 80 hours a week across endless committees and meetings. Feeling trapped, he considered quitting. An advisor suggested a radical test: stay at the company, but quietly refuse every single request and meeting that was not absolutely vital to his core project. He stopped attending status meetings and politely declined non-essential requests. Expecting fury from his boss, the exact opposite happened: freed from busywork, the quality of his core work skyrocketed, and he was promoted with the highest evaluation of his career.',
      takeawayLesson: 'Respect comes from having clear priorities. Saying no to the trivial many unlocks excellence in the vital few.'
    },
    dailyMicroHabit: 'The Priority One Card: Every morning on a 3x5 card, write down the ONE thing that must get done today. Hide your to-do list until it is finished.',
    memorableQuote: {
      quote: 'If you don’t prioritize your life, someone else will.',
      context: 'Introduction: The Disciplined Pursuit of Less'
    },
    actionChecklist: [
      'Declutter one non-essential recurring commitment from your calendar.',
      'Apply the 90% Rule to any new proposal today.',
      'Protect a 1-hour quiet buffer daily to think, read, and reflect.'
    ]
  },
  'grit: the power of passion and perseverance': {
    title: 'Grit: The Power of Passion and Perseverance',
    author: 'Angela Duckworth',
    category: 'High Performance',
    readTimeMinutes: 8,
    hook: 'Natural talent is overrated. Effort counts twice. Passion and sustained perseverance over years is the true secret of world-class achievement.',
    coverGradient: 'from-amber-600 via-rose-700 to-indigo-950',
    accentColor: '#f59e0b',
    contextImage: `<svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover">
      <rect width="400" height="240" fill="#0f172a"/>
      <path d="M 40 200 L 160 140 L 220 160 L 360 50" stroke="#f59e0b" stroke-width="4" fill="none" stroke-linecap="round"/>
      <circle cx="360" cy="50" r="14" fill="#fbbf24"/>
      <polygon points="360,42 363,49 371,49 365,54 367,61 360,57 353,61 355,54 349,49 357,49" fill="#0f172a"/>
      <text x="50" y="80" fill="#fde68a" font-weight="bold" font-size="12" font-family="sans-serif">Effort x Talent = Skill</text>
      <text x="50" y="105" fill="#fde68a" font-weight="bold" font-size="12" font-family="sans-serif">Skill x Effort = ACHIEVEMENT</text>
    </svg>`,
    visualContextPrompt: 'A mountain climber ascending through rocky setbacks toward a golden peak, symbolizing long-term grit.',
    coreThesis: `Angela Duckworth demonstrates through psychological research that grit—a combination of long-term passion and perseverance—predicts success far better than IQ, test scores, or raw talent.

While our culture is obsessed with "naturals," Duckworth proves that effort counts twice: Talent × Effort = Skill, and Skill × Effort = Achievement. Real grit is not just working hard for a week; it is waking up every day for years working on the same overarching life goal.`,
    keyTakeaways: [
      {
        title: 'Effort Counts Twice',
        insight: 'Talent shows how fast your skills improve when you invest effort. But achievement only happens when you apply effort to those skills day after day.',
        practicalDrill: 'Remind yourself today: "I do not need to be the smartest in the room; I just need to be the one who refuses to quit."'
      },
      {
        title: 'Deliberate Practice on Weaknesses',
        insight: 'Casual practice repeats what you already do well. Deliberate practice zooms in on your specific point of failure with immediate feedback.',
        practicalDrill: 'Pick the one step in your daily work that you dread or stumble on, and practice it deliberately for 15 minutes.'
      },
      {
        title: 'Cultivate a Growth Mindset',
        insight: 'Gritty people believe that ability can be grown through challenge, viewing mistakes as data rather than proof of inadequacy.',
        practicalDrill: 'Whenever something fails today, say: "I haven\'t mastered this YET."'
      }
    ],
    realLifeExample: {
      title: 'The West Point Beast Barracks Cadet Study',
      story: 'Every summer, 1,200 top high school seniors enter the United States Military Academy at West Point. During the first seven weeks of brutal training called "Beast Barracks," dozens drop out. West Point spent millions evaluating SAT scores, athletic ability, and leadership scores to predict who would survive, but none of these metrics worked. Angela Duckworth administered her 12-question "Grit Scale" to incoming cadets. The Grit Scale accurately predicted who completed Beast Barracks better than any test or physical fitness score in West Point\'s history.',
      takeawayLesson: 'When things get physically and emotionally exhausting, perseverance and internal purpose beat raw talent every time.'
    },
    dailyMicroHabit: 'The Hard Thing Rule: Commit to doing one challenging skill every day that requires deliberate effort, and never quit on a bad day.',
    memorableQuote: {
      quote: 'Enthusiasm is common. Endurance is rare.',
      context: 'Chapter 4: How Gritty Are You?'
    },
    actionChecklist: [
      'Take 5 minutes to identify your overarching top-level life goal.',
      'Commit to practicing your hardest skill for 15 uninterrupted minutes today.',
      'Refuse to quit on a day when you feel tired or frustrated.'
    ]
  },
  'the almanack of naval ravikant': {
    title: 'The Almanack of Naval Ravikant',
    author: 'Eric Jorgenson',
    category: 'Wealth & Mastery',
    readTimeMinutes: 7,
    hook: 'Getting rich without getting lucky is a skill. True wealth is freedom: owning assets that earn while you sleep, and cultivating a peaceful, unhurried mind.',
    coverGradient: 'from-emerald-700 via-teal-800 to-slate-950',
    accentColor: '#10b981',
    contextImage: `<svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover">
      <rect width="400" height="240" fill="#042f2e"/>
      <path d="M 60 180 L 340 180 M 200 180 L 200 60" stroke="#059669" stroke-width="4"/>
      <circle cx="200" cy="60" r="16" fill="#34d399"/>
      <text x="120" y="215" fill="#a7f3d0" font-weight="bold" font-size="11" font-family="sans-serif">CODE &amp; MEDIA LEVERAGE</text>
    </svg>`,
    visualContextPrompt: 'A lever resting on a steady fulcrum lifting immense weight with minimal effort, symbolizing permissionless code and media.',
    coreThesis: `Naval Ravikant teaches that wealth creation is not about renting your time for hourly wages. It is about understanding leverage, acquiring specific knowledge, and building judgment.

Modern permissionless leverage—code and media—allows anyone to create products that work while they sleep. Paired with compound interest in relationships and a peaceful, desire-free mindset, true success is having both abundant wealth and a calm mind.`,
    keyTakeaways: [
      {
        title: 'Permissionless Leverage (Code and Media)',
        insight: 'Traditional leverage requires asking permission (managing people or raising capital). Modern leverage—writing code, publishing articles, recording podcasts—requires zero permission and works 24/7.',
        practicalDrill: 'Create one digital asset (a guide, a script, or an article) that can deliver value even while you sleep.'
      },
      {
        title: 'Specific Knowledge (Cannot Be Trained)',
        insight: 'Specific knowledge is found by pursuing your genuine curiosity and obsession rather than whatever is currently hyped in the job market.',
        practicalDrill: 'Ask three close friends: "What is something that feels effortless to me, but seems hard to everyone else?"'
      },
      {
        title: 'Happiness is a Choice and a Skill',
        insight: 'Desire is a contract you make with yourself to be unhappy until you get what you want. Choose only one core desire at a time.',
        practicalDrill: 'Notice what you are craving right now; consciously release all desires except your single main focus.'
      }
    ],
    realLifeExample: {
      title: 'How Naval Built Wealth and Freedom from Scratch',
      story: 'Naval Ravikant arrived in the United States as an immigrant child in a poor family, working illegal jobs as a teenager. Instead of chasing prestige, he spent all his spare time reading whatever interested him at the public library. He learned programming and investing from first principles. By focusing exclusively on permissionless leverage—founding AngelList and angel-investing in tech companies—he built immense wealth without having a boss, maintaining complete sovereignty over every minute of his day.',
      takeawayLesson: 'Arm yourself with specific knowledge and permissionless leverage, and you will never have to rent out your time.'
    },
    dailyMicroHabit: 'The Curiosity Hour: Spend 30 minutes reading whatever topic genuinely fascinates you, regardless of whether it looks practical on a resume.',
    memorableQuote: {
      quote: 'Seek wealth, not money or status. Wealth is having assets that earn while you sleep.',
      context: 'Part 1: Building Wealth'
    },
    actionChecklist: [
      'Stop renting your time: brainstorm one asset you can build.',
      'Identify your genuine curiosities and lean into them.',
      'Meditate or sit quietly for 10 minutes to train a calm mind.'
    ]
  },
  'zero to one': {
    title: 'Zero to One',
    author: 'Peter Thiel',
    category: 'Leadership',
    readTimeMinutes: 7,
    hook: 'Doing what we already know how to do takes the world from 1 to n. But every time we create something completely new, we go from 0 to 1.',
    coverGradient: 'from-amber-600 via-purple-800 to-slate-950',
    accentColor: '#8b5cf6',
    contextImage: `<svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover">
      <rect width="400" height="240" fill="#090d16"/>
      <text x="110" y="130" fill="#8b5cf6" font-weight="900" font-size="48" font-family="sans-serif">0</text>
      <path d="M 180 115 L 220 115 M 210 100 L 225 115 L 210 130" stroke="#f59e0b" stroke-width="4" stroke-linecap="round"/>
      <text x="245" y="130" fill="#fbbf24" font-weight="900" font-size="48" font-family="sans-serif">1</text>
    </svg>`,
    visualContextPrompt: 'A dramatic leap from 0 to 1 in glowing typography, symbolizing vertical innovation replacing horizontal copying.',
    coreThesis: `PayPal co-founder and venture capitalist Peter Thiel challenges business dogma: competition is not healthy; it destroys profits. True value creation comes from building creative monopolies by going from 0 to 1.

To build a truly breakthrough company, you must uncover a "secret"—an important truth that very few people agree with you on—and dominate a small niche before scaling.`,
    keyTakeaways: [
      {
        title: 'Vertical (0 to 1) vs Horizontal (1 to n) Progress',
        insight: 'Horizontal progress copies things that already work (globalization). Vertical progress creates something fundamentally new that has never existed before (technology).',
        practicalDrill: 'Ask Thiel\'s famous contrarian question: "What important truth do very few people agree with you on?"'
      },
      {
        title: 'Competition is for Losers',
        insight: 'Fierce competition destroys margins and turns companies into copies of each other. Build a unique advantage so you operate as a creative monopoly.',
        practicalDrill: 'Identify what makes your skill or offering 10x better than existing alternatives in a specific tiny niche.'
      },
      {
        title: 'Start Small and Monopolize',
        insight: 'Every startup should target a tiny market where it can become the dominant player immediately, then expand into adjacent markets.',
        practicalDrill: 'Define the smallest possible group of customers you can serve extraordinarily well.'
      }
    ],
    realLifeExample: {
      title: 'How PayPal Defeated Fraud to Dominate eBay Payments',
      story: 'In 2000, PayPal was growing at 7% a day, but Russian fraudsters began draining millions through automated credit card scams. Facing bankruptcy, PayPal did not copy traditional banking methods. Max Levchin and his engineering team invented CAPTCHA—an algorithm that forced humans to decipher distorted characters—and built the Igor fraud engine. By inventing proprietary software that stopped fraud where traditional banks failed, PayPal secured a 10x advantage and became the undisputed payment monopoly on eBay.',
      takeawayLesson: 'Building proprietary technology that is 10x better than substitutes creates an unassailable advantage.'
    },
    dailyMicroHabit: 'The Contrarian Check: Before agreeing with consensus opinions today, ask: "What if the exact opposite is true?"',
    memorableQuote: {
      quote: 'The most contrarian thing of all is not to oppose the crowd, but to think for yourself.',
      context: 'Chapter 1: The Challenge of the Future'
    },
    actionChecklist: [
      'Write down your contrarian belief in your industry.',
      'Target a narrow niche rather than a massive vague market.',
      'Focus on engineering a 10x improvement over existing options.'
    ]
  },
  'daring greatly': {
    title: 'Daring Greatly',
    author: 'Brené Brown',
    category: 'Mindset',
    readTimeMinutes: 7,
    hook: 'Vulnerability is not weakness; it is our greatest measure of courage. When we dare to step into the arena and be seen, we unlock true connection and creativity.',
    coverGradient: 'from-rose-600 via-purple-700 to-slate-900',
    accentColor: '#ec4899',
    contextImage: `<svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover">
      <rect width="400" height="240" fill="#0c0a14"/>
      <circle cx="200" cy="120" r="75" stroke="#ec4899" stroke-width="2" stroke-dasharray="6 6"/>
      <circle cx="200" cy="120" r="35" fill="#f43f5e" fill-opacity="0.3"/>
      <polygon points="200,95 208,112 226,112 211,123 216,140 200,129 184,140 189,123 174,112 192,112" fill="#fbcfe8"/>
      <text x="140" y="215" fill="#f472b6" font-weight="bold" font-size="11" font-family="sans-serif">COURAGE TO BE SEEN</text>
    </svg>`,
    visualContextPrompt: 'A lone brave figure standing in the center of an ancient arena bathed in warm light, representing daring greatly.',
    coreThesis: `Dr. Brené Brown's twelve years of research reveals that vulnerability is the birthplace of joy, love, belonging, and innovation.

In a culture dominated by scarcity ("never enough"), we often wear emotional armor—perfectionism, numbing, and cynicism. But true resilience comes from recognizing our worthiness and daring greatly despite the fear of failure or judgment.`,
    keyTakeaways: [
      {
        title: 'Vulnerability is Courage, Not Weakness',
        insight: 'Vulnerability is uncertainty, risk, and emotional exposure. There is no courage without vulnerability; stepping into the arena requires willingness to fail.',
        practicalDrill: 'Have one honest conversation today where you express your genuine feeling or need without hiding behind a protective joke.'
      },
      {
        title: 'Perfectionism is a 20-Ton Shield',
        insight: 'Healthy striving focuses on self-improvement ("How can I grow?"), while perfectionism focuses on other people\'s approval ("What will they think?").',
        practicalDrill: 'Deliberately share an imperfect draft or project today to break the grip of perfectionism.'
      },
      {
        title: 'Practice Gratitude Over Scarcity',
        insight: 'The antidote to foreboding joy (worrying that something terrible will ruin a happy moment) is the conscious, vocal practice of gratitude.',
        practicalDrill: 'When you feel anxious about a good moment today, say out loud: "I am deeply grateful for this right now."'
      }
    ],
    realLifeExample: {
      title: 'The "Man in the Arena" Speech and Brené Brown\'s Breakthrough',
      story: 'After giving a viral TED talk on vulnerability that was watched by millions, Brené Brown experienced a crippling "vulnerability hangover." Reading vicious anonymous internet comments, she felt sick and wanted to retreat from public life. While crying over coffee, she read Theodore Roosevelt\'s 1910 Sorbonne speech: "It is not the critic who counts; not the man who points out how the strong man stumbles... The credit belongs to the man who is actually in the arena, whose face is marred by dust and sweat and blood; who errs, who comes short again and again, but who at the worst, if he fails, at least fails while daring greatly." That passage transformed her life. She decided to ignore critics sitting in the cheap seats who never dare to step into the arena themselves.',
      takeawayLesson: 'If you are not in the arena getting your face kicked, do not let uninvested critics dictate your self-worth.'
    },
    dailyMicroHabit: 'The Arena Breath: When fear of judgment strikes, remind yourself: "I am choosing courage over comfort today."',
    memorableQuote: {
      quote: 'Vulnerability is not winning or losing; it’s having the courage to show up and be seen when we have no control over the outcome.',
      context: 'Chapter 1: Scarcity — Looking Inside Our Culture of Never Enough'
    },
    actionChecklist: [
      'Stop accepting criticism from people who aren\'t in the arena with you.',
      'Replace perfectionism with a willingness to show your real, honest work.',
      'Practice sharing sincere gratitude with someone who supported you.'
    ]
  }
};

/**
 * Normalizes title for case-insensitive matching
 */
export function findPopularBookPreset(queryTitle: string): Partial<BookSummary> | null {
  if (!queryTitle) return null;
  const normalized = queryTitle.toLowerCase().trim();

  // Direct match
  if (POPULAR_BOOK_PRESETS[normalized]) {
    return POPULAR_BOOK_PRESETS[normalized];
  }

  // Partial / fuzzy match
  for (const [key, preset] of Object.entries(POPULAR_BOOK_PRESETS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return preset;
    }
  }

  return null;
}
