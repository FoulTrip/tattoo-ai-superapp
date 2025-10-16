/**
 * WebSocket Module Exports
 * Punto central de exportación para todos los managers WebSocket
 */

export { useBaseWebSocket } from './baseWebSocket';
export type { BaseWebSocketConfig, BaseWebSocketReturn, ConnectionStatus } from './baseWebSocket';

export { useAppointmentWebSocket } from './appointmentWebSocket';
export type { AppointmentWebSocketConfig, AppointmentWebSocketReturn } from './appointmentWebSocket';

export { usePreviewWebSocket } from './previewWebSocket';
export type { PreviewWebSocketConfig, PreviewWebSocketReturn } from './previewWebSocket';