/**
 * Hook para manejar el estado y operaciones de Appointments
 * Integra WebSocket y proporciona funciones para gestionar citas
 */

'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import type {
  AppointmentWithClient,
  AppointmentStatus,
  AppointmentEventPayload,
  AppointmentReminderPayload,
  AppointmentEventHandlers,
} from '@/types/appointment';
import { useAppointmentWebSocket } from '@/websockets';

interface UseAppointmentsOptions {
  tenantId: string;
  calendarIds?: string[];
  serverUrl?: string;
  apiBaseUrl?: string;
  enableWebSocket?: boolean;
  initialAppointments?: AppointmentWithClient[];
  onReminderNotification?: (appointment: AppointmentWithClient, minutesUntil: number) => void;
}

interface UseAppointmentsReturn {
  appointments: AppointmentWithClient[];
  isLoading: boolean;
  error: Error | null;
  isConnected: boolean;

  // Operaciones CRUD
  addAppointment: (appointment: AppointmentWithClient) => void;
  updateAppointment: (appointmentId: string, updates: Partial<AppointmentWithClient>) => void;
  removeAppointment: (appointmentId: string) => void;

  // Filtros y búsqueda
  getAppointmentById: (id: string) => AppointmentWithClient | undefined;
  getAppointmentsByStatus: (status: AppointmentStatus) => AppointmentWithClient[];
  getAppointmentsByCalendar: (calendarId: string) => AppointmentWithClient[];
  getAppointmentsByDate: (date: Date) => AppointmentWithClient[];
  searchAppointments: (query: string) => AppointmentWithClient[];

  // Estadísticas
  stats: {
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
    completed: number;
    totalRevenue: number;
  };

  // WebSocket
  subscribeToCalendar: (calendarId: string) => void;
  unsubscribeFromCalendar: (calendarId: string) => void;
  reconnectAttempts: number;
}

const logger = {
  info: (msg: string, data?: any) => console.log(`[useAppointments] INFO ${msg}`, data || ''),
  success: (msg: string, data?: any) => console.log(`[useAppointments] SUCCESS ${msg}`, data || ''),
  warn: (msg: string, data?: any) => console.warn(`[useAppointments] WARN ${msg}`, data || ''),
  error: (msg: string, err?: any) => console.error(`[useAppointments] ERROR ${msg}`, err || ''),
};

export function useAppointments({
  tenantId,
  calendarIds = [],
  serverUrl = process.env.NEXT_PUBLIC_WS_APPOINTMENTS_URL!,
  apiBaseUrl = process.env.NEXT_PUBLIC_URL_GATEWAY!,
  enableWebSocket = true,
  initialAppointments = [],
  onReminderNotification,
}: UseAppointmentsOptions): UseAppointmentsReturn {
  const [appointments, setAppointments] = useState<AppointmentWithClient[]>(initialAppointments);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [dataInitialized, setDataInitialized] = useState(initialAppointments.length > 0);

  // Cargar citas iniciales del servidor
  const fetchInitialAppointments = useCallback(async () => {
    if (dataInitialized) return; // No cargar si ya tenemos datos

    try {
      setIsLoading(true);
      setError(null);
      logger.info('Fetching initial appointments from server', { tenantId });

      const response = await fetch(`${apiBaseUrl}/appointments?tenantId=${tenantId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch appointments: ${response.statusText}`);
      }

      const data = await response.json();

      // Handle different response formats
      let appointmentsArray: AppointmentWithClient[] = [];
      if (Array.isArray(data)) {
        appointmentsArray = data;
      } else if (Array.isArray(data.appointments)) {
        appointmentsArray = data.appointments;
      } else if (Array.isArray(data.data)) {
        appointmentsArray = data.data;
      } else {
        throw new Error('Invalid response format: appointments must be an array');
      }

      setAppointments(appointmentsArray);
      setDataInitialized(true);
      logger.success('Initial appointments loaded', { count: appointmentsArray.length });
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      logger.error('Failed to fetch initial appointments', error.message);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [tenantId, apiBaseUrl, dataInitialized]);

  // Handlers para eventos WebSocket con validación
  const websocketHandlers: AppointmentEventHandlers = useMemo(
    () => ({
      onCreated: (payload: AppointmentEventPayload) => {
        try {
          if (!payload?.data?.id) {
            logger.warn('Invalid onCreated payload', payload);
            return;
          }

          setAppointments((prev) => {
            // Evitar duplicados
            const exists = prev.some((apt) => apt.id === payload.data.id);
            if (exists) {
              logger.warn('Appointment already exists, skipping', { id: payload.data.id });
              return prev;
            }
            logger.success('Appointment added to state', {
              id: payload.data.id,
              title: payload.data.title,
            });
            return [...prev, payload.data];
          });
        } catch (err) {
          logger.error('Error in onCreated handler', err);
        }
      },

      onUpdated: (payload: AppointmentEventPayload) => {
        try {
          if (!payload?.appointmentId || !payload?.data?.id) {
            logger.warn('Invalid onUpdated payload', payload);
            return;
          }

          setAppointments((prev) =>
            prev.map((apt) =>
              apt.id === payload.appointmentId ? { ...apt, ...payload.data } : apt
            )
          );
          logger.success('Appointment updated in state', {
            id: payload.appointmentId,
          });
        } catch (err) {
          logger.error('Error in onUpdated handler', err);
        }
      },

      onDeleted: (payload: AppointmentEventPayload) => {
        try {
          if (!payload?.appointmentId) {
            logger.warn('Invalid onDeleted payload', payload);
            return;
          }

          setAppointments((prev) =>
            prev.filter((apt) => apt.id !== payload.appointmentId)
          );
          logger.success('Appointment removed from state', {
            id: payload.appointmentId,
          });
        } catch (err) {
          logger.error('Error in onDeleted handler', err);
        }
      },

      onStatusChanged: (payload: AppointmentEventPayload) => {
        try {
          if (!payload?.appointmentId || !payload?.data?.id) {
            logger.warn('Invalid onStatusChanged payload', payload);
            return;
          }

          setAppointments((prev) =>
            prev.map((apt) =>
              apt.id === payload.appointmentId
                ? { ...apt, status: payload.data.status }
                : apt
            )
          );
          logger.success('Appointment status changed', {
            id: payload.appointmentId,
            status: payload.data.status,
          });
        } catch (err) {
          logger.error('Error in onStatusChanged handler', err);
        }
      },

      onRescheduled: (payload: AppointmentEventPayload) => {
        try {
          if (!payload?.appointmentId || !payload?.data?.id) {
            logger.warn('Invalid onRescheduled payload', payload);
            return;
          }

          setAppointments((prev) =>
            prev.map((apt) =>
              apt.id === payload.appointmentId
                ? {
                  ...apt,
                  startTime: payload.data.startTime,
                  endTime: payload.data.endTime,
                }
                : apt
            )
          );
          logger.success('Appointment rescheduled', {
            id: payload.appointmentId,
            newStart: payload.data.startTime,
          });
        } catch (err) {
          logger.error('Error in onRescheduled handler', err);
        }
      },

      onReminder: (payload: AppointmentReminderPayload) => {
        try {
          if (!payload?.appointment?.id || typeof payload?.minutesUntilStart !== 'number') {
            logger.warn('Invalid onReminder payload', payload);
            return;
          }

          logger.info('Reminder notification triggered', {
            title: payload.appointment.title,
            minutesUntilStart: payload.minutesUntilStart,
          });
          onReminderNotification?.(payload.appointment, payload.minutesUntilStart);
        } catch (err) {
          logger.error('Error in onReminder handler', err);
        }
      },

      onError: (err: Error) => {
        logger.error('WebSocket error received', err.message);
        setError(err);
      },
    }),
    [onReminderNotification]
  );

  // Inicializar WebSocket
  const { isConnected, subscribeToCalendar, unsubscribeFromCalendar, reconnectAttempts } =
    useAppointmentWebSocket({
      serverUrl,
      tenantId,
      autoConnect: enableWebSocket,
      handlers: websocketHandlers,
    });

  // Cargar datos iniciales al montar el componente
  useEffect(() => {
    if (!dataInitialized) {
      logger.info('Component mounted, fetching initial data');
      fetchInitialAppointments();
    }
  }, []); // Solo ejecutar una vez al montar

  // Auto-suscribirse a calendarios especificados
  useEffect(() => {
    if (isConnected && calendarIds.length > 0) {
      logger.info('Subscribing to calendars', { calendars: calendarIds });
      calendarIds.forEach((calendarId) => {
        subscribeToCalendar(calendarId);
      });
    }

    // Cleanup: desuscribirse al cambiar calendarIds o desconectar
    return () => {
      if (calendarIds.length > 0) {
        logger.info('Unsubscribing from calendars', { calendars: calendarIds });
        calendarIds.forEach((calendarId) => {
          unsubscribeFromCalendar(calendarId);
        });
      }
    };
  }, [isConnected, calendarIds, subscribeToCalendar, unsubscribeFromCalendar]);

  // Operaciones CRUD con validación
  const addAppointment = useCallback((appointment: AppointmentWithClient) => {
    if (!appointment?.id) {
      logger.warn('Cannot add appointment without id', appointment);
      return;
    }

    setAppointments((prev) => {
      const exists = prev.some((apt) => apt.id === appointment.id);
      if (exists) {
        logger.warn('Appointment already exists', { id: appointment.id });
        return prev;
      }
      logger.success('Appointment added manually', { id: appointment.id });
      return [...prev, appointment];
    });
  }, []);

  const updateAppointment = useCallback(
    (appointmentId: string, updates: Partial<AppointmentWithClient>) => {
      if (!appointmentId) {
        logger.warn('Cannot update appointment without id');
        return;
      }

      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId
            ? { ...apt, ...updates, updatedAt: new Date() }
            : apt
        )
      );
      logger.success('Appointment updated manually', { id: appointmentId });
    },
    []
  );

  const removeAppointment = useCallback((appointmentId: string) => {
    if (!appointmentId) {
      logger.warn('Cannot remove appointment without id');
      return;
    }

    setAppointments((prev) => prev.filter((apt) => apt.id !== appointmentId));
    logger.success('Appointment removed manually', { id: appointmentId });
  }, []);

  // Filtros y búsqueda con validación
  const getAppointmentById = useCallback(
    (id: string) => {
      if (!id) return undefined;
      return appointments.find((apt) => apt.id === id);
    },
    [appointments]
  );

  const getAppointmentsByStatus = useCallback(
    (status: AppointmentStatus) => {
      if (!status) return [];
      return appointments.filter((apt) => apt.status === status);
    },
    [appointments]
  );

  const getAppointmentsByCalendar = useCallback(
    (calendarId: string) => {
      if (!calendarId) return [];
      return appointments.filter((apt) => apt.calendarId === calendarId);
    },
    [appointments]
  );

  const getAppointmentsByDate = useCallback(
    (date: Date) => {
      if (!(date instanceof Date) || isNaN(date.getTime())) {
        logger.warn('Invalid date provided', date);
        return [];
      }

      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);

      return appointments.filter((apt) => {
        const aptDate = new Date(apt.startTime);
        return aptDate >= targetDate && aptDate < nextDay;
      });
    },
    [appointments]
  );

  const searchAppointments = useCallback(
    (query: string) => {
      if (!query || typeof query !== 'string') return [];

      const lowerQuery = query.toLowerCase().trim();
      if (lowerQuery.length === 0) return appointments;

      return appointments.filter(
        (apt) =>
          apt.title.toLowerCase().includes(lowerQuery) ||
          apt.client?.name.toLowerCase().includes(lowerQuery) ||
          apt.client?.email.toLowerCase().includes(lowerQuery) ||
          apt.description?.toLowerCase().includes(lowerQuery) ||
          apt.notes?.toLowerCase().includes(lowerQuery)
      );
    },
    [appointments]
  );

  // Estadísticas con validación
  const stats = useMemo(() => {
    const pending = appointments.filter((a) => a.status === 'PENDING').length;
    const confirmed = appointments.filter((a) => a.status === 'CONFIRMED').length;
    const cancelled = appointments.filter((a) => a.status === 'CANCELLED').length;
    const completed = appointments.filter((a) => a.status === 'COMPLETED').length;

    const totalRevenue = appointments
      .filter((a) => a.status === 'CONFIRMED' || a.status === 'COMPLETED')
      .reduce((sum, a) => {
        const price = typeof a.totalPrice === 'number' ? a.totalPrice : 0;
        return sum + price;
      }, 0);

    return {
      total: appointments.length,
      pending,
      confirmed,
      cancelled,
      completed,
      totalRevenue,
    };
  }, [appointments]);

  return {
    appointments,
    isLoading,
    error,
    isConnected,

    // Operaciones CRUD
    addAppointment,
    updateAppointment,
    removeAppointment,

    // Filtros y búsqueda
    getAppointmentById,
    getAppointmentsByStatus,
    getAppointmentsByCalendar,
    getAppointmentsByDate,
    searchAppointments,

    // Estadísticas
    stats,

    // WebSocket
    subscribeToCalendar,
    unsubscribeFromCalendar,
    reconnectAttempts,
  };
}
