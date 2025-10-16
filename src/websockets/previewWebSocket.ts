/**
 * Preview WebSocket Manager
 * Extiende el base WebSocket con funcionalidades específicas para preview de imágenes
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type {
  PreviewConnectionStatus,
  PreviewEventHandlers,
  ConnectedEvent,
  ProcessingStartedEvent,
  ProcessingProgressEvent,
  ProcessingCompletedEvent,
  ProcessingErrorEvent,
  PongEvent,
  ErrorEvent,
} from '@/types/preview';

export interface PreviewWebSocketConfig {
  serverUrl: string;
  token: string;
  autoConnect?: boolean;
  reconnection?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
  handlers?: PreviewEventHandlers;
}

export interface PreviewWebSocketReturn {
  socket: Socket | null;
  status: PreviewConnectionStatus;
  isConnected: boolean;
  userId: string | null;
  socketId: string | null;
  processImages: (files: string[], styles?: string[], colors?: string[], description?: string) => void;
  ping: () => void;
  connect: () => void;
  disconnect: () => void;
  error: Error | null;
}

export function usePreviewWebSocket({
  serverUrl,
  token,
  autoConnect = true,
  reconnection = true,
  reconnectionAttempts = 5,
  reconnectionDelay = 1000,
  handlers = {},
}: PreviewWebSocketConfig): PreviewWebSocketReturn {
  const socketRef = useRef<Socket | null>(null);
  const [status, setStatus] = useState<PreviewConnectionStatus>('disconnected');
  const [error, setError] = useState<Error | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [socketId, setSocketId] = useState<string | null>(null);

  // Handlers estables con useCallback
  const handleConnected = useCallback(
    (event: ConnectedEvent) => {
      console.log('✅ Preview WebSocket Connected');
      console.log(`   User ID: ${event.userId}`);
      console.log(`   Socket ID: ${event.socketId}`);
      console.log(`   Message: ${event.message}`);
      console.log('   Timestamp:', new Date().toISOString());

      setUserId(event.userId);
      setSocketId(event.socketId);
      setStatus('connected');
      setError(null);

      handlers.onConnected?.(event);
    },
    [handlers]
  );

  const handleProcessingStarted = useCallback(
    (event: ProcessingStartedEvent) => {
      console.log('🚀 Processing Started:');
      console.log(`   Job ID: ${event.jobId}`);
      console.log(`   Message: ${event.message}`);
      console.log(`   Timestamp: ${event.timestamp}`);
      console.log('   ✅ Event received and handled');

      handlers.onProcessingStarted?.(event);
    },
    [handlers]
  );

  const handleProcessingProgress = useCallback(
    (event: ProcessingProgressEvent) => {
      console.log(`📊 Processing Progress: ${event.progress}%`);
      if (event.message) {
        console.log(`   Message: ${event.message}`);
      }
      console.log(`   Job ID: ${event.jobId}`);
      console.log('   ✅ Progress event received and handled');

      handlers.onProcessingProgress?.(event);
    },
    [handlers]
  );

  const handleProcessingCompleted = useCallback(
    (event: ProcessingCompletedEvent) => {
      console.log('🎉 Processing Completed!');
      console.log(`   Job ID: ${event.jobId}`);
      console.log(`   Timestamp: ${event.timestamp}`);
      console.log('   Result data:', event.data);
      console.log('   ✅ Completion event received and handled');

      handlers.onProcessingCompleted?.(event);
    },
    [handlers]
  );

  const handleProcessingError = useCallback(
    (event: ProcessingErrorEvent) => {
      console.error('   Processing Error:');
      console.error(`   Job ID: ${event.jobId}`);
      console.error(`   Error: ${event.error}`);
      console.error(`   Timestamp: ${event.timestamp}`);

      handlers.onProcessingError?.(event);
    },
    [handlers]
  );

  const handlePong = useCallback(
    (event: PongEvent) => {
      console.log('   Pong received:');
      console.log(`   Socket ID: ${event.socketId}`);
      console.log(`   Timestamp: ${event.timestamp}`);

      handlers.onPong?.(event);
    },
    [handlers]
  );

  const handleError = useCallback(
    (event: ErrorEvent) => {
      console.error('❌ Server error:', event.message);
      const err = new Error(event.message);
      setError(err);
      setStatus('error');

      handlers.onError?.(event);
    },
    [handlers]
  );

  const handleDisconnect = useCallback(
    (reason: string) => {
      console.log('Disconnected:', reason);
      console.log('Timestamp:', new Date().toISOString());
      console.log('Socket was connected:', socketRef.current?.connected || false);
      setStatus('disconnected');
      setUserId(null);
      setSocketId(null);

      handlers.onDisconnect?.(reason);
    },
    [handlers]
  );

  // Función para procesar imágenes
  const processImages = useCallback((
    files: string[],
    styles?: string[],
    colors?: string[],
    description?: string,
  ) => {
    if (!socketRef.current?.connected) {
      console.error('Not connected to server');
      return;
    }

    if (files.length !== 2) {
      console.error('❌ Exactly 2 images are required');
      return;
    }

    console.log('Processing images...');
    console.log('Files count:', files.length);
    console.log('File 1 length:', files[0]?.length || 'undefined');
    console.log('File 2 length:', files[1]?.length || 'undefined');
    console.log('Sending payload:', { files, styles, colors, description });
    socketRef.current.emit('process-images', { files, styles: styles || [], colors: colors || [], description });
    console.log('Images sent to server');
  }, []);

  // Función para enviar ping
  const ping = useCallback(() => {
    if (!socketRef.current?.connected) {
      console.error('Not connected to server');
      return;
    }

    console.log('Sending ping...');
    socketRef.current.emit('ping');
  }, []);

  // Función para conectar manualmente
  const connect = useCallback(() => {
    if (!socketRef.current || !socketRef.current.connected) {
      setStatus('connecting');
      socketRef.current?.connect();
    }
  }, []);

  // Función para desconectar manualmente
  const disconnect = useCallback(() => {
    console.log('Disconnecting...');
    socketRef.current?.disconnect();
    setStatus('disconnected');
    setUserId(null);
    setSocketId(null);
  }, []);

  // Inicializar WebSocket
  useEffect(() => {
    if (!autoConnect) return;

    console.log('🔌 Initializing WebSocket connection...');
    console.log('   Server URL:', serverUrl);
    console.log('   Namespace:', serverUrl.includes('/preview') ? '/preview' : 'default');
    console.log('   Token provided:', !!token);
    console.log('   Auto connect:', autoConnect);
    console.log('   Reconnection:', reconnection);
    console.log('   Reconnection attempts:', reconnectionAttempts);
    console.log('   Reconnection delay:', reconnectionDelay);

    setStatus('authenticating');

    const socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnection,
      reconnectionAttempts,
      reconnectionDelay,
    });

    socketRef.current = socket;

    // Event listeners de conexión
    socket.on('connected', handleConnected);

    socket.on('disconnect', handleDisconnect);

    socket.on('connect_error', (err) => {
      console.error('❌ Connection error:', err.message);
      console.error('   Error details:', err);
      console.error('   Socket state:', socket.connected ? 'connected' : 'disconnected');
      console.error('   Reconnection enabled:', reconnection);
      console.error('   Reconnection attempts:', reconnectionAttempts);
      const error = new Error(err.message);
      setError(error);
      setStatus('error');
    });

    socket.on('error', handleError);

    // Event listeners de procesamiento
    socket.on('processing:started', handleProcessingStarted);
    socket.on('processing:progress', handleProcessingProgress);
    socket.on('processing:completed', handleProcessingCompleted);
    socket.on('processing:error', handleProcessingError);
    socket.on('pong', handlePong);

    // Cleanup al desmontar
    return () => {
      console.log('🧹 Cleaning up WebSocket connection...');
      socket.off('connected', handleConnected);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error');
      socket.off('error', handleError);
      socket.off('processing:started', handleProcessingStarted);
      socket.off('processing:progress', handleProcessingProgress);
      socket.off('processing:completed', handleProcessingCompleted);
      socket.off('processing:error', handleProcessingError);
      socket.off('pong', handlePong);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [
    serverUrl,
    autoConnect,
    reconnection,
    reconnectionAttempts,
    reconnectionDelay,
  ]);

  return {
    socket: socketRef.current,
    status,
    isConnected: status === 'connected',
    userId,
    socketId,
    processImages,
    ping,
    connect,
    disconnect,
    error,
  };
}