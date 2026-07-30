export const problems = [
    // EASY (10)
    {
        id: 'easy-1',
        title: 'Sum of Two Numbers',
        difficulty: 'Easy',
        description: 'Write a function that takes two numbers and returns their sum.',
        boilerplate: 'function sum(a, b) {\n  // Your code here\n}',
        testCases: [
            { input: [1, 2], expected: 3 },
            { input: [-1, 1], expected: 0 },
            { input: [10, 20], expected: 30 }
        ]
    },
    {
        id: 'easy-2',
        title: 'Return Hello World',
        difficulty: 'Easy',
        description: 'Write a function that returns the string "Hello World".',
        boilerplate: 'function hello() {\n  // Your code here\n}',
        testCases: [
            { input: [], expected: 'Hello World' }
        ]
    },
    {
        id: 'easy-3',
        title: 'Is Even?',
        difficulty: 'Easy',
        description: 'Write a function that returns true if a number is even, false otherwise.',
        boilerplate: 'function isEven(n) {\n  // Your code here\n}',
        testCases: [
            { input: [2], expected: true },
            { input: [3], expected: false },
            { input: [0], expected: true }
        ]
    },
    {
        id: 'easy-4',
        title: 'Convert Minutes to Seconds',
        difficulty: 'Easy',
        description: 'Write a function that takes an integer minutes and converts it to seconds.',
        boilerplate: 'function convert(minutes) {\n  // Your code here\n}',
        testCases: [
            { input: [5], expected: 300 },
            { input: [3], expected: 180 },
            { input: [2], expected: 120 }
        ]
    },
    {
        id: 'easy-5',
        title: 'Find the Largest Number',
        difficulty: 'Easy',
        description: 'Write a function that takes an array of numbers and returns the largest number.',
        boilerplate: 'function findMax(arr) {\n  // Your code here\n}',
        testCases: [
            { input: [[1, 2, 3]], expected: 3 },
            { input: [[-1, -5, -2]], expected: -1 },
            { input: [[100, 200, 50]], expected: 200 }
        ]
    },
    {
        id: 'easy-6',
        title: 'Reverse a String',
        difficulty: 'Easy',
        description: 'Write a function that reverses a string.',
        boilerplate: 'function reverse(str) {\n  // Your code here\n}',
        testCases: [
            { input: ['hello'], expected: 'olleh' },
            { input: ['world'], expected: 'dlrow' },
            { input: ['a'], expected: 'a' }
        ]
    },
    {
        id: 'easy-7',
        title: 'Check for Palindrome',
        difficulty: 'Easy',
        description: 'Write a function that checks if a string is a palindrome.',
        boilerplate: 'function isPalindrome(str) {\n  // Your code here\n}',
        testCases: [
            { input: ['racecar'], expected: true },
            { input: ['hello'], expected: false },
            { input: ['madam'], expected: true }
        ]
    },
    {
        id: 'easy-8',
        title: 'Factorial of a Number',
        difficulty: 'Easy',
        description: 'Write a function that returns the factorial of a number.',
        boilerplate: 'function factorial(n) {\n  // Your code here\n}',
        testCases: [
            { input: [5], expected: 120 },
            { input: [3], expected: 6 },
            { input: [0], expected: 1 }
        ]
    },
    {
        id: 'easy-9',
        title: 'Count Vowels',
        difficulty: 'Easy',
        description: 'Write a function that counts the number of vowels in a string.',
        boilerplate: 'function countVowels(str) {\n  // Your code here\n}',
        testCases: [
            { input: ['hello'], expected: 2 },
            { input: ['world'], expected: 1 },
            { input: ['aeiou'], expected: 5 }
        ]
    },
    {
        id: 'easy-10',
        title: 'Remove Duplicates from Array',
        difficulty: 'Easy',
        description: 'Write a function that removes duplicate values from an array.',
        boilerplate: 'function removeDuplicates(arr) {\n  // Your code here\n}',
        testCases: [
            { input: [[1, 2, 2, 3]], expected: [1, 2, 3] },
            { input: [[1, 1, 1]], expected: [1] },
            { input: [[1, 2, 3]], expected: [1, 2, 3] }
        ]
    },

    // INTERMEDIATE (15)
    {
        id: 'int-1',
        title: 'Flatten Array',
        difficulty: 'Intermediate',
        description: 'Write a function that flattens a nested array (one level deep).',
        boilerplate: 'function flatten(arr) {\n  // Your code here\n}',
        testCases: [
            { input: [[[1, 2], [3, 4]]], expected: [1, 2, 3, 4] },
            { input: [[1, [2, 3]]], expected: [1, 2, 3] }
        ]
    },
    {
        id: 'int-2',
        title: 'Anagram Check',
        difficulty: 'Intermediate',
        description: 'Check if two strings are anagrams of each other.',
        boilerplate: 'function isAnagram(str1, str2) {\n  // Your code here\n}',
        testCases: [
            { input: ['listen', 'silent'], expected: true },
            { input: ['hello', 'world'], expected: false }
        ]
    },
    {
        id: 'int-3',
        title: 'FizzBuzz',
        difficulty: 'Intermediate',
        description: 'Return an array from 1 to n. Replace multiples of 3 with "Fizz", 5 with "Buzz", both with "FizzBuzz".',
        boilerplate: 'function fizzBuzz(n) {\n  // Your code here\n}',
        testCases: [
            { input: [3], expected: [1, 2, 'Fizz'] },
            { input: [5], expected: [1, 2, 'Fizz', 4, 'Buzz'] }
        ]
    },
    {
        id: 'int-4',
        title: 'Fibonacci Sequence',
        difficulty: 'Intermediate',
        description: 'Return the nth number in the Fibonacci sequence.',
        boilerplate: 'function fibonacci(n) {\n  // Your code here\n}',
        testCases: [
            { input: [5], expected: 5 },
            { input: [10], expected: 55 }
        ]
    },
    {
        id: 'int-5',
        title: 'Title Case a Sentence',
        difficulty: 'Intermediate',
        description: 'Capitalize the first letter of each word in a sentence.',
        boilerplate: 'function titleCase(str) {\n  // Your code here\n}',
        testCases: [
            { input: ['I am a teapot'], expected: 'I Am A Teapot' },
            { input: ['sHoRt aNd sToUt'], expected: 'Short And Stout' }
        ]
    },
    {
        id: 'int-6',
        title: 'Find Longest Word',
        difficulty: 'Intermediate',
        description: 'Return the length of the longest word in a sentence.',
        boilerplate: 'function findLongestWordLength(str) {\n  // Your code here\n}',
        testCases: [
            { input: ['The quick brown fox jumped over the lazy dog'], expected: 6 },
            { input: ['May the force be with you'], expected: 5 }
        ]
    },
    {
        id: 'int-7',
        title: 'Array Chunking',
        difficulty: 'Intermediate',
        description: 'Split an array into groups the length of size.',
        boilerplate: 'function chunkArrayInGroups(arr, size) {\n  // Your code here\n}',
        testCases: [
            { input: [[1, 2, 3, 4], 2], expected: [[1, 2], [3, 4]] },
            { input: [[1, 2, 3, 4, 5], 2], expected: [[1, 2], [3, 4], [5]] }
        ]
    },
    {
        id: 'int-8',
        title: 'Confirm the Ending',
        difficulty: 'Intermediate',
        description: 'Check if a string ends with the given target string.',
        boilerplate: 'function confirmEnding(str, target) {\n  // Your code here\n}',
        testCases: [
            { input: ['Bastian', 'n'], expected: true },
            { input: ['Connor', 'n'], expected: false }
        ]
    },
    {
        id: 'int-9',
        title: 'Repeat a String',
        difficulty: 'Intermediate',
        description: 'Repeat a given string str (first argument) for num times (second argument).',
        boilerplate: 'function repeatStringNumTimes(str, num) {\n  // Your code here\n}',
        testCases: [
            { input: ['abc', 3], expected: 'abcabcabc' },
            { input: ['abc', 1], expected: 'abc' }
        ]
    },
    {
        id: 'int-10',
        title: 'Truncate a String',
        difficulty: 'Intermediate',
        description: 'Truncate a string if it is longer than the given maximum string length.',
        boilerplate: 'function truncateString(str, num) {\n  // Your code here\n}',
        testCases: [
            { input: ['A-tisket a-tasket A green and yellow basket', 8], expected: 'A-tisket...' },
            { input: ['Peter Piper picked a peck of pickled peppers', 11], expected: 'Peter Piper...' }
        ]
    },
    {
        id: 'int-11',
        title: 'Find Element in Array',
        difficulty: 'Intermediate',
        description: 'Create a function that looks through an array arr and returns the first element in it that passes a "truth test".',
        boilerplate: 'function findElement(arr, func) {\n  // Your code here\n}',
        testCases: [
            { input: [[1, 2, 3, 4], num => num % 2 === 0], expected: 2 },
            { input: [[1, 3, 5, 8, 9, 10], num => num % 2 === 0], expected: 8 }
        ]
    },
    {
        id: 'int-12',
        title: 'Boo who',
        difficulty: 'Intermediate',
        description: 'Check if a value is classified as a boolean primitive.',
        boilerplate: 'function booWho(bool) {\n  // Your code here\n}',
        testCases: [
            { input: [true], expected: true },
            { input: [false], expected: true },
            { input: [1], expected: false }
        ]
    },
    {
        id: 'int-13',
        title: 'Mutations',
        difficulty: 'Intermediate',
        description: 'Return true if the string in the first element of the array contains all of the letters of the string in the second element of the array.',
        boilerplate: 'function mutation(arr) {\n  // Your code here\n}',
        testCases: [
            { input: [['hello', 'hey']], expected: false },
            { input: [['hello', 'Hello']], expected: true }
        ]
    },
    {
        id: 'int-14',
        title: 'Chunky Monkey',
        difficulty: 'Intermediate',
        description: 'Write a function that splits an array (first argument) into groups the length of size (second argument) and returns them as a two-dimensional array.',
        boilerplate: 'function chunkArrayInGroups(arr, size) {\n  // Your code here\n}',
        testCases: [
            { input: [['a', 'b', 'c', 'd'], 2], expected: [['a', 'b'], ['c', 'd']] },
            { input: [[0, 1, 2, 3, 4, 5], 3], expected: [[0, 1, 2], [3, 4, 5]] }
        ]
    },
    {
        id: 'int-15',
        title: 'Where do I Belong',
        difficulty: 'Intermediate',
        description: 'Return the lowest index at which a value (second argument) should be inserted into an array (first argument) once it has been sorted.',
        boilerplate: 'function getIndexToIns(arr, num) {\n  // Your code here\n}',
        testCases: [
            { input: [[10, 20, 30, 40, 50], 35], expected: 3 },
            { input: [[10, 20, 30, 40, 50], 30], expected: 2 }
        ]
    },

    // ADVANCED (15)
    {
        id: 'adv-1',
        title: 'Sum All Numbers in a Range',
        difficulty: 'Advanced',
        description: 'We\'ll pass you an array of two numbers. Return the sum of those two numbers plus the sum of all the numbers between them.',
        boilerplate: 'function sumAll(arr) {\n  // Your code here\n}',
        testCases: [
            { input: [[1, 4]], expected: 10 },
            { input: [[4, 1]], expected: 10 }
        ]
    },
    {
        id: 'adv-2',
        title: 'Diff Two Arrays',
        difficulty: 'Advanced',
        description: 'Compare two arrays and return a new array with any items only found in one of the two given arrays, but not both.',
        boilerplate: 'function diffArray(arr1, arr2) {\n  // Your code here\n}',
        testCases: [
            { input: [[1, 2, 3, 5], [1, 2, 3, 4, 5]], expected: [4] },
            { input: [['diorite', 'andesite', 'grass', 'dirt', 'pink wool', 'dead shrub'], ['diorite', 'andesite', 'grass', 'dirt', 'dead shrub']], expected: ['pink wool'] }
        ]
    },
    {
        id: 'adv-3',
        title: 'Seek and Destroy',
        difficulty: 'Advanced',
        description: 'You will be provided with an initial array (the first argument in the destroyer function), followed by one or more arguments. Remove all elements from the initial array that are of the same value as these arguments.',
        boilerplate: 'function destroyer(arr, ...vals) {\n  // Your code here\n}',
        testCases: [
            { input: [[1, 2, 3, 1, 2, 3], 2, 3], expected: [1, 1] },
            { input: [[1, 2, 3, 5, 1, 2, 3], 2, 3], expected: [1, 5, 1] }
        ]
    },
    {
        id: 'adv-4',
        title: 'Wherefore art thou',
        difficulty: 'Advanced',
        description: 'Make a function that looks through an array of objects (first argument) and returns an array of all objects that have matching name and value pairs (second argument).',
        boilerplate: 'function whatIsInAName(collection, source) {\n  // Your code here\n}',
        testCases: [
            { input: [[{ first: 'Romeo', last: 'Montague' }, { first: 'Mercutio', last: null }, { first: 'Tybalt', last: 'Capulet' }], { last: 'Capulet' }], expected: [{ first: 'Tybalt', last: 'Capulet' }] },
            { input: [[{ 'apple': 1, 'bat': 2 }, { 'bat': 2 }, { 'apple': 1, 'bat': 2, 'cookie': 2 }], { 'apple': 1, 'bat': 2 }], expected: [{ 'apple': 1, 'bat': 2 }, { 'apple': 1, 'bat': 2, 'cookie': 2 }] }
        ]
    },
    {
        id: 'adv-5',
        title: 'Spinal Tap Case',
        difficulty: 'Advanced',
        description: 'Convert a string to spinal case. Spinal case is all-lowercase-words-joined-by-dashes.',
        boilerplate: 'function spinalCase(str) {\n  // Your code here\n}',
        testCases: [
            { input: ['This Is Spinal Tap'], expected: 'this-is-spinal-tap' },
            { input: ['thisIsSpinalTap'], expected: 'this-is-spinal-tap' }
        ]
    },
    {
        id: 'adv-6',
        title: 'Pig Latin',
        difficulty: 'Advanced',
        description: 'Translate the provided string to Pig Latin.',
        boilerplate: 'function translatePigLatin(str) {\n  // Your code here\n}',
        testCases: [
            { input: ['california'], expected: 'aliforniacay' },
            { input: ['paragraphs'], expected: 'aragraphspay' },
            { input: ['glove'], expected: 'oveglay' }
        ]
    },
    {
        id: 'adv-7',
        title: 'Search and Replace',
        difficulty: 'Advanced',
        description: 'Perform a search and replace on the sentence using the arguments provided and return the new sentence.',
        boilerplate: 'function myReplace(str, before, after) {\n  // Your code here\n}',
        testCases: [
            { input: ['Let us go to the store', 'store', 'mall'], expected: 'Let us go to the mall' },
            { input: ['He is Sleeping on the couch', 'Sleeping', 'sitting'], expected: 'He is Sitting on the couch' }
        ]
    },
    {
        id: 'adv-8',
        title: 'DNA Pairing',
        difficulty: 'Advanced',
        description: 'The DNA strand is missing the pairing element. Take each character, get its pair, and return the results as a 2d array.',
        boilerplate: 'function pairElement(str) {\n  // Your code here\n}',
        testCases: [
            { input: ['GCG'], expected: [['G', 'C'], ['C', 'G'], ['G', 'C']] },
            { input: ['ATCGA'], expected: [['A', 'T'], ['T', 'A'], ['C', 'G'], ['G', 'C'], ['A', 'T']] }
        ]
    },
    {
        id: 'adv-9',
        title: 'Missing letters',
        difficulty: 'Advanced',
        description: 'Find the missing letter in the passed letter range and return it.',
        boilerplate: 'function fearNotLetter(str) {\n  // Your code here\n}',
        testCases: [
            { input: ['abce'], expected: 'd' },
            { input: ['abcdefghjklmno'], expected: 'i' }
        ]
    },
    {
        id: 'adv-10',
        title: 'Sorted Union',
        difficulty: 'Advanced',
        description: 'Write a function that takes two or more arrays and returns a new array of unique values in the order of the original provided arrays.',
        boilerplate: 'function uniteUnique(...arrs) {\n  // Your code here\n}',
        testCases: [
            { input: [[1, 3, 2], [5, 2, 1, 4], [2, 1]], expected: [1, 3, 2, 5, 4] },
            { input: [[1, 2, 3], [5, 2, 1]], expected: [1, 2, 3, 5] }
        ]
    },
    {
        id: 'adv-11',
        title: 'Convert HTML Entities',
        difficulty: 'Advanced',
        description: 'Convert the characters &, <, >, " (double quote), and \' (apostrophe), in a string to their corresponding HTML entities.',
        boilerplate: 'function convertHTML(str) {\n  // Your code here\n}',
        testCases: [
            { input: ['Dolce & Gabbana'], expected: 'Dolce &amp; Gabbana' },
            { input: ['Hamburgers < Pizza < Tacos'], expected: 'Hamburgers &lt; Pizza &lt; Tacos' }
        ]
    },
    {
        id: 'adv-12',
        title: 'Sum All Odd Fibonacci Numbers',
        difficulty: 'Advanced',
        description: 'Given a positive integer num, return the sum of all odd Fibonacci numbers that are less than or equal to num.',
        boilerplate: 'function sumFibs(num) {\n  // Your code here\n}',
        testCases: [
            { input: [1000], expected: 1785 },
            { input: [4000000], expected: 4613732 },
            { input: [4], expected: 5 }
        ]
    },
    {
        id: 'adv-13',
        title: 'Sum All Primes',
        difficulty: 'Advanced',
        description: 'Sum all the prime numbers up to and including the provided number.',
        boilerplate: 'function sumPrimes(num) {\n  // Your code here\n}',
        testCases: [
            { input: [10], expected: 17 },
            { input: [977], expected: 73156 }
        ]
    },
    {
        id: 'adv-14',
        title: 'Smallest Common Multiple',
        difficulty: 'Advanced',
        description: 'Find the smallest common multiple of the provided parameters that can be evenly divided by both, as well as by all sequential numbers in the range between these parameters.',
        boilerplate: 'function smallestCommons(arr) {\n  // Your code here\n}',
        testCases: [
            { input: [[1, 5]], expected: 60 },
            { input: [[5, 1]], expected: 60 },
            { input: [[2, 10]], expected: 2520 }
        ]
    },
    {
        id: 'adv-15',
        title: 'Drop it',
        difficulty: 'Advanced',
        description: 'Given the array arr, iterate through and remove each element starting from the first element (the 0 index) until the function func returns true when the iterated element is passed through it.',
        boilerplate: 'function dropElements(arr, func) {\n  // Your code here\n}',
        testCases: [
            { input: [[1, 2, 3, 4], function (n) { return n >= 3; }], expected: [3, 4] },
            { input: [[0, 1, 0, 1], function (n) { return n === 1; }], expected: [1, 0, 1] }
        ]
    },

    // EXPERT (10)
    {
        id: 'exp-1',
        title: 'Steamroller',
        difficulty: 'Expert',
        description: 'Flatten a nested array. You must account for varying levels of nesting.',
        boilerplate: 'function steamrollArray(arr) {\n  // Your code here\n}',
        testCases: [
            { input: [[[0, 1], [2, 3], [4, 5]]], expected: [0, 1, 2, 3, 4, 5] },
            { input: [[1, [2], [3, [[4]]]]], expected: [1, 2, 3, 4] }
        ]
    },
    {
        id: 'exp-2',
        title: 'Binary Agents',
        difficulty: 'Expert',
        description: 'Return an English translated sentence of the passed binary string.',
        boilerplate: 'function binaryAgent(str) {\n  // Your code here\n}',
        testCases: [
            { input: ['01000001 01110010 01100101 01101110 00100111 01110100 00100000 01100010 01101111 01101110 01100110 01101001 01110010 01100101 01110011 00100000 01100110 01110101 01101110 00100001 00111111'], expected: 'Aren\'t bonfires fun!?' }
        ]
    },
    {
        id: 'exp-3',
        title: 'Everything Be True',
        difficulty: 'Expert',
        description: 'Check if the predicate (second argument) is truthy on all elements of a collection (first argument).',
        boilerplate: 'function truthCheck(collection, pre) {\n  // Your code here\n}',
        testCases: [
            { input: [[{ user: 'Tinky-Winky', sex: 'male' }, { user: 'Dipsy', sex: 'male' }, { user: 'Laa-Laa', sex: 'female' }, { user: 'Po', sex: 'female' }], 'sex'], expected: true },
            { input: [[{ user: 'Tinky-Winky', sex: 'male' }, { user: 'Dipsy' }, { user: 'Laa-Laa', sex: 'female' }, { user: 'Po', sex: 'female' }], 'sex'], expected: false }
        ]
    },
    {
        id: 'exp-4',
        title: 'Arguments Optional',
        difficulty: 'Expert',
        description: 'Create a function that sums two arguments together. If only one argument is provided, then return a function that expects one argument and returns the sum.',
        boilerplate: 'function addTogether(...args) {\n  // Your code here\n}',
        testCases: [
            { input: [2, 3], expected: 5 },
            { input: [2], expected: 'function' } // Special handling needed for this test case type
        ]
    },
    {
        id: 'exp-5',
        title: 'Make a Person',
        difficulty: 'Expert',
        description: 'Fill in the object constructor with the following methods below: getFirstName(), getLastName(), getFullName(), setFirstName(first), setLastName(last), setFullName(firstAndLast).',
        boilerplate: 'const Person = function(firstAndLast) {\n  // Complete the method below and implement the others similarly\n  this.getFullName = function() {\n    return "";\n  };\n  return firstAndLast;\n};',
        testCases: [] // Complex object testing needed
    },
    {
        id: 'exp-6',
        title: 'Map the Debris',
        difficulty: 'Expert',
        description: 'Return a new array that transforms the elements\' average altitude into their orbital periods (in seconds).',
        boilerplate: 'function orbitalPeriod(arr) {\n  const GM = 398600.4418;\n  const earthRadius = 6367.4447;\n  // Your code here\n}',
        testCases: [
            { input: [[{ name: 'sputnik', avgAlt: 35873.5553 }]], expected: [{ name: 'sputnik', orbitalPeriod: 86400 }] }
        ]
    },
    {
        id: 'exp-7',
        title: 'Palindrome Checker',
        difficulty: 'Expert',
        description: 'Return true if the given string is a palindrome. Otherwise, return false.',
        boilerplate: 'function palindrome(str) {\n  // Your code here\n}',
        testCases: [
            { input: ['eye'], expected: true },
            { input: ['_eye'], expected: true },
            { input: ['race car'], expected: true }
        ]
    },
    {
        id: 'exp-8',
        title: 'Roman Numeral Converter',
        difficulty: 'Expert',
        description: 'Convert the given number into a roman numeral.',
        boilerplate: 'function convertToRoman(num) {\n  // Your code here\n}',
        testCases: [
            { input: [2], expected: 'II' },
            { input: [3], expected: 'III' },
            { input: [4], expected: 'IV' }
        ]
    },
    {
        id: 'exp-9',
        title: 'Caesars Cipher',
        difficulty: 'Expert',
        description: 'Write a function which takes a ROT13 encoded string as input and returns a decoded string.',
        boilerplate: 'function rot13(str) {\n  // Your code here\n}',
        testCases: [
            { input: ['SERR PBQR PNZC'], expected: 'FREE CODE CAMP' },
            { input: ['SERR CVMMN!'], expected: 'FREE PIZZA!' }
        ]
    },
    {
        id: 'exp-10',
        title: 'Telephone Number Validator',
        difficulty: 'Expert',
        description: 'Return true if the passed string looks like a valid US phone number.',
        boilerplate: 'function telephoneCheck(str) {\n  // Your code here\n}',
        testCases: [
            { input: ['555-555-5555'], expected: true },
            { input: ['1 555-555-5555'], expected: true },
            { input: ['1 (555) 555-5555'], expected: true }
        ]
    }
];

export const getProblemById = (id) => problems.find(p => p.id === id);
