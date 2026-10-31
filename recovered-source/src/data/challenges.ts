import { Challenge } from '../types';

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'p1_banana_split',
    title: '🍌 The Missing Banana Split Bug',
    funnyIntro: 'A mischievous monkey hijacked the zookeeper\'s fruit inventory system! Bananas are returning undefined or string concatenations like "5bananas" instead of actual math numbers.',
    description: 'Write a function `calculateTotalBananas(initialCount, addedCount)` that safely converts input values to numbers and returns the sum of total bananas. If any argument is invalid or negative, return 0.',
    difficulty: 'beginner',
    category: 'basics',
    tags: ['Math', 'Type Conversion', 'Beginner'],
    xpReward: 100,
    coinReward: 25,
    initialCode: `function calculateTotalBananas(initialCount, addedCount) {
  // Fix the monkey's bug here!
  // Hint: Convert inputs to numbers and check if negative or NaN
  return initialCount + addedCount;
}`,
    testCases: [
      {
        id: 'tc1',
        inputDescription: 'calculateTotalBananas(5, 10)',
        expectedOutput: '15',
        expectedType: 'number'
      },
      {
        id: 'tc2',
        inputDescription: 'calculateTotalBananas("3", "7")',
        expectedOutput: '10',
        expectedType: 'number'
      },
      {
        id: 'tc3',
        inputDescription: 'calculateTotalBananas(-5, 10)',
        expectedOutput: '0',
        expectedType: 'number'
      },
      {
        id: 'tc4',
        inputDescription: 'calculateTotalBananas("banana", 5)',
        expectedOutput: '0',
        expectedType: 'number',
        hidden: true
      }
    ],
    hints: [
      'Use Number() or parseInt() to convert string inputs into actual numbers.',
      'Check if the numbers are NaN using Number.isNaN(val) or isNaN(val).',
      'If either number is less than 0 or NaN, return 0 early.'
    ],
    solutionCode: `function calculateTotalBananas(initialCount, addedCount) {
  const a = Number(initialCount);
  const b = Number(addedCount);
  if (isNaN(a) || isNaN(b) || a < 0 || b < 0) return 0;
  return a + b;
}`
  },
  {
    id: 'p2_cat_keyboard',
    title: '🐱 Cat on the Keyboard Noise Cleaner',
    funnyIntro: 'Your cat Barnaby walked across your mechanical keyboard and inserted "meow" and "purr" in the middle of important user names!',
    description: 'Write a function `cleanCatNoise(noisyString)` that removes all occurrences of "meow" and "purr" (case-insensitive) from the input string and trims extra white spaces.',
    difficulty: 'beginner',
    category: 'funny_bugs',
    tags: ['Strings', 'Regex', 'Cat Humor'],
    xpReward: 120,
    coinReward: 30,
    initialCode: `function cleanCatNoise(noisyString) {
  // Remove "meow" and "purr" from noisyString!
  
  return noisyString;
}`,
    testCases: [
      {
        id: 'tc1',
        inputDescription: 'cleanCatNoise("Alice meow Smith")',
        expectedOutput: '"Alice  Smith"',
        expectedType: 'string'
      },
      {
        id: 'tc2',
        inputDescription: 'cleanCatNoise("PURRBobMeow")',
        expectedOutput: '"Bob"',
        expectedType: 'string'
      },
      {
        id: 'tc3',
        inputDescription: 'cleanCatNoise("CleanUser")',
        expectedOutput: '"CleanUser"',
        expectedType: 'string'
      }
    ],
    hints: [
      'You can use string replace with a Regular Expression with the global and case-insensitive flags: /meow|purr/gi',
      'Example: str.replace(/meow|purr/gi, "")',
      'Don\'t forget to handle both "meow" and "purr" in one regex or consecutive replaces!'
    ],
    solutionCode: `function cleanCatNoise(noisyString) {
  if (!noisyString) return "";
  return noisyString.replace(/meow|purr/gi, "").trim();
}`
  },
  {
    id: 'p3_pizza_splitter',
    title: '🍕 Fair Pizza Slicer',
    funnyIntro: 'Three hungry developers ordered 2 large pepperoni pizzas with 16 total slices. One guy ate 7, one ate 5... How many slices are left for you?',
    description: 'Write a function `getSlicesLeft(totalSlices, eatenArray)` where `eatenArray` is an array of numbers representing slices eaten by each friend. Return the number of remaining slices. If eaten slices exceed total, return 0 with no debt!',
    difficulty: 'beginner',
    category: 'basics',
    tags: ['Arrays', 'Reduce', 'Food Math'],
    xpReward: 110,
    coinReward: 25,
    initialCode: `function getSlicesLeft(totalSlices, eatenArray) {
  // Sum up slices eaten and subtract from totalSlices!
  
}`,
    testCases: [
      {
        id: 'tc1',
        inputDescription: 'getSlicesLeft(16, [7, 5, 2])',
        expectedOutput: '2',
        expectedType: 'number'
      },
      {
        id: 'tc2',
        inputDescription: 'getSlicesLeft(12, [4, 4, 4])',
        expectedOutput: '0',
        expectedType: 'number'
      },
      {
        id: 'tc3',
        inputDescription: 'getSlicesLeft(10, [8, 5])',
        expectedOutput: '0',
        expectedType: 'number'
      }
    ],
    hints: [
      'Calculate the sum of all elements in eatenArray using array.reduce() or a simple loop.',
      'Subtract totalEaten from totalSlices.',
      'Use Math.max(0, remaining) to make sure you never return negative pizza slices!'
    ],
    solutionCode: `function getSlicesLeft(totalSlices, eatenArray) {
  const totalEaten = eatenArray.reduce((acc, current) => acc + current, 0);
  const remaining = totalSlices - totalEaten;
  return Math.max(0, remaining);
}`
  },
  {
    id: 'p4_infinite_loop_escape',
    title: '🌀 Escape the Infinite Rocket Loop',
    funnyIntro: 'The launch rocket countdown got stuck in an infinite loop! Ground control is panicking while counting down from 10 to 1.',
    description: 'Fix the function `countdownRocket(startNumber)` so it returns an array of numbers from `startNumber` down to 1, followed by the string "BLASTOFF!". If startNumber is <= 0, return ["ABORT!"]',
    difficulty: 'intermediate',
    category: 'funny_bugs',
    tags: ['Loops', 'Arrays', 'Control Flow'],
    xpReward: 150,
    coinReward: 35,
    initialCode: `function countdownRocket(startNumber) {
  if (startNumber <= 0) return ["ABORT!"];
  let result = [];
  
  // Fill array from startNumber down to 1
  
  result.push("BLASTOFF!");
  return result;
}`,
    testCases: [
      {
        id: 'tc1',
        inputDescription: 'countdownRocket(5)',
        expectedOutput: '[5, 4, 3, 2, 1, "BLASTOFF!"]',
        expectedType: 'array'
      },
      {
        id: 'tc2',
        inputDescription: 'countdownRocket(0)',
        expectedOutput: '["ABORT!"]',
        expectedType: 'array'
      },
      {
        id: 'tc3',
        inputDescription: 'countdownRocket(3)',
        expectedOutput: '[3, 2, 1, "BLASTOFF!"]',
        expectedType: 'array'
      }
    ],
    hints: [
      'Use a while loop or for loop starting at i = startNumber down to i >= 1 with i--.',
      'Push each number into the result array.',
      'At the end of the loop, push "BLASTOFF!" to the result.'
    ],
    solutionCode: `function countdownRocket(startNumber) {
  if (startNumber <= 0) return ["ABORT!"];
  let result = [];
  for (let i = startNumber; i >= 1; i--) {
    result.push(i);
  }
  result.push("BLASTOFF!");
  return result;
}`
  },
  {
    id: 'p5_async_promise_race',
    title: '🏎️ The Coffee Bot Async Race',
    funnyIntro: 'Three barista robots (Espresso Bot, Cold Brew Bot, Matcha Bot) operate asynchronously. The impatient customer only cares about whoever responds first!',
    description: 'Write an async function `raceCoffeeBots(botPromises)` that accepts an array of Promises and returns a Promise resolving to the first successful bot drink output with the prefix "First Ready: ". If all bots fail or array is empty, return "Coffee Machine Out of Order!".',
    difficulty: 'advanced',
    category: 'async_magic',
    tags: ['Async/Await', 'Promises', 'Promise.race', 'Advanced'],
    xpReward: 250,
    coinReward: 60,
    initialCode: `async function raceCoffeeBots(botPromises) {
  // Use Promise handling or Promise.race to return whichever drink finishes first!
  // Remember to catch errors gracefully!
  
}`,
    testCases: [
      {
        id: 'tc1',
        inputDescription: 'raceCoffeeBots([Promise.resolve("Espresso"), Promise.resolve("Matcha")])',
        expectedOutput: '"First Ready: Espresso"',
        expectedType: 'string'
      },
      {
        id: 'tc2',
        inputDescription: 'raceCoffeeBots([])',
        expectedOutput: '"Coffee Machine Out of Order!"',
        expectedType: 'string'
      }
    ],
    hints: [
      'Check if botPromises is empty or null first.',
      'You can use Promise.race(botPromises) inside a try/catch block.',
      'Return "First Ready: " + result if successful!'
    ],
    solutionCode: `async function raceCoffeeBots(botPromises) {
  if (!botPromises || botPromises.length === 0) {
    return "Coffee Machine Out of Order!";
  }
  try {
    const winner = await Promise.race(botPromises);
    return "First Ready: " + winner;
  } catch (err) {
    return "Coffee Machine Out of Order!";
  }
}`
  },
  {
    id: 'p6_secret_click_counter',
    title: '🔒 The Secret Closure Click Tracker',
    funnyIntro: 'The sneaky web admin wants a click tracker function that stores click counts in private closure scope so user tampered globals can\'t reset it!',
    description: 'Write a function `createSecretTracker(initialClicks)` that returns an object with 3 methods:\n- `click()`: increments count by 1 and returns new count\n- `reset()`: resets count back to 0 and returns 0\n- `getCount()`: returns current count.',
    difficulty: 'advanced',
    category: 'algorithms',
    tags: ['Closures', 'Scope', 'OOP', 'Advanced'],
    xpReward: 220,
    coinReward: 50,
    initialCode: `function createSecretTracker(initialClicks = 0) {
  // Define private state here using closure!
  let count = initialClicks;
  
  return {
    click: function() {
      // fill in
    },
    reset: function() {
      // fill in
    },
    getCount: function() {
      // fill in
    }
  };
}`,
    testCases: [
      {
        id: 'tc1',
        inputDescription: 'const t = createSecretTracker(5); t.click(); t.click(); t.getCount();',
        expectedOutput: '7',
        expectedType: 'number'
      },
      {
        id: 'tc2',
        inputDescription: 'const t = createSecretTracker(10); t.reset(); t.getCount();',
        expectedOutput: '0',
        expectedType: 'number'
      }
    ],
    hints: [
      'Keep `count` inside `createSecretTracker` function scope.',
      'The object methods keep a reference to `count` via closure.',
      'No property named `count` should be exposed directly on the returned object!'
    ],
    solutionCode: `function createSecretTracker(initialClicks = 0) {
  let count = initialClicks;
  return {
    click: function() {
      count++;
      return count;
    },
    reset: function() {
      count = 0;
      return count;
    },
    getCount: function() {
      return count;
    }
  };
}`
  },
  {
    id: 'p7_regex_alien_filter',
    title: '👽 Alien Phone Number Sanitizer',
    funnyIntro: 'Galactic Empire HQ received distress signals, but half the transmission logs are corrupted with fake alien phone numbers!',
    description: 'Write a function `sanitizePhoneNumbers(transmissions)` that takes an array of strings and returns only strings that match valid Earth format: `(XXX) XXX-XXXX` or `XXX-XXX-XXXX` (where X is a digit 0-9).',
    difficulty: 'advanced',
    category: 'regex_madness',
    tags: ['RegEx', 'Validation', 'Arrays'],
    xpReward: 230,
    coinReward: 55,
    initialCode: `function sanitizePhoneNumbers(transmissions) {
  // Filter transmissions using Regular Expressions!
  
}`,
    testCases: [
      {
        id: 'tc1',
        inputDescription: 'sanitizePhoneNumbers(["(555) 123-4567", "999-000-1111", "alien-phone-999"])',
        expectedOutput: '["(555) 123-4567", "999-000-1111"]',
        expectedType: 'array'
      },
      {
        id: 'tc2',
        inputDescription: 'sanitizePhoneNumbers(["12345", "bad-format"])',
        expectedOutput: '[]',
        expectedType: 'array'
      }
    ],
    hints: [
      'Use a Regex pattern like /^(\\(\\d{3}\\)\\s?|\\d{3}-)\\d{3}-\\d{4}$/',
      'Test each string with pattern.test(str).',
      'Use transmissions.filter(str => pattern.test(str))!'
    ],
    solutionCode: `function sanitizePhoneNumbers(transmissions) {
  const pattern = /^(\(\d{3}\)\s?|\d{3}-)\d{3}-\d{4}$/;
  return transmissions.filter(item => pattern.test(item));
}`
  }
];
