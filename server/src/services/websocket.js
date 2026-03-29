import http from 'http';
import { Server } from 'socket.io';
import { QueueEvents } from 'bullmq';
import { Redis } from 'ioredis';

let io;

const connection = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
});

export function initializeWebSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:8080',
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    socket.on('subscribe_submission', (submissionId) => {
      socket.join(`submission_${submissionId}`);
      console.log(`📡 Client subscribed to submission: ${submissionId}`);
    });

    socket.on('unsubscribe_submission', (submissionId) => {
      socket.leave(`submission_${submissionId}`);
      console.log(`📴 Client unsubscribed from submission: ${submissionId}`);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  // Listen to queue events
  setupQueueListeners();

  return io;
}

function setupQueueListeners() {
  const queueEvents = new QueueEvents('code-submissions', { connection });

  // Listen for job progress updates from the worker
  queueEvents.on('progress', ({ jobId, data }) => {
    // data is the object passed to job.updateProgress()
    const progress = typeof data === 'string' ? JSON.parse(data) : data;
    const submissionId = progress?.submissionId || jobId.replace('submission_', '');
    if (io) {
      io.to(`submission_${submissionId}`).emit('submission_update', {
        type: 'progress',
        submissionId,
        status: 'running',
        progress,
      });
    }
  });

  // Listen for job completion — returnvalue is JSON-stringified result from worker
  queueEvents.on('completed', ({ jobId, returnvalue }) => {
    try {
      const result = typeof returnvalue === 'string' ? JSON.parse(returnvalue) : returnvalue;
      const submissionId = result?.submissionId || jobId.replace('submission_', '');
      if (io) {
        io.to(`submission_${submissionId}`).emit('submission_update', {
          type: 'completed',
          submissionId,
          status: 'completed',
          result,
        });
      }
    } catch (err) {
      console.error('Error parsing job returnvalue:', err);
    }
  });

  // Listen for job failures
  queueEvents.on('failed', ({ jobId, failedReason }) => {
    const submissionId = jobId.replace('submission_', '');
    if (io) {
      io.to(`submission_${submissionId}`).emit('submission_update', {
        type: 'failed',
        submissionId,
        status: 'failed',
        error: failedReason,
      });
    }
  });
}

export function notifySubmissionProgress(submissionId, current, total) {
  if (io) {
    io.to(`submission_${submissionId}`).emit('submission_update', {
      type: 'progress',
      submissionId,
      status: 'running',
      progress: {
        currentTest: current,
        totalTests: total,
      },
    });
  }
}

export function notifySubmissionComplete(submissionId, result) {
  if (io) {
    io.to(`submission_${submissionId}`).emit('submission_update', {
      type: 'completed',
      submissionId,
      status: 'completed',
      result,
    });
  }
}

export { io };
