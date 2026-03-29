import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface SubmissionProgress {
  currentTest: number;
  totalTests: number;
}

interface SubmissionResult {
  verdict: string;
  passedTests: number;
  totalTests: number;
  runtime: number;
  memory: number;
  runtimePercentile?: number;
  memoryPercentile?: number;
  testResults?: any[];
}

interface SubmissionUpdate {
  type: 'progress' | 'completed' | 'failed';
  submissionId: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress?: SubmissionProgress;
  result?: SubmissionResult;
  error?: string;
}

export const useSubmissionStatus = (submissionId: string | null) => {
  const [status, setStatus] = useState<SubmissionUpdate | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!submissionId) return;

    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      transports: ['websocket', 'polling'],
      auth: {
        token: localStorage.getItem('token'),
      },
    });

    newSocket.on('connect', () => {
      console.log('✅ WebSocket connected');
      setIsConnected(true);
      newSocket.emit('subscribe_submission', submissionId);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
      setIsConnected(false);
    });

    newSocket.on('submission_update', (data: SubmissionUpdate) => {
      console.log('📨 Submission update:', data);
      setStatus(data);
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    setSocket(newSocket);

    return () => {
      if (submissionId) {
        newSocket.emit('unsubscribe_submission', submissionId);
      }
      newSocket.close();
    };
  }, [submissionId]);

  return { status, socket, isConnected };
};
