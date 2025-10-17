/**
 * Hook para manejar el estado y operaciones de procesamiento de imágenes
 * Integra WebSocket y proporciona funciones para gestionar previews
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import type {
  ProcessingJob,
  ProcessingStatus,
  ProcessingResult,
  ProcessingStats,
  ProcessingStartedEvent,
  ProcessingProgressEvent,
  ProcessingCompletedEvent,
  ProcessingErrorEvent,
  PreviewEventHandlers,
} from '@/types/preview';
import { usePreviewWebSocket } from '@/websockets';

interface UseImagePreviewOptions {
  token: string; // JWT token para autenticación
  serverUrl?: string;
  enableWebSocket?: boolean;
  onComplete?: (result: ProcessingResult) => void;
  onError?: (error: string) => void;
}

interface UseImagePreviewReturn {
  // Estado
  jobs: ProcessingJob[];
  currentJob: ProcessingJob | null;
  isConnected: boolean;
  isProcessing: boolean;
  error: Error | null;

  // Operaciones
  processImages: (files: string[], styles?: string[], colors?: string[], description?: string) => Promise<void>;
  cancelJob: (jobId: string) => void;
  clearHistory: () => void;
  getJobById: (jobId: string) => ProcessingJob | undefined;

  // Utilidades
  convertFileToBase64: (file: File) => Promise<string>;
  convertFilesToBase64: (files: File[]) => Promise<string[]>;

  // Estadísticas
  stats: ProcessingStats;

  // WebSocket
  ping: () => void;
  userId: string | null;
  socketId: string | null;
}

export function useImagePreview({
  token,
  serverUrl = process.env.NEXT_PUBLIC_WS_PREVIEW_URL!,
  enableWebSocket = true,
  onComplete,
  onError,
}: UseImagePreviewOptions): UseImagePreviewReturn {
  const [jobs, setJobs] = useState<ProcessingJob[]>([]);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Job actual en procesamiento
  const currentJob = useMemo(
    () => jobs.find((job) => job.jobId === currentJobId) || null,
    [jobs, currentJobId]
  );

  // Verificar si hay algún job procesándose
  const isProcessing = useMemo(
    () => jobs.some((job) => job.status === 'processing' || job.status === 'uploading'),
    [jobs]
  );

  // Handlers para eventos WebSocket
  const websocketHandlers: PreviewEventHandlers = useMemo(
    () => ({
      onProcessingStarted: (event: ProcessingStartedEvent) => {
        console.log('🎯 Processing started for job:', event.jobId);
        setJobs((prev) =>
          prev.map((job) =>
            job.status === 'uploading'
              ? {
                  ...job,
                  status: 'processing' as ProcessingStatus,
                  message: event.message,
                }
              : job
          )
        );
        // Keep the local currentJobId, don't change it
      },

      onProcessingProgress: (event: ProcessingProgressEvent) => {
        setJobs((prev) =>
          prev.map((job) =>
            job.jobId === event.jobId
              ? {
                  ...job,
                  progress: event.progress,
                  message: event.message,
                }
              : job
          )
        );
      },

      onProcessingCompleted: (event: ProcessingCompletedEvent) => {
        console.log('✅ Updating job to completed:', event.jobId);
        console.log('✅ Event data:', event.data);
        setJobs((prev) => {
          const updated = prev.map((job) =>
            job.status === 'processing'
              ? {
                  ...job,
                  status: 'completed' as ProcessingStatus,
                  progress: 100,
                  result: event.data,
                  completedAt: new Date(),
                }
              : job
          );
          console.log('📋 Jobs after completion:', updated);
          return updated;
        });

        // Don't set currentJobId to null so the component can display the result
        // setCurrentJobId(null);
        onComplete?.(event.data);
      },

      onProcessingError: (event: ProcessingErrorEvent) => {
        setJobs((prev) =>
          prev.map((job) =>
            job.jobId === event.jobId
              ? {
                  ...job,
                  status: 'error',
                  error: event.error,
                  completedAt: new Date(),
                }
              : job
          )
        );

        setCurrentJobId(null);
        onError?.(event.error);
      },

      onError: (event) => {
        const err = new Error(event.message);
        setError(err);
        onError?.(event.message);
      },
    }),
    [onComplete, onError]
  );

  // Inicializar WebSocket
  const { isConnected, processImages: sendToWebSocket, ping, userId, socketId } = usePreviewWebSocket({
      serverUrl,
      token,
      autoConnect: enableWebSocket,
      handlers: websocketHandlers,
    });

  // Función para convertir File a base64
  const convertFileToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const base64 = reader.result as string;
        // Remover el prefijo "data:image/xxx;base64," si existe
        const base64Clean = base64.includes(',')
          ? base64.split(',')[1]
          : base64;
        resolve(base64Clean);
      };

      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsDataURL(file);
    });
  }, []);

  // Función para convertir múltiples Files a base64
  const convertFilesToBase64 = useCallback(
    async (files: File[]): Promise<string[]> => {
      return Promise.all(files.map((file) => convertFileToBase64(file)));
    },
    [convertFileToBase64]
  );

  // Función para procesar imágenes
  const processImages = useCallback(
    async (files: string[], styles?: string[], colors?: string[], description?: string) => {
      if (!isConnected) {
        const err = new Error('Not connected to server');
        setError(err);
        throw err;
      }

      if (files.length !== 2) {
        const err = new Error('Exactly 2 images are required');
        setError(err);
        throw err;
      }

      // Crear nuevo job
      const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const newJob: ProcessingJob = {
        jobId,
        status: 'uploading',
        progress: 0,
        startedAt: new Date(),
        files,
        styles: styles || [],
        colors: colors || [],
        description: description || ''
      };

      setJobs((prev) => [...prev, newJob]);
      setCurrentJobId(jobId);

      // Enviar a WebSocket
      sendToWebSocket(files, styles, colors, description);
    },
    [isConnected, sendToWebSocket]
  );

  // Función para cancelar un job (esto solo lo marca localmente, no cancela en servidor)
  const cancelJob = useCallback((jobId: string) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.jobId === jobId
          ? {
              ...job,
              status: 'error' as ProcessingStatus,
              error: 'Cancelled by user',
              completedAt: new Date(),
            }
          : job
      )
    );

    if (currentJobId === jobId) {
      setCurrentJobId(null);
    }
  }, [currentJobId]);

  // Función para limpiar historial
  const clearHistory = useCallback(() => {
    setJobs([]);
    setCurrentJobId(null);
    setError(null);
  }, []);

  // Función para obtener job por ID
  const getJobById = useCallback(
    (jobId: string) => {
      return jobs.find((job) => job.jobId === jobId);
    },
    [jobs]
  );

  // Estadísticas
  const stats = useMemo((): ProcessingStats => {
    const totalJobs = jobs.length;
    const completedJobs = jobs.filter((j) => j.status === 'completed').length;
    const failedJobs = jobs.filter((j) => j.status === 'error').length;

    const processingTimes = jobs
      .filter((j) => j.status === 'completed' && j.completedAt)
      .map((j) => j.completedAt!.getTime() - j.startedAt.getTime());

    const averageProcessingTime =
      processingTimes.length > 0
        ? processingTimes.reduce((sum, time) => sum + time, 0) / processingTimes.length
        : 0;

    const successRate =
      totalJobs > 0 ? (completedJobs / totalJobs) * 100 : 0;

    return {
      totalJobs,
      completedJobs,
      failedJobs,
      averageProcessingTime,
      successRate,
    };
  }, [jobs]);

  return {
    // Estado
    jobs,
    currentJob,
    isConnected,
    isProcessing,
    error,

    // Operaciones
    processImages,
    cancelJob,
    clearHistory,
    getJobById,

    // Utilidades
    convertFileToBase64,
    convertFilesToBase64,

    // Estadísticas
    stats,

    // WebSocket
    ping,
    userId,
    socketId,
  };
}
