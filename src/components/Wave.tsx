export default function Wave({ playing = true, bars = 32, className = '' }: { playing?: boolean; bars?: number; className?: string }) {
  return (
    <div className={`flex items-end gap-[3px] ${className}`} aria-hidden>
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className="wave-bar"
          style={{
            height: `${30 + ((i * 37) % 70)}%`,
            animationDelay: `${(i * 97) % 900}ms`,
            animationDuration: `${700 + ((i * 53) % 600)}ms`,
            animationPlayState: playing ? 'running' : 'paused',
          }}
        />
      ))}
    </div>
  );
}
