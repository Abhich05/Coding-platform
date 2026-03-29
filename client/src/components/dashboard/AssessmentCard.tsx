import { Assessment } from '@/types/assessment';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Users, Clock, FileCode, ArrowRight, Play, Link2, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';

interface AssessmentCardProps {
  assessment: Assessment;
  onStart: () => void;
  onViewDetails: () => void;
}

const statusConfig = {
  draft: { label: 'Draft', className: 'bg-muted text-muted-foreground border-border' },
  active: { label: 'Active', className: 'bg-success/10 text-success border-success/30' },
  closed: { label: 'Closed', className: 'bg-destructive/10 text-destructive border-destructive/30' },
};

export function AssessmentCard({ assessment, onStart, onViewDetails }: AssessmentCardProps) {
  const completedCount = assessment.candidates.filter(c => c.status === 'completed' || c.status === 'evaluated').length;
  const [copied, setCopied] = useState(false);

  const copyInviteLink = () => {
    const link = `${window.location.origin}/join?id=${assessment.id}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      toast.success('Invite link copied!', { description: link });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden border border-border hover:border-primary/30 transition-all hover:shadow-lg">
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg text-foreground">{assessment.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {assessment.description}
              </p>
            </div>
            <Badge 
              variant="outline" 
              className={cn("shrink-0 ml-2", statusConfig[assessment.status].className)}
            >
              {statusConfig[assessment.status].label}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-border">
            <div className="flex items-center gap-2 text-sm">
              <FileCode className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">{assessment.problems.length} Problems</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">{assessment.duration} min</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">
                {completedCount}/{assessment.candidates.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Button variant="default" className="flex-1 gap-2" onClick={onStart}>
              <Play className="w-4 h-4" />
              Preview
            </Button>
            <Button
              variant="outline"
              className="gap-1.5"
              onClick={copyInviteLink}
              title="Copy candidate invite link"
            >
              {copied ? <Check className="w-4 h-4 text-success" /> : <Link2 className="w-4 h-4" />}
              {copied ? 'Copied' : 'Invite'}
            </Button>
            <Button variant="outline" onClick={onViewDetails}>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
