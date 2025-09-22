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
  Star,
  Compass,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useOpen } from "@/hooks/useOpen";
import { useCategories, useSubcategoriesByCategory } from "@/services/postsService";
import { useAuth } from "@/hooks/useAuth";
import type { Category } from "@/types/blog";
import { useTheme } from "next-themes";
import logoDark from "@/assets/logo_d.svg?url";
import logoLight from "@/assets/logo_l.svg?url";
import nameLogo from "@/assets/name_logo.svg?url";

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar = ({ isMobileOpen = false, onMobileClose }: SidebarProps = {}) => {
  const { isOpen, setIsOpen } = useOpen();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { theme } = useTheme();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedHome, setSelectedHome] = useState<boolean>(true);
  const [selectedTrending, setSelectedTrending] = useState<boolean>(false);
  const [selectedPopular, setSelectedPopular] = useState<boolean>(false);
  const [selectedExplore, setSelectedExplore] = useState<boolean>(false);

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
    setSelectedExplore(false);
    
    if (pathname === '/') {
      setSelectedHome(true);
    } else if (pathname === '/trending') {
      setSelectedTrending(true);
    } else if (pathname === '/popular') {
      setSelectedPopular(true);
    } else if (pathname === '/explore') {
      setSelectedExplore(true);
    } else if (pathname.startsWith('/category/')) {
      const categorySlug = pathname.split('/category/')[1];
      const category = categories.find(c => c.slug === categorySlug);
      
      if (category) {
        setSelectedCategory(category.id.toString());
        
        // Check for subcategory in URL
        const subcategorySlug = searchParams.get('subcategory');
        if (subcategorySlug) {
          setSelectedSubcategory(subcategorySlug);
          // Expand the category to show subcategories
          setExpandedCategories(prev => new Set([...prev, category.id.toString()]));
        } else {
          setSelectedSubcategory(null);
        }
      }
    }
  }, [location, categories]);

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase().replace(/\s+/g, ' ').trim();
    switch (name) {
      case 'frontend':
        return Code;
      case 'backend':
        return Database;
      case 'programación':
        return Terminal;
      case 'full-stack':
        return Globe;
      case 'devops':
        return Users;
      case 'desarrollo móvil':
        return Smartphone;
      case 'inteligencia artificial':
        return Brain;
      default:
        console.warn(`Unknown category name: "${categoryName}" - using default Code icon`);
        return Code;
    }
  };

  const handleNavigation = (callback: () => void) => {
    callback();
    if (onMobileClose) {
      onMobileClose(); // Close mobile menu after navigation
    }
  };

  const handleHomeClick = () => {
    setSelectedHome(true);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSelectedTrending(false);
    setSelectedPopular(false);
    setSelectedExplore(false);
    navigate('/');
    if (onMobileClose) onMobileClose();
  };

  const handleTrendingClick = () => {
    setSelectedTrending(true);
    setSelectedHome(false);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSelectedPopular(false);
    setSelectedExplore(false);
    navigate('/trending');
    if (onMobileClose) onMobileClose();
  };

  const handlePopularClick = () => {
    setSelectedPopular(true);
    setSelectedHome(false);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSelectedTrending(false);
    setSelectedExplore(false);
    navigate('/popular');
    if (onMobileClose) onMobileClose();
  };

  const handleExploreClick = () => {
    setSelectedExplore(true);
    setSelectedHome(false);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSelectedTrending(false);
    setSelectedPopular(false);
    navigate('/explore');
    if (onMobileClose) onMobileClose();
  };

  const handleCategoryClick = (categoryId: string, categorySlug: string) => {
    // Navigate to category page
    navigate(`/category/${categorySlug}`);
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null);
    setSelectedHome(false);
    setSelectedTrending(false);
    setSelectedPopular(false);
    if (onMobileClose) onMobileClose();
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
      setSelectedCategory(category.id.toString());
      setSelectedSubcategory(subcategorySlug);
      setSelectedHome(false);
      setSelectedTrending(false);
      setSelectedPopular(false);
      // Expand the category to show subcategories
      setExpandedCategories(prev => new Set([...prev, category.id.toString()]));
    }
    // Navigate to category page with subcategory filter
    navigate(`/category/${categorySlug}?subcategory=${subcategorySlug}`);
    if (onMobileClose) onMobileClose();
  };

  const CategoryItem = ({ category }: { category: Category }) => {
    const { data: subcategories = [] } = useSubcategoriesByCategory(category.id);
    const isExpanded = expandedCategories.has(category.id.toString());
    const isSelected = selectedCategory === category.id.toString();
    const IconComponent = getCategoryIcon(category.name);

    return (
      <div>
        <div className="flex items-center">
          <Button
            variant={isSelected ? "secondary" : "ghost"}
            className={`flex-1 justify-start gap-3 transition-smooth ${
              isSelected ? 'bg-primary/10 text-primary hover:bg-primary/15' : 'hover:bg-accent'
            }`}
            onClick={() => handleCategoryClick(category.id.toString(), category.slug)}
          >
            <IconComponent className="h-4 w-4" style={{ color: category.color }} />
            <span className="flex-1 text-left">{category.name}</span>
          </Button>
          {subcategories.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-8 w-8 hover:bg-accent"
              onClick={(e) => toggleCategoryDropdown(category.id.toString(), e)}
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
                  subcategoryId={subcategory.id.toString()}
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

  // Mobile sidebar content
  const SidebarContent = () => (
    <div className="space-y-6">
      {/* Mobile Header */}
      {isMobileOpen && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <img
              src={theme === "dark" ? logoLight : logoDark}
              alt="Logo"
              className="h-8 w-8"
            />
            <img
              src={nameLogo}
              alt="DevBlog"
              className="h-6 w-auto"
              style={{
                filter: theme === "dark" ? "brightness(0) invert(1)" : "brightness(0) invert(0)"
              }}
            />
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onMobileClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}

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
            <span className="flex-1 text-left">Tendencia</span>
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

          {/* Explore Button - Only show if user is authenticated */}
          {user && (
            <Button
              variant={selectedExplore ? "secondary" : "ghost"}
              className={`w-full justify-start gap-3 transition-smooth ${
                selectedExplore ? 'bg-primary/10 text-primary hover:bg-primary/15' : 'hover:bg-accent'
              }`}
              onClick={handleExploreClick}
            >
              <Compass className="h-4 w-4" />
              <span className="flex-1 text-left">Explorar</span>
            </Button>
          )}

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
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className={`${isOpen ? "w-86" : "w-16"} fixed top-20 left-0 h-[calc(100dvh-5rem)] overflow-y-auto p-4 border-r bg-background/95 backdrop-blur-sm z-40 transition-all duration-300 ease-in-out sidebar-scroll hidden md:block`}
      >
        {isOpen && <SidebarContent />}
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

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          
          {/* Mobile Sidebar */}
          <div className="fixed left-0 top-0 h-full w-80 bg-background border-r shadow-xl overflow-y-auto">
            <div className="p-4">
              <SidebarContent />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
