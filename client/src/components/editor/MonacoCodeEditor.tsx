import { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Type, Sun, Moon, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import debounce from 'lodash.debounce';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MonacoCodeEditorProps {
  problemId: string;
  language: string;
  initialCode: string;
  onCodeChange: (code: string) => void;
  onLanguageChange?: (language: string) => void;
}

const LANGUAGE_MAP: Record<string, string> = {
  'javascript': 'javascript',
  'python': 'python',
  'java': 'java',
  'cpp': 'cpp',
  'typescript': 'typescript',
};

export function MonacoCodeEditor({
  problemId,
  language,
  initialCode,
  onCodeChange,
  onLanguageChange
}: MonacoCodeEditorProps) {
  const editorRef = useRef<any>(null);
  const [code, setCode] = useState(initialCode);
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState<'vs-dark' | 'light'>('vs-dark');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Auto-save to localStorage
  const saveToLocalStorage = debounce((codeToSave: string) => {
    localStorage.setItem(`code_${problemId}_${language}`, codeToSave);
    localStorage.setItem(`code_${problemId}_timestamp`, Date.now().toString());
    setLastSaved(new Date());
  }, 2000);

  // Restore code on mount
  useEffect(() => {
    const saved = localStorage.getItem(`code_${problemId}_${language}`);
    if (saved && saved !== initialCode) {
      setCode(saved);
      onCodeChange(saved);
    }
  }, [problemId, language]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Custom keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      const submitBtn = document.getElementById('submit-btn');
      if (submitBtn) submitBtn.click();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      const runBtn = document.getElementById('run-btn');
      if (runBtn) runBtn.click();
    });

    // Configure editor settings
    editor.updateOptions({
      fontSize: fontSize,
      fontFamily: '"Fira Code", "Cascadia Code", "Consolas", monospace',
      fontLigatures: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      smoothScrolling: true,
    });
  };

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    onCodeChange(newCode);
    saveToLocalStorage(newCode);
  };

  const getTimeSince = (date: Date | null) => {
    if (!date) return 'Never';
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 5) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    return 'over an hour ago';
  };

  return (
    <div className="relative h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700">
        <div className="flex items-center gap-3">
          {onLanguageChange && (
            <Select value={language} onValueChange={onLanguageChange}>
              <SelectTrigger className="w-32 h-8 bg-gray-800 border-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
              </SelectContent>
            </Select>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === 'vs-dark' ? 'light' : 'vs-dark')}
            className="h-8 text-gray-300 hover:text-white"
          >
            {theme === 'vs-dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs text-gray-400 flex items-center gap-2">
            <Save className="w-3 h-3" />
            <span>Saved {getTimeSince(lastSaved)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFontSize(Math.max(10, fontSize - 2))}
              className="h-8 w-8 p-0 text-gray-300"
            >
              <Type className="w-3 h-3" />-
            </Button>
            <span className="text-sm text-gray-300 w-10 text-center">{fontSize}px</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFontSize(Math.min(24, fontSize + 2))}
              className="h-8 w-8 p-0 text-gray-300"
            >
              <Type className="w-4 h-4" />+
            </Button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={LANGUAGE_MAP[language] || 'python'}
          theme={theme}
          value={code}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: fontSize,
            lineNumbers: 'on',
            roundedSelection: true,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            insertSpaces: true,
            formatOnPaste: true,
            formatOnType: true,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            quickSuggestions: true,
            wordWrap: 'off',
            bracketPairColorization: { enabled: true },
            guides: {
              bracketPairs: true,
              indentation: true,
            },
            padding: { top: 16, bottom: 16 },
            scrollbar: {
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
          }}
        />
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="absolute bottom-2 left-2 text-xs text-gray-500 bg-gray-900 px-2 py-1 rounded">
        <span className="font-mono">Ctrl+Enter</span> to Run • <span className="font-mono">Ctrl+S</span> to Submit
      </div>
    </div>
  );
}
