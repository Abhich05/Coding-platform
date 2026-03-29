import { twoSumTemplates, reverseStringTemplates } from './languageTemplates.js';

export const sampleProblems = [
  {
    title: "Two Sum",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.`,
    difficulty: "easy",
    // starterCode is an object — keys match the language selector values in the editor
    starterCode: {
      javascript: twoSumTemplates.javascript,
      typescript: twoSumTemplates.javascript.replace('function twoSum', '// TypeScript\nfunction twoSum'),
      python:     twoSumTemplates.python,
      java:       twoSumTemplates.java,
      cpp:        twoSumTemplates.cpp,
    },
    tags: ["array", "hash-table", "two-pointers"],
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]"
      }
    ],
    constraintsList: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    testCases: [
      { input: "[2,7,11,15]\n9",  expectedOutput: "[0,1]", isHidden: false },
      { input: "[3,2,4]\n6",      expectedOutput: "[1,2]", isHidden: false },
      { input: "[3,3]\n6",        expectedOutput: "[0,1]", isHidden: true  }
    ]
  },

  {
    title: "Reverse String",
    description: `Write a function that reverses a string. The input string is given as an array of characters s.

You must do this by modifying the input array in-place with O(1) extra memory.`,
    difficulty: "easy",
    starterCode: {
      javascript: reverseStringTemplates.javascript,
      typescript: reverseStringTemplates.javascript.replace('function reverseString', '// TypeScript\nfunction reverseString'),
      python:     reverseStringTemplates.python,
      java:       reverseStringTemplates.java,
      cpp:        reverseStringTemplates.cpp,
    },
    tags: ["string", "two-pointers", "array"],
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]'
      },
      {
        input: 's = ["H","a","n","n","a","h"]',
        output: '["h","a","n","n","a","H"]'
      }
    ],
    constraintsList: [
      "1 <= s.length <= 10^5",
      "s[i] is a printable ascii character"
    ],
    testCases: [
      { input: '["h","e","l","l","o"]',   expectedOutput: '["o","l","l","e","h"]',   isHidden: false },
      { input: '["H","a","n","n","a","h"]', expectedOutput: '["h","a","n","n","a","H"]', isHidden: false },
      { input: '["A"]',                    expectedOutput: '["A"]',                   isHidden: true  }
    ]
  }
];
