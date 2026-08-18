import useErpTranslation from '../i18n/useErpTranslation';

/** Centered spinner + label. The spinner rides the ERP primary token. */
export default function LoadingState({ message }) {
  const { te } = useErpTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
      <div
        className="w-8 h-8 border-2 border-[hsl(var(--primary)/0.3)] border-t-[hsl(var(--primary))] rounded-full animate-spin mb-4"
        aria-hidden="true"
      />
      <p className="text-sm">{message || te.common.loading}</p>
    </div>
  );
}
