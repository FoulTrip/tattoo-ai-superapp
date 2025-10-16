/**
 * Tipos TypeScript para el sistema de Preview WebSocket
 * Procesamiento de imágenes en tiempo real
 */

// Estado de procesamiento de imagen
export type ProcessingStatus =
  | 'idle'
  | 'uploading'
  | 'processing'
  | 'completed'
  | 'error';

// Resultado de procesamiento de imagen
export interface ProcessingResult {
  imageUrl?: string;
  base64Image?: string;
  metadata?: Record<string, unknown>;
  processingTime?: number;
  [key: string]: unknown;
}

// Evento: Conexión establecida
export interface ConnectedEvent {
  message: string;
  userId: string;
  socketId: string;
}

// Evento: Procesamiento iniciado
export interface ProcessingStartedEvent {
  jobId: string;
  message: string;
  timestamp: string;
}

// Evento: Progreso del procesamiento
export interface ProcessingProgressEvent {
  jobId: string;
  progress: number; // 0-100
  message?: string;
  timestamp: string;
}

// Evento: Procesamiento completado
export interface ProcessingCompletedEvent {
  jobId: string;
  data: ProcessingResult;
  timestamp: string;
}

// Evento: Error en el procesamiento
export interface ProcessingErrorEvent {
  jobId: string;
  error: string;
  timestamp: string;
}

// Evento: Pong response
export interface PongEvent {
  timestamp: number;
  socketId: string;
}

// Evento: Error general
export interface ErrorEvent {
  message: string;
}

// Job de procesamiento (tracking interno)
export interface ProcessingJob {
  jobId: string;
  status: ProcessingStatus;
  progress: number;
  message?: string;
  result?: ProcessingResult;
  error?: string;
  startedAt: Date;
  completedAt?: Date;
  files?: string[]; // Base64 de los archivos enviados
}

// Handlers de eventos WebSocket
export interface PreviewEventHandlers {
  onConnected?: (event: ConnectedEvent) => void;
  onProcessingStarted?: (event: ProcessingStartedEvent) => void;
  onProcessingProgress?: (event: ProcessingProgressEvent) => void;
  onProcessingCompleted?: (event: ProcessingCompletedEvent) => void;
  onProcessingError?: (event: ProcessingErrorEvent) => void;
  onPong?: (event: PongEvent) => void;
  onError?: (error: ErrorEvent) => void;
  onDisconnect?: (reason: string) => void;
}

// Configuración de WebSocket para Preview
export interface PreviewWebSocketConfig {
  serverUrl: string;
  token: string; // JWT token
  reconnection?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
}

// Estado de conexión WebSocket
export type PreviewConnectionStatus =
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'error'
  | 'authenticating';

// Opciones para procesar imágenes
export interface ProcessImagesOptions {
  files: string[]; // Array de base64 o File objects
  onProgress?: (progress: number) => void;
  onComplete?: (result: ProcessingResult) => void;
  onError?: (error: string) => void;
}

// Estadísticas de procesamiento
export interface ProcessingStats {
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  averageProcessingTime: number;
  successRate: number;
}
