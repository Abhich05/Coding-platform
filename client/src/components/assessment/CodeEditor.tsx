import { useState, useEffect, useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Play, Send, RotateCcw } from 'lucide-react';
import { Problem } from '@/types/assessment';
import { CODE_TEMPLATES } from '@/utils/codeTemplates';

interface CodeEditorProps {
  problem: Problem;
  onRun: (code: string, language: string) => void;
  onSubmit: (code: string, language: string) => void;
  isRunning: boolean;
}

const SUPPORTED_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', monacoLang: 'javascript' },
  { value: 'typescript', label: 'TypeScript', monacoLang: 'typescript' },
  { value: 'python',     label: 'Python',     monacoLang: 'python' },
  { value: 'java',       label: 'Java',       monacoLang: 'java' },
  { value: 'cpp',        label: 'C++',        monacoLang: 'cpp' },
];

/** Returns starter code for the given language from the problem's starterCode field. */
function getStarterCode(problem: Problem, lang: string): string {
  // 1. Per-language object on the problem (preferred — seeded problems)
  if (problem.starterCode && typeof problem.starterCode !== 'string') {
    const map = problem.starterCode as Record<string, string>;
    if (map[lang]) return map[lang];
  }
  // 2. Plain string stored for this problem — use it regardless of language
  if (typeof problem.starterCode === 'string' && problem.starterCode.trim()) {
    return problem.starterCode;
  }
  // 3. Generic fallback template with proper stdin/stdout harness
  return CODE_TEMPLATES[lang] ?? `// Start coding in ${lang} here\n`;
}

export function CodeEditor({ problem, onRun, onSubmit, isRunning }: CodeEditorProps) {
  const [language, setLanguage] = useState('javascript');
  const editorRef = useRef<any>(null);
  // Stable refs so keyboard shortcuts always see latest values
  const languageRef = useRef(language);
  const onRunRef = useRef(onRun);
  const onSubmitRef = useRef(onSubmit);

  useEffect(() => { languageRef.current = language; }, [language]);
  useEffect(() => { onRunRef.current = onRun; }, [onRun]);
  useEffect(() => { onSubmitRef.current = onSubmit; }, [onSubmit]);

  // Persist user code per language per problem so switching doesn't wipe work.
  // Key: `${problem.id}:${lang}`
  const codeMapRef = useRef<Record<string, string>>({});
  const buildKey = (lang: string) => `${problem.id}:${lang}`;

  const getCode = (lang: string): string =>
    codeMapRef.current[buildKey(lang)] ?? getStarterCode(problem, lang);

  const [editorValue, setEditorValue] = useState(() => getCode('javascript'));

  // When the problem changes, clear saved codes and reset language + editor to starter.
  useEffect(() => {
    codeMapRef.current = {};
    setLanguage('javascript');
    setEditorValue(getStarterCode(problem, 'javascript'));
  }, [problem.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLanguageChange = (newLang: string) => {
    // Save current editor content before switching.
    codeMapRef.current[buildKey(language)] = editorValue;
    setLanguage(newLang);
    setEditorValue(getCode(newLang));
  };

  const handleEditorChange = (value: string | undefined) => {
    const v = value ?? '';
    setEditorValue(v);
    codeMapRef.current[buildKey(language)] = v;
  };

  const handleReset = () => {
    const starter = getStarterCode(problem, language);
    codeMapRef.current[buildKey(language)] = starter;
    setEditorValue(starter);
  };

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRunRef.current(editorRef.current?.getValue() ?? '', languageRef.current);
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onSubmitRef.current(editorRef.current?.getValue() ?? '', languageRef.current);
    });

    // Cursor & rendering polish
    editor.updateOptions({
      cursorStyle: 'line',
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      cursorWidth: 2,
      smoothScrolling: true,
      mouseWheelZoom: true,
      renderLineHighlight: 'all',
      matchBrackets: 'always',
      occurrencesHighlight: 'singleFile',
      selectionHighlight: true,
      colorDecorators: true,
      bracketPairColorization: { enabled: true },
      guides: { bracketPairs: true, indentation: true },
    });

    // Focus the editor automatically
    editor.focus();
  };

  const monacoLang =
    SUPPORTED_LANGUAGES.find(l => l.value === language)?.monacoLang ?? language;

  return (
    <div className="flex flex-col h-full bg-editor">
      <div className="flex items-center justify-between px-4 py-2 bg-editor-line/50 border-b border-editor-line">
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-44 h-8 bg-editor border-editor-line text-editor-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SUPPORTED_LANGUAGES.map(lang => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-editor-foreground hover:bg-editor-line/50"
            title="Reset to starter code"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
          <Button
            variant="editor"
            size="sm"
            onClick={() => onRun(editorRef.current?.getValue() ?? editorValue, language)}
            disabled={isRunning}
            title="Run visible test cases (Ctrl+Enter)"
          >
            <Play className="w-4 h-4 mr-1" />
            Run
          </Button>
          <Button
            variant="success"
            size="sm"
            onClick={() => onSubmit(editorRef.current?.getValue() ?? editorValue, language)}
            disabled={isRunning}
            title="Submit all test cases (Ctrl+S)"
          >
            <Send className="w-4 h-4 mr-1" />
            Submit
          </Button>
        </div>
      </div>

      <div className="flex-1">
        <Editor
          height="100%"
          language={monacoLang}
          value={editorValue}
          onChange={handleEditorChange}
          onMount={handleEditorMount}
          theme="vs-dark"
          options={{
            // Font
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Menlo, monospace",
            fontLigatures: true,
            // Layout
            minimap: { enabled: false },
            padding: { top: 16, bottom: 16 },
            lineNumbers: 'on',
            lineNumbersMinChars: 3,
            lineDecorationsWidth: 8,
            glyphMargin: false,
            folding: true,
            // Scroll
            scrollBeyondLastLine: false,
            automaticLayout: true,
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
              useShadows: false,
            },
            // Indentation
            tabSize: 4,
            insertSpaces: true,
            detectIndentation: true,
            // Wrap
            wordWrap: 'on',
            // Suggestions
            suggestOnTriggerCharacters: true,
            quickSuggestions: { other: true, comments: false, strings: true },
            acceptSuggestionOnEnter: 'on',
            tabCompletion: 'on',
            parameterHints: { enabled: true },
            wordBasedSuggestions: 'matchingDocuments',
            // Format
            formatOnPaste: true,
            formatOnType: false,
            // Selection
            roundedSelection: true,
            // Inline context hints
            inlineSuggest: { enabled: true },
          }}
        />
      </div>

      {/* Keyboard shortcut hint bar */}
      <div className="flex items-center gap-3 px-3 py-1 bg-editor-line/30 border-t border-editor-line text-xs text-muted-foreground select-none">
        <span><kbd className="font-mono bg-editor-line/60 px-1 py-0.5 rounded text-[10px]">Ctrl+Enter</kbd> Run</span>
        <span><kbd className="font-mono bg-editor-line/60 px-1 py-0.5 rounded text-[10px]">Ctrl+S</kbd> Submit</span>
        <span className="ml-auto opacity-50">{monacoLang}</span>
      </div>
    </div>
  );
}
