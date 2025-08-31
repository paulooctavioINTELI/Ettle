export default function ProgressBar({ progress, enabled }: { progress: number; enabled: boolean }) {
  return (
    <div
      className={`h-2 w-full overflow-hidden rounded-full ${!enabled ? "bg-white/5" : "bg-white/10"}`}
      aria-hidden
    >
      <div
        className="h-full rounded-full bg-[var(--color-primary)] transition-[width] duration-300"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      />
    </div>
  );
}
