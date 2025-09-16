import Lottie from 'lottie-react';
import daySpaceshipAnimation from '@/assets/day_spaceship.json';
import nightSpaceshipAnimation from '@/assets/night_spaceship.json';
import { useTheme } from 'next-themes';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen = ({ message = "Loading..." }: LoadingScreenProps) => {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-8">
        {/* Spaceship Animation */}
        <div className="w-160 h-160 flex items-center justify-center">
          <Lottie 
            animationData={theme === 'dark' ? nightSpaceshipAnimation : daySpaceshipAnimation} 
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
