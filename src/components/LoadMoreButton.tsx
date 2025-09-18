interface LoadMoreButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
}

export function LoadMoreButton({ 
  onClick, 
  disabled = false,
  loading = false,
  children = 'Cargar más posts'
}: LoadMoreButtonProps) {
  return (
    <div className="text-center mt-12">
      <button 
        onClick={onClick}
        disabled={disabled || loading}
        className={`px-8 py-3 bg-devtalles-gradient text-white rounded-lg hover:opacity-90 transition-opacity ${
          disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Cargando...' : children}
      </button>
    </div>
  );
}
