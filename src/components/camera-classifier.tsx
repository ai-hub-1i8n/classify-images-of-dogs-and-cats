"use client"

import { useEffect, useRef, useState } from "react"
import * as tf from '@tensorflow/tfjs'

const CANVAS_SIZE = 300

export default function CameraClassifier() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const [model, setModel] = useState<tf.LayersModel | null>(null);
    const [prediction, setPrediction] = useState('');
    const [facingMode, setFacingMode] = useState('user');
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [loading, setLoading] = useState(true);

    const CANVAS_SIZE = 600

    const startCamera = async () => {
        try {
            const constraints = {
                audio: false,
                video: {
                    facingMode: facingMode,
                    width: CANVAS_SIZE,
                    height: CANVAS_SIZE
                }
            };

            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                setStream(mediaStream);

                // Esperar a que el video esté listo
                videoRef.current.onloadedmetadata = () => {
                    processCamera();
                    // predict();
                };
            }
        } catch (error) {
            console.error("Error accediendo a la cámara:", error);
            alert("No se pudo acceder a la cámara");
        }
    };

    const processCamera = () => {
        if (canvasRef.current && videoRef.current) {
            const ctx = canvasRef.current.getContext('2d') as CanvasRenderingContext2D;
            ctx.drawImage(videoRef.current, 0, 0, CANVAS_SIZE, CANVAS_SIZE, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
            setTimeout(processCamera, 20);
        }
    };

    const resampleCanvas = (sourceCanvas: HTMLCanvasElement, width: number, height: number, targetCanvas: HTMLCanvasElement) => {
        const sourceCtx = sourceCanvas.getContext('2d') as CanvasRenderingContext2D;
        const targetCtx = targetCanvas.getContext('2d') as CanvasRenderingContext2D;

        // Redimensionar usando drawImage (más simple que el algoritmo Hermite)
        targetCtx.drawImage(sourceCanvas, 0, 0, sourceCanvas.width, sourceCanvas.height, 0, 0, width, height);
    };

    const changeCamera = async () => {
        // Detener el stream actual
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }

        // Cambiar el modo de la cámara
        const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
        setFacingMode(newFacingMode);

        try {
            const constraints = {
                audio: false,
                video: {
                    facingMode: newFacingMode,
                    width: CANVAS_SIZE,
                    height: CANVAS_SIZE
                }
            };

            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                setStream(mediaStream);
            }
        } catch (error) {
            console.error("Error cambiando cámara:", error);
        }
    };

    useEffect(() => {
        const loadModel = async () => {
            try {
                console.log("Cargando modelo...");
                const loadedModel = await tf.loadLayersModel(`/model.json`) as tf.LayersModel;
                setModel(loadedModel);
                console.log("Modelo cargado");
                setLoading(false);
            } catch (error) {
                console.error("Error cargando el modelo:", error);
                setLoading(false);
            }
        };

        loadModel();
    }, []);

    useEffect(() => {
        console.log(loading, model);

        if (!loading && model) {
            startCamera();
        }

        return () => {
            if (stream) {
                console.log("Stopping video stream");
            }
        };
    }, [loading, model]);

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header mejorado */}
            <div className="px-4 py-8 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">🐕 Perros y Gatos 🐱</h1>
                    <div className="max-w-2xl mx-auto">
                        <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                            Clasificación inteligente de imágenes usando tu cámara web con
                            <span className="font-semibold text-indigo-600"> TensorFlow.js</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Contenido principal mejorado */}
            <div className="container mx-auto px-4 pb-12">
                <div className="flex justify-center">
                    <div className="w-full max-w-md lg:max-w-lg">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-lg">
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent mb-4"></div>
                                <p className="text-gray-600 font-medium">Cargando modelo...</p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
                                {/* Video oculto */}
                                <video ref={videoRef} autoPlay playsInline style={{ width: '1px', height: '1px' }} />

                                {/* Botón de cambiar cámara */}
                                <div className="flex justify-center">
                                    <button
                                        onClick={changeCamera}
                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                            />
                                        </svg>
                                        Cambiar cámara
                                    </button>
                                </div>

                                {/* Canvas principal con marco mejorado */}
                                <div className="relative">
                                    <div className="bg-gray-100 rounded-xl p-4 border-2 border-dashed border-gray-300">
                                        <canvas
                                            ref={canvasRef}
                                            width={CANVAS_SIZE}
                                            height={CANVAS_SIZE}
                                            className="w-full h-auto max-w-full rounded-lg shadow-inner bg-black"
                                        />
                                    </div>

                                    {/* Overlay de esquinas para efecto de cámara */}
                                    <div className="absolute inset-4 pointer-events-none">
                                        <div className="relative w-full h-full">
                                            {/* Esquina superior izquierda */}
                                            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white opacity-80"></div>
                                            {/* Esquina superior derecha */}
                                            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white opacity-80"></div>
                                            {/* Esquina inferior izquierda */}
                                            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white opacity-80"></div>
                                            {/* Esquina inferior derecha */}
                                            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white opacity-80"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Canvas oculto */}
                                <canvas ref={hiddenCanvasRef} width={150} height={150} className="hidden" />

                                {/* Resultado de la predicción mejorado */}
                                <div className="text-center py-6">
                                    {prediction ? (
                                        <div className="space-y-3">
                                            <div className="text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
                                                {prediction}
                                            </div>
                                            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                                                Detectado
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-gray-400 text-lg font-medium py-8">Apunta la cámara hacia un perro o gato</div>
                                    )}
                                </div>

                                {/* Indicadores de estado */}
                                <div className="flex justify-center space-x-4 text-sm text-gray-500">
                                    {loading && (
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                            Cámara activa
                                        </div>
                                    )}
                                    {model && (
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                                            IA lista
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Información adicional para móviles */}
            <div className="px-4 pb-8 md:hidden">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-md mx-auto">
                    <div className="flex items-start">
                        <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <div>
                            <p className="text-sm text-amber-800 font-medium">Consejo para móviles</p>
                            <p className="text-sm text-amber-700 mt-1">
                                Mantén el dispositivo estable y asegúrate de tener buena iluminación para mejores resultados.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
