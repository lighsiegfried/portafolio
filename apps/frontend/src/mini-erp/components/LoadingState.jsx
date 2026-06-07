export default function LoadingState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-secondary">
      <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-400 rounded-full animate-spin mb-4" />
      <p className="text-sm">{message || 'Cargando...'}</p>
    </div>
  );
}
