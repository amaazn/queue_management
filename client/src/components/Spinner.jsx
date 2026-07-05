export default function Spinner({ size = 22, className = "" }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export function LoadingScreen({ label = "Loading..." }) {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-3 text-slate-400">
      <Spinner size={34} className="text-brand-600" />
      <p className="text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
}
