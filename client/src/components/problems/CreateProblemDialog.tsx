import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Sparkles, Wand2, FileCode } from 'lucide-react';
import { Problem } from '@/types/assessment';
import { toast } from 'sonner';
import aiService from '@/services/aiService';
import { getTemplateForProblem } from '@/utils/codeTemplates';

// ── Boilerplate starters shown when clicking "Load Template" ─────────────────
const STARTER_BOILERPLATE: Record<string, string> = {
  python: `import sys, json

def solution(data):
    """
    Parse 'data' (raw stdin string) and return the answer.
    e.g.  lines = data.split('\\n')
          nums  = json.loads(lines[0])
    """
    # ── Write your solution here ──────────────────────────────────────────────
    pass

# Do not modify below this line
if __name__ == "__main__":
    data = sys.stdin.read().strip()
    result = solution(data)
    if result is not None:
        print(result)`,

  javascript: `function solution(data) {
    // Parse 'data' (raw stdin string) and return the answer.
    // e.g.  const lines = data.split('\\n');
    //       const nums  = JSON.parse(lines[0]);
    // ── Write your solution here ────────────────────────────────────────────
}

// Do not modify below this line
process.stdin.resume();
process.stdin.setEncoding('utf8');
let _input = '';
process.stdin.on('data', d => _input += d);
process.stdin.on('end', () => {
    const result = solution(_input.trim());
    if (result !== undefined && result !== null) console.log(result);
});`,

  typescript: `function solution(data: string): string | number | null {
    // Parse 'data' (raw stdin string) and return the answer.
    // e.g.  const lines = data.split('\\n');
    // ── Write your solution here ────────────────────────────────────────────
    return null;
}

// Do not modify below this line
process.stdin.resume();
process.stdin.setEncoding('utf8');
let _input = '';
process.stdin.on('data', (d: string) => _input += d);
process.stdin.on('end', () => {
    const result = solution(_input.trim());
    if (result !== undefined && result !== null) console.log(result);
});`,

  java: `import java.util.*;
import java.io.*;

class Solution {
    public static String solve(String data) {
        // Parse data however your problem needs:
        // String[] lines = data.split("\\\\n");
        // ── Write your solution here ────────────────────────────────────────
        return "";
    }
}

// Do not modify below this line
public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = br.readLine()) != null) sb.append(line).append('\n');
        System.out.println(Solution.solve(sb.toString().trim()));
    }
}`,

  cpp: `#include <iostream>
#include <string>
#include <sstream>
using namespace std;

string solution(const string& data) {
    // Parse data however your problem needs:
    // istringstream iss(data); int n; iss >> n;
    // ── Write your solution here ────────────────────────────────────────────
    return "";
}

// Do not modify below this line
int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    istreambuf_iterator<char> begin(cin), end;
    string data(begin, end);
    if (!data.empty() && data.back() == '\n') data.pop_back();
    cout << solution(data) << endl;
    return 0;
}`,
};

interface CreateProblemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProblem: (problem: Partial<Problem>) => void;
}

export function CreateProblemDialog({ open, onOpenChange, onCreateProblem }: CreateProblemDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [language, setLanguage] = useState<'javascript' | 'python' | 'java'>('javascript');
  const [starterCode, setStarterCode] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [testCases, setTestCases] = useState<Array<{ input: string; expectedOutput: string }>>([
    { input: '', expectedOutput: '' }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiTopic, setAiTopic] = useState('');

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: '', expectedOutput: '' }]);
  };

  const handleRemoveTestCase = (index: number) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  const handleTestCaseChange = (index: number, field: 'input' | 'expectedOutput', value: string) => {
    const updated = [...testCases];
    updated[index][field] = value;
    setTestCases(updated);
  };

  const handleGenerateProblem = async () => {
    if (!aiTopic.trim()) {
      toast.error('Please enter a topic for AI generation');
      return;
    }

    setIsGenerating(true);
    try {
      const generatedProblem = await aiService.generateProblem({
        topic: aiTopic,
        difficulty,
        language,
      });

      setTitle(generatedProblem.title);
      setDescription(generatedProblem.description);
      setStarterCode(generatedProblem.starterCode);
      setTags(generatedProblem.tags);
      setTestCases(generatedProblem.testCases.map(tc => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
      })));

      toast.success('Problem generated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate problem');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateTestCases = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error('Please enter title and description first');
      return;
    }

    setIsGenerating(true);
    try {
      const generatedTestCases = await aiService.generateTestCases({
        title,
        description,
        language,
        starterCode,
      });

      setTestCases(generatedTestCases.map(tc => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
      })));

      toast.success('Test cases generated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate test cases');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEnhanceDescription = async () => {
    if (!description.trim()) {
      toast.error('Please enter a description first');
      return;
    }

    setIsGenerating(true);
    try {
      const enhanced = await aiService.enhanceDescription(description);
      setDescription(enhanced);
      toast.success('Description enhanced successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to enhance description');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreate = () => {
    if (!title.trim()) {
      toast.error('Please enter a problem title');
      return;
    }

    if (!description.trim()) {
      toast.error('Please enter a problem description');
      return;
    }

    if (!starterCode.trim()) {
      toast.error('Please enter starter code');
      return;
    }

    const validTestCases = testCases.filter(tc => tc.input.trim() && tc.expectedOutput.trim());
    if (validTestCases.length === 0) {
      toast.error('Please add at least one test case');
      return;
    }

    const problem: Partial<Problem> = {
      title: title.trim(),
      description: description.trim(),
      difficulty,
      language,
      starterCode: starterCode.trim(),
      tags,
      testCases: validTestCases.map((tc, index) => ({
        id: `test-${index}`,
        input: tc.input.trim(),
        expectedOutput: tc.expectedOutput.trim(),
        isHidden: false,
      })),
    };

    onCreateProblem(problem);
    
    // Reset form
    setTitle('');
    setDescription('');
    setDifficulty('easy');
    setLanguage('javascript');
    setStarterCode('');
    setTags([]);
    setTestCases([{ input: '', expectedOutput: '' }]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Problem</DialogTitle>
          <DialogDescription>
            Add a new coding problem to your problem bank.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* AI Problem Generation */}
          <div className="p-4 border border-purple-200 bg-purple-50 rounded-lg space-y-3">
            <div className="flex items-center gap-2 text-purple-700 font-semibold">
              <Sparkles className="h-5 w-5" />
              <span>AI Problem Generator</span>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Enter topic (e.g., arrays, graphs, strings)"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleGenerateProblem} 
                disabled={isGenerating}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isGenerating ? 'Generating...' : 'Generate'}
              </Button>
            </div>
            <p className="text-xs text-purple-600">
              AI will generate a complete problem based on your topic, difficulty, and language settings below.
            </p>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Problem Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Two Sum"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Description *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleEnhanceDescription}
                disabled={isGenerating || !description}
                className="h-7 text-xs"
              >
                <Wand2 className="h-3 w-3 mr-1" />
                Enhance with AI
              </Button>
            </div>
            <Textarea
              id="description"
              placeholder="Describe the problem in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          {/* Difficulty and Language */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Difficulty *</Label>
              <Select value={difficulty} onValueChange={(v: any) => setDifficulty(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Language *</Label>
              <Select value={language} onValueChange={(v: any) => setLanguage(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Starter Code */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="starterCode">Starter Code *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={() => {
                  setStarterCode(STARTER_BOILERPLATE[language] ?? STARTER_BOILERPLATE['javascript']);
                  toast.info('Template loaded', { description: 'Fill in the solution body. Test case inputs will be piped as stdin.' });
                }}
              >
                <FileCode className="h-3 w-3" />
                Load I/O Template
              </Button>
            </div>
            <Textarea
              id="starterCode"
              placeholder={`Click "Load I/O Template" to get a working stdin/stdout scaffold for ${language}.`}
              value={starterCode}
              onChange={(e) => setStarterCode(e.target.value)}
              rows={10}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              ⚠️ Starter code must read from <code>stdin</code> and print to <code>stdout</code> — test case inputs are piped directly to the program.
            </p>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add tag (e.g., arrays, hash-map)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <Button type="button" variant="outline" onClick={handleAddTag}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Test Cases */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Test Cases *</Label>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleGenerateTestCases}
                  disabled={isGenerating}
                  className="gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate with AI
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={handleAddTestCase} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Test Case
                </Button>
              </div>
            </div>
            <div className="space-y-3">
              {testCases.map((tc, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Test Case {index + 1}</span>
                    {testCases.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveTestCase(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Input</Label>
                      <Textarea
                        placeholder="e.g., [2,7,11,15], 9"
                        value={tc.input}
                        onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                        rows={2}
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Expected Output</Label>
                      <Textarea
                        placeholder="e.g., [0,1]"
                        value={tc.expectedOutput}
                        onChange={(e) => handleTestCaseChange(index, 'expectedOutput', e.target.value)}
                        rows={2}
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="gradient" onClick={handleCreate}>
            Create Problem
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
