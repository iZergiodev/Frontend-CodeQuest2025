import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { useState } from "react";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  postCount?: number;
}

const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  postCount = 0
}: CategoryFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Filtrar por categoría</h3>
          {selectedCategory && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {postCount} posts en {selectedCategory}
            </Badge>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden"
        >
          {isOpen ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
        </Button>
      </div>

      <div className={`${isOpen ? 'block' : 'hidden'} lg:block`}>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(null)}
            className="transition-all duration-200 hover:scale-105"
          >
            Todas las categorías
          </Button>
          
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category)}
              className="transition-all duration-200 hover:scale-105"
            >
              {category}
            </Button>
          ))}
        </div>

        {selectedCategory && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Filtro activo:</span>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {selectedCategory}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCategoryChange(null)}
                className="ml-2 h-4 w-4 p-0 hover:bg-transparent"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;