"use client";
import { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";

export function useTensorFlow(modelPath: string) {
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        setLoading(true);
        console.log("Cargando modelo...");


        const loadedModel = await tf.loadLayersModel(modelPath);
        setModel(loadedModel);
        console.log("Modelo cargado exitosamente");
      } catch (err) {
        console.error("Error cargando el modelo:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadModel();

    // Cleanup
    return () => {
      if (model) {
        model.dispose();
      }
    };
  }, [modelPath]);

  const predict = (inputTensor: tf.Tensor4D) => {
    if (!model) {
      throw new Error("Modelo no cargado");
    }

    try {
      const prediction = model.predict(inputTensor) as tf.Tensor;
      return prediction.dataSync();
    } catch (err) {
      console.error("Error en predicción:", err);
      throw err;
    }
  };

  return {
    model,
    loading,
    error,
    predict,
  };
}
