import { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import { toast } from "@/components/toast";

export function useTensorFlow(modelPath: string) {
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await tf.loadLayersModel(
          modelPath
        ) as tf.LayersModel;
        setModel(loadedModel);
        setLoading(false);

        toast.success({
          title: "Model Loaded",
          description: "The model has been successfully loaded.",
        });
      } catch {
        toast.error({
          title: "Model Loading Error",
          description:
            "Error occurred while loading the model. Please try again.",
        });
        setLoading(false);
      }
    };

    loadModel();
  }, []);

  return {
    model,
    loading,
  };
}
