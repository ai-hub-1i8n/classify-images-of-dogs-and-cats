interface PredictionDisplayProps {
    prediction: string;
    loading: boolean;
    confidence: number | null;
}
export function PredictionDisplay({
    prediction,
    loading,
    confidence
}: PredictionDisplayProps) {
    const getEmoji = (pred: string) => {
        switch (pred) {
            case 'Dog': return '🐕';
            case 'Cat': return '🐱';
            default: return '';
        }
    };

    const getColor = (pred: string) => {
        switch (pred) {
            case 'Dog': return 'from-purple-400 via-pink-500 to-red-500';
            case 'Cat': return 'from-purple-400 via-pink-500 to-blue-500';
            default: return 'from-purple-400 via-pink-500 to-gray-500';
        }
    };

    console.log(prediction);

    if (loading) {
        return (
            <div className="text-center mt-4">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Processing...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                <div className={`text-6xl md:text-7xl lg:text-8xl font-bold  animate-pulse`}>
                    {getEmoji(prediction)} <span className={`bg-gradient-to-r ${getColor(prediction)} bg-clip-text text-transparent`}>{prediction}</span>
                </div>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-300 border border-green-500/50">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    Detected
                </div>
                {confidence && (
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-300 border border-purple-500/50">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
                        Confidence: {(confidence * 100).toFixed(1)}%
                    </div>
                )}
            </div>
        </>
    );
}