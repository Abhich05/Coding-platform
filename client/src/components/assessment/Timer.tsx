import { useState, useEffect, useRef } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TimerProps {
  duration: number; // in minutes
  onTimeUp: () => void;
}

export function Timer({ duration, onTimeUp }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // convert to seconds
  // Derive warning/critical states directly from timeLeft — no extra state needed.
  const isWarning  = timeLeft <= 300 && timeLeft > 60;  // 5 min warning
  const isCritical = timeLeft <= 60;                     // 1 min critical

  // Stabilize the callback so it doesn't retrigger the effect.
  const onTimeUpRef = useRef(onTimeUp);
  useEffect(() => { onTimeUpRef.current = onTimeUp; }, [onTimeUp]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUpRef.current();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const percentage = (timeLeft / (duration * 60)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-center gap-3 px-4 py-2 rounded-lg font-mono text-lg transition-all duration-300",
        isCritical 
          ? "bg-destructive/10 text-destructive border border-destructive/30" 
          : isWarning 
            ? "bg-warning/10 text-warning border border-warning/30"
            : "bg-card border border-border"
      )}
    >
      {isCritical ? (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
        >
          <AlertTriangle className="w-5 h-5" />
        </motion.div>
      ) : (
        <Clock className="w-5 h-5" />
      )}
      <span className="font-semibold">{formatTime(timeLeft)}</span>
      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={cn(
            "h-full rounded-full transition-colors",
            isCritical 
              ? "bg-destructive" 
              : isWarning 
                ? "bg-warning"
                : "bg-primary"
          )}
          initial={{ width: '100%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  );
}
