import { Search, TrendingUp, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Hero = () => {
  return (
    <section className="relative py-20 px-4 bg-hero-bg overflow-hidden">
      <div className="absolute inset-0 bg-devtalles-gradient opacity-5"></div>
      
      <div className="container mx-auto text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
          Comparte tu conocimiento con la{" "}
          <span className="bg-devtalles-gradient bg-clip-text text-transparent">
            comunidad DevTalles
          </span>
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Descubre artículos técnicos, tutoriales y experiencias compartidas por desarrolladores 
          de nuestra comunidad. Aprende, enseña y crece junto a nosotros.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 max-w-md mx-auto">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input 
              placeholder="¿Qué quieres aprender hoy?" 
              className="pl-10 h-12 bg-background/80 backdrop-blur border-2 border-primary/20 focus:border-primary"
            />
          </div>
          <Button size="lg" className="bg-devtalles-gradient hover:opacity-90 h-12 px-8">
            Explorar
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
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
      </div>
    </section>
  );
};

export default Hero;