import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, Edit, Trash2, Code2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Problem } from '@/types/assessment';
import { problemService } from '@/services/problemService';
import { toast } from 'sonner';
import { CreateProblemDialog } from '@/components/problems/CreateProblemDialog';

export default function Problems() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    try {
      setLoading(true);
      const response = await problemService.getAll({ limit: 100 });
      if (response.success) {
        setProblems(response.data);
      }
    } catch (error: any) {
      toast.error('Failed to load problems', {
        description: error.response?.data?.message || 'Please try again',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProblem = async (problem: Partial<Problem>) => {
    try {
      const response = await problemService.create(problem);
      if (response.success) {
        setProblems([response.data, ...problems]);
        toast.success('Problem created successfully!');
      }
    } catch (error: any) {
      toast.error('Failed to create problem', {
        description: error.response?.data?.message || 'Please try again',
      });
    }
  };

  const handleDeleteProblem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this problem?')) return;

    try {
      await problemService.delete(id);
      setProblems(problems.filter(p => p.id !== id));
      toast.success('Problem deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete problem', {
        description: error.response?.data?.message,
      });
    }
  };

  const filteredProblems = problems.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Code2 className="h-6 w-6 text-primary" />
              <span className="font-semibold text-xl">Problems</span>
            </div>
          </div>
          <Button variant="gradient" onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Create Problem
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search problems by title or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Problems Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading problems...</p>
          </div>
        ) : filteredProblems.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Code2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No problems found</h3>
              <p className="text-muted-foreground mb-4 text-center max-w-md">
                {searchQuery
                  ? 'No problems match your search. Try a different query.'
                  : 'Get started by creating your first coding problem.'}
              </p>
              {!searchQuery && (
                <Button variant="gradient" onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Your First Problem
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProblems.map((problem, index) => (
              <motion.div
                key={problem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{problem.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {problem.description}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          problem.difficulty === 'easy' ? 'default' :
                          problem.difficulty === 'medium' ? 'secondary' : 'destructive'
                        }
                        className="capitalize ml-2"
                      >
                        {problem.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {problem.language}
                        </Badge>
                        {problem.tags?.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-2"
                          onClick={() => {/* TODO: Edit */}}
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteProblem(problem.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <CreateProblemDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateProblem={handleCreateProblem}
      />
    </div>
  );
}
