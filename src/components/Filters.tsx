import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, TrendingUp, Star, Clock, Calendar } from "lucide-react";
import type { Category, BlogFilters } from "@/types/blog";
import { useSubcategoriesByCategory } from "@/services/postsService";
import { useEffect, useState } from "react";

interface BlogFiltersProps {
  categories: Category[];
  filters: BlogFilters;
  onFiltersChange: (filters: BlogFilters) => void;
  categoryPage?: boolean;
  rankingType?: boolean;
}

export function BlogFilters({ categories, filters, onFiltersChange, categoryPage = false, rankingType = false }: BlogFiltersProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const sortOptions = [
    { value: "latest", label: "Más Recientes", icon: Clock },
    { value: "popular", label: "Más Populares", icon: Star },
    { value: "trending", label: "Más Tendencia", icon: TrendingUp },
  ];

  const selectedCategory = categories.find(c => c.slug === filters.category);
  const { data: subcategories = [] } = useSubcategoriesByCategory(selectedCategory?.id || "");

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`space-y-6 ${categoryPage || rankingType ? 'px-0' : 'px-8'}`}>
      {/* Sort and main filters */}
      {!rankingType && 
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Filtros</span>
          </div>
          
          <div className="flex gap-2">
            <Select
              value={filters.sortBy || "latest"}
              onValueChange={(value) => onFiltersChange({ ...filters, sortBy: value as any })}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <option.icon className="h-4 w-4" />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      }

      {/* Categories - Only show if not on category page */}
      {!categoryPage && (
        <div className="space-y-3">
          <h3 className="font-medium">Categorías</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={!filters.category ? "default" : "outline"}
              size="sm"
              onClick={() => onFiltersChange({ ...filters, category: undefined })}
              className="h-8"
            >
              Todas
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={filters.category === category.slug ? "default" : "outline"}
                size="sm"
                onClick={() => 
                  onFiltersChange({ 
                    ...filters, 
                    category: filters.category === category.slug ? undefined : category.slug 
                  })
                }
                className="h-8"
              >
                <div
                  className="w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Subcategories */}
      {subcategories.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium">Subcategorías</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={!filters.subcategory ? "default" : "outline"}
              size="sm"
              onClick={() => onFiltersChange({ ...filters, subcategory: undefined })}
              className="h-8 hover:opacity-80 transition-opacity"
            >
              Todas
            </Button>
            {subcategories.map((subcategory) => {
              const isBlack = subcategory.color === '#000000' || subcategory.color === '#000';
              
              const displayColor = isBlack && isDarkMode ? 'white' : subcategory.color;
              
              return (
                <Button
                  key={subcategory.id}
                  variant={filters.subcategory === subcategory.slug ? "default" : "outline"}
                  size="sm"
                  onClick={() => 
                    onFiltersChange({ 
                      ...filters, 
                      subcategory: filters.subcategory === subcategory.slug ? undefined : subcategory.slug 
                    })
                  }
                  className={`h-8 transition-all duration-200 ${
                    isBlack ? 'text-black dark:text-white' : ''
                  }`}
                  style={{
                    backgroundColor: filters.subcategory === subcategory.slug ? `${displayColor}20` : undefined,
                    borderColor: filters.subcategory !== subcategory.slug ? `${displayColor}40` : undefined,
                    color: isBlack ? undefined : subcategory.color,
                    '--hover-bg': `${displayColor}15`
                  } as React.CSSProperties & { '--hover-bg': string }}
                  onMouseEnter={(e) => {
                    if (filters.subcategory !== subcategory.slug) {
                      e.currentTarget.style.backgroundColor = `${displayColor}15`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (filters.subcategory !== subcategory.slug) {
                      e.currentTarget.style.backgroundColor = '';
                    }
                  }}
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      isBlack ? 'bg-black dark:bg-white' : ''
                    }`}
                    style={isBlack ? {} : { backgroundColor: subcategory.color }}
                  />
                  {subcategory.name}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active filters */}
      {((!categoryPage && filters.category) || filters.subcategory || filters.search || filters.tag) && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Filtros activos:</h4>
          <div className="flex flex-wrap gap-2">
            {!categoryPage && filters.category && (
              <Badge variant="secondary" className="gap-1">
                Categoría: {categories.find(c => c.slug === filters.category)?.name}
                <button
                  onClick={() => onFiltersChange({ ...filters, category: undefined })}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            )}
            {filters.subcategory && (
              <Badge variant="secondary" className="gap-1">
                Subcategoría: {subcategories.find(s => s.slug === filters.subcategory)?.name}
                <button
                  onClick={() => onFiltersChange({ ...filters, subcategory: undefined })}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            )}
            {filters.search && (
              <Badge variant="secondary" className="gap-1">
                Búsqueda: "{filters.search}"
                <button
                  onClick={() => onFiltersChange({ ...filters, search: undefined })}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            )}
            {filters.tag && (
              <Badge variant="secondary" className="gap-1">
                Tag: {filters.tag}
                <button
                  onClick={() => onFiltersChange({ ...filters, tag: undefined })}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}