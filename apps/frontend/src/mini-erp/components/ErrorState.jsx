export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
      <div className="w-12 h-12 mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
        <span className="text-red-400 text-xl">!</span>
      </div>
      <p className="text-sm text-red-300 mb-4 text-center max-w-md">{message || 'Error al cargar datos'}</p>
      {onRetry && (
        <button onClick={onRetry} className="px-4 py-2 text-xs rounded-lg border border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
          Reintentar
        </button>
      )}
    </div>
  );
}
