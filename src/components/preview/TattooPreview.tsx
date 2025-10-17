"use client"

import { useState, useRef, useEffect } from 'react';
import { useImagePreview } from '@/hooks/useImagePreview';
import { Upload, X, Download, Image, Dice6 } from 'lucide-react';

// Importar Konva desde CDN
const loadKonva = () => {
    return new Promise((resolve, reject) => {
        if (typeof window !== 'undefined' && (window as any).Konva) {
            resolve((window as any).Konva);
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/konva@9/konva.min.js';
        script.onload = () => resolve((window as any).Konva);
        script.onerror = reject;
        document.head.appendChild(script);
    });
};

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
    const [showUploader, setShowUploader] = useState(true);
    const [styles, setStyles] = useState<string[]>([]);
    const [colors, setColors] = useState<string[]>([]);
    const [description, setDescription] = useState('');
    const [isRandomMode, setIsRandomMode] = useState(false);
    const [randomPrompt, setRandomPrompt] = useState('');

    // Estados para el marcador de rectángulo
    const [tattooWidth, setTattooWidth] = useState(100);
    const [tattooHeight, setTattooHeight] = useState(100);

    // Función para calcular el precio estimado
    const calculatePrice = () => {
        const widthCm = tattooWidth / 37.795;
        const heightCm = tattooHeight / 37.795;
        const maxDimension = Math.max(widthCm, heightCm);
        
        if (maxDimension <= 5) {
            return {
                category: "Pequeño",
                description: "líneas simples, símbolos",
                range: "$80 – $200 USD",
                minPrice: 80,
                maxPrice: 200
            };
        } else if (maxDimension <= 15) {
            return {
                category: "Mediano",
                description: "detalles, sombreado, color básico",
                range: "$200 – $500 USD",
                minPrice: 200,
                maxPrice: 500
            };
        } else if (maxDimension <= 50) {
            return {
                category: "Grande",
                description: "realismo, color avanzado, custom",
                range: "$500 – $1,500+ USD",
                minPrice: 500,
                maxPrice: 1500
            };
        } else {
            return {
                category: "Muy Grande",
                description: "sleeve, backpiece, proyecto extenso",
                range: "Desde $1,500+ USD",
                minPrice: 1500,
                maxPrice: null
            };
        }
    };

    const priceEstimate = calculatePrice();

    const containerRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<any>(null);
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

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'body' | 'tattoo') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result;
                if (typeof result === 'string') {
                    if (type === 'body') {
                        setBodyImage(result);
                        setEditedBodyImage(null);
                    } else {
                        setTattooImage(result);
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // Inicializar Konva cuando se abre el editor
    useEffect(() => {
        if (!showEditor || !bodyImage || !containerRef.current) return;

        let mounted = true;

        // Esperar un frame para asegurar que el DOM esté listo
        requestAnimationFrame(() => {
            loadKonva().then((Konva: any) => {
                if (!mounted || !containerRef.current) return;

                // Limpiar stage anterior si existe
                if (stageRef.current) {
                    stageRef.current.destroy();
                    stageRef.current = null;
                }

                const img = new window.Image();
                img.onload = () => {
                    if (!mounted || !containerRef.current) return;

                    // Obtener dimensiones del contenedor
                    const containerWidth = containerRef.current.offsetWidth || 800;
                    const maxHeight = 500;
                    
                    // Calcular escala para que la imagen quepa
                    const scaleX = containerWidth / img.width;
                    const scaleY = maxHeight / img.height;
                    const scale = Math.min(scaleX, scaleY, 1);
                    
                    const scaledWidth = img.width * scale;
                    const scaledHeight = img.height * scale;

                    console.log('Canvas dimensions:', { scaledWidth, scaledHeight, scale });

                    // Crear stage
                    const stage = new Konva.Stage({
                        container: containerRef.current,
                        width: scaledWidth,
                        height: scaledHeight,
                    });

                    stageRef.current = stage;

                    // Capa de imagen
                    const layer = new Konva.Layer();
                    stage.add(layer);

                    // Agregar imagen de fondo
                    const konvaImage = new Konva.Image({
                        image: img,
                        width: scaledWidth,
                        height: scaledHeight,
                    });
                    layer.add(konvaImage);

                    // Grupo para el rectángulo y texto
                    const group = new Konva.Group({
                        x: scaledWidth / 2,
                        y: scaledHeight / 2,
                        draggable: true,
                    });

                    // Rectángulo rojo
                    const rect = new Konva.Rect({
                        x: -tattooWidth * scale / 2,
                        y: -tattooHeight * scale / 2,
                        width: tattooWidth * scale,
                        height: tattooHeight * scale,
                        stroke: 'rgba(255, 0, 0, 0.8)',
                        strokeWidth: 3,
                    });

                    // Marcador central
                    const centerMarker = new Konva.Rect({
                        x: -5,
                        y: -5,
                        width: 10,
                        height: 10,
                        fill: 'rgba(255, 0, 0, 0.6)',
                    });

                    // Texto de tamaño
                    const sizeText = new Konva.Text({
                        x: -50,
                        y: -tattooHeight * scale / 2 - 25,
                        text: `${(tattooWidth / 37.795).toFixed(1)}x${(tattooHeight / 37.795).toFixed(1)}cm`,
                        fontSize: 14,
                        fontStyle: 'bold',
                        fill: 'rgba(255, 0, 0, 0.8)',
                        width: 100,
                        align: 'center',
                    });

                    group.add(rect);
                    group.add(centerMarker);
                    group.add(sizeText);
                    layer.add(group);

                    // Actualizar cuando cambia el tamaño
                    const updateRect = (newWidth: number, newHeight: number) => {
                        rect.x(-newWidth * scale / 2);
                        rect.y(-newHeight * scale / 2);
                        rect.width(newWidth * scale);
                        rect.height(newHeight * scale);
                        sizeText.y(-newHeight * scale / 2 - 25);
                        sizeText.text(`${(newWidth / 37.795).toFixed(1)}x${(newHeight / 37.795).toFixed(1)}cm`);
                        layer.batchDraw();
                    };

                    // Guardar función de actualización y la escala
                    (stage as any).updateRect = updateRect;
                    (stage as any).scale = scale;

                    layer.draw();
                };
                
                img.onerror = () => {
                    console.error('Error loading image');
                };
                
                img.src = bodyImage;
            }).catch(error => {
                console.error('Error loading Konva:', error);
            });
        });

        return () => {
            mounted = false;
            if (stageRef.current) {
                stageRef.current.destroy();
                stageRef.current = null;
            }
        };
    }, [showEditor, bodyImage]);

    // Actualizar rectángulo cuando cambian las dimensiones
    useEffect(() => {
        if (stageRef.current && (stageRef.current as any).updateRect) {
            (stageRef.current as any).updateRect(tattooWidth, tattooHeight);
        }
    }, [tattooWidth, tattooHeight]);

    const saveMarker = () => {
        if (!stageRef.current) return;
        const dataURL = stageRef.current.toDataURL();
        setEditedBodyImage(dataURL);
        setShowEditor(false);
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
            await processImages([cleanBodyImage, cleanTattooImage], styles || [], colors || [], description);

            console.log('📤 Imágenes enviadas al servidor');
        } catch (error) {
            console.error('Error al generar visualización:', error);
            alert('Error al procesar las imágenes. Por favor intenta de nuevo.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 transition-colors">
            <div className="max-w-7xl mx-auto pt-5">
                {/* Banner */}
                <div className={`mb-4 bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all ${showUploader ? 'mb-3' : 'mb-6'}`}>
                    <div className="relative p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
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
                                {showUploader ? 'Ocultar' : 'Comenzar'}
                            </button>
                        </div>
                    </div>
                </div>

                {showUploader && (
                    <>
                        {/* Descripción */}
                        <div className="mb-4">
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Detalles adicionales</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe el tatuaje que quieres... (ej: Un dragón tribal minimalista en el brazo, con tonos azules y negros)"
                                className="w-full px-3 py-2 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
                                rows={3}
                            />
                        </div>

                        {/* Estilos y Colores */}
                        <div className="mb-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Estilos</label>
                                    <input
                                        type="text"
                                        placeholder="Ej: minimalista, geométrico..."
                                        className="w-full px-3 py-2 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                                setStyles([...styles, e.currentTarget.value.trim()]);
                                                e.currentTarget.value = '';
                                            }
                                        }}
                                    />
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {styles.map((style, index) => (
                                            <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full">
                                                {style}
                                                <button
                                                    onClick={() => setStyles(styles.filter((_, i) => i !== index))}
                                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Colores</label>
                                    <input
                                        type="text"
                                        placeholder="Ej: negro, rojo..."
                                        className="w-full px-3 py-2 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                                setColors([...colors, e.currentTarget.value.trim()]);
                                                e.currentTarget.value = '';
                                            }
                                        }}
                                    />
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {colors.map((color, index) => (
                                            <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full">
                                                {color}
                                                <button
                                                    onClick={() => setColors(colors.filter((_, i) => i !== index))}
                                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Grid Principal */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-in fade-in duration-300 min-h-[400px]">
                            {/* Body Image */}
                            <div className="lg:col-span-1 flex flex-col">
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">1. Foto del cuerpo</label>
                                <div className="flex-1 relative">
                                    {(editedBodyImage || bodyImage) ? (
                                        <div className="h-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden flex items-center justify-center">
                                            <img src={editedBodyImage || bodyImage || ''} alt="Body" className="max-w-full max-h-full object-contain" />
                                            <button
                                                onClick={() => {
                                                    setEditedBodyImage(null);
                                                    bodyInputRef.current?.click();
                                                }}
                                                className="absolute top-2 right-2 px-2 py-1 bg-gray-900 text-white text-xs rounded hover:bg-gray-800"
                                            >
                                                Cambiar
                                            </button>
                                            <button
                                                onClick={() => setShowEditor(true)}
                                                className="absolute bottom-2 right-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                            >
                                                Marcar zona
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => bodyInputRef.current?.click()}
                                            className="h-full bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                                        >
                                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                            <p className="text-xs text-gray-500 dark:text-gray-400 text-center px-4">Sube tu foto</p>
                                        </div>
                                    )}
                                    <input
                                        ref={bodyInputRef}
                                        type="file"
                                        onChange={(e) => handleImageUpload(e, 'body')}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                </div>
                            </div>

                            {/* Tattoo Image */}
                            <div className="lg:col-span-1 flex flex-col">
                                <div className="mb-2 flex items-center justify-between">
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">2. Diseño del tatuaje</label>
                                    <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                                        <button
                                            onClick={() => setIsRandomMode(false)}
                                            className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                                                !isRandomMode
                                                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                            }`}
                                        >
                                            <Image className="w-3 h-3" />
                                            Subir
                                        </button>
                                        <button
                                            onClick={() => setIsRandomMode(true)}
                                            className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                                                isRandomMode
                                                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                            }`}
                                        >
                                            <Dice6 className="w-3 h-3" />
                                            Aleatorio
                                        </button>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    {isRandomMode ? (
                                        <div className="h-full flex flex-col gap-3">
                                            <textarea
                                                value={randomPrompt}
                                                onChange={(e) => setRandomPrompt(e.target.value)}
                                                placeholder="Describe cómo quieres que sea el diseño aleatorio..."
                                                className="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
                                            />
                                            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 dark:bg-white/10 dark:hover:bg-white/20 text-white dark:text-gray-200 text-sm font-medium rounded-lg transition-all border border-gray-900 dark:border-white/10 shadow-lg">
                                                <Dice6 className="w-4 h-4" />
                                                Generar Diseño
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="h-full relative">
                                            {tattooImage ? (
                                                <div className="h-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden flex items-center justify-center">
                                                    <img src={tattooImage} alt="Tattoo" className="max-w-full max-h-full object-contain" />
                                                    <button
                                                        onClick={() => tattooInputRef.current?.click()}
                                                        className="absolute top-2 right-2 px-2 py-1 bg-gray-900 text-white text-xs rounded hover:bg-gray-800"
                                                    >
                                                        Cambiar
                                                    </button>
                                                </div>
                                            ) : (
                                                <div
                                                    onClick={() => tattooInputRef.current?.click()}
                                                    className="h-full bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                                                >
                                                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center px-4">Sube tu diseño</p>
                                                </div>
                                            )}
                                            <input
                                                ref={tattooInputRef}
                                                type="file"
                                                onChange={(e) => handleImageUpload(e, 'tattoo')}
                                                className="hidden"
                                                accept="image/*"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Result */}
                            <div className="lg:col-span-1 flex flex-col">
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">5. Resultado</label>
                                <div className="flex-1">
                                    {isProcessing && !displayImage ? (
                                        <div className="h-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center p-6">
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
                                        <div className="h-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
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
                                        <div className="h-full bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 text-center px-4">El resultado aparecerá aquí</p>
                                        </div>
                                    )}
                                </div>
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
                            {((styles && styles.length > 0) || (colors && colors.length > 0)) && (
                                <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 text-center">
                                    Estilos: {(styles || []).join(', ')} | Colores: {(colors || []).join(', ')}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Modal Editor */}
                {showEditor && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
                            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3 flex items-center justify-between">
                                <h3 className="text-sm font-medium">Marcar zona del tatuaje</h3>
                                <button
                                    onClick={() => setShowEditor(false)}
                                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="p-4">
                                {/* Controles */}
                                <div className="mb-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg space-y-4">
                                    <div className="flex items-center gap-4 flex-wrap">
                                        <div className="flex items-center gap-3">
                                            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Ancho:</label>
                                            <input
                                                type="range"
                                                min="20"
                                                max="7559"
                                                value={tattooWidth}
                                                onChange={(e) => setTattooWidth(Number(e.target.value))}
                                                className="w-32"
                                            />
                                            <span className="text-xs font-medium text-gray-900 dark:text-white w-12">{(tattooWidth / 37.795).toFixed(1)}cm</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Alto:</label>
                                            <input
                                                type="range"
                                                min="20"
                                                max="7559"
                                                value={tattooHeight}
                                                onChange={(e) => setTattooHeight(Number(e.target.value))}
                                                className="w-32"
                                            />
                                            <span className="text-xs font-medium text-gray-900 dark:text-white w-12">{(tattooHeight / 37.795).toFixed(1)}cm</span>
                                        </div>
                                    </div>
                                    
                                    {/* Estimación de precio */}
                                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border-2 border-blue-200 dark:border-blue-900">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                                                        {priceEstimate.category}
                                                    </span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        ({priceEstimate.description})
                                                    </span>
                                                </div>
                                                <div className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {priceEstimate.range}
                                                </div>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                    💡 Precio estimado para {(tattooWidth / 37.795).toFixed(1)}x{(tattooHeight / 37.795).toFixed(1)} cm
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        Arrastra el rectángulo rojo para posicionarlo. Ajusta el tamaño con los deslizadores.
                                    </p>
                                </div>

                                {/* Canvas con Konva */}
                                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-2 overflow-auto flex justify-center">
                                    <div 
                                        ref={containerRef} 
                                        className="border border-gray-300 dark:border-gray-600 rounded"
                                        style={{ minWidth: '400px', minHeight: '400px' }}
                                    />
                                </div>

                                {/* Botones */}
                                <div className="mt-4 flex gap-2 justify-end">
                                    <button
                                        onClick={() => setShowEditor(false)}
                                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={saveMarker}
                                        className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded hover:bg-gray-800 dark:hover:bg-gray-200"
                                    >
                                        Guardar marcador
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

export default TattooOverlayGenerator;
