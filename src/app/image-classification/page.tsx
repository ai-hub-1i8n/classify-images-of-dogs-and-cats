"use client"
import React, { useEffect, useRef, useState } from 'react'
import * as tf from '@tensorflow/tfjs'
import { PredictionDisplay } from '@/components/PredictionDisplay';


function ImageClassificationPage() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const [model, setModel] = useState<tf.LayersModel | null>(null);
    const [prediction, setPrediction] = useState<string>('');
    const [facingMode, setFacingMode] = useState('user');
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [loading, setLoading] = useState(true);
    const [confidence, setConfidence] = useState<number | null>(null);

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
                    predict();
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

    const predict = async () => {
        if (model && canvasRef.current && hiddenCanvasRef.current) {
            try {
                // Redimensionar a 100x100 para el modelo
                resampleCanvas(canvasRef.current, 100, 100, hiddenCanvasRef.current);

                // Obtener datos de imagen
                const ctx = hiddenCanvasRef.current.getContext('2d') as CanvasRenderingContext2D;
                const imageData = ctx.getImageData(0, 0, 100, 100);

                // Procesar imagen a escala de grises
                const arr = [];
                const arr100 = [];

                for (let p = 0; p < imageData.data.length; p += 4) {
                    const red = imageData.data[p] / 255;
                    const green = imageData.data[p + 1] / 255;
                    const blue = imageData.data[p + 2] / 255;

                    const gray = (red + green + blue) / 3;

                    arr100.push([gray]);
                    if (arr100.length == 100) {
                        arr.push([...arr100]);
                        arr100.length = 0; // Limpiar array
                    }
                }

                console.log(arr);
                console.log(arr.length, arr[0].length);

                // Crear tensor y hacer predicción
                const tensor = tf.tensor4d([arr], [1, 100, 100, 1]);
                const result = model.predict(tensor) as tf.Tensor;

                console.log(result.dataSync());

                const prediction = result.dataSync()[0] <= 0.5 ? 'Gato' : 'Perro';
                setPrediction(prediction);
                setConfidence(result.dataSync()[0]);

                // Limpiar tensor
                tensor.dispose();
            } catch (error) {
                console.error("Error en predicción:", error);
            }
        }

        setTimeout(predict, 150);
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

    console.log(prediction);

    return (
        <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 dark:from-black dark:via-purple-950 dark:to-cyan-950">
            {/* Header mejorado */}
            <div className="px-4 py-8 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                        🐕 Perros y Gatos 🐱
                    </h1>
                    <div className="max-w-2xl mx-auto">
                        <p className="text-lg md:text-xl text-cyan-200 dark:text-cyan-300 leading-relaxed">
                            Clasificación inteligente de imágenes usando tu cámara web con
                            <span className="font-semibold text-pink-400 dark:text-pink-300"> TensorFlow.js</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Contenido principal mejorado */}
            <div className="container mx-auto px-4 pb-12">
                <div className="flex justify-center">
                    <div className="w-full max-w-md lg:max-w-lg">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center p-12 bg-black/40 dark:bg-black/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-cyan-500/30">
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-500 border-t-transparent mb-4"></div>
                                <p className="text-cyan-200 font-medium">Cargando modelo...</p>
                            </div>
                        ) : (
                            <div className="bg-black/40 dark:bg-black/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-cyan-500/30 p-6 space-y-6">
                                {/* Video oculto */}
                                <video ref={videoRef} autoPlay playsInline className="hidden" />

                                {/* Botón de cambiar cámara */}
                                <div className="flex justify-center">
                                    <button
                                        onClick={changeCamera}
                                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-pink-500/25 border border-pink-500/50"
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
                                    <div className="bg-black/60 rounded-xl p-4 border-2 border-dashed border-cyan-400/50">
                                        <canvas
                                            ref={canvasRef}
                                            width={CANVAS_SIZE}
                                            height={CANVAS_SIZE}
                                            className="w-full h-auto max-w-full rounded-lg shadow-inner bg-black border border-purple-500/30"
                                        />
                                    </div>

                                    {/* Overlay de esquinas para efecto de cámara */}
                                    <div className="absolute inset-4 pointer-events-none">
                                        <div className="relative w-full h-full">
                                            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400 opacity-80"></div>
                                            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-400 opacity-80"></div>
                                            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-400 opacity-80"></div>
                                            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-400 opacity-80"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Canvas oculto */}
                                <canvas ref={hiddenCanvasRef} width={150} height={150} className="hidden" />

                                {/* Resultado de la predicción mejorado */}
                                <div className="text-center py-6">
                                    {prediction ? (
                                        <PredictionDisplay prediction={prediction} loading={loading} confidence={confidence} />
                                    ) : (
                                        <div className="text-cyan-300/70 text-lg font-medium py-8">
                                            Apunta la cámara hacia un perro o gato
                                        </div>
                                    )}

                                </div>

                                <div className="flex justify-center space-x-4 text-sm text-cyan-300/80">
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                                        Cámara activa
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse"></div>
                                        IA lista
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="px-4 pb-8 md:hidden">
                <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-4 max-w-md mx-auto backdrop-blur-sm">
                    <div className="flex items-start">
                        <svg className="w-5 h-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <div>
                            <p className="text-sm text-yellow-300 font-medium">Consejo para móviles</p>
                            <p className="text-sm text-yellow-200/80 mt-1">
                                Mantén el dispositivo estable y asegúrate de tener buena iluminación para mejores resultados.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default ImageClassificationPage