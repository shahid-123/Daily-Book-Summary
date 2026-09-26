import { BookSummary } from '../types';

export const CURATED_BOOKS: BookSummary[] = [
  {
    id: 'atomic-habits',
    title: 'Atomic Habits',
    author: 'James Clear',
    year: 2018,
    category: 'Habits',
    readTimeMinutes: 7,
    hook: 'Big goals do not change your life. Small daily habits do. If you get just 1% better each day, you become 37 times better by the end of the year.',
    coverGradient: 'from-amber-600 via-orange-500 to-rose-600',
    accentColor: '#f97316',
    contextImage: `<svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover">
      <defs>
        <linearGradient id="curveGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#f97316" stop-opacity="0.2"/>
          <stop offset="60%" stop-color="#fb923c" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#fef08a" stop-opacity="1"/>
        </linearGradient>
        <radialGradient id="atomicPulse" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fdba74" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#fdba74" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="400" height="240" fill="#0f172a"/>
      <line x1="40" y1="40" x2="360" y2="40" stroke="#334155" stroke-dasharray="4 4" opacity="0.3"/>
      <line x1="40" y1="90" x2="360" y2="90" stroke="#334155" stroke-dasharray="4 4" opacity="0.3"/>
      <line x1="40" y1="140" x2="360" y2="140" stroke="#334155" stroke-dasharray="4 4" opacity="0.3"/>
      <line x1="40" y1="190" x2="360" y2="190" stroke="#334155" stroke-dasharray="4 4" opacity="0.3"/>
      <path d="M 40 190 Q 220 180 360 45" stroke="url(#curveGrad)" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M 40 190 Q 220 180 360 45 L 360 210 L 40 210 Z" fill="url(#curveGrad)" opacity="0.12"/>
      <line x1="40" y1="190" x2="360" y2="90" stroke="#94a3b8" stroke-dasharray="6 6" stroke-width="2" opacity="0.5"/>
      <text x="50" y="115" fill="#94a3b8" font-size="10" font-family="sans-serif">Expected slow progress</text>
      <text x="210" y="45" fill="#fef08a" font-weight="bold" font-size="12" font-family="sans-serif">Small 1% daily steps take off!</text>
      <circle cx="100" cy="186" r="5" fill="#ea580c"/>
      <circle cx="170" cy="181" r="6" fill="#f97316"/>
      <circle cx="240" cy="165" r="7" fill="#fb923c"/>
      <circle cx="300" cy="120" r="9" fill="#fde047"/>
      <circle cx="300" cy="120" r="22" fill="url(#atomicPulse)"/>
      <circle cx="360" cy="45" r="11" fill="#fff" filter="drop-shadow(0 0 8px #fbbf24)"/>
    </svg>`,
    visualContextPrompt: 'A simple graph showing that tiny daily steps add up into massive improvement over time.',
    coreThesis: `Most people fail to change because they set huge goals without changing what they do every day. James Clear explains that habits are like compound interest. When you save a tiny bit of money every day, it grows huge over time. Habits work the exact same way.

The best way to stick to a good habit is to change how you think of yourself. Do not just say, "I want to read a book." Instead, say to yourself, "I am a reader." When a habit matches who you believe you are, you do not need to fight yourself to do it.`,
    keyTakeaways: [
      {
        title: 'The 2-Minute Rule to Start Any Habit',
        insight: 'When you start a new habit, it should take less than two minutes to do. If it feels too hard, you will put it off. Start so small that you cannot say no.',
        practicalDrill: 'Want to read more? Tell yourself: "I will read just one page tonight before sleeping."'
      },
      {
        title: 'Design Your Room for Good Choices',
        insight: 'People with good self-control do not have magic willpower. They just keep temptations out of sight and make good habits easy to see.',
        practicalDrill: 'Put your book or water bottle on your pillow or desk right now. Move distracting apps into a hidden folder.'
      },
      {
        title: 'Habit Stacking (Connect New to Old)',
        insight: 'The easiest way to build a new habit is to attach it to something you already do every single day without thinking.',
        practicalDrill: 'Fill in this simple sentence: "After I pour my morning coffee, I will write down my 1 main task for the day."'
      },
      {
        title: 'Never Miss Twice in a Row',
        insight: 'Everyone has busy or messy days. Missing one day is just an accident. But missing two days in a row is the start of a bad habit.',
        practicalDrill: 'If you cannot do your full 30-minute workout today, do 5 pushups or walk for 2 minutes. Keep the chain unbroken.'
      }
    ],
    realLifeExample: {
      title: 'How British Cyclists Went from Last Place to Champions',
      story: 'For almost 100 years, the British cycling team was very average. They had only won a single gold medal and had never won the Tour de France. Then a new coach named Dave Brailsford took over. He looked for tiny 1% improvements in everything they did. He made bike seats slightly more comfortable, tested better pillows for deep sleep, and taught riders how to wash their hands properly so they would not get sick.\n\nNone of these changes sounded big on their own. But combined together, they won 60% of all gold medals at the Olympics and won 5 Tour de France titles in 6 years!',
      takeawayLesson: 'You do not need a giant overnight miracle. Lots of small, simple fixes add up into huge life results.'
    },
    dailyMicroHabit: 'The 60-Second Rule: When you finish your morning drink, read exactly 2 pages of a book before you check social media.',
    memorableQuote: {
      quote: 'You do not rise to the level of your goals. You fall to the level of your systems.',
      context: 'Chapter 1: The Surprising Power of Atomic Habits'
    },
    actionChecklist: [
      'Write down your simple habit plan: "I will [action] at [time] in [place]."',
      'Make starting tomorrow\'s goal take less than 2 minutes.',
      'Remove one distracting thing from your desk or room.'
    ],
    nextDaySneakPeek: {
      title: "Man's Search for Meaning",
      author: 'Viktor E. Frankl',
      teaser: 'When you have a strong reason to live, you can make it through almost any hard time.',
      category: 'Resilience & Stoicism',
      dateStr: 'Tomorrow'
    }
  },
  {
    id: 'mans-search-for-meaning',
    title: "Man's Search for Meaning",
    author: 'Viktor E. Frankl',
    year: 1946,
    category: 'Resilience & Stoicism',
    readTimeMinutes: 8,
    hook: 'If you have a clear "why" to live for, you can survive almost any "how." Nobody can take away your power to choose your own attitude.',
    coverGradient: 'from-stone-700 via-zinc-800 to-amber-900',
    accentColor: '#d97706',
    contextImage: `<svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover">
      <defs>
        <linearGradient id="dawnGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fed7aa"/>
          <stop offset="40%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#1c1917"/>
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="#0c0a09"/>
      <path d="M 0 240 L 70 140 L 150 180 L 250 80 L 330 160 L 400 110 L 400 240 Z" fill="#1c1917"/>
      <path d="M 120 240 L 220 120 L 310 200 L 400 140 L 400 240 Z" fill="#292524" opacity="0.7"/>
      <circle cx="250" cy="80" r="45" fill="url(#dawnGrad)" opacity="0.6"/>
      <path d="M 250 35 L 250 125 M 205 80 L 295 80" stroke="#fef3c7" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
      <circle cx="210" cy="145" r="5" fill="#fef08a"/>
      <path d="M 210 150 L 210 180 M 200 165 L 220 165 M 210 180 L 195 210 M 210 180 L 225 210" stroke="#fef08a" stroke-width="3" stroke-linecap="round"/>
      <text x="40" y="50" fill="#d6d3d1" font-size="12" font-family="serif">"You always choose your own response."</text>
    </svg>`,
    visualContextPrompt: 'A simple glowing lantern on a dark hill greeting a warm sunrise, representing hope.',
    coreThesis: `Viktor Frankl was a doctor who survived harsh World War II prison camps. He noticed something surprising: the people who survived were not always the biggest or strongest. The people who made it through were the ones who had a deep reason to keep going—like a child waiting for them at home, a book they needed to finish, or faith that their life still had work to do.

Frankl learned that what humans want most in life is not just fun or easy pleasure. What we really need is meaning. Even when bad things happen that you cannot stop, you still have the power to choose how you respond.`,
    keyTakeaways: [
      {
        title: 'The Pause Before You React',
        insight: 'When something upsets you, you do not have to yell or panic immediately. There is a small gap of time between what happens and what you do. In that gap, you choose your words.',
        practicalDrill: 'When someone frustrates you today, take 3 slow breaths before saying a single word.'
      },
      {
        title: 'Three Simple Ways to Find Purpose',
        insight: 'You find meaning in three simple places: (1) Doing work that helps others, (2) Loving a person or enjoying nature and music, and (3) Staying brave when facing tough times.',
        practicalDrill: 'Think of one person you care about. Send them a short text today saying you appreciate them.'
      },
      {
        title: 'Turning Hardships into Strength',
        insight: 'Tough days will happen to everyone. You cannot always pick what happens to you, but you can always decide: "Will I let this make me bitter, or will I let it teach me to be stronger and kinder?"',
        practicalDrill: 'Take today\'s most annoying problem and ask yourself: "What good lesson can I learn from this?"'
      }
    ],
    realLifeExample: {
      title: 'How Writing in Secret Saved Frankl\'s Life',
      story: 'When Frankl was taken to the camp, the guards destroyed the book manuscript he had spent his whole life writing. He had no clothes, no food, and no possessions left. But he made a promise to himself: he would stay alive and write the book again to help people suffering around the world. Whenever he found tiny scraps of dirty paper in the hospital ward, he wrote notes in total darkness. That sense of mission gave his mind the strength to survive sickness and cold.',
      takeawayLesson: 'When you have a caring purpose bigger than yourself, your mind finds the power to push through difficult days.'
    },
    dailyMicroHabit: 'The Morning Purpose Question: Before checking social media, ask yourself: "What is one good thing I can do to help someone today?"',
    memorableQuote: {
      quote: 'Everything can be taken from a man but one thing: to choose one’s attitude in any given set of circumstances.',
      context: 'Experiences in a Concentration Camp'
    },
    actionChecklist: [
      'Write down your biggest challenge right now and one positive lesson inside it.',
      'Take a 5-second pause before replying to any frustrating message today.',
      'Thank one person who makes your life brighter.'
    ],
    nextDaySneakPeek: {
      title: 'Deep Work',
      author: 'Cal Newport',
      teaser: 'How to focus without distractions in a noisy world and get your best work done.',
      category: 'Productivity',
      dateStr: 'Tomorrow'
    }
  },
  {
    id: 'deep-work',
    title: 'Deep Work',
    author: 'Cal Newport',
    year: 2016,
    category: 'Productivity',
    readTimeMinutes: 7,
    hook: 'The power to focus without looking at your phone is becoming very rare. If you can focus deeply for just one hour, you can do better work than most people do in a full day.',
    coverGradient: 'from-blue-700 via-indigo-800 to-slate-900',
    accentColor: '#3b82f6',
    contextImage: `<svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover">
      <defs>
        <radialGradient id="focusLens" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.9"/>
          <stop offset="50%" stop-color="#0284c7" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#0f172a" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="400" height="240" fill="#090d16"/>
      <path d="M 20 50 Q 80 120 40 190 M 70 20 Q 90 90 60 220 M 350 30 Q 320 110 370 200" stroke="#475569" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.3"/>
      <circle cx="200" cy="120" r="85" fill="url(#focusLens)"/>
      <circle cx="200" cy="120" r="85" stroke="#38bdf8" stroke-width="2" opacity="0.7"/>
      <line x1="200" y1="20" x2="200" y2="220" stroke="#e0f2fe" stroke-width="3" stroke-linecap="round"/>
      <circle cx="200" cy="120" r="14" fill="#ffffff" filter="drop-shadow(0 0 12px #38bdf8)"/>
      <text x="135" y="165" fill="#e0f2fe" font-size="11" font-weight="bold" font-family="sans-serif">ZERO DISTRACTIONS</text>
    </svg>`,
    visualContextPrompt: 'A clear blue focus shield blocking out noisy phone notifications and chaotic digital chatter.',
    coreThesis: `Deep Work means sitting down and working on a hard task with complete focus, without checking your phone, emails, or tabs. It is how you learn hard skills quickly and create things that truly matter.

Today, most people spend their workday doing shallow tasks—replying to quick chat pings, checking social media, and refreshing inboxes. If you learn to block out just 60 to 90 minutes of quiet, uninterrupted focus every day, you will get ahead faster than you think.`,
    keyTakeaways: [
      {
        title: 'Stop Jumping Between Tasks',
        insight: 'When you switch from your work to check a quick phone notification, your brain stays partly stuck on the message. This makes you tired and cuts your thinking speed in half.',
        practicalDrill: 'Close all tabs except the one you need. Work for 45 minutes straight without touching your phone.'
      },
      {
        title: 'Block Out Your Day on Paper',
        insight: 'If you start your day without a clear plan, other people will decide how you spend your time with their emails and requests.',
        practicalDrill: 'Every morning, write down what you will do in each hour. Pick your 1 most important task first.'
      },
      {
        title: 'Practice Being Bored',
        insight: 'If you pull out your phone every single time you wait in an elevator or line, your brain forgets how to be calm and patient. This ruins your ability to focus when studying or working.',
        practicalDrill: 'Next time you are waiting in line or at a red light, leave your phone in your pocket and look around.'
      }
    ],
    realLifeExample: {
      title: 'How J.K. Rowling Finished the Harry Potter Series',
      story: 'When writing the final Harry Potter book, J.K. Rowling found it impossible to focus at home. Her dogs were barking, the doorbell kept ringing, and children were running around. So she booked a quiet room in a hotel with no internet. In that peaceful, silent space, with zero distractions, she was able to focus completely and finish the famous book.',
      takeawayLesson: 'Protecting your focus from noise and interruptions is the secret to doing your best work.'
    },
    dailyMicroHabit: 'The End-of-Day Shutdown: At the end of work, write down your top task for tomorrow, close your laptop, and say: "Work is done for today."',
    memorableQuote: {
      quote: 'If you don’t produce, you won’t thrive—no matter how skilled or talented you are.',
      context: 'Part 1: The Idea of Deep Work'
    },
    actionChecklist: [
      'Plan one 60-minute quiet focus block on tomorrow\'s schedule.',
      'Turn off non-important app notifications on your phone.',
      'Do a simple end-of-day shutdown routine so your mind can rest in the evening.'
    ],
    nextDaySneakPeek: {
      title: "Can't Hurt Me",
      author: 'David Goggins',
      teaser: 'When your mind wants to quit, you have only tapped into 40% of what you can really do.',
      category: 'High Performance',
      dateStr: 'Tomorrow'
    }
  },
  {
    id: 'cant-hurt-me',
    title: "Can't Hurt Me",
    author: 'David Goggins',
    year: 2018,
    category: 'High Performance',
    readTimeMinutes: 8,
    hook: 'When your brain tells you that you are completely exhausted and cannot take another step, you are only at 40% of your real strength.',
    coverGradient: 'from-red-900 via-neutral-900 to-amber-950',
    accentColor: '#ef4444',
    contextImage: `<svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover">
      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ef4444"/>
          <stop offset="100%" stop-color="#7f1d1d"/>
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="#0a0a0a"/>
      <path d="M 200 40 L 290 80 C 290 160 200 210 200 210 C 200 210 110 160 110 80 Z" fill="url(#shieldGrad)" stroke="#fca5a5" stroke-width="4"/>
      <circle cx="200" cy="115" r="30" fill="#b91c1c"/>
      <path d="M 185 115 L 195 125 L 218 100" stroke="#fef08a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="145" y="175" fill="#fef08a" font-weight="900" font-size="14" font-family="sans-serif">THE 40% RULE</text>
      <circle cx="80" cy="60" r="3" fill="#f87171"/>
      <circle cx="330" cy="70" r="4" fill="#f87171"/>
    </svg>`,
    visualContextPrompt: 'A glowing shield of mental toughness with the 40% rule icon in bright gold.',
    coreThesis: `David Goggins grew up in poverty, faced abuse, and was out of shape. Yet he turned his life around to become a Navy SEAL and world-famous ultra-runner.

He discovered the 40% Rule: your brain has a built-in safety switch. As soon as you feel tired or uncomfortable, your brain wants you to sit on the couch and rest. But if you push past that first feeling of tiredness, you will discover that you have way more energy and courage than you realized.`,
    keyTakeaways: [
      {
        title: 'The Accountability Mirror',
        insight: 'Stop lying to yourself or making excuses for being lazy. Look yourself in the eye, admit where you are falling behind, and write down what you will fix today.',
        practicalDrill: 'Put a sticky note on your mirror with one clear standard you promise to keep today.'
      },
      {
        title: 'The Cookie Jar Trick',
        insight: 'When life gets super tough and you want to give up, open your mental "cookie jar." Remind yourself of 3 hard times you already survived in your past.',
        practicalDrill: 'Write down 3 tough things you beat in the past. Remember: if you survived those, you can handle today.'
      },
      {
        title: 'Do the Hard Thing First',
        insight: 'Do not wait until you feel motivated. Motivation is unreliable. Real discipline means doing what needs to be done even when you do not feel like doing it.',
        practicalDrill: 'Do your toughest chore or workout first thing today without complaining.'
      }
    ],
    realLifeExample: {
      title: 'Running 100 Miles with Zero Notice',
      story: 'To raise money for children of fallen soldiers, Goggins had to run a 100-mile race with just three days of notice, even though he had not run long distance in months. Around mile 70, his legs were aching, he was dizzy, and his brain told him to quit. Instead of stopping, he reminded himself of all the tough challenges he had survived before. He stood up, took one step at a time, and crossed the finish line in 19 hours.',
      takeawayLesson: 'Your mind can keep going long after your feelings tell you to quit.'
    },
    dailyMicroHabit: 'The Cold Water Challenge: For the last 30 seconds of your shower today, turn the water cold. It teaches your brain not to panic when things feel uncomfortable.',
    memorableQuote: {
      quote: 'You are in danger of living a life so comfortable and soft, that you will die without ever realizing your true potential.',
      context: 'Chapter 5: Armored Mind'
    },
    actionChecklist: [
      'Be honest with yourself about one bad habit you need to fix.',
      'Think of 2 hard times you overcame in the past to build confidence.',
      'Take action on one task today that you have been putting off.'
    ],
    nextDaySneakPeek: {
      title: 'The Psychology of Money',
      author: 'Morgan Housel',
      teaser: 'Doing well with money is not about math. It is about staying patient and keeping calm.',
      category: 'Wealth & Mastery',
      dateStr: 'Tomorrow'
    }
  },
  {
    id: 'psychology-of-money',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    year: 2020,
    category: 'Wealth & Mastery',
    readTimeMinutes: 7,
    hook: 'Doing well with money is not about being a math genius. It is about how you behave. Being patient and not showing off is how real wealth is made.',
    coverGradient: 'from-emerald-800 via-teal-900 to-slate-900',
    accentColor: '#10b981',
    contextImage: `<svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover">
      <defs>
        <linearGradient id="emeraldGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#047857"/>
          <stop offset="100%" stop-color="#6ee7b7"/>
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="#064e3b"/>
      <path d="M 200 220 L 200 130" stroke="#a7f3d0" stroke-width="8" stroke-linecap="round"/>
      <path d="M 200 150 Q 140 110 110 80" stroke="#6ee7b7" stroke-width="5" stroke-linecap="round"/>
      <path d="M 200 140 Q 260 100 290 70" stroke="#6ee7b7" stroke-width="5" stroke-linecap="round"/>
      <circle cx="110" cy="80" r="14" fill="#fbbf24"/>
      <circle cx="290" cy="70" r="16" fill="#fbbf24"/>
      <circle cx="170" cy="40" r="12" fill="#fde047"/>
      <circle cx="230" cy="40" r="12" fill="#fde047"/>
      <text x="135" y="210" fill="#ecfdf5" font-size="11" font-weight="bold" font-family="sans-serif">PATIENCE BUILDS WEALTH</text>
    </svg>`,
    visualContextPrompt: 'A healthy green tree growing steady roots, bearing gold coins over time.',
    coreThesis: `Most people think that becoming rich requires complicated math or picking the next hot stock. But Morgan Housel shows that financial success comes down to simple human behavior: living below your means, being patient, and avoiding silly risks.

True wealth is what you do not see. It is the new car you chose not to buy, the expensive watch you did not get, and the money left in your bank account. The best thing money can buy is freedom: waking up in the morning and choosing what you want to do with your day.`,
    keyTakeaways: [
      {
        title: 'Freedom is the Greatest Return on Money',
        insight: 'Having money saved gives you control over your time. It means you can leave a bad job, take time off when sick, and never be forced to make desperate choices.',
        practicalDrill: 'Before spending money on luxury stuff, ask: "Will this purchase give me more free time or less?"'
      },
      {
        title: 'Learn to Say "I Have Enough"',
        insight: 'If your desire to spend always grows as fast as your paycheck, you will always feel broke. Comparing yourself to what neighbors buy is a game you can never win.',
        practicalDrill: 'Write down what a comfortable, happy life looks like for you so you stop chasing things you do not need.'
      },
      {
        title: 'Always Keep an Emergency Safety Net',
        insight: 'Life is unpredictable. Your financial plan should never rely on everything going right. Having savings in cash lets you sleep well at night.',
        practicalDrill: 'Set up an automatic transfer of a small amount of money into an emergency savings account every month.'
      }
    ],
    realLifeExample: {
      title: 'The Janitor Who Quietly Saved Millions',
      story: 'Ronald Read was a quiet gas station worker and janitor in Vermont. He lived simply, fixed his own clothes, and invested whatever little money he saved into steady companies for 50 years. When he passed away at age 92, people were shocked to learn he had saved $8 million! He donated millions to his local hospital and library.\n\nMeanwhile, a wealthy Harvard-trained executive went completely broke around the same time because he bought a massive mansion with 11 bathrooms and took huge debts. The humble janitor who had patience beat the fancy executive who lacked self-control.',
      takeawayLesson: 'Patience and self-control matter far more with money than fancy degrees.'
    },
    dailyMicroHabit: 'The 24-Hour Rule: When you feel the urge to buy something you do not urgently need, wait 24 hours. Most of the time, the urge goes away.',
    memorableQuote: {
      quote: 'Spending money to show people how much money you have is the fastest way to have less money.',
      context: 'Chapter 9: Wealth is What You Don’t See'
    },
    actionChecklist: [
      'Decide what "enough" means for your monthly spending.',
      'Check your savings to make sure you have money saved for surprises.',
      'Focus on saving money regularly instead of trying to get rich quick.'
    ],
    nextDaySneakPeek: {
      title: 'Meditations',
      author: 'Marcus Aurelius',
      teaser: 'You cannot control outside events. You can only control your own thoughts and actions.',
      category: 'Resilience & Stoicism',
      dateStr: 'Tomorrow'
    }
  },
  {
    id: 'meditations-marcus-aurelius',
    title: 'Meditations',
    author: 'Marcus Aurelius',
    year: 180,
    category: 'Resilience & Stoicism',
    readTimeMinutes: 7,
    hook: 'You have power over your own mind, not outside events. When you truly realize this, you will find unbreakable calm.',
    coverGradient: 'from-amber-800 via-stone-800 to-stone-950',
    accentColor: '#d97706',
    contextImage: `<svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover">
      <defs>
        <radialGradient id="stoicLight" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fef08a" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#fef08a" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="400" height="240" fill="#1c1917"/>
      <rect x="180" y="60" width="40" height="130" fill="#d6d3d1" rx="4"/>
      <circle cx="200" cy="115" r="45" stroke="#f59e0b" stroke-width="3" stroke-dasharray="8 6"/>
      <circle cx="200" cy="115" r="25" fill="url(#stoicLight)"/>
      <text x="140" y="225" fill="#fef08a" font-size="11" font-weight="bold" font-family="serif">PEACE INSIDE YOUR MIND</text>
    </svg>`,
    visualContextPrompt: 'A steady stone pillar remaining solid while wind and rain pass by peacefully.',
    coreThesis: `Marcus Aurelius was the Emperor of Rome and the most powerful man on earth. Yet this book was never meant to be published. It was his personal diary, written at night in army tents, reminding himself to stay humble, be patient with difficult people, and avoid letting fame or anger go to his head.

The main lesson of his philosophy is simple: split everything in life into two groups: things you CAN control, and things you CANNOT control. You cannot control the weather, the past, or other people\'s moods. But you can always control your own choices, kindness, and effort.`,
    keyTakeaways: [
      {
        title: 'Expect People to Be Difficult Sometimes',
        insight: 'Do not be shocked when someone is rude, selfish, or ungrateful. Tell yourself in the morning: "People may be grumpy today, but I will not let their bad mood ruin my peace or make me act badly."',
        practicalDrill: 'If someone is rude to you today, tell yourself: "That is their problem, not mine," and move on calmly.'
      },
      {
        title: 'Turn Obstacles into Practice',
        insight: 'When plans go wrong or someone cancels on you, do not get angry. Ask yourself: "How can I use this setback to practice being patient, creative, or calm?"',
        practicalDrill: 'When you hit a delay or a glitch today, treat it as a quick test of your patience.'
      },
      {
        title: 'Do Not Waste Time Arguing About Being Good',
        insight: 'Talking endlessly about good values does not help anyone. Just live by them. Be honest, be helpful, and do your duty quietly.',
        practicalDrill: 'Do one kind deed today without telling anyone or looking for praise.'
      }
    ],
    realLifeExample: {
      title: 'An Emperor Who Put His People First in Crisis',
      story: 'During Marcus\'s rule, Rome was hit by a terrible sickness and money crisis. While other kings would have hidden in luxury palaces, Marcus stayed in the city. He sold his own palace furniture, art, and jewels to pay off debts for poor families. He treated common soldiers with dignity and slept in simple army tents because he believed an honest leader must share the burdens of his people.',
      takeawayLesson: 'Real leadership means being fair and doing what is right, especially when times get hard.'
    },
    dailyMicroHabit: 'The 1-Minute Evening Review: Before you go to sleep, ask yourself: "Where did I do well today? Where did I get angry? How can I do better tomorrow?"',
    memorableQuote: {
      quote: 'Waste no more time arguing about what a good man should be. Be one.',
      context: 'Book 10, Section 16'
    },
    actionChecklist: [
      'Remind yourself this morning that you cannot control what others do, only how you react.',
      'Practice staying calm when plans get delayed today.',
      'Do one helpful deed without asking for praise.'
    ],
    nextDaySneakPeek: {
      title: 'Mindset',
      author: 'Carol S. Dweck',
      teaser: 'Why believing you can learn and grow beats thinking you are born with fixed talent.',
      category: 'Mindset',
      dateStr: 'Tomorrow'
    }
  }
];

export function getBookForDate(targetDate: Date = new Date()): BookSummary {
  const startOfYear = new Date(targetDate.getFullYear(), 0, 0);
  const diff = targetDate.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  const index = Math.abs(dayOfYear) % CURATED_BOOKS.length;
  const book = { ...CURATED_BOOKS[index] };
  
  const nextDate = new Date(targetDate);
  nextDate.setDate(nextDate.getDate() + 1);
  const nextIndex = (index + 1) % CURATED_BOOKS.length;
  const nextBook = CURATED_BOOKS[nextIndex];

  book.dayOfYear = dayOfYear;
  book.dateKey = targetDate.toISOString().split('T')[0];
  book.nextDaySneakPeek = {
    title: nextBook.title,
    author: nextBook.author,
    teaser: nextBook.hook,
    category: nextBook.category,
    dateStr: nextDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
  };

  return book;
}
