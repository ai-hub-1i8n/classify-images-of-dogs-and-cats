import { Card } from "@/components/ui/card";
import ImageClassificationPage from '@/pages/ImageClassificationPage';


export default function Home() {
  return (
    <div className="font-sans w-full flex flex-col items-center justify-items-center p-8 gap-5">
      <Card className="px-4 py-8 text-center">
        <div className="w-full mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold dark:text-white text-slate-800 mb-4 drop-shadow-lg">
            🐕 Dogs and Cats 🐱
          </h1>
          <div className="max-w-2xl mx-auto">
            <p className="text-lg md:text-xl text-cyan-500 dark:text-cyan-300 leading-relaxed">
              Intelligent image classification using your webcam with
              <span className="font-semibold text-pink-500 dark:text-pink-300"> TensorFlow.js</span>
            </p>
          </div>
        </div>
      </Card>
      <Card className="p-8 w-full">
        <ImageClassificationPage />
      </Card>
    </div>
  );
}
