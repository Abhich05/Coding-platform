import { Problem } from '@/types/assessment';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface ProblemPanelProps {
  problem: Problem;
}

const difficultyColors = {
  easy: 'bg-success/10 text-success border-success/30',
  medium: 'bg-warning/10 text-warning border-warning/30',
  hard: 'bg-destructive/10 text-destructive border-destructive/30',
  Easy: 'bg-success/10 text-success border-success/30',
  Medium: 'bg-warning/10 text-warning border-warning/30',
  Hard: 'bg-destructive/10 text-destructive border-destructive/30',
};

export function ProblemPanel({ problem }: ProblemPanelProps) {
  const difficulty = problem.difficulty as keyof typeof difficultyColors;
  
  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-xl font-semibold text-foreground">{problem.title}</h2>
          <Badge 
            variant="outline" 
            className={cn("text-xs font-medium", difficultyColors[difficulty] || difficultyColors.easy)}
          >
            {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="description" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent px-4">
          <TabsTrigger 
            value="description" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Description
          </TabsTrigger>
          <TabsTrigger 
            value="examples"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Examples
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="description" className="p-4 m-0">
            <div className="prose prose-sm max-w-none text-foreground">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {problem.description.split('\n').map((line, i) => (
                  <p key={i} className="mb-2">
                    {line.split('`').map((part, j) => 
                      j % 2 === 1 ? (
                        <code key={j} className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">
                          {part}
                        </code>
                      ) : (
                        <span key={j}>{part}</span>
                      )
                    )}
                  </p>
                ))}
              </div>

              {problem.constraints && Array.isArray(problem.constraints) && problem.constraints.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold mb-3 text-foreground">Constraints</h4>
                  <ul className="space-y-1">
                    {problem.constraints.map((constraint, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <code className="font-mono text-xs">{constraint}</code>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="examples" className="p-4 m-0">
            <div className="space-y-4">
              {problem.examples && problem.examples.length > 0 ? (
                problem.examples.map((example, i) => (
                  <div key={example.id || i} className="rounded-lg border border-border bg-muted/30 overflow-hidden">
                    <div className="px-3 py-2 bg-muted/50 border-b border-border">
                      <span className="text-sm font-medium text-foreground">Example {i + 1}</span>
                    </div>
                    <div className="p-3 space-y-2">
                      <div>
                        <span className="text-xs font-medium text-muted-foreground">Input:</span>
                        <pre className="mt-1 p-2 rounded bg-editor text-editor-foreground font-mono text-xs overflow-x-auto">
                          {example.input}
                        </pre>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-muted-foreground">Output:</span>
                        <pre className="mt-1 p-2 rounded bg-editor text-editor-foreground font-mono text-xs overflow-x-auto">
                          {example.output}
                        </pre>
                      </div>
                      {example.explanation && (
                        <div>
                          <span className="text-xs font-medium text-muted-foreground">Explanation:</span>
                          <p className="mt-1 text-xs text-muted-foreground">{example.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No examples available for this problem.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
