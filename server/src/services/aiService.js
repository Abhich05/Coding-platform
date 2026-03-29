import { GoogleGenerativeAI } from '@google/generative-ai';

class AIService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      console.error('⚠️ GEMINI_API_KEY is not set or is using default value!');
      console.error('Please update .env file with your actual API key from https://aistudio.google.com/app/apikey');
    } else {
      console.log('✅ Gemini API Key loaded:', apiKey.substring(0, 10) + '...');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async generateProblem(topic, difficulty, language) {
    const ioExamples = {
      javascript: `process.stdin.resume();\nprocess.stdin.setEncoding('utf8');\nlet _input = '';\nprocess.stdin.on('data', d => _input += d);\nprocess.stdin.on('end', () => {\n    const lines = _input.trim().split('\\n');\n    // parse lines, call your function, console.log the result\n});`,
      python: `import sys, json\nif __name__ == "__main__":\n    data = sys.stdin.read().strip()\n    lines = data.split('\\n')\n    # parse lines, call your function, print(result)`,
      java: `public class Main {\n    public static void main(String[] args) throws Exception {\n        java.util.Scanner sc = new java.util.Scanner(System.in);\n        // read sc.nextLine(), call Solution method, System.out.println(result)\n    }\n}`,
      cpp: `int main() {\n    std::string line;\n    // use std::getline / std::cin, call solve(), std::cout << result\n    return 0;\n}`,
    };
    const ioHint = ioExamples[language] || ioExamples.javascript;

    const prompt = `Generate a coding problem with the following specifications:
Topic: ${topic}
Difficulty: ${difficulty}
Primary Language: ${language}

CRITICAL REQUIREMENT — The "starterCode" field MUST be a COMPLETE, RUNNABLE program that:
1. Reads input from stdin (keyboard/pipe)
2. Calls the solution function
3. Prints the result to stdout
Do NOT return just a function definition — always include a full stdin/stdout harness.

Example harness style for ${language}:
${ioHint}

Please provide the response in the following JSON format:
{
  "title": "Problem title",
  "description": "Detailed problem description with examples and constraints",
  "difficulty": "${difficulty}",
  "language": "${language}",
  "starterCode": "COMPLETE runnable starter code WITH stdin reading AND stdout printing harness",
  "tags": ["tag1", "tag2", "tag3"],
  "testCases": [
    {
      "input": "exact stdin that will be piped to the program",
      "expectedOutput": "exact stdout the program should print",
      "isHidden": false
    }
  ]
}

Make sure to include:
- Clear problem statement
- At least 3 example test cases matching the harness I/O exactly
- 2 hidden edge-case test cases (isHidden: true)
- Relevant tags
- Realistic constraints
- Test case inputs/outputs must match the harness exactly (no extra spaces/brackets unless the harness produces them)`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to extract JSON from AI response');
      }
      
      const problemData = JSON.parse(jsonMatch[0]);
      return problemData;
    } catch (error) {
      console.error('Error generating problem:', error);
      throw new Error('Failed to generate problem with AI');
    }
  }

  async generateTestCases(title, description, language, starterCode) {
    const prompt = `Based on the following coding problem, generate comprehensive test cases:
Title: ${title}
Description: ${description}
Language: ${language}
Starter Code: ${starterCode}

Please provide the response in the following JSON format:
{
  "testCases": [
    {
      "input": "test input",
      "expectedOutput": "expected output",
      "isHidden": false
    }
  ]
}

Generate at least 5-7 test cases including:
- Basic functionality tests
- Edge cases (empty input, large numbers, etc.)
- Corner cases
- Performance tests
Mark some test cases as hidden (isHidden: true) for evaluation purposes.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to extract JSON from AI response');
      }
      
      const testCaseData = JSON.parse(jsonMatch[0]);
      return testCaseData.testCases;
    } catch (error) {
      console.error('Error generating test cases:', error);
      throw new Error('Failed to generate test cases with AI');
    }
  }

  async enhanceProblemDescription(description) {
    const prompt = `Enhance the following coding problem description to make it more clear and professional:

${description}

Please improve it by:
- Adding clear examples with input/output
- Specifying constraints
- Making the problem statement more precise
- Adding edge case considerations
- Formatting it properly

Provide only the enhanced description without any additional text or explanations.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error enhancing description:', error);
      throw new Error('Failed to enhance description with AI');
    }
  }
}

export default new AIService();
