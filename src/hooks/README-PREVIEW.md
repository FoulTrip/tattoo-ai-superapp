# Hooks de Preview WebSocket - Guía de Uso

Este documento describe cómo usar los hooks personalizados para manejar el procesamiento de imágenes en tiempo real con WebSocket.

## Tabla de Contenidos

1. [Instalación](#instalación)
2. [usePreviewWebSocket](#usepreviewwebsocket)
3. [useImagePreview](#useimagepreview)
4. [Ejemplos de Uso](#ejemplos-de-uso)
5. [Tipos TypeScript](#tipos-typescript)

## Instalación

Asegúrate de tener instalado `socket.io-client`:

```bash
npm install socket.io-client
```

## usePreviewWebSocket

Hook de bajo nivel para manejar la conexión WebSocket directamente con el módulo de Preview.

### Opciones

```typescript
interface UsePreviewWebSocketOptions {
  serverUrl: string;              // URL del servidor WebSocket
  token: string;                  // JWT token para autenticación
  autoConnect?: boolean;          // Conectar automáticamente (default: true)
  reconnection?: boolean;         // Reconectar automáticamente (default: true)
  reconnectionAttempts?: number;  // Intentos de reconexión (default: 5)
  reconnectionDelay?: number;     // Delay entre intentos (default: 1000ms)
  handlers?: {                    // Handlers para eventos
    onConnected?: (event) => void;
    onProcessingStarted?: (event) => void;
    onProcessingProgress?: (event) => void;
    onProcessingCompleted?: (event) => void;
    onProcessingError?: (event) => void;
    onPong?: (event) => void;
    onError?: (event) => void;
    onDisconnect?: (reason) => void;
  };
}
```

### Retorno

```typescript
{
  socket: Socket | null;              // Instancia del socket
  status: PreviewConnectionStatus;    // Estado de conexión
  isConnected: boolean;               // Si está conectado
  userId: string | null;              // ID del usuario conectado
  socketId: string | null;            // ID del socket
  processImages: (files: string[]) => void; // Enviar imágenes para procesar
  ping: () => void;                   // Enviar ping
  connect: () => void;                // Conectar manualmente
  disconnect: () => void;             // Desconectar
  error: Error | null;                // Error actual
}
```

### Ejemplo Básico

```typescript
'use client';

import { usePreviewWebSocket } from '@/hooks/usePreviewWebSocket';
import { useSession } from 'next-auth/react';

export default function PreviewComponent() {
  const { data: session } = useSession();

  const { isConnected, processImages, userId } = usePreviewWebSocket({
    serverUrl: 'http://localhost:3000',
    token: session?.user?.token || '',
    handlers: {
      onConnected: (event) => {
        console.log('Connected as:', event.userId);
      },
      onProcessingCompleted: (event) => {
        console.log('Processing completed:', event.data);
      },
    },
  });

  const handleProcess = () => {
    const base64Images = ['base64_image_1', 'base64_image_2'];
    processImages(base64Images);
  };

  return (
    <div>
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      <p>User ID: {userId}</p>
      <button onClick={handleProcess}>Process Images</button>
    </div>
  );
}
```

## useImagePreview

Hook de alto nivel que combina WebSocket con gestión de estado de procesamiento de imágenes.

### Opciones

```typescript
interface UseImagePreviewOptions {
  token: string;                      // JWT token (requerido)
  serverUrl?: string;                 // URL del servidor
  enableWebSocket?: boolean;          // Habilitar WebSocket (default: true)
  onComplete?: (result) => void;      // Callback cuando se completa
  onError?: (error: string) => void;  // Callback cuando hay error
}
```

### Retorno

```typescript
{
  // Estado
  jobs: ProcessingJob[];              // Historial de jobs
  currentJob: ProcessingJob | null;   // Job actual en proceso
  isConnected: boolean;               // Estado WebSocket
  isProcessing: boolean;              // Si hay un job procesándose
  error: Error | null;                // Error actual

  // Operaciones
  processImages: (files: string[]) => Promise<void>;
  cancelJob: (jobId: string) => void;
  clearHistory: () => void;
  getJobById: (jobId: string) => ProcessingJob | undefined;

  // Utilidades
  convertFileToBase64: (file: File) => Promise<string>;
  convertFilesToBase64: (files: File[]) => Promise<string[]>;

  // Estadísticas
  stats: {
    totalJobs: number;
    completedJobs: number;
    failedJobs: number;
    averageProcessingTime: number;
    successRate: number;
  };

  // WebSocket
  ping: () => void;
  userId: string | null;
  socketId: string | null;
}
```

## Ejemplos de Uso

### Ejemplo 1: Procesamiento Básico de Imágenes

```typescript
'use client';

import { useState } from 'react';
import { useImagePreview } from '@/hooks/useImagePreview';
import { useSession } from 'next-auth/react';

export default function ImageProcessor() {
  const { data: session } = useSession();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const {
    processImages,
    convertFilesToBase64,
    currentJob,
    isProcessing,
    isConnected,
  } = useImagePreview({
    token: session?.user?.token || '',
    onComplete: (result) => {
      alert('Processing completed!');
      console.log('Result:', result);
    },
    onError: (error) => {
      alert(`Error: ${error}`);
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 2) {
      setSelectedFiles(files);
    } else {
      alert('Please select exactly 2 images');
    }
  };

  const handleProcess = async () => {
    if (selectedFiles.length !== 2) {
      alert('Please select exactly 2 images');
      return;
    }

    try {
      const base64Images = await convertFilesToBase64(selectedFiles);
      await processImages(base64Images);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>Image Preview Processor</h1>
      <p>Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</p>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        disabled={isProcessing}
      />

      <button onClick={handleProcess} disabled={isProcessing || !isConnected}>
        {isProcessing ? 'Processing...' : 'Process Images'}
      </button>

      {currentJob && (
        <div>
          <h3>Current Job</h3>
          <p>Status: {currentJob.status}</p>
          <p>Progress: {currentJob.progress}%</p>
          {currentJob.message && <p>Message: {currentJob.message}</p>}
        </div>
      )}
    </div>
  );
}
```

### Ejemplo 2: Con Barra de Progreso

```typescript
'use client';

import { useImagePreview } from '@/hooks/useImagePreview';
import { useSession } from 'next-auth/react';

export default function ImageProcessorWithProgress() {
  const { data: session } = useSession();

  const { processImages, currentJob, isProcessing, convertFilesToBase64 } =
    useImagePreview({
      token: session?.user?.token || '',
    });

  const handleFileDrop = async (files: File[]) => {
    if (files.length !== 2) return;

    const base64Images = await convertFilesToBase64(files);
    await processImages(base64Images);
  };

  return (
    <div>
      <h2>Upload Images</h2>

      {isProcessing && currentJob && (
        <div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${currentJob.progress}%` }}
            />
          </div>
          <p>{currentJob.progress}% - {currentJob.message || 'Processing...'}</p>
        </div>
      )}

      {/* Drag & drop zone */}
      <div
        onDrop={(e) => {
          e.preventDefault();
          const files = Array.from(e.dataTransfer.files);
          handleFileDrop(files);
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        Drop 2 images here
      </div>
    </div>
  );
}
```

### Ejemplo 3: Historial de Jobs

```typescript
'use client';

import { useImagePreview } from '@/hooks/useImagePreview';
import { useSession } from 'next-auth/react';

export default function ProcessingHistory() {
  const { data: session } = useSession();

  const { jobs, stats, clearHistory, getJobById } = useImagePreview({
    token: session?.user?.token || '',
  });

  return (
    <div>
      <div>
        <h3>Statistics</h3>
        <p>Total Jobs: {stats.totalJobs}</p>
        <p>Completed: {stats.completedJobs}</p>
        <p>Failed: {stats.failedJobs}</p>
        <p>Success Rate: {stats.successRate.toFixed(2)}%</p>
        <p>
          Avg Processing Time: {(stats.averageProcessingTime / 1000).toFixed(2)}s
        </p>
      </div>

      <button onClick={clearHistory}>Clear History</button>

      <div>
        <h3>Job History</h3>
        {jobs.map((job) => (
          <div key={job.jobId}>
            <h4>Job {job.jobId}</h4>
            <p>Status: {job.status}</p>
            <p>Progress: {job.progress}%</p>
            <p>Started: {job.startedAt.toLocaleString()}</p>
            {job.completedAt && (
              <p>Completed: {job.completedAt.toLocaleString()}</p>
            )}
            {job.error && <p style={{ color: 'red' }}>Error: {job.error}</p>}
            {job.result && (
              <div>
                {job.result.imageUrl && (
                  <img src={job.result.imageUrl} alt="Result" />
                )}
                {job.result.base64Image && (
                  <img
                    src={`data:image/png;base64,${job.result.base64Image}`}
                    alt="Result"
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Ejemplo 4: Componente Completo con UI

```typescript
'use client';

import { useState } from 'react';
import { useImagePreview } from '@/hooks/useImagePreview';
import { useSession } from 'next-auth/react';

export default function CompleteImageProcessor() {
  const { data: session } = useSession();
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const {
    processImages,
    convertFilesToBase64,
    currentJob,
    isProcessing,
    isConnected,
    jobs,
    stats,
    clearHistory,
  } = useImagePreview({
    token: session?.user?.token || '',
    onComplete: (result) => {
      console.log('Processing completed:', result);
      // Mostrar resultado
      if (result.imageUrl) {
        window.open(result.imageUrl, '_blank');
      }
    },
    onError: (error) => {
      alert(`Error: ${error}`);
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length !== 2) {
      alert('Please select exactly 2 images');
      return;
    }

    setFiles(selectedFiles);

    // Crear previews
    const urls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleProcess = async () => {
    if (files.length !== 2) return;

    try {
      const base64Images = await convertFilesToBase64(files);
      await processImages(base64Images);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleClear = () => {
    setFiles([]);
    setPreviewUrls([]);
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
  };

  return (
    <div className="container">
      <header>
        <h1>Image Preview Processor</h1>
        <div className="status">
          Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
      </header>

      <div className="upload-section">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          disabled={isProcessing}
        />

        {previewUrls.length === 2 && (
          <div className="preview-grid">
            {previewUrls.map((url, idx) => (
              <img key={idx} src={url} alt={`Preview ${idx + 1}`} />
            ))}
          </div>
        )}

        <div className="actions">
          <button
            onClick={handleProcess}
            disabled={files.length !== 2 || isProcessing || !isConnected}
          >
            {isProcessing ? 'Processing...' : 'Process Images'}
          </button>
          <button onClick={handleClear} disabled={isProcessing}>
            Clear
          </button>
        </div>
      </div>

      {currentJob && (
        <div className="current-job">
          <h3>Current Job: {currentJob.jobId}</h3>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${currentJob.progress}%` }}
            />
          </div>
          <p>{currentJob.progress}% - {currentJob.message || 'Processing...'}</p>
          <p>Status: {currentJob.status}</p>
        </div>
      )}

      <div className="stats">
        <h3>Statistics</h3>
        <div className="stats-grid">
          <div>Total: {stats.totalJobs}</div>
          <div>Completed: {stats.completedJobs}</div>
          <div>Failed: {stats.failedJobs}</div>
          <div>Success Rate: {stats.successRate.toFixed(1)}%</div>
        </div>
        <button onClick={clearHistory}>Clear History</button>
      </div>

      <div className="history">
        <h3>Recent Jobs</h3>
        {jobs.slice(-5).reverse().map((job) => (
          <div key={job.jobId} className="job-item">
            <span>{job.jobId}</span>
            <span>{job.status}</span>
            <span>{job.progress}%</span>
            {job.result?.imageUrl && (
              <a href={job.result.imageUrl} target="_blank" rel="noopener noreferrer">
                View Result
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Ejemplo 5: Con Next-Auth Integration

```typescript
'use client';

import { useImagePreview } from '@/hooks/useImagePreview';
import { useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';

export default function AuthenticatedPreview() {
  const { data: session, status } = useSession();

  const {
    processImages,
    isConnected,
    userId,
  } = useImagePreview({
    token: session?.user?.token || '',
    enableWebSocket: status === 'authenticated',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn();
    }
  }, [status]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return <div>Please sign in...</div>;
  }

  return (
    <div>
      <h1>Welcome, {session?.user?.name}</h1>
      <p>User ID: {userId}</p>
      <p>WebSocket: {isConnected ? 'Connected' : 'Connecting...'}</p>
      {/* Rest of your component */}
    </div>
  );
}
```

## Tipos TypeScript

Todos los tipos están disponibles en `@/types/preview.ts`:

```typescript
import type {
  ProcessingJob,
  ProcessingStatus,
  ProcessingResult,
  ProcessingStats,
  ProcessingStartedEvent,
  ProcessingProgressEvent,
  ProcessingCompletedEvent,
  ProcessingErrorEvent,
} from '@/types/preview';
```

## Variables de Entorno

Agrega en tu `.env.local`:

```env
NEXT_PUBLIC_WS_URL=http://localhost:3000
```

## Notas Importantes

1. **Autenticación**: El módulo Preview requiere un JWT token válido para la conexión WebSocket.

2. **2 Imágenes Requeridas**: El sistema siempre requiere exactamente 2 imágenes para procesar.

3. **Base64**: Las imágenes deben ser convertidas a base64 antes de enviarlas. El hook proporciona utilidades para esto.

4. **Next.js**: Todos los componentes que usen estos hooks deben tener `'use client'` en la parte superior.

5. **Limpieza de URLs**: Si usas `URL.createObjectURL` para previews, recuerda limpiarlos con `URL.revokeObjectURL`.

6. **Historial**: El hook mantiene un historial de todos los jobs procesados durante la sesión. Usa `clearHistory()` para limpiarlo.

## Soporte

Si encuentras problemas o tienes preguntas, consulta la documentación del backend o contacta al equipo de desarrollo.
