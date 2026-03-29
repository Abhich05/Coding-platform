import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { AssessmentInterface } from '@/components/assessment/AssessmentInterface';
import { Assessment as AssessmentType } from '@/types/assessment';
import { toast } from 'sonner';
import { submissionService } from '@/services/submissionService';
import { assessmentService } from '@/services/assessmentService';
import { Loader2 } from 'lucide-react';

export default function Assessment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [assessment, setAssessment] = useState<AssessmentType | null>(null);
  const [loading, setLoading] = useState(true);
  
  const assessmentFromState = location.state?.assessment as AssessmentType | undefined;
  const candidateEmail = location.state?.candidateEmail as string | undefined;
  const assessmentId = searchParams.get('id') || assessmentFromState?.id;
  const isCandidateMode = !!candidateEmail;
  
  useEffect(() => {
    const loadAssessment = async () => {
      if (!assessmentId) {
        toast.error('No assessment selected');
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        // Candidates use the public endpoint (no auth token); admins use the protected one
        const response = isCandidateMode
          ? await assessmentService.getForCandidate(assessmentId)
          : await assessmentService.getById(assessmentId);
        if (response.success) {
          setAssessment(response.data);
          // Auto-register candidate if this is a candidate session
          if (isCandidateMode && candidateEmail) {
            const candidateName = location.state?.candidateName as string | undefined;
            assessmentService.startAsCandidate(assessmentId, candidateName || candidateEmail, candidateEmail)
              .catch(() => { /* non-fatal — submission controller will block if truly invalid */ });
          }
        } else {
          throw new Error('Failed to load assessment');
        }
      } catch (error: any) {
        toast.error('Failed to load assessment', {
          description: error.response?.data?.message || 'Please try again',
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadAssessment();
  }, [assessmentId, navigate]);

  const handleComplete = async () => {
    if (!assessment || !candidateEmail) {
      toast.success('Assessment submitted successfully!', {
        description: 'Your results have been recorded.',
      });
      navigate('/');
      return;
    }

    try {
      await submissionService.completeAssessment({
        assessmentId: assessment.id,
        candidateEmail,
        timeSpent: assessment.duration,
      });
      toast.success('Assessment submitted successfully!', {
        description: 'Your results have been recorded.',
      });
      navigate('/');
    } catch (error) {
      toast.error('Failed to submit assessment', {
        description: 'Please try again.',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return null;
  }

  return (
    <AssessmentInterface
      problems={assessment.problems}
      duration={assessment.duration}
      onComplete={handleComplete}
      assessmentId={assessment.id}
      candidateEmail={candidateEmail}
    />
  );
}
