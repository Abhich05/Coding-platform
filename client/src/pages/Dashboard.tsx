import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/dashboard/StatCard';
import { AssessmentCard } from '@/components/dashboard/AssessmentCard';
import { CandidateTable } from '@/components/dashboard/CandidateTable';
import { CreateAssessmentDialog } from '@/components/dashboard/CreateAssessmentDialog';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { Input } from '@/components/ui/input';
import { Users, FileCode, CheckCircle, TrendingUp, Plus, Search, Bell, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { Assessment, Candidate } from '@/types/assessment';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { assessmentService } from '@/services/assessmentService';
import { useAuth } from '@/contexts/AuthContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadAssessments();
    } else {
      setLoading(false);
      setIsAuthDialogOpen(true);
    }
  }, [isAuthenticated]);

  const loadAssessments = async () => {
    try {
      setLoading(true);
      const response = await assessmentService.getAll();
      if (response.success) {
        setAssessments(response.data);
      }
    } catch (error: any) {
      toast.error('Failed to load assessments', {
        description: error.response?.data?.message || 'Please try again later',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      setAssessments([]);
      setIsAuthDialogOpen(true);
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const handleStartAssessment = (assessment: Assessment) => {
    navigate(`/assessment?id=${assessment.id}`, { state: { assessment } });
  };

  const handleCreateAssessment = async (newAssessment: Assessment) => {
    try {
      const response = await assessmentService.create(newAssessment);
      if (response.success) {
        setAssessments([response.data, ...assessments]);
        toast.success('Assessment created!', {
          description: `"${newAssessment.title}" has been created successfully.`,
        });
      }
    } catch (error: any) {
      toast.error('Failed to create assessment', {
        description: error.response?.data?.message || 'Please try again',
      });
    }
  };

  const allCandidates = assessments.flatMap(a => a.candidates || []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <span className="text-primary-foreground font-bold">TA</span>
              </div>
              <span className="font-bold text-xl text-foreground">TechAssess</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/problems')}>
              Problems
            </Button>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search assessments..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
              <LogOut className="h-5 w-5" />
            </Button>
            <Avatar className="h-9 w-9 cursor-pointer">
              <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                {user?.name.substring(0, 2).toUpperCase() || 'HR'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground">Welcome back! 👋</h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your hiring pipeline today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Active Assessments"
            value={assessments.filter(a => a.status === 'active').length}
            change="+2 this week"
            changeType="positive"
            icon={FileCode}
          />
          <StatCard
            title="Total Candidates"
            value={allCandidates.length}
            change="+12% from last month"
            changeType="positive"
            icon={Users}
          />
          <StatCard
            title="Completed Tests"
            value={allCandidates.filter(c => c.status === 'completed' || c.status === 'evaluated').length}
            icon={CheckCircle}
          />
          <StatCard
            title="Avg. Score"
            value="78%"
            change="+5% improvement"
            changeType="positive"
            icon={TrendingUp}
          />
        </div>

        {/* Assessments Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Assessments</h2>
              <p className="text-sm text-muted-foreground">Manage your coding assessments</p>
            </div>
            <Button variant="gradient" className="gap-2" onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4" />
              Create Assessment
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessments.map((assessment, index) => (
              <motion.div
                key={assessment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <AssessmentCard
                  assessment={assessment}
                  onStart={() => handleStartAssessment(assessment)}
                  onViewDetails={() => {}}
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Recent Candidates */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Recent Candidates</h2>
              <p className="text-sm text-muted-foreground">Track candidate progress and results</p>
            </div>
            <Button variant="outline" className="gap-2">
              View All
              <Users className="w-4 h-4" />
            </Button>
          </div>

          <CandidateTable candidates={allCandidates} />
        </section>
      </main>

      <CreateAssessmentDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateAssessment={handleCreateAssessment}
      />

      <AuthDialog
        open={isAuthDialogOpen}
        onOpenChange={(open) => {
          if (!open && !isAuthenticated) {
            // Prevent closing if not authenticated
            return;
          }
          setIsAuthDialogOpen(open);
        }}
      />
    </div>
  );
}
