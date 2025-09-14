import Lottie from 'lottie-react';
import spaceshipAnimation from '@/assets/spaceship.json';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen = ({ message = "Loading..." }: LoadingScreenProps) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-8">
        {/* Spaceship Animation */}
        <div className="w-160 h-160 flex items-center justify-center">
          <Lottie 
            animationData={spaceshipAnimation} 
            loop={true}
            autoplay={true}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        
        {/* Loading Message */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {message}
          </h2>
        </div>
      </div>
    </div>
  );
};
