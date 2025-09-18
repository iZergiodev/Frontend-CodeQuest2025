import { Button } from "@/components/ui/button";
import { FollowButton } from "@/components/FollowButton";

import {
  Home,
  Code,
  Database,
  Globe,
  Smartphone,
  Brain,
  Users,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Terminal,
  TrendingUp,
  Star
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useOpen } from "@/hooks/useOpen";
import { useCategories, useSubcategoriesByCategory } from "@/services/postsService";
import type { Category } from "@/types/blog";


export const Sidebar = () => {
  const { isOpen, setIsOpen } = useOpen();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedHome, setSelectedHome] = useState<boolean>(true);
  const [selectedTrending, setSelectedTrending] = useState<boolean>(false);
  const [selectedPopular, setSelectedPopular] = useState<boolean>(false);

  // Update selected states based on current URL
  useEffect(() => {
    const pathname = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    
    // Reset all selections
    setSelectedHome(false);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSelectedTrending(false);
    setSelectedPopular(false);
    
    if (pathname === '/') {
      setSelectedHome(true);
    } else if (pathname === '/trending') {
      setSelectedTrending(true);
    } else if (pathname === '/popular') {
      setSelectedPopular(true);
    } else if (pathname.startsWith('/category/')) {
      const categorySlug = pathname.split('/category/')[1];
      const category = categories.find(c => c.slug === categorySlug);
      
      if (category) {
        setSelectedCategory(category.id);
        
        // Check for subcategory in URL
        const subcategorySlug = searchParams.get('subcategory');
        if (subcategorySlug) {
          setSelectedSubcategory(subcategorySlug);
          // Expand the category to show subcategories
          setExpandedCategories(prev => new Set([...prev, category.id]));
        } else {
          setSelectedSubcategory(null);
        }
      }
    }
  }, [location, categories]);

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    switch (name) {
      case 'frontend':
        return Code;
      case 'backend':
        return Database;
      case 'programming':
        return Terminal;
      case 'full-stack':
        return Globe;
      case 'devops':
        return Users;
      case 'mobile development':
        return Smartphone;
      case 'ai':
        return Brain;
      default:
        return Code;
    }
  };

  const handleHomeClick = () => {
    setSelectedHome(true);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSelectedTrending(false);
    setSelectedPopular(false);
    navigate('/');
  };

  const handleTrendingClick = () => {
    setSelectedTrending(true);
    setSelectedHome(false);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSelectedPopular(false);
    navigate('/trending');
  };

  const handlePopularClick = () => {
    setSelectedPopular(true);
    setSelectedHome(false);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSelectedTrending(false);
    navigate('/popular');
  };

  const handleCategoryClick = (categoryId: string, categorySlug: string) => {
    // Navigate to category page
    navigate(`/category/${categorySlug}`);
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null);
    setSelectedHome(false);
    setSelectedTrending(false);
    setSelectedPopular(false);
  };

  const toggleCategoryDropdown = (categoryId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent navigation when clicking dropdown
    
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleSubcategoryClick = (subcategorySlug: string, categorySlug: string) => {
    const category = categories.find(c => c.slug === categorySlug);
    if (category) {
      setSelectedCategory(category.id);
      setSelectedSubcategory(subcategorySlug);
      setSelectedHome(false);
      setSelectedTrending(false);
      setSelectedPopular(false);
      // Expand the category to show subcategories
      setExpandedCategories(prev => new Set([...prev, category.id]));
    }
    // Navigate to category page with subcategory filter
    navigate(`/category/${categorySlug}?subcategory=${subcategorySlug}`);
  };

  const CategoryItem = ({ category }: { category: Category }) => {
    const { data: subcategories = [] } = useSubcategoriesByCategory(category.id);
    const isExpanded = expandedCategories.has(category.id);
    const isSelected = selectedCategory === category.id;
    const IconComponent = getCategoryIcon(category.name);

    return (
      <div>
        <div className="flex items-center">
          <Button
            variant={isSelected ? "secondary" : "ghost"}
            className={`flex-1 justify-start gap-3 transition-smooth ${
              isSelected ? 'bg-primary/10 text-primary hover:bg-primary/15' : 'hover:bg-accent'
            }`}
            onClick={() => handleCategoryClick(category.id, category.slug)}
          >
            <IconComponent className="h-4 w-4" style={{ color: category.color }} />
            <span className="flex-1 text-left">{category.name}</span>
          </Button>
          {subcategories.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-8 w-8 hover:bg-accent"
              onClick={(e) => toggleCategoryDropdown(category.id, e)}
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </Button>
          )}
        </div>
        
        {isExpanded && subcategories.length > 0 && (
          <div className="ml-4 mt-1 space-y-1">
            {subcategories.map((subcategory) => (
              <div key={subcategory.id} className="flex items-center gap-2">
                <Button
                  variant={selectedSubcategory === subcategory.slug ? "secondary" : "ghost"}
                  size="sm"
                  className={`flex-1 justify-start gap-2 text-sm transition-smooth ${
                    selectedSubcategory === subcategory.slug 
                      ? 'bg-primary/10 text-primary hover:bg-primary/15' 
                      : 'hover:bg-accent'
                  }`}
                  onClick={() => handleSubcategoryClick(subcategory.slug, category.slug)}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: subcategory.color }}
                  />
                  <span className="flex-1 text-left">{subcategory.name}</span>
                </Button>
                <FollowButton
                  subcategoryId={subcategory.id}
                  followerCount={subcategory.followerCount}
                  size="sm"
                  variant="ghost"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
        <aside 
          className={`${isOpen ? "w-86" : "w-16"} fixed top-20 left-0 h-[calc(100dvh-5rem)] overflow-y-auto p-4 border-r bg-background/95 backdrop-blur-sm z-40 transition-all duration-300 ease-in-out sidebar-scroll hidden md:block`}
        >
        {isOpen && <div className="space-y-6">
          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold mt-3 mb-3 text-muted-foreground uppercase tracking-wider">
              Navegación
            </h3>
            <nav className="space-y-1">
              {/* Home Button */}
              <Button
                variant={selectedHome ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 transition-smooth ${
                  selectedHome ? 'bg-primary/10 text-primary hover:bg-primary/15' : 'hover:bg-accent'
                }`}
                onClick={handleHomeClick}
              >
                <Home className="h-4 w-4" />
                <span className="flex-1 text-left">Inicio</span>
              </Button>

              {/* Trending Button */}
              <Button
                variant={selectedTrending ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 transition-smooth ${
                  selectedTrending ? 'bg-primary/10 text-primary hover:bg-primary/15' : 'hover:bg-accent'
                }`}
                onClick={handleTrendingClick}
              >
                <TrendingUp className="h-4 w-4" />
                <span className="flex-1 text-left">Trending</span>
              </Button>

              {/* Popular Button */}
              <Button
                variant={selectedPopular ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 transition-smooth ${
                  selectedPopular ? 'bg-primary/10 text-primary hover:bg-primary/15' : 'hover:bg-accent'
                }`}
                onClick={handlePopularClick}
              >
                <Star className="h-4 w-4" />
                <span className="flex-1 text-left">Popular</span>
              </Button>

              {categoriesLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : (
                categories.map((category) => (
                  <CategoryItem key={category.id} category={category} />
                ))
              )}
            </nav>
          </div>

          {/* Community Stats */}
          <div className="bg-card border rounded-lg p-4 mb-4">
            <h3 className="font-semibold mb-3">Estadísticas</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Miembros activos</span>
                <span className="font-medium">1,247</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Posts hoy</span>
                <span className="font-medium">28</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Online ahora</span>
                <span className="font-medium text-success">156</span>
              </div>
            </div>
          </div>
        </div>}
      </aside>
      {/* BOTÓN FLOTANTE (fijo y visible siempre) */}
      <Button
        aria-label="Abrir/cerrar sidebar"
        variant="default"
        size="icon"
        className={`fixed top-30 -translate-y-1/2 ${isOpen ? 'left-[21.5rem]' : 'left-[4rem]'} -translate-x-1/2 z-50 rounded-full ring-1 ring-border p-0 bg-background text-foreground hover:bg-accent transition-all duration-300 ease-in-out hidden md:flex`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <ChevronLeft className="h-5 w-5" />
        ) : (
          <ChevronRight className="h-5 w-5" />
        )}
      </Button>
    </>
  );
};
