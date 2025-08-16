import { useEffect, useRef } from 'react';
import { useCamera } from '../hooks/useCamera';

interface CameraProps {
    onCanvasUpdate: (canvas: HTMLCanvasElement, hiddenCanvas: HTMLCanvasElement) => void;
    canvasSize?: number;
    className?: string;
}

export function Camera({
    onCanvasUpdate,
    canvasSize = 400,
    className = ""
}: CameraProps) {
    const { videoRef, startCamera, switchCamera, error } = useCamera();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        startCamera({
            video: {
                width: canvasSize,
                height: canvasSize
            }
        }).then(() => {
            if (videoRef.current) {
                videoRef.current.onloadedmetadata = () => {
                    processCamera();
                };
            }
        }).catch(console.error);
    }, [startCamera, canvasSize]);

    const processCamera = () => {
        if (canvasRef.current && videoRef.current) {
            const ctx = canvasRef.current.getContext('2d') as CanvasRenderingContext2D;
            ctx.drawImage(
                videoRef.current,
                0, 0, canvasSize, canvasSize,
                0, 0, canvasSize, canvasSize
            );

            // Notificar al padre que el canvas se actualizó
            if (onCanvasUpdate) {
                onCanvasUpdate(canvasRef.current, hiddenCanvasRef.current!);
            }

            setTimeout(processCamera, 20);
        }
    };

    if (error) {
        return (
            <div className="alert alert-danger">
                Error accediendo a la cámara: {error.message}
            </div>
        );
    }

    return (
        <div className={className}>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{ width: '1px', height: '1px' }}
            />

            <button
                className="btn btn-primary mb-2 d-block mx-auto"
                onClick={switchCamera}
            >
                Cambiar cámara
            </button>

            <canvas
                ref={canvasRef}
                width={canvasSize}
                height={canvasSize}
                className="d-block mx-auto"
                style={{ maxWidth: '100%' }}
            />

            <canvas
                ref={hiddenCanvasRef}
                width={150}
                height={150}
                style={{ display: 'none' }}
            />
        </div>
    );
}