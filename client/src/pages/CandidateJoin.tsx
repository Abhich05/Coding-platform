import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { assessmentService } from '@/services/assessmentService';
import { Loader2, Code2, Clock, FileCode } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CandidateJoin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const assessmentId = searchParams.get('id');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [assessmentInfo, setAssessmentInfo] = useState<{
    title: string;
    duration: number;
    problems: number;
  } | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(true);

  useEffect(() => {
    if (!assessmentId) {
      toast.error('Invalid invite link', { description: 'No assessment ID found in the URL.' });
      navigate('/');
      return;
    }

    const fetchInfo = async () => {
      try {
        const res = await assessmentService.getPublicInfo(assessmentId);
        if (res.success) {
          if (res.data.status === 'closed') {
            toast.error('Assessment closed', { description: 'This assessment is no longer accepting submissions.' });
            navigate('/');
            return;
          }
          setAssessmentInfo({
            title: res.data.title,
            duration: res.data.duration,
            problems: res.data.problems ?? 0,
          });
        } else {
          throw new Error('Assessment not found');
        }
      } catch {
        toast.error('Assessment not found', {
          description: 'This invite link may be expired or invalid.',
        });
        navigate('/');
      } finally {
        setLoadingInfo(false);
      }
    };

    fetchInfo();
  }, [assessmentId, navigate]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      toast.error('Please enter your full name');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setSubmitting(true);
    navigate(`/assessment?id=${assessmentId}`, {
      state: {
        candidateEmail: trimmedEmail,
        candidateName: trimmedName,
      },
    });
  };

  if (loadingInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Logo / Brand */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-2 mb-8"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
          <Code2 className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="font-bold text-2xl text-foreground">TechAssess</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="w-full max-w-md"
      >
        <Card className="border border-border p-8 shadow-xl bg-card">
          {/* Assessment header */}
          {assessmentInfo && (
            <div className="mb-6 pb-6 border-b border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                You're invited to
              </p>
              <h1 className="text-xl font-bold text-foreground">{assessmentInfo.title}</h1>
              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-primary" />
                  {assessmentInfo.problems} problem{assessmentInfo.problems !== 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-primary" />
                  {assessmentInfo.duration} min
                </span>
              </div>
            </div>
          )}

          <h2 className="text-lg font-semibold text-foreground mb-1">Enter your details</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Your name and email are used to track your submission.
          </p>

          <form onSubmit={handleStart} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Jane Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                autoComplete="name"
                disabled={submitting}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={submitting}
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              size="lg"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Starting…
                </>
              ) : (
                'Start Assessment'
              )}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-4">
            By starting, you agree that your code submissions will be recorded and evaluated.
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
