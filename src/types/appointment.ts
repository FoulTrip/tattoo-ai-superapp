/**
 * Tipos TypeScript para el sistema de Appointments
 * Basados en el schema de Prisma
 */

// Enum de status de citas
export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

// Tipo base de usuario/cliente
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
}

// Tipo principal de Appointment
export interface Appointment {
  id: string;
  title: string;
  description: string | null;
  startTime: Date;
  endTime: Date;
  status: AppointmentStatus;
  deposit: number | null;
  totalPrice: number | null;
  notes: string | null;
  designImages: string[];
  tenantId: string;
  calendarId: string;
  clientId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Appointment con relación de cliente incluida
export interface AppointmentWithClient extends Appointment {
  client: Client;
}

// Payload de cambios para eventos de actualización
export interface AppointmentChanges {
  oldValue?: unknown;
  newValue?: unknown;
  field?: string;
}

// Payload de eventos WebSocket
export interface AppointmentEventPayload {
  appointmentId: string;
  tenantId: string;
  calendarId: string;
  clientId: string;
  eventType: string;
  timestamp: Date;
  data: AppointmentWithClient;
  changes?: AppointmentChanges;
}

// Payload de recordatorio
export interface AppointmentReminderPayload {
  appointmentId: string;
  appointment: AppointmentWithClient;
  minutesUntilStart: number;
  timestamp: Date;
}

// Tipos de eventos WebSocket
export type AppointmentEventType =
  | 'appointment:created'
  | 'appointment:updated'
  | 'appointment:deleted'
  | 'appointment:status_changed'
  | 'appointment:rescheduled'
  | 'appointment:reminder';

// Event handlers opcionales
export interface AppointmentEventHandlers {
  onCreated?: (payload: AppointmentEventPayload) => void;
  onUpdated?: (payload: AppointmentEventPayload) => void;
  onDeleted?: (payload: AppointmentEventPayload) => void;
  onStatusChanged?: (payload: AppointmentEventPayload) => void;
  onRescheduled?: (payload: AppointmentEventPayload) => void;
  onReminder?: (payload: AppointmentReminderPayload) => void;
  onError?: (error: Error) => void;
}

// Configuración de WebSocket
export interface WebSocketConfig {
  serverUrl: string;
  tenantId: string;
  reconnection?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
}

// Estado de conexión WebSocket
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';
