// hooks/useCamera.js
import { useState, useRef, useCallback } from "react";

export function useCamera() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState("user");
  const [error, setError] = useState<Error | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startCamera = useCallback(
    async (constraints: { video: MediaTrackConstraints } = { video: {} }) => {
      try {
        setError(null);

        const defaultConstraints = {
          audio: false,
          video: {
            facingMode: facingMode,
            width: 400,
            height: 400,
            ...constraints.video,
          },
        };

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          ...defaultConstraints,
          ...constraints,
        }) as MediaStream;

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }

        setStream(mediaStream);
        return mediaStream;
      } catch (err) {
        console.error("Error accediendo a la cámara:", err);
        setError(err as Error);
        throw err;
      }
    },
    [facingMode]
  );

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  const switchCamera = useCallback(async () => {
    stopCamera();
    const newFacingMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newFacingMode);

    // Pequeño delay para asegurar que la cámara se libere
    setTimeout(() => {
      startCamera();
    }, 100);
  }, [facingMode, startCamera, stopCamera]);

  return {
    videoRef,
    stream,
    facingMode,
    error,
    startCamera,
    stopCamera,
    switchCamera,
  };
}
