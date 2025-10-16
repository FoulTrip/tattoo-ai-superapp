"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useImagePreview } from "./useImagePreview";

function UsePreviewTattoo() {
    const { data: session } = useSession();
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

    // Integración con WebSocket para procesamiento de imágenes
    const {
        processImages,
        convertFileToBase64,
        currentJob,
        isProcessing,
        isConnected,
        error: wsError,
    } = useImagePreview({
        token: (session?.user as any)?.token || (session as any)?.accessToken || '',
        enableWebSocket: !!((session?.user as any)?.token) || !!((session as any)?.accessToken),
        onComplete: (result) => {
            console.log('Processing completed:', result);
        },
        onError: (error) => {
            console.error('❌ Processing error:', error);
            alert(`Error al procesar las imágenes: ${error}`);
        },
    });

    // Estado derivado del job actual - la imagen generada viene del resultado del job
    const generatedImage = currentJob?.status === 'completed' && currentJob?.result
        ? (currentJob.result.imageUrl ||
           (currentJob.result.base64Image
             ? `data:image/png;base64,${currentJob.result.base64Image}`
             : null))
        : null;

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

            // Extraer el base64 limpio (sin el prefijo data:image/...)
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

    return {
        bodyInputRef,
        tattooInputRef,
        editedBodyImage,
        handleImageUpload,
        showUploader,
        setShowUploader,
        showEditor,
        setShowEditor,
        bodyImage,
        tattooImage,
        generatedImage,
        generateOverlay,
        setIsErasing,
        isErasing,
        brushSize,
        setBrushSize,
        clearCanvas,
        canvasRef,
        startDrawing,
        draw,
        stopDrawing,
        setEditedBodyImage,
        // Nuevos retornos de WebSocket
        isProcessing,
        isConnected,
        currentJob,
        wsError,
    }
}

export default UsePreviewTattoo