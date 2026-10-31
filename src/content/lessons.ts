// All lesson content lives here, separate from the screens.
// Each lesson: a hook, 3-4 short cards, a tiny "try it" action, a 2-3 question quiz, and a takeaway.
// Numbers are taken from the science check doc; each one links to its source.

export type ToolId = 'swap' | 'rescue' | 'breathe' | 'circle' | 'fakeout' | 'slip';

export type Source = { label: string; url: string };

export type Card = { title: string; body: string; source?: Source };

export type Question = {
  id: string;
  prompt: string;
  options: string[];
  answer: number; // index of the correct option
  why: string; // shown straight after answering
};

export type Lesson = {
  id: string;
  number: number;
  title: string;
  summary: string;
  minutes: number;
  hook: string;
  cards: Card[];
  tryIt: { title: string; body: string; seconds?: number };
  quiz: Question[];
  takeaway: string;
  unlocks?: ToolId;
};

const review2022: Source = {
  label: 'Onychophagia review, 2022',
  url: 'https://mdpi.com/1660-4601/19/6/3392',
};

export const lessons: Lesson[] = [
  {
    id: 'l1',
    number: 1,
    title: "You're not broken",
    summary: 'Why so many people bite, and why it has nothing to do with character.',
    minutes: 3,
    hook: "If you've ever hidden your hands in a meeting, this one's for you.",
    cards: [
      {
        title: 'You have a lot of company',
        body: 'Somewhere between 1 in 5 and 1 in 3 people bite their nails. In kids around 10 to puberty, it can be close to half.',
        source: review2022,
      },
      {
        title: 'It has a name',
        body: "Doctors call it onychophagia. It belongs to a family called body-focused repetitive behaviors, alongside skin picking and hair pulling. It's not 'bad manners'.",
        source: review2022,
      },
      {
        title: "It's grooming, stuck on repeat",
        body: 'Biting usually does something for you in the moment: it calms tension, eases boredom, or smooths an edge that feels wrong. Your brain keeps doing it because it works, briefly.',
      },
      {
        title: 'Genes play a part',
        body: 'In a study of over 1,100 twin pairs, kids whose parents both bit their nails were 3 to 4 times more likely to bite too. Willpower was never the whole story.',
        source: review2022,
      },
    ],
    tryIt: {
      title: 'Notice, no judgment',
      body: "Look at your hands right now. Say to yourself: 'This is a habit my brain learned. Habits can be relearned.'",
    },
    quiz: [
      {
        id: 'l1q1',
        prompt: 'Roughly how many people bite their nails?',
        options: ['About 1 in 100', 'Between 1 in 5 and 1 in 3', 'Almost everyone'],
        answer: 1,
        why: "Estimates run 20 to 30% of people. It's one of the most common habits there is.",
      },
      {
        id: 'l1q2',
        prompt: 'Your friend says biting proves they have no self-control. What would you tell them?',
        options: [
          "They're right, it's a willpower problem",
          "It's a learned habit that gives quick relief, so it sticks",
          'They should just stop thinking about it',
        ],
        answer: 1,
        why: "Biting sticks because it briefly helps, with stress, boredom or a rough edge. That's how habits work, not a character flaw.",
      },
    ],
    takeaway: 'Nail biting is a common, learned habit. Learned habits can be retrained.',
  },
  {
    id: 'l2',
    number: 2,
    title: 'Your brain on autopilot',
    summary: 'Why your hand reaches your mouth before you notice.',
    minutes: 3,
    hook: "Ever 'wake up' with your finger already in your mouth?",
    cards: [
      {
        title: 'Practice makes automatic',
        body: 'When you repeat an action in the same situations, your brain hands it over to deeper habit circuits. That saves effort, and it means the action can run without you deciding to.',
      },
      {
        title: 'Bundled into one routine',
        body: "Brain research in animals shows habit circuits mark the start and end of a routine and go quiet in the middle. Lift, search for an edge, bite: it can run as one package.",
        source: { label: 'MIT News, 2018', url: 'https://news.mit.edu/2018/distinctive-brain-pattern-helps-habits-form-0208' },
      },
      {
        title: 'Why willpower shows up late',
        body: "Willpower kicks in when you notice. On autopilot, you notice after the bite. So instead of trying harder, we'll catch the routine earlier and give your hands something else to do.",
      },
    ],
    tryIt: {
      title: 'Spot your start signal',
      body: 'Think of the last time you bit. What happened just before: a rough edge, a screen, a stressful thought? That moment is where we will intervene.',
    },
    quiz: [
      {
        id: 'l2q1',
        prompt: 'Why does trying harder often fail?',
        options: [
          'Because the routine can run before you consciously notice',
          'Because nail biting is impossible to change',
          "Because you haven't found the right bitter polish",
        ],
        answer: 0,
        why: 'Automatic habits start before awareness catches up. The fix is earlier detection and a replacement action.',
      },
      {
        id: 'l2q2',
        prompt: 'Where is the best moment to step in?',
        options: ['After the bite', 'At the very start, when the urge or reach begins', 'At the end of the day'],
        answer: 1,
        why: 'The start of the routine is the easiest place to break it. Later, the bundle is already running.',
      },
    ],
    takeaway: "You can't out-muscle autopilot. Catch the start and swap in something else.",
  },
  {
    id: 'l3',
    number: 3,
    title: 'Zombie mode vs. fix-it mode',
    summary: 'The two ways people bite, and why each needs a different tool.',
    minutes: 3,
    hook: 'Some bites you never notice. Others you feel coming a mile away.',
    cards: [
      {
        title: 'Zombie mode',
        body: "You're absorbed in something else, a screen, a book, the road, and your body is still. Your hand drifts up without a single thought. Chin-on-hand postures are a classic setup.",
      },
      {
        title: 'Fix-it mode',
        body: "You're fully aware and there's a strong itch: you're stressed, frustrated, or your thumb found a jagged edge that feels wrong. Biting brings instant relief.",
      },
      {
        title: 'Most people do both',
        body: 'People often switch modes during the same day. Zombie mode needs ways to notice sooner. Fix-it mode needs ways to handle the urge or the edge itself.',
      },
    ],
    tryIt: {
      title: 'Which one is you?',
      body: "Think about your last three bites. Were you zoned out, or feeling an urge? Most people find they're a mix.",
    },
    quiz: [
      {
        id: 'l3q1',
        prompt: "You're watching TV and suddenly realize you've been biting for a while. Which mode was that?",
        options: ['Zombie mode', 'Fix-it mode'],
        answer: 0,
        why: 'No awareness until afterwards is the signature of zombie mode.',
      },
      {
        id: 'l3q2',
        prompt: 'You feel a hangnail and just have to deal with it right now. Which mode is this?',
        options: ['Zombie mode', 'Fix-it mode'],
        answer: 1,
        why: "You're aware and feel a pull to 'fix' something. That's fix-it mode.",
      },
    ],
    takeaway: 'Know your mode, pick your tool. Zombie mode needs noticing; fix-it mode needs relief.',
  },
  {
    id: 'l4',
    number: 4,
    title: 'The 60-second swap',
    summary: 'The core move from Habit Reversal Training, and the timing that makes it work.',
    minutes: 4,
    hook: 'The most tested method for nail biting fits in your two hands.',
    cards: [
      {
        title: 'Swap, not stop',
        body: "Habit Reversal Training has you do a 'competing response' the moment you notice an urge: an action that makes biting impossible, like a gentle fist, sitting on your hands, or holding an object.",
      },
      {
        title: 'It works',
        body: 'In a trial with 30 adults, people who learned this grew their nails 22% longer, versus 3% with a placebo. Five months later they had kept most of it.',
        source: { label: 'Twohig and colleagues, 2003', url: 'https://pubmed.ncbi.nlm.nih.gov/12590622/' },
      },
      {
        title: "Five seconds isn't enough",
        body: 'When people held the swap for 5 seconds, early gains faded. Holding it for 1 minute lasted, and 3 minutes was no better than 1.',
        source: { label: 'Twohig and Woods, 2001', url: 'https://pubmed.ncbi.nlm.nih.gov/11800193/' },
      },
      {
        title: 'Why a minute?',
        body: 'An urge rises and then falls. If you let go too soon, your hands go straight back. A full minute gives the wave time to pass.',
      },
    ],
    tryIt: {
      title: 'Try it now',
      body: 'Make a gentle fist with both hands, or press your palms on your thighs. Hold for 60 seconds.',
      seconds: 60,
    },
    quiz: [
      {
        id: 'l4q1',
        prompt: 'You notice your hand drifting up. How long should you hold your swap?',
        options: ['About 5 seconds', 'At least 1 minute', 'Until the end of the day'],
        answer: 1,
        why: '5 seconds wore off in research; 1 minute was enough for the effect to last.',
      },
      {
        id: 'l4q2',
        prompt: 'Which of these is a good competing response?',
        options: ['Clenching a gentle fist', 'Biting just one nail', 'Putting on bitter polish'],
        answer: 0,
        why: "A competing response makes biting physically impossible. A fist does; polish doesn't change what your hands do.",
      },
    ],
    takeaway: 'Swap in a hand action and hold it a full minute. Five seconds lets the urge win.',
    unlocks: 'swap',
  },
  {
    id: 'l5',
    number: 5,
    title: 'Your SCAMP triggers',
    summary: 'Five kinds of trigger, each with its own fix.',
    minutes: 4,
    hook: "You wouldn't use a hammer for every job in the house.",
    cards: [
      {
        title: 'S is for Sensory',
        body: 'A jagged edge or hangnail your brain wants to smooth. Fix: keep a nail file within reach and smooth it in 10 seconds.',
      },
      {
        title: 'C is for Cognitive, A is for Affective',
        body: "C is thoughts like 'I can't focus until this is gone'. Remind yourself teeth leave a rougher edge than a file. A is feelings: stress, boredom, frustration. Fix: slow breathing or a fidget.",
      },
      {
        title: 'M is for Motor, P is for Place',
        body: "M is postures, like resting your chin in your hand. Fix: notice it and lower your hands. P is places: your desk, the couch, the car. Fix: put a file or fidget right there.",
      },
      {
        title: 'Built by clinicians',
        body: 'This map comes from the Comprehensive Behavioral (ComB) model used by therapists who treat these habits. Matching the fix to the trigger is the point.',
      },
    ],
    tryIt: {
      title: 'Name your top two',
      body: 'Which two letters show up most for you? Keep them in mind. The craving rescue button will ask what triggered you and pick a tool to match.',
    },
    quiz: [
      {
        id: 'l5q1',
        prompt: "You're on the couch and your thumb finds a rough edge. What helps most?",
        options: ['Wait for the urge to pass', 'Smooth it with a nail file', 'Put on bitter polish'],
        answer: 1,
        why: "That's a Sensory trigger. Fixing the edge removes the reason to bite, and a file leaves it smoother than teeth.",
      },
      {
        id: 'l5q2',
        prompt: "A stressful email lands and you feel the urge. What's the matching fix?",
        options: ['A slow breathing exercise', 'Filing your nails', 'Moving to a different room'],
        answer: 0,
        why: "That's an Affective (feelings) trigger, so calm the feeling. Breathing with a long exhale helps.",
      },
      {
        id: 'l5q3',
        prompt: 'You always bite at your desk. Which letter is that, and what helps?',
        options: ['C: argue with the thought', 'P: put a file or fidget on the desk', 'S: ignore it'],
        answer: 1,
        why: 'A trigger spot is Place. Changing one thing in that spot breaks the routine.',
      },
    ],
    takeaway: 'Match the fix to the trigger: a file for rough edges, breathing for stress, a fidget for your trigger spots.',
    unlocks: 'rescue',
  },
  {
    id: 'l6',
    number: 6,
    title: 'Surf the urge',
    summary: 'How to ride out a strong craving without giving in.',
    minutes: 4,
    hook: 'Fighting an urge often makes it louder. There is another way.',
    cards: [
      {
        title: 'Urges are waves',
        body: "Cravings build, peak, and fade on their own if you don't feed them. Urge surfing, a technique from addiction research by Alan Marlatt, teaches you to ride the wave instead of fighting it.",
      },
      {
        title: 'Name it',
        body: "Switch from 'I need to bite' to 'I'm noticing an urge to bite.' Naming it puts you in the observer seat.",
      },
      {
        title: 'Find it and breathe',
        body: 'Notice where the urge lives: a tingling thumb, restless fingers, a tight jaw. Then breathe in for 4 seconds and out for 6. A longer exhale helps your body settle.',
      },
      {
        title: 'Ride the peak',
        body: "The strongest moment comes right before it fades. Stay with your breath a little longer. Each wave you surf teaches your brain that urges pass.",
      },
    ],
    tryIt: {
      title: 'One wave',
      body: 'Breathe in for 4, out for 6, five times. Notice how your body feels at the end.',
      seconds: 50,
    },
    quiz: [
      {
        id: 'l6q1',
        prompt: 'What does urge surfing ask you to do with a craving?',
        options: ['Push it out of your mind', 'Notice it and ride it out', 'Give in a little so it goes away'],
        answer: 1,
        why: 'Pushing an urge away tends to make it bounce back. Observing it lets it fade.',
      },
      {
        id: 'l6q2',
        prompt: 'Which breathing pattern is the urge surfer built on?',
        options: ['In 4, out 6', 'In 6, out 2', 'Hold for 30 seconds'],
        answer: 0,
        why: 'A longer exhale than inhale helps your body calm down.',
      },
    ],
    takeaway: "No urge lasts forever. Name it, breathe 4 in and 6 out, and ride it out.",
    unlocks: 'breathe',
  },
  {
    id: 'l7',
    number: 7,
    title: 'The gentle circle',
    summary: 'A soothing hand move that worked especially well for nail biters.',
    minutes: 3,
    hook: 'What if your hands could get what they want without your teeth?',
    cards: [
      {
        title: 'Soothe, don’t freeze',
        body: 'Habit replacement swaps biting for a gentle, barely noticeable motion: slowly rubbing your fingertips together in a circle, or softly stroking your forearm.',
      },
      {
        title: 'Tested at scale',
        body: 'In a 2023 trial with 268 people, 53% of those using habit replacement improved, versus 20% on a waitlist. People who bite their nails benefited most.',
        source: { label: 'Moritz and colleagues, 2023', url: 'https://pubmed.ncbi.nlm.nih.gov/37466986/' },
      },
      {
        title: 'The catch: practice',
        body: "Many people in the study forgot to practice. That's what your daily plan is for: a minute of gentle circles when you're calm makes them easier to reach for when you're not.",
      },
    ],
    tryIt: {
      title: 'Practice for a minute',
      body: 'Rest your hands in your lap. Slowly circle your thumb against your fingertips. Keep it soft and slow for 60 seconds.',
      seconds: 60,
    },
    quiz: [
      {
        id: 'l7q1',
        prompt: 'What makes the gentle circle different from a fist?',
        options: ['It soothes instead of freezing your hands', "It's faster", 'It uses bitter taste'],
        answer: 0,
        why: 'It gives your hands a calming sensation, which is often what biting was providing.',
      },
      {
        id: 'l7q2',
        prompt: 'When is the best time to practice it?',
        options: ['Only during a strong urge', 'Also during calm moments, so it becomes automatic', 'Never, just remember it'],
        answer: 1,
        why: 'Practicing when calm builds the new habit, so it shows up when you need it.',
      },
    ],
    takeaway: 'Give your hands a soothing job. Practice the gentle circle when calm, use it when not.',
    unlocks: 'circle',
  },
  {
    id: 'l8',
    number: 8,
    title: 'The fake-out move',
    summary: 'Rewire the reach itself by redirecting it.',
    minutes: 3,
    hook: "Instead of stopping your hand, let's send it somewhere else.",
    cards: [
      {
        title: 'Decoupling',
        body: 'Let your hand start toward your mouth, then right before it arrives, move it quickly to a harmless spot: your earlobe, the back of your neck, or your cheek.',
      },
      {
        title: 'Evidence so far',
        body: 'In a trial with 72 nail biters, people practicing this resisted urges more and rated their nails as less damaged after 4 weeks than people practicing relaxation. Researchers call the results promising but early.',
        source: { label: 'Moritz and Rufer, 2011', url: 'https://pubmed.ncbi.nlm.nih.gov/21659318/' },
      },
      {
        title: 'The imagined version',
        body: 'You can also close your eyes, picture yourself reaching to bite, and move your real hand away at the last second. In a head-to-head study it had the best completion and steady results.',
        source: { label: 'Moritz and colleagues, 2022', url: 'https://www.bfrb.org/research/a-head-to-head-comparison-of-three-self-help-techniques-to-reduce-body-focused-repetitive-behaviors' },
      },
    ],
    tryIt: {
      title: 'Five reps',
      body: 'Slowly lift your hand toward your mouth. Just before it arrives, flick it to your earlobe. Do it 5 times.',
    },
    quiz: [
      {
        id: 'l8q1',
        prompt: 'In the fake-out move, when do you redirect your hand?',
        options: ['Before you lift it', 'Just before it reaches your mouth', 'After the first bite'],
        answer: 1,
        why: "Letting the reach start and then redirecting it is what retrains the routine.",
      },
      {
        id: 'l8q2',
        prompt: 'Where could your hand go instead?',
        options: ['Your earlobe or the back of your neck', 'Your other hand’s nails', 'Your pocket for your phone'],
        answer: 0,
        why: 'Pick a harmless spot near your face, so the movement feels natural.',
      },
    ],
    takeaway: "Let the reach start, then redirect it. You're rewiring the routine itself.",
    unlocks: 'fakeout',
  },
  {
    id: 'l9',
    number: 9,
    title: "Why the old tricks didn't stick",
    summary: 'Bitter polish, being called out, and why they rarely last.',
    minutes: 4,
    hook: 'If you tried these before, you were not doing it wrong.',
    cards: [
      {
        title: 'Bitter polish: hard to keep up',
        body: "In a study of 80 people, polish worked about as well as a simple reminder band, but twice as many people quit it (26% vs 12%). It also does nothing about stress or rough edges.",
        source: review2022,
      },
      {
        title: 'Swaps beat taste',
        body: 'When researchers compared mild bitter-taste aversion with a fist-clenching swap, the swap did more for skin damage and severity.',
        source: review2022,
      },
      {
        title: 'Being called out',
        body: "A partner slapping your hand only works when they're around, and most biting happens alone. Being scolded can also add stress, which is one of the things that drives biting in the first place.",
      },
      {
        title: 'What works better',
        body: "Swap in a hand action, handle the trigger, and ask the people around you to cheer your progress instead of policing you.",
      },
    ],
    tryIt: {
      title: 'Ask for support, not policing',
      body: "If someone in your life helps, try: 'Instead of stopping me, could you notice when my hands are doing well?'",
    },
    quiz: [
      {
        id: 'l9q1',
        prompt: "What's the main problem with bitter polish in research?",
        options: ['It never works at all', 'Lots of people stop using it', "It's dangerous"],
        answer: 1,
        why: 'It worked for people who stuck with it, but many gave up. It also leaves the urge untouched.',
      },
      {
        id: 'l9q2',
        prompt: 'Why does a partner calling you out often backfire?',
        options: [
          "It only works when they're there, and stress can feed the habit",
          'It makes your nails grow too fast',
          'It works perfectly, there is no downside',
        ],
        answer: 0,
        why: 'Most biting happens alone, and stress is a common trigger.',
      },
    ],
    takeaway: "Punishment rarely lasts. Swaps, trigger fixes and encouragement do.",
  },
  {
    id: 'l10',
    number: 10,
    title: 'Slips are data',
    summary: 'How to handle a slip so it stays a slip.',
    minutes: 4,
    hook: 'Everyone slips. What you tell yourself next is what matters.',
    cards: [
      {
        title: "The 'might as well' trap",
        body: "Psychologists call it the abstinence violation effect: one slip feels like total failure, so you give up. 'I already ruined it, so tonight's a free-for-all.'",
        source: { label: "Marlatt's relapse prevention model", url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6760427/' },
      },
      {
        title: "That's why there are no streaks here",
        body: 'Your score counts bite-free days out of the last 28. A rough night dips it a little. It never crashes to zero.',
      },
      {
        title: 'Blame the situation',
        body: "Instead of 'I have no self-control,' try 'I bit at 11 PM on the couch after a stressful day.' Then change one thing in that spot, like putting a nail file by the couch.",
      },
      {
        title: 'Habits take time',
        body: 'In a study of new habits, it took a median of 66 days for them to feel automatic, and missing a single day barely mattered.',
        source: { label: 'Lally and colleagues, 2010', url: 'https://www.thebehavioralscientist.com/articles/how-long-to-form-a-habit' },
      },
    ],
    tryIt: {
      title: 'Plan your bounce-back',
      body: 'Pick one thing you would change in your most common biting spot. You can log slips anytime from the Tools tab.',
    },
    quiz: [
      {
        id: 'l10q1',
        prompt: "You slip after 20 good days. What's the most helpful thought?",
        options: [
          "I've ruined everything, so why bother",
          'I bit on the couch after a stressful day. Tomorrow I will keep a file there.',
          "I'll start again once my nails look good",
        ],
        answer: 1,
        why: 'Naming the situation and changing one thing keeps a slip from becoming a relapse.',
      },
      {
        id: 'l10q2',
        prompt: 'Why does Nibblr use a 28-day score instead of a streak?',
        options: ['Streaks are too easy', 'A reset to zero can trigger giving up', 'Scores look nicer'],
        answer: 1,
        why: 'Seeing a streak crash to zero feeds the "might as well" trap. A rolling score dips gently.',
      },
    ],
    takeaway: 'A slip is information. Blame the situation, change one thing, and keep going.',
    unlocks: 'slip',
  },
];

export const allQuestions = lessons.flatMap((l) => l.quiz.map((q) => ({ ...q, lessonId: l.id })));
