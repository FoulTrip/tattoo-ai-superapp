"use client"

import { useState, useRef, useEffect } from 'react';
import { useImagePreview } from '@/hooks/useImagePreview';
import { Upload, Pencil, X, Eraser, Download } from 'lucide-react';
import ImageUploadBox from './ImageUploadBox';

function TattooOverlayGenerator() {
    const {
        processImages,
        currentJob,
        isProcessing,
        isConnected,
        error: wsError,
        jobs,
    } = useImagePreview({
        token: '',
        enableWebSocket: true,
        onComplete: (result) => {
            console.log('✅ Processing completed:', result);
            console.log('   Result keys:', Object.keys(result));
            console.log('   Result result_url:', result.result_url);
            console.log('   Generated image URL:', result.result_url);
            // Force re-render by updating a state
            setBodyImage(bodyImage);
        },
        onError: (error) => {
            console.error('❌ Processing error:', error);
        },
    });

    // Estados locales para el componente
    const [bodyImage, setBodyImage] = useState<string | null>(null);
    const [tattooImage, setTattooImage] = useState<string | null>(null);
    const [editedBodyImage, setEditedBodyImage] = useState<string | null>(null);
    const [showEditor, setShowEditor] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [brushSize, setBrushSize] = useState(20);
    const [isErasing, setIsErasing] = useState(false);
    const [showUploader, setShowUploader] = useState(true);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const bodyInputRef = useRef<HTMLInputElement>(null);
    const tattooInputRef = useRef<HTMLInputElement>(null);

    // Buscar cualquier job completado con resultado
    const completedJob = jobs.find(job => job.status === 'completed' && job.result);
    const displayImage = completedJob?.result
        ? (completedJob.result.imageUrl ||
            (completedJob.result.base64Image
              ? `data:image/png;base64,${completedJob.result.base64Image}`
              : null) ||
            (typeof completedJob.result.result_url === 'string'
              ? completedJob.result.result_url
              : null))
        : null;

    // Debug logs - remove after fixing
    console.log('🔍 All jobs:', jobs);
    console.log('🔍 Current job status:', currentJob?.status);
    console.log('🔍 Current job result:', currentJob?.result);
    console.log('🔍 Display image:', displayImage);
    console.log('🔍 Is processing:', isProcessing);

    useEffect(() => {
        if (showEditor && bodyImage && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                if (editedBodyImage) {
                    const editedImg = new Image();
                    editedImg.onload = () => ctx.drawImage(editedImg, 0, 0);
                    editedImg.src = editedBodyImage;
                }
            };
            img.src = bodyImage;
        }
    }, [showEditor, bodyImage, editedBodyImage]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'body' | 'tattoo') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
                const result = event.target?.result as string;
                if (type === 'body') {
                    setBodyImage(result);
                    setEditedBodyImage(null);
                } else {
                    setTattooImage(result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        setIsDrawing(true);
        draw(e);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        if (canvasRef.current) setEditedBodyImage(canvasRef.current.toDataURL());
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing && e.type !== 'mousedown' && e.type !== 'touchstart') return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = ('touches' in e ? e.touches[0].clientX : e.clientX - rect.left) * (canvas.width / rect.width);
        const y = ('touches' in e ? e.touches[0].clientY : e.clientY - rect.top) * (canvas.height / rect.height);

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = brushSize;
        ctx.globalCompositeOperation = isErasing ? 'destination-out' : 'source-over';

        if (!isErasing) {
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        }

        ctx.beginPath();
        ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
        ctx.fill();
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas || !bodyImage) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
        img.src = bodyImage;
        setEditedBodyImage(null);
    };

    const generateOverlay = async () => {
        if (!bodyImage || !tattooImage) {
            alert('Por favor, sube ambas imágenes primero');
            return;
        }

        if (!isConnected) {
            alert('No hay conexión con el servidor. Intenta de nuevo en un momento.');
            return;
        }

        try {
            console.log('🚀 Iniciando procesamiento de imágenes...');

            // Usar la imagen editada si existe, sino la original
            const bodyImageToUse = editedBodyImage || bodyImage;

            // Extraer el base64 limpio (sin el prefijo data:image/...base64,)
            const cleanBodyImage = bodyImageToUse.includes(',')
                ? bodyImageToUse.split(',')[1]
                : bodyImageToUse;

            const cleanTattooImage = tattooImage.includes(',')
                ? tattooImage.split(',')[1]
                : tattooImage;

            // Enviar a procesar
            await processImages([cleanBodyImage, cleanTattooImage]);

            console.log('📤 Imágenes enviadas al servidor');
        } catch (error) {
            console.error('Error al generar visualización:', error);
            alert('Error al procesar las imágenes. Por favor intenta de nuevo.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 transition-colors">
            <div className="max-w-7xl mx-auto pt-5">
                {/* Banner mejorado con más detalles */}
                <div className={`mb-4 bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all ${showUploader ? 'mb-3' : 'mb-6'}`}>
                    {/* Efecto de brillo sutil */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/30 dark:via-white/3 to-transparent pointer-events-none"></div>

                    <div className="relative p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-gray-400 dark:bg-gray-600'} ${isConnected ? 'animate-pulse' : ''}`}></div>
                                    <span className={`text-xs font-medium uppercase tracking-wider ${isConnected ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-500'}`}>
                                        {isConnected ? 'Powered by AI' : 'Conectando...'}
                                    </span>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">
                                    Previsualiza tu tatuaje
                                </h1>
                                <p className="text-gray-600 dark:text-gray-300 text-xs max-w-2xl leading-relaxed">
                                    IA que muestra cómo lucirá tu diseño en tu piel antes de tatuarte.
                                    <span className="text-gray-500 dark:text-gray-400"> Sube tu foto, marca la zona y visualiza el resultado.</span>
                                </p>
                                {wsError && (
                                    <div className="mt-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-md inline-block">
                                        ⚠️ {wsError.message}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setShowUploader(!showUploader)}
                                className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur-sm text-white dark:text-gray-200 text-sm font-medium rounded-lg transition-all whitespace-nowrap border border-gray-900 dark:border-white/10 hover:border-gray-700 dark:hover:border-white/20 shadow-lg"
                            >
                                {showUploader ? (
                                    <span className="flex items-center gap-2">
                                        Ocultar
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Comenzar
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {showUploader && (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-in fade-in duration-300">
                            {/* Column 1: Body Image */}
                            <div className="lg:col-span-1">
                                <ImageUploadBox
                                    image={bodyImage}
                                    type="body"
                                    label="1. Foto del cuerpo"
                                    bodyInputRef={bodyInputRef}
                                    tattooInputRef={tattooInputRef}
                                    editedBodyImage={editedBodyImage}
                                    setShowEditor={setShowEditor}
                                    handleImageUpload={handleImageUpload}
                                />
                            </div>

                            {/* Column 2: Tattoo Image */}
                            <div className="lg:col-span-1">
                                <ImageUploadBox
                                    image={tattooImage}
                                    type="tattoo"
                                    label="2. Diseño del tatuaje"
                                    bodyInputRef={bodyInputRef}
                                    tattooInputRef={tattooInputRef}
                                    editedBodyImage={editedBodyImage}
                                    setShowEditor={setShowEditor}
                                    handleImageUpload={handleImageUpload}
                                />
                            </div>

                            {/* Column 3: Result */}
                            <div className="lg:col-span-1">
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">3. Resultado</label>
                                {isProcessing && !displayImage ? (
                                    <div className="aspect-square bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center p-6">
                                        <div className="w-full max-w-xs">
                                            {/* Spinner animado */}
                                            <div className="flex justify-center mb-4">
                                                <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-gray-900 dark:border-t-white rounded-full animate-spin"></div>
                                            </div>

                                            {/* Barra de progreso */}
                                            {currentJob && currentJob.progress > 0 && (
                                                <div className="mb-3">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-xs text-gray-600 dark:text-gray-400">Procesando</span>
                                                        <span className="text-xs font-medium text-gray-900 dark:text-white">{currentJob.progress}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                                        <div
                                                            className="bg-gray-900 dark:bg-white h-full transition-all duration-300 ease-out"
                                                            style={{ width: `${currentJob.progress}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Mensaje de estado */}
                                            <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                                                {currentJob?.message || 'Procesando tu visualización...'}
                                            </p>
                                        </div>
                                    </div>
                                ) : displayImage ? (
                                    <div className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden aspect-square">
                                        <div className="relative h-full">
                                            <img src={displayImage} alt="Result" className="w-full h-full object-contain" />
                                            <a
                                                href={displayImage}
                                                download="tattoo-visualization.png"
                                                className="absolute top-2 right-2 flex items-center gap-1 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg hover:bg-gray-800"
                                            >
                                                <Download className="w-3 h-3" />
                                                Descargar
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="aspect-square bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center px-4">El resultado aparecerá aquí</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-4 grid place-content-center">
                            <button
                                onClick={generateOverlay}
                                disabled={!bodyImage || !tattooImage || isProcessing || !isConnected}
                                className="px-8 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Procesando...</span>
                                    </>
                                ) : (
                                    <span>Generar Visualización</span>
                                )}
                            </button>
                            {!isConnected && (
                                <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 text-center">
                                    ⚠️ Esperando conexión con el servidor...
                                </p>
                            )}
                        </div>
                    </>
                )}

                {showEditor && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
                            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3 flex items-center justify-between">
                                <h3 className="text-sm font-medium">Marcar zona del tatuaje</h3>
                                <button onClick={() => setShowEditor(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="p-4">
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <button
                                        onClick={() => setIsErasing(false)}
                                        className={`px-3 py-1 rounded text-xs font-medium ${!isErasing ? 'bg-gray-900 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                                    >
                                        <Pencil className="w-3 h-3 inline mr-1" />Dibujar
                                    </button>
                                    <button
                                        onClick={() => setIsErasing(true)}
                                        className={`px-3 py-1 rounded text-xs font-medium ${isErasing ? 'bg-gray-900 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                                    >
                                        <Eraser className="w-3 h-3 inline mr-1" />Borrar
                                    </button>
                                    <div className="flex items-center gap-2 ml-auto">
                                        <label className="text-xs">Tamaño:</label>
                                        <input type="range" min="10" max="50" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="w-20" />
                                        <span className="text-xs w-6">{brushSize}</span>
                                    </div>
                                    <button onClick={clearCanvas} className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs rounded hover:bg-red-100 dark:hover:bg-red-900/30">
                                        Limpiar
                                    </button>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-900 rounded p-2 overflow-auto">
                                    <canvas
                                        ref={canvasRef}
                                        onMouseDown={startDrawing}
                                        onMouseMove={draw}
                                        onMouseUp={stopDrawing}
                                        onMouseLeave={stopDrawing}
                                        onTouchStart={startDrawing}
                                        onTouchMove={draw}
                                        onTouchEnd={stopDrawing}
                                        className="max-w-full cursor-crosshair"
                                        style={{ touchAction: 'none' }}
                                    />
                                </div>

                                <div className="mt-3 flex gap-2 justify-end">
                                    <button onClick={() => setShowEditor(false)} className="px-4 py-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs rounded hover:bg-gray-200 dark:hover:bg-gray-600">
                                        Cancelar
                                    </button>
                                    <button onClick={() => { setEditedBodyImage(canvasRef.current?.toDataURL() || null); setShowEditor(false); }} className="px-4 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded hover:bg-gray-800 dark:hover:bg-gray-200">
                                        Guardar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TattooOverlayGenerator