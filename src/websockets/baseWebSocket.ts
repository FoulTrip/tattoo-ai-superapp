/**
 * Base WebSocket Manager
 * Proporciona funcionalidad común para todas las conexiones WebSocket
 */

'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface BaseWebSocketConfig {
  serverUrl: string;
  autoConnect?: boolean;
  reconnection?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
}

export interface BaseWebSocketReturn {
  socket: Socket | null;
  status: ConnectionStatus;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  error: Error | null;
  reconnectAttempts: number;
}

export function useBaseWebSocket({
  serverUrl,
  autoConnect = true,
  reconnection = true,
  reconnectionAttempts = 5,
  reconnectionDelay = 1000,
}: BaseWebSocketConfig): BaseWebSocketReturn {
  const socketRef = useRef<Socket | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [error, setError] = useState<Error | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  // Logger utility
  const createLogger = (namespace: string) => ({
    info: (message: string, data?: any) => {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [${namespace}] INFO ${message}`, data || '');
    },
    success: (message: string, data?: any) => {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [${namespace}] SUCCESS ${message}`, data || '');
    },
    warn: (message: string, data?: any) => {
      const timestamp = new Date().toISOString();
      console.warn(`[${timestamp}] [${namespace}] WARN ${message}`, data || '');
    },
    error: (message: string, error?: any) => {
      const timestamp = new Date().toISOString();
      console.error(`[${timestamp}] [${namespace}] ERROR ${message}`, error || '');
    },
  });

  const logger = createLogger('WebSocket:Base');

  // Función para conectar manualmente
  const connect = useCallback(() => {
    if (!socketRef.current || !socketRef.current.connected) {
      logger.info('Initiating manual connection');
      setStatus('connecting');
      socketRef.current?.connect();
    }
  }, []);

  // Función para desconectar manualmente
  const disconnect = useCallback(() => {
    logger.info('Initiating disconnect');
    socketRef.current?.disconnect();
    setStatus('disconnected');
    logger.success('Disconnected from WebSocket');
  }, []);

  // Inicializar WebSocket
  useEffect(() => {
    if (!autoConnect) {
      logger.info('WebSocket autoConnect disabled');
      return;
    }

    if (!serverUrl) {
      logger.error('Missing serverUrl configuration');
      return;
    }

    logger.info('Initializing WebSocket connection', {
      serverUrl,
      reconnection,
      reconnectionAttempts,
      reconnectionDelay,
    });

    setStatus('connecting');

    const socket = io(serverUrl, {
      transports: ['websocket'],
      reconnection,
      reconnectionAttempts,
      reconnectionDelay,
      reconnectionDelayMax: 5000,
      autoConnect: true,
    });

    socketRef.current = socket;

    // Eventos de conexión
    socket.on('connect', () => {
      logger.success('Connected to WebSocket', { socketId: socket.id });
      setStatus('connected');
      setError(null);
      setReconnectAttempts(0);
    });

    socket.on('disconnect', (reason) => {
      logger.warn('Disconnected from WebSocket', { reason });
      setStatus('disconnected');
    });

    socket.on('connect_error', (err) => {
      logger.warn('Connection error', err.message);
    });

    socket.on('error', (err) => {
      logger.error('Socket error', err);
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setStatus('error');
    });

    // Eventos de reconexión
    socket.on('reconnect_attempt', () => {
      logger.info('Attempting to reconnect');
      setStatus('connecting');
      setReconnectAttempts((prev) => prev + 1);
    });

    socket.on('reconnect', () => {
      logger.success('Reconnected successfully');
      setStatus('connected');
      setReconnectAttempts(0);
    });

    socket.on('reconnect_error', (err) => {
      logger.warn('Reconnection error', err.message);
      setStatus('error');
    });

    socket.on('reconnect_failed', () => {
      logger.error('Failed to reconnect after maximum attempts');
      setStatus('error');
    });

    // Cleanup
    return () => {
      logger.info('Cleaning up WebSocket resources');
      disconnect();
    };
  }, [serverUrl, autoConnect, reconnection, reconnectionAttempts, reconnectionDelay, disconnect]);

  return {
    socket: socketRef.current,
    status,
    isConnected: status === 'connected',
    connect,
    disconnect,
    error,
    reconnectAttempts,
  };
}