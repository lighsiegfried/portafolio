export default function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
      <div className="w-12 h-12 mb-4 rounded-full bg-muted/50 flex items-center justify-center">
        <span className="text-muted-foreground text-xl">-</span>
      </div>
      <p className="text-sm">{message || 'Sin datos'}</p>
    </div>
  );
}
