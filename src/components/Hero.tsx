import { Button } from "./ui/button";
import { Search, TrendingUp, Users, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import AnimatedSVG from "./AnimatedSVG.tsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const DevtallesLogo = () => (
    <svg 
      className="inline-block h-8 md:h-16 lg:h-12 xl:h-14 w-auto lg:ml-4 mb-2" 
      viewBox="0 0 3217.23 572.37" 
      fill="#b794f6"
    >
      <g fill="#b794f6">
        <g>
          <path d="M458.28,13.42h51.94c7.53,0,13.62,6.08,13.62,13.56v425.15c0,7.49-6.1,13.56-13.62,13.56h-49.52c-7.33,0-13.35-5.77-13.62-13.06-.43-11.54-13.98-17.03-22.79-9.5-21.13,18.11-49.02,28.37-83.86,28.37-85.01,0-150.21-64.36-150.21-160.62s65.21-163.52,150.21-163.52c.18,0,.34.03.5.03v-.03s90.11,0,90.11,0c7.52,0,13.62-6.07,13.62-13.56V26.98c0-7.49,6.1-13.56,13.62-13.56ZM444.66,228.19c0-7.49-6.1-13.56-13.62-13.56h-74v.07c-51.01.71-84.72,38.74-84.72,95.02s34.36,93.94,86.17,93.94,86.17-37.69,86.17-94.52v-80.95Z"/>
          <path d="M869.81,327.59c-.55,5.67-5.37,9.97-11.08,9.97h-203.71c-7.13,0-12.56,6.64-10.91,13.54,8.58,36.15,31.55,58.36,72.65,58.36,31.98,0,58.15-14.47,76.78-37.04l-.02-.03h.05s.03-.03.03-.03l.08.03h56.61c7.58,0,13.12,7.47,10.62,14.58-30.87,87.87-143,84.53-143,84.53-96.08,0-160.12-63.79-160.12-160.05s62.29-164.09,156.62-164.09,156.61,62.62,156.61,157.14c.01,7.44-.51,15.67-1.22,23.09ZM774.59,284.21c7.04,0,12.45-6.49,10.95-13.34-8.63-39.27-32.76-61.46-71.11-61.46s-61.35,22.1-70.34,61.23c-1.59,6.92,3.8,13.57,10.92,13.57h119.59Z"/>
          <path d="M937.64,153.17c5.41,0,10.25,3.32,12.2,8.35l70.14,182.49c4.28,11.15,20.14,11.13,24.4-.03l69.65-182.44c1.92-5.04,6.78-8.38,12.2-8.38h58.08c9.33,0,15.66,9.47,12.03,18.04l-121.17,286.54c-2.04,4.83-6.78,7.96-12.03,7.96h-61.87c-5.24,0-9.97-3.12-12.02-7.93l-121.71-286.54c-3.64-8.58,2.68-18.07,12.02-18.07h58.08Z"/>
        </g>
        <path d="M1499.59,0l-364.88,572.37h-53.48L1444.08,0h55.51Z"/>
        <g>
          <path d="M1625.2,217.52c-4.51,0-8.16,3.65-8.16,8.13v231.92c0,4.49-3.65,8.12-8.16,8.12h-62.87c-4.51,0-8.16-3.64-8.16-8.12v-231.92c0-4.49-3.65-8.13-8.16-8.13h-49.46c-4.51,0-8.16-3.64-8.16-8.12v-48.12c0-4.49,3.65-8.12,8.16-8.12h49.46c4.51,0,8.16-3.64,8.16-8.13v-31.63c0,4.49,3.65-8.12,8.16-8.12h62.87c4.51,0,8.16,3.64,8.16,8.12v31.63c0,4.49,3.65,8.13,8.16,8.13h50.64c4.51,0,8.16,3.64,8.16,8.12v48.12c0,4.49-3.65,8.12-8.16,8.12h-50.64Z"/>
          <path d="M1999.6,458.88c0,3.77-3.07,6.82-6.85,6.82h-62.84c-3.68,0-6.7-2.9-6.85-6.56l-.76-19.38c-.24-6.03-7.7-8.85-11.78-4.39-21.4,23.39-52.1,36.13-84.43,36.13-64.63,0-108.3-38.86-108.3-96.84s52.99-99.74,133.33-99.74c19.12,0,40.07,1.83,61.22,5.48,4.2.73,8.06-2.42,8.06-6.67v-51.71c0-3.77-3.07-6.82-6.85-6.82h-169.12c-3.78,0-6.85-3.06-6.85-6.82v-48.4c0-3.77,3.07-6.82,6.85-6.82h248.31c3.78,0,6.85,3.05,6.85,6.82v298.89h0ZM1920.19,341.2c.22-3.4-2.28-6.47-5.64-7.08-18.5-3.35-37.2-5.25-53.53-5.25-36.69,0-61.12,17.4-61.12,44.07s16.89,42.33,48.9,42.33c35.22,0,68.31-26.74,71.39-74.06h0Z"/>
          <path d="M2113.46,13.42c5.82,0,10.54,4.7,10.54,10.5v371.02c0,3.21,2.62,5.8,5.84,5.8h68.77c5.82,0,10.54,4.7,10.54,10.51v43.94c0,5.8-4.72,10.5-10.54,10.5h-143.24c-5.83,0-10.54-4.7-10.54-10.5V23.92c0-5.8,4.72-10.5,10.54-10.5h58.09Z"/>
          <path d="M2319.92,13.42c5.82,0,10.54,4.7,10.54,10.5v371.02c0,3.21,2.62,5.8,5.84,5.8h68.77c5.82,0,10.54,4.7,10.54,10.51v43.94c0,5.8-4.72,10.5-10.54,10.5h-143.24c-5.83,0-10.54-4.7-10.54-10.5V23.92c0-5.8,4.72-10.5,10.54-10.5h58.09Z"/>
          <path d="M2741.95,327.59c-.55,5.67-5.37,9.97-11.08,9.97h-203.71c-7.13,0-12.56,6.64-10.91,13.54,8.58,36.15,31.55,58.36,72.65,58.36,31.98,0,58.15-14.47,76.78-37.04l-.02-.03h.05s.03-.03.03-.03l.08.03h56.61c7.58,0,13.12,7.47,10.62,14.58-30.87,87.87-143,84.53-143,84.53-96.08,0-160.12-63.79-160.12-160.05s62.29-164.09,156.62-164.09,156.61,62.62,156.61,157.14c.01,7.44-.51,15.67-1.22,23.09ZM2646.72,284.21c7.04,0,12.45-6.49,10.95-13.34-8.63-39.27-32.76-61.46-71.11-61.46s-61.35,22.1-70.34,61.23c-1.59,6.92,3.8,13.57,10.92,13.57h119.59Z"/>
          <path d="M2800.28,397.47c3.6-5.76,11.02-7.99,17.13-4.96,26.21,13.01,52.52,17.52,79.76,17.52,29.11,0,48.91-12.17,48.91-31.31s-22.13-29.57-53.58-37.69l-26.19-6.96c-52.98-13.92-89.09-34.22-89.09-83.49,0-62.04,48.91-103.22,123.45-103.22,41.17,0,77.01,7.52,105.99,23.31,6.8,3.71,8.97,12.45,4.78,18.95l-19.23,29.93c-3.59,5.56-10.76,7.74-16.76,4.93-22.06-10.3-45.37-15.07-69.55-15.07-28.53,0-48.32,10.44-48.32,28.42s19.79,27.25,47.16,34.21l26.2,7.54c53.56,13.92,96.08,38.27,96.08,93.36,0,59.14-52.41,98.58-131.01,98.58-42.47,0-80.8-9.64-108.85-29.33-5.79-4.07-7.31-11.99-3.57-17.98l16.7-26.73Z"/>
        </g>
      </g>
      <g fill="#b794f6">
        <path d="M0,267.99c47.39,0,54.16-26.3,54.83-49.89,0-18.88-2.71-37.75-5.41-55.96-2.71-19.55-5.41-38.43-5.41-56.63,0-62.02,41.3-88.32,98.83-88.32h13.54v37.08h-11.51c-39.94.67-54.16,21.57-54.16,57.98,0,15.51,2.71,31.69,4.74,47.87,2.71,16.86,5.41,33.04,5.41,51.23.68,43.14-18.96,64.72-49.42,72.81v1.35c30.46,8.09,49.42,30.34,49.42,73.49,0,18.2-2.71,35.05-5.41,51.91-2.03,16.18-4.74,32.36-4.74,48.54,0,37.75,16.25,57.98,54.16,58.65h11.51v37.08h-14.21c-55.51,0-98.16-24.27-98.16-92.36,0-18.2,2.71-37.08,6.09-55.28,2.03-18.88,4.74-37.08,4.74-54.61C54.83,331.35,48.07,302.36,0,302.36v-34.37Z"/>
        <path d="M3217.23,302.37c-47.39,0-54.16,28.99-54.83,50.56,0,17.53,2.71,35.73,5.41,54.61,2.71,18.2,5.41,37.08,5.41,55.28,0,68.09-42.64,92.36-98.16,92.36h-14.21v-37.08h11.51c37.91-.67,54.16-20.9,54.16-58.65,0-16.18-2.71-32.36-4.74-48.54-2.71-16.86-5.41-33.71-5.41-51.91-.68-43.14,18.96-65.4,49.42-73.49v-1.35c-30.46-8.09-49.42-29.66-49.42-72.81,0-18.2,2.71-34.39,5.41-51.23,2.03-16.18,4.74-32.36,4.74-47.87,0-36.4-14.21-57.31-54.16-57.98h-11.51V17.2h13.54c57.54,0,98.83,26.3,98.83,88.32,0,18.2-2.71,37.08-5.41,56.63-2.71,18.2-5.41,37.08-5.41,55.96,0,23.6,6.77,49.89,54.83,49.89v34.37Z"/>
      </g>
    </svg>
  );

  // Common Discord logo SVG
  const DiscordLogo = () => (
    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  );

  // Conditional content based on auth status
  const title = user 
    ? "Bienvenid@ a la" 
    : "Comparte tu conocimiento con la";
  
  const subtitle = user
    ? "El foro de la comunidad de desarrolladores donde compartimos conocimiento, resolvemos dudas y creamos juntos el futuro del desarrollo."
    : "Descubre artículos técnicos, tutoriales y experiencias compartidas por desarrolladores de nuestra comunidad. Aprende, enseña y crece junto a nosotros.";

  const buttonText = user ? "Unirse a Discord" : "Explorar";
  const buttonIcon = user ? <DiscordLogo /> : <Search className="h-5 w-5 mr-2" />;
  const buttonAction = user 
    ? () => window.open('https://discord.gg/2KbNVhXPke', '_blank') // Discord server link
    : () => navigate('/#posts');

  // Container classes based on auth status
  const containerClass = user 
    ? "container mx-auto px-4 py-12"
    : "relative py-20 px-4 bg-hero-bg overflow-hidden";
  
  const contentClass = user
    ? "py-12 bg-hero-bg rounded-2xl border"
    : "text-center mx-auto pr-0 xl:pr-40";

  return (
    <div className={containerClass}>
      {!user && <div className="absolute inset-0 bg-devtalles-gradient opacity-5"></div>}
      
      <div className={user ? "" : "container mx-auto relative z-20"}>
        <div className={contentClass}>
          {user ? (
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                  {title}
                  <br/>
                  <span className="bg-devtalles-gradient bg-clip-text text-transparent">
                    comunidad 
                  </span>
                  <div className="inline-block relative">
                    <DevtallesLogo />
                  </div>
                </h1>
                
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  {subtitle}
                </p>
                
                <div className="flex items-center justify-center gap-4">
                  <Button 
                    size="lg" 
                    className="bg-devtalles-gradient hover:opacity-90 hover:scale-105 transition-all duration-300 h-14 px-10 rounded-2xl font-semibold text-lg shadow-[var(--floating-shadow)] hover:shadow-[var(--glow-primary),var(--floating-shadow)]"
                    onClick={buttonAction}
                  >
                    {buttonIcon}
                    {buttonText}
                  </Button>
                </div>
              </div>

              {/* Right side - Laptop Animation */}
              <div className="hidden lg:flex items-center justify-center">
                <div className="w-48 h-48 xl:w-90 xl:h-90 pointer-events-none">
                  <AnimatedSVG svg="laptop"/>
                </div>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                {title}
                <br/>
                <span className="bg-devtalles-gradient bg-clip-text text-transparent">
                  comunidad 
                </span>
                <div className="inline-block relative">
                  <DevtallesLogo />
                </div>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                {subtitle}
              </p>
              
              {/* Search section - only for non-authenticated users */}
              <div className="animate-scale-in z-20" style={{animationDelay: '0.4s'}}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 max-w-lg mx-auto">
                  <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 transition-colors group-hover:text-primary" />
                    <Input 
                      placeholder="¿Qué quieres aprender hoy?" 
                      className="pl-12 h-14 text-lg bg-background/90 backdrop-blur border-2 border-primary/30 focus:border-primary focus:shadow-[var(--glow-primary)] transition-all duration-300 rounded-2xl"
                    />
                  </div>
                  <Button 
                    size="lg" 
                    className="bg-devtalles-gradient hover:opacity-90 hover:scale-105 transition-all duration-300 h-14 px-10 rounded-2xl font-semibold text-lg shadow-[var(--floating-shadow)] hover:shadow-[var(--glow-primary),var(--floating-shadow)]"
                    onClick={buttonAction}
                  >
                    {buttonIcon}
                    {buttonText}
                  </Button>
                </div>
              </div>

              {/* Stats section - only for non-authenticated users */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto z-20">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">+500 Artículos</h3>
                  <p className="text-muted-foreground">Contenido técnico de calidad</p>
                </div>
                  
                <div className="flex flex-col items-center text-center">
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Comunidad Activa</h3>
                  <p className="text-muted-foreground">Miles de desarrolladores conectados</p>
                </div>
                    
                <div className="flex flex-col items-center text-center">
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Contenido Trending</h3>
                  <p className="text-muted-foreground">Las últimas tendencias en desarrollo</p>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Animated SVG - only for non-authenticated users */}
        {!user && (
          <div className="absolute opacity-25 xl:opacity-100 top-50 lg:top-120 xl:top-1/2 xl:left-auto xl:-right-20 left-1/2 sm:left-1/2 md:left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-100 h-100 lg:w-200 lg:h-200 xl:w-80 xl:h-80 -z-10 pointer-events-none">
            <AnimatedSVG svg="hero"/>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;