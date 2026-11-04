import { Pause, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fmt } from '../lib';
import { useStore } from '../store';
import type { Track } from '../types';

export default function TrackRow({ t, list, meta }: { t: Track; list: string[]; meta?: string }) {
  const { play, current, playing, durations } = useStore();
  const active = current?.id === t.id;
  return (
    <div className={`flex items-center gap-3 rounded-xl p-2.5 transition hover:bg-white/5 ${active ? 'bg-white/5' : ''}`}>
      <button onClick={() => play(t.id, list)} aria-label="Играть" className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
        <img src={t.cover} alt="" className="h-full w-full object-cover" />
        <span className="absolute inset-0 grid place-items-center bg-black/40 text-white">
          {active && playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
        </span>
      </button>
      <Link to={`/track/${t.id}`} className="min-w-0 flex-1">
        <p className="truncate font-semibold">{t.title}</p>
        <p className="truncate text-xs text-muted">{meta ?? t.artists}</p>
      </Link>
      <span className="text-xs tabular-nums text-muted">{fmt(t.duration ?? durations[t.id])}</span>
    </div>
  );
}
