import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Sparkles } from 'lucide-react';
import { Assessment, Problem } from '@/types/assessment';
import { problemService } from '@/services/problemService';
import { toast } from 'sonner';

interface CreateAssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateAssessment: (assessment: Assessment) => void;
}

export function CreateAssessmentDialog({ open, onOpenChange, onCreateAssessment }: CreateAssessmentDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('60');
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [availableProblems, setAvailableProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadProblems();
    }
  }, [open]);

  const loadProblems = async () => {
    try {
      setLoading(true);
      const response = await problemService.getAll({ limit: 50 });
      if (response.success) {
        setAvailableProblems(response.data);
      }
    } catch (error: any) {
      toast.error('Failed to load problems', {
        description: error.response?.data?.message || 'Please try again',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProblem = (problemId: string) => {
    if (!selectedProblems.includes(problemId)) {
      setSelectedProblems([...selectedProblems, problemId]);
    }
  };

  const handleRemoveProblem = (problemId: string) => {
    setSelectedProblems(selectedProblems.filter(id => id !== problemId));
  };

  const handleCreate = () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (selectedProblems.length === 0) {
      toast.error('Please select at least one problem');
      return;
    }

    const newAssessment: Partial<Assessment> = {
      title: title.trim(),
      description: description.trim() || 'No description provided.',
      problems: selectedProblems as any, // API expects problem IDs
      duration: parseInt(duration) || 60,
      status: 'draft',
    };

    onCreateAssessment(newAssessment as Assessment);
    
    // Reset form
    setTitle('');
    setDescription('');
    setDuration('60');
    setSelectedProblems([]);
    onOpenChange(false);
  };

  const filteredProblems = availableProblems.filter(p => !selectedProblems.includes(p.id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Assessment</DialogTitle>
          <DialogDescription>
            Build a coding assessment by adding problems and setting a time limit.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Assessment Title</Label>
            <Input
              id="title"
              placeholder="e.g., Senior Frontend Developer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what this assessment covers..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
                <SelectItem value="90">90 minutes</SelectItem>
                <SelectItem value="120">120 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Selected Problems */}
          <div className="space-y-2">
            <Label>Selected Problems ({selectedProblems.length})</Label>
            {selectedProblems.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedProblems.map((id) => {
                  const problem = availableProblems.find(p => p.id === id);
                  if (!problem) return null;
                  return (
                    <Badge
                      key={id}
                      variant="secondary"
                      className="gap-1 pr-1"
                    >
                      {problem.title}
                      <button
                        onClick={() => handleRemoveProblem(id)}
                        className="ml-1 hover:bg-muted rounded p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No problems selected. Add problems below.</p>
            )}
          </div>

          {/* Add Problems */}
          <div className="space-y-2">
            <Label>Add Problems</Label>
            <div className="border rounded-lg divide-y max-h-60 overflow-y-auto">
              {loading ? (
                <p className="text-sm text-muted-foreground p-3 text-center">Loading problems...</p>
              ) : filteredProblems.length > 0 ? (
                filteredProblems.map((problem) => (
                  <div
                    key={problem.id}
                    className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          problem.difficulty === 'easy' ? 'default' :
                          problem.difficulty === 'medium' ? 'secondary' : 'destructive'
                        }
                        className="text-xs capitalize"
                      >
                        {problem.difficulty}
                      </Badge>
                      <span className="font-medium">{problem.title}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddProblem(problem.id)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center space-y-3">
                  <p className="text-sm text-muted-foreground">
                    No problems available. You need to create problems first!
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      onOpenChange(false);
                      window.location.href = '/problems';
                    }}
                  >
                    Go to Problems Page
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="gradient"
            onClick={handleCreate}
            disabled={selectedProblems.length === 0}
          >
            Create Assessment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
