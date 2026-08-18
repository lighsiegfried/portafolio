import useErpTranslation from '../i18n/useErpTranslation';

/**
 * Error state with an optional retry. Colors come from the `destructive`
 * semantic token, so the block reads on both the light and the dark surface.
 */
export default function ErrorState({ message, onRetry }) {
  const { te } = useErpTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
      <div className="w-12 h-12 mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
        <span className="text-destructive text-xl" aria-hidden="true">!</span>
      </div>
      <p className="text-sm text-destructive mb-4 text-center max-w-md">{message || te.errors.generic}</p>
      {onRetry && (
        <button onClick={onRetry} className="px-4 py-2 text-xs rounded-lg border border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
          {te.common.retry}
        </button>
      )}
    </div>
  );
}
