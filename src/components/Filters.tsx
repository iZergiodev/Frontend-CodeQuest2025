import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, TrendingUp, Clock, Heart } from "lucide-react";
import type { Category, BlogFilters } from "@/types/blog";

interface BlogFiltersProps {
  categories: Category[];
  filters: BlogFilters;
  onFiltersChange: (filters: BlogFilters) => void;
}

export function BlogFilters({ categories, filters, onFiltersChange }: BlogFiltersProps) {
  const sortOptions = [
    { value: "latest", label: "Más Recientes", icon: Clock },
    { value: "popular", label: "Más Populares", icon: Heart },
    { value: "trending", label: "Trending", icon: TrendingUp },
  ];

  return (
    <div className="space-y-6 px-8">
      {/* Sort and main filters */}
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

      {/* Categories */}
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

      {/* Active filters */}
      {(filters.category || filters.search || filters.tag) && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Filtros activos:</h4>
          <div className="flex flex-wrap gap-2">
            {filters.category && (
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