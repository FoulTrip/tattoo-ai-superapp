/**
 * Appointment WebSocket Manager
 * Extiende el base WebSocket con funcionalidades específicas para appointments
 */

'use client';

import { useCallback, useRef, useEffect } from 'react';
import { useBaseWebSocket, type BaseWebSocketConfig } from './baseWebSocket';
import type {
  AppointmentEventHandlers,
  AppointmentEventPayload,
  AppointmentReminderPayload,
} from '@/types/appointment';

export interface AppointmentWebSocketConfig extends BaseWebSocketConfig {
  tenantId: string;
  handlers?: AppointmentEventHandlers;
}

export interface AppointmentWebSocketReturn {
  socket: any;
  status: string;
  isConnected: boolean;
  subscribeToCalendar: (calendarId: string) => void;
  unsubscribeFromCalendar: (calendarId: string) => void;
  connect: () => void;
  disconnect: () => void;
  error: Error | null;
  reconnectAttempts: number;
}

export function useAppointmentWebSocket({
  serverUrl,
  tenantId,
  autoConnect = true,
  reconnection = true,
  reconnectionAttempts = 5,
  reconnectionDelay = 1000,
  handlers = {},
}: AppointmentWebSocketConfig): AppointmentWebSocketReturn {
  const subscribedCalendarsRef = useRef<Set<string>>(new Set());

  const logger = {
    info: (message: string, data?: any) => {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [WebSocket:Appointments] INFO ${message}`, data || '');
    },
    success: (message: string, data?: any) => {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [WebSocket:Appointments] SUCCESS ${message}`, data || '');
    },
    warn: (message: string, data?: any) => {
      const timestamp = new Date().toISOString();
      console.warn(`[${timestamp}] [WebSocket:Appointments] WARN ${message}`, data || '');
    },
    error: (message: string, error?: any) => {
      const timestamp = new Date().toISOString();
      console.error(`[${timestamp}] [WebSocket:Appointments] ERROR ${message}`, error || '');
    },
  };

  // Validadores de payload
  const validateAppointmentPayload = (payload: unknown): payload is AppointmentEventPayload => {
    if (!payload || typeof payload !== 'object') return false;
    const p = payload as any;
    return p.data?.id && p.appointmentId && typeof p.data === 'object';
  };

  const validateReminderPayload = (payload: unknown): payload is AppointmentReminderPayload => {
    if (!payload || typeof payload !== 'object') return false;
    const p = payload as any;
    return p.appointment?.id && typeof p.minutesUntilStart === 'number';
  };

  const { socket, status, isConnected, connect, disconnect: baseDisconnect, error, reconnectAttempts } = useBaseWebSocket({
    serverUrl,
    autoConnect,
    reconnection,
    reconnectionAttempts,
    reconnectionDelay,
  });

  // Handlers estables con useCallback y validación
  const handleCreated = useCallback(
    (payload: unknown) => {
      if (!validateAppointmentPayload(payload)) {
        logger.warn('Invalid appointment:created payload', payload);
        return;
      }
      logger.success('Appointment created', {
        title: payload.data.title,
        id: payload.data.id,
      });
      handlers.onCreated?.(payload);
    },
    [handlers]
  );

  const handleUpdated = useCallback(
    (payload: unknown) => {
      if (!validateAppointmentPayload(payload)) {
        logger.warn('Invalid appointment:updated payload', payload);
        return;
      }
      logger.success('Appointment updated', {
        title: payload.data.title,
        id: payload.data.id,
      });
      handlers.onUpdated?.(payload);
    },
    [handlers]
  );

  const handleDeleted = useCallback(
    (payload: unknown) => {
      if (!validateAppointmentPayload(payload)) {
        logger.warn('Invalid appointment:deleted payload', payload);
        return;
      }
      logger.success('Appointment deleted', { id: payload.appointmentId });
      handlers.onDeleted?.(payload);
    },
    [handlers]
  );

  const handleStatusChanged = useCallback(
    (payload: unknown) => {
      if (!validateAppointmentPayload(payload)) {
        logger.warn('Invalid appointment:status_changed payload', payload);
        return;
      }
      logger.success('Status changed', {
        id: payload.appointmentId,
        oldStatus: (payload as any).changes?.oldValue,
        newStatus: (payload as any).changes?.newValue,
      });
      handlers.onStatusChanged?.(payload);
    },
    [handlers]
  );

  const handleRescheduled = useCallback(
    (payload: unknown) => {
      if (!validateAppointmentPayload(payload)) {
        logger.warn('Invalid appointment:rescheduled payload', payload);
        return;
      }
      logger.success('Appointment rescheduled', {
        title: payload.data.title,
        id: payload.data.id,
      });
      handlers.onRescheduled?.(payload);
    },
    [handlers]
  );

  const handleReminder = useCallback(
    (payload: unknown) => {
      if (!validateReminderPayload(payload)) {
        logger.warn('Invalid appointment:reminder payload', payload);
        return;
      }
      logger.info('Reminder triggered', {
        appointmentTitle: payload.appointment.title,
        minutesUntilStart: payload.minutesUntilStart,
      });
      handlers.onReminder?.(payload);
    },
    [handlers]
  );

  // Función para suscribirse a un calendario
  const subscribeToCalendar = useCallback((calendarId: string) => {
    if (!calendarId || typeof calendarId !== 'string') {
      logger.warn('Invalid calendarId for subscription', calendarId);
      return;
    }

    if (socket?.connected) {
      socket.emit('subscribe:calendar', { calendarId }, (response: any) => {
        if (response?.success) {
          subscribedCalendarsRef.current.add(calendarId);
          logger.success('Subscribed to calendar', { calendarId });
        } else {
          logger.warn('Failed to subscribe to calendar', { calendarId, response });
        }
      });
    } else {
      logger.warn('Cannot subscribe: socket not connected', { calendarId });
    }
  }, [socket]);

  // Función para desuscribirse de un calendario
  const unsubscribeFromCalendar = useCallback((calendarId: string) => {
    if (!calendarId || typeof calendarId !== 'string') {
      logger.warn('Invalid calendarId for unsubscription', calendarId);
      return;
    }

    if (socket?.connected) {
      socket.emit('unsubscribe:calendar', { calendarId }, (response: any) => {
        if (response?.success) {
          subscribedCalendarsRef.current.delete(calendarId);
          logger.success('Unsubscribed from calendar', { calendarId });
        } else {
          logger.warn('Failed to unsubscribe from calendar', { calendarId, response });
        }
      });
    } else {
      logger.warn('Cannot unsubscribe: socket not connected', { calendarId });
    }
  }, [socket]);

  // Re-suscribirse a calendarios después de reconectar
  const resubscribeToCalendars = useCallback(() => {
    if (subscribedCalendarsRef.current.size > 0) {
      logger.info('Re-subscribing to calendars after reconnection', {
        count: subscribedCalendarsRef.current.size,
      });
      subscribedCalendarsRef.current.forEach((calendarId) => {
        subscribeToCalendar(calendarId);
      });
    }
  }, [subscribeToCalendar]);

  // Función para desconectar con limpieza específica
  const disconnect = useCallback(() => {
    // Desuscribirse de todos los calendarios
    if (socket?.connected) {
      subscribedCalendarsRef.current.forEach((calendarId) => {
        socket.emit('unsubscribe:calendar', { calendarId });
      });

      // Desuscribirse del tenant
      socket.emit('unsubscribe:tenant', { tenantId }, () => {
        logger.success('Unsubscribed from tenant');
      });

      subscribedCalendarsRef.current.clear();
    }

    baseDisconnect();
  }, [socket, tenantId, baseDisconnect]);

  // Configurar eventos específicos de appointments cuando el socket esté disponible
  useEffect(() => {
    if (!socket) return;

    // Auto-suscribirse al tenant cuando se conecte
    const handleConnect = () => {
      socket.emit('subscribe:tenant', { tenantId }, (response: any) => {
        if (response?.success) {
          logger.success('Subscribed to tenant', { tenantId });
        } else {
          logger.warn('Failed to subscribe to tenant', { response });
        }
      });
    };

    // Re-suscribirse después de reconectar
    const handleReconnect = () => {
      socket.emit('subscribe:tenant', { tenantId });
      resubscribeToCalendars();
    };

    socket.on('connect', handleConnect);
    socket.on('reconnect', handleReconnect);

    // Eventos de appointments
    socket.on('appointment:created', handleCreated);
    socket.on('appointment:updated', handleUpdated);
    socket.on('appointment:deleted', handleDeleted);
    socket.on('appointment:status_changed', handleStatusChanged);
    socket.on('appointment:rescheduled', handleRescheduled);
    socket.on('appointment:reminder', handleReminder);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('reconnect', handleReconnect);
      socket.off('appointment:created', handleCreated);
      socket.off('appointment:updated', handleUpdated);
      socket.off('appointment:deleted', handleDeleted);
      socket.off('appointment:status_changed', handleStatusChanged);
      socket.off('appointment:rescheduled', handleRescheduled);
      socket.off('appointment:reminder', handleReminder);
    };
  }, [
    socket,
    tenantId,
    handleCreated,
    handleUpdated,
    handleDeleted,
    handleStatusChanged,
    handleRescheduled,
    handleReminder,
    resubscribeToCalendars,
  ]);

  return {
    socket,
    status,
    isConnected,
    subscribeToCalendar,
    unsubscribeFromCalendar,
    connect,
    disconnect,
    error,
    reconnectAttempts,
  };
}