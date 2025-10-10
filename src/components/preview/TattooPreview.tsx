"use client"

import UsePreviewTattoo from '@/hooks/UsePreviewTattoo';
import { Upload, Pencil, X, Eraser, Download } from 'lucide-react';
import ImageUploadBox from './ImageUploadBox';

function TattooOverlayGenerator() {
    const {
        bodyInputRef,
        tattooInputRef,
        editedBodyImage,
        handleImageUpload,
        showUploader,
        setShowUploader,
        showEditor,
        bodyImage,
        tattooImage,
        generatedImage,
        generateOverlay,
        setShowEditor,
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
    } = UsePreviewTattoo();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 transition-colors">
            <div className="max-w-7xl mx-auto pt-5">
                {/* Banner mejorado con más detalles */}
                <div className={`mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-xl shadow-lg border border-gray-700/50 dark:border-gray-700 overflow-hidden transition-all ${showUploader ? 'mb-3' : 'mb-6'}`}>
                    {/* Efecto de brillo sutil */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 dark:via-white/3 to-transparent pointer-events-none"></div>

                    <div className="relative p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 dark:bg-emerald-500 animate-pulse"></div>
                                    <span className="text-xs font-medium text-emerald-400 dark:text-emerald-500 uppercase tracking-wider">
                                        Powered by AI
                                    </span>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white dark:text-gray-100 mb-2 tracking-tight">
                                    Previsualiza tu tatuaje
                                </h1>
                                <p className="text-gray-300 dark:text-gray-400 text-xs max-w-2xl leading-relaxed">
                                    IA que muestra cómo lucirá tu diseño en tu piel antes de tatuarte.
                                    <span className="text-gray-400 dark:text-gray-500"> Sube tu foto, marca la zona y visualiza el resultado.</span>
                                </p>
                            </div>
                            <button
                                onClick={() => setShowUploader(!showUploader)}
                                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10 backdrop-blur-sm text-white dark:text-gray-200 text-sm font-medium rounded-lg transition-all whitespace-nowrap border border-white/10 dark:border-white/5 hover:border-white/20 dark:hover:border-white/10 shadow-lg"
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
                                {generatedImage ? (
                                    <div className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden aspect-square">
                                        <div className="relative h-full">
                                            <img src={generatedImage} alt="Result" className="w-full h-full object-contain" />
                                            <a
                                                href={generatedImage}
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
                                disabled={!bodyImage || !tattooImage}
                                className="px-8 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Generar Visualización
                            </button>
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