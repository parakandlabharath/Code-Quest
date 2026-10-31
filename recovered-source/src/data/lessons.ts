import { InteractiveLesson } from '../types';

export const INTERACTIVE_LESSONS: InteractiveLesson[] = [
  {
    id: 'lesson_js_weirdness',
    title: '🤡 JavaScript Quirks & Funny Mysteries',
    funnyConcept: 'Why 0 == "0" is true, but "0" == [] makes developers cry tears of pizza!',
    difficulty: 'beginner',
    durationMinutes: 5,
    xpReward: 150,
    badgeReward: {
      name: 'Coercion Survivor',
      icon: '🤪',
      description: 'Mastered the weird & funny type coercions of JavaScript!'
    },
    steps: [
      {
        stepTitle: 'The Tale of Two Equals: == vs ===',
        storyExplanation: 'In JavaScript, double equals `==` is like a overly friendly Golden Retriever. It tries to force incompatible things (strings and numbers) to get along by auto-converting them! Triple equals `===` is like a strict security guard checking official IDs.',
        codeSnippet: `console.log(0 == "0");   // true (Golden Retriever forced string "0" to number 0!)
console.log(0 === "0");  // false (Strict security guard sees number vs string!)
console.log([] == false); // true (Empty array converts to empty string, then to number 0!)`,
        quizQuestion: 'What does `"5" === 5` evaluate to in JavaScript?',
        options: ['true', 'false', 'undefined', 'NaN'],
        correctOptionIndex: 1,
        hint: '`===` checks both value AND data type without converting anything!'
      },
      {
        stepTitle: 'NaN is a Number? (Wait, What?!)',
        storyExplanation: 'JavaScript has a funny identity crisis: `NaN` stands for "Not-a-Number", but if you check `typeof NaN`, JavaScript proudly announces `"number"`. Think of `NaN` as a chaotic evil number that failed its math test.',
        codeSnippet: `console.log(typeof NaN); // "number" 🤯
console.log(NaN === NaN); // false (NaN is so chaotic it doesn't even equal itself!)
console.log(Number.isNaN(NaN)); // true (The safe way to test for NaN)`,
        quizQuestion: 'How should you safely check if a variable `val` is NaN?',
        options: ['val === NaN', 'val == NaN', 'Number.isNaN(val)', 'typeof val === "NaN"'],
        correctOptionIndex: 2,
        hint: 'Since NaN !== NaN, use the built-in Number.isNaN() method!'
      },
      {
        stepTitle: 'Adding Arrays to Objects (Banana Math)',
        storyExplanation: 'When you try to perform string addition with arrays or objects, JavaScript converts them to strings. For example: `("b" + "a" + + "a" + "a").toLowerCase()` produces `"banana"` because `+ "a"` evaluates to `NaN`!',
        codeSnippet: `const magicBanana = ("b" + "a" + + "a" + "a").toLowerCase();
console.log(magicBanana); // "banana" 🍌`,
        quizQuestion: 'Why does `+ "a"` result in `NaN`?',
        options: [
          'Because "a" is converted to ascii',
          'Unary plus attempts to convert string "a" into a number and fails',
          'Because banana is a fruit',
          'JavaScript runs out of memory'
        ],
        correctOptionIndex: 1,
        hint: 'The unary plus (+) tries to parse "a" as a number, yielding NaN.'
      }
    ]
  },
  {
    id: 'lesson_arrays_pizzas',
    title: '🍕 Array Magic: Stacking Pizza Boxes',
    funnyConcept: 'Mastering .map(), .filter(), and .reduce() using delicious food analogies!',
    difficulty: 'beginner',
    durationMinutes: 7,
    xpReward: 200,
    badgeReward: {
      name: 'Pizza Array Chef',
      icon: '🍕',
      description: 'Learned how to transform, filter, and reduce array data like a pro pizza chef!'
    },
    steps: [
      {
        stepTitle: '1. Array.map() - The Pizza Toppings Transformer',
        storyExplanation: 'Imagine an array of plain cheese pizzas `["cheese", "cheese"]`. `.map()` passes each item through a transformer function and returns a brand new array with extra toppings!',
        codeSnippet: `const plainPizzas = ["cheese", "veggie", "pepperoni"];
const upgradedPizzas = plainPizzas.map(pizza => pizza + " + 🧀 Extra Mozzarella");

console.log(upgradedPizzas);
// ["cheese + 🧀 Extra Mozzarella", "veggie + 🧀 Extra Mozzarella", ...]`,
        quizQuestion: 'Does Array.map() modify the original array or return a new one?',
        options: ['Modifies original array in place', 'Returns a brand new array', 'Deletes the array', 'Reverses the array'],
        correctOptionIndex: 1,
        hint: 'Array.map() is immutable—it creates and returns a shiny new array!'
      },
      {
        stepTitle: '2. Array.filter() - The Picky Eating Bouncer',
        storyExplanation: 'Imagine a bouncer at a party who only lets in spicy pizzas. `.filter()` tests every item with a boolean test (`true`/`false`) and keeps only the winners.',
        codeSnippet: `const pizzas = [
  { name: "Margherita", isSpicy: false },
  { name: "Diablo Pepperoni", isSpicy: true },
  { name: "Jalapeno Inferno", isSpicy: true }
];

const spicyMenu = pizzas.filter(pizza => pizza.isSpicy === true);
console.log(spicyMenu); // Contains Diablo & Jalapeno!`,
        quizQuestion: 'What does `.filter()` return if no elements match the condition?',
        options: ['null', 'undefined', 'An empty array []', 'Throws a TypeError'],
        correctOptionIndex: 2,
        hint: 'Filter always returns an array—empty if no match!'
      },
      {
        stepTitle: '3. Array.reduce() - The Total Calories Accumulator',
        storyExplanation: 'Imagine putting all your pizza slices into a blender (or calorie counter). `.reduce()` takes many items and squashes them into a single value (like total calories, total bill, or single combined object).',
        codeSnippet: `const sliceCalories = [250, 300, 280, 320];

const totalCalories = sliceCalories.reduce((accumulator, currentSlice) => {
  return accumulator + currentSlice;
}, 0); // 0 is initial accumulator starting value

console.log("Total Cals:", totalCalories); // 1150`,
        quizQuestion: 'In `.reduce((acc, curr) => acc + curr, 10)`, what is 10?',
        options: ['The index', 'The length of array', 'The initial value of the accumulator', 'The multiplier'],
        correctOptionIndex: 2,
        hint: 'The second parameter after the reducer function is the starting value for accumulator!'
      }
    ]
  },
  {
    id: 'lesson_async_promises',
    title: '🛵 Async/Await: Ordering Late-Night Tacos',
    funnyConcept: 'Stop blocking the thread! How non-blocking asynchronous JavaScript works.',
    difficulty: 'intermediate',
    durationMinutes: 8,
    xpReward: 250,
    badgeReward: {
      name: 'Async Taco Master',
      icon: '🌮',
      description: 'Mastered non-blocking promises and async/await syntax without freezing the UI!'
    },
    steps: [
      {
        stepTitle: 'Synchronous vs Asynchronous (Standing in Line vs Buzzer)',
        storyExplanation: 'In synchronous code, you stand at the counter frozen, unable to check your phone until the taco chef hands you food. In asynchronous code, you get a **Promise** (a vibrating buzzer disk). You go sit down, drink water, and play games until the buzzer vibrates!',
        codeSnippet: `// Synchronous (Blocks everything)
console.log("1. Order Taco");
console.log("2. Wait 10 minutes at register without moving");
console.log("3. Eat Taco");

// Asynchronous Promise (Non-blocking)
console.log("1. Order Taco & get Buzzer (Promise)");
fetchTacoFromKitchen().then(taco => console.log("3. Buzzer rang! Eat", taco));
console.log("2. Play phone game while waiting!");`,
        quizQuestion: 'What is a JavaScript Promise?',
        options: [
          'A guarantee that your computer will never crash',
          'An object representing the eventual completion or failure of an asynchronous operation',
          'A strict variable declaration',
          'A synchronous loop'
        ],
        correctOptionIndex: 1,
        hint: 'A Promise is a placeholder for a future result (fulfilled or rejected).'
      },
      {
        stepTitle: 'Async / Await (Clean & Coziness)',
        storyExplanation: 'Instead of chaining `.then().then().catch()`, ES2017 introduced `async` and `await`. It makes asynchronous code read like clean synchronous steps!',
        codeSnippet: `async function deliverLateNightTacos() {
  try {
    console.log("Calling taco truck...");
    const tacos = await fetchTacos(); // Pauses execution of THIS function until resolved!
    console.log("Tacos arrived! 🌮", tacos);
  } catch (error) {
    console.log("Oh no, taco truck had a flat tire!", error);
  }
}`,
        quizQuestion: 'Can you use `await` inside a regular, non-async function top level (without ESM top-level await)?',
        options: ['Yes, always', 'No, await must be inside an async function', 'Only on Tuesdays', 'Yes, if using var'],
        correctOptionIndex: 1,
        hint: 'Prior to top-level await modules, `await` was strictly required to be inside an `async` function!'
      }
    ]
  }
];
