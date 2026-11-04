import { motion } from 'framer-motion';
import { Heart, Pause, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fmt } from '../lib';
import { useStore } from '../store';
import type { Track } from '../types';

export default function TrackCard({ t, list }: { t: Track; list: string[] }) {
  const { play, current, playing, favorites, toggleFav, durations, plays } = useStore();
  const active = current?.id === t.id;
  const fav = favorites.includes(t.id);
  const mine = plays[t.id];

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={`group relative overflow-hidden rounded-2xl border bg-card shadow-card transition-shadow duration-300 hover:shadow-glow ${active ? 'border-accent/60' : 'border-white/5 hover:border-accent/40'}`}
    >
      <Link to={`/track/${t.id}`} className="relative block aspect-square overflow-hidden" aria-label={t.title}>
        <img src={t.cover} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
        {(t.demo || t.local) && (
          <span className="absolute left-2.5 top-2.5 rounded-md bg-black/55 px-2 py-0.5 text-[10px] font-semibold tracking-wider backdrop-blur">
            {t.demo ? 'DEMO' : 'МОЙ ФАЙЛ'}
          </span>
        )}
        <span className="absolute right-2.5 top-2.5 rounded-md bg-black/55 px-2 py-0.5 text-xs tabular-nums backdrop-blur">
          {fmt(t.duration ?? durations[t.id])}
        </span>
      </Link>
      <div className="flex items-center gap-2 p-3.5">
        <div className="min-w-0 flex-1">
          <Link to={`/track/${t.id}`} className="block truncate font-display font-bold hover:text-accent">{t.title}</Link>
          <p className="truncate text-xs text-muted">{t.artists}</p>
          {mine ? <p className="mt-0.5 text-[11px] text-accent/80">Вы слушали: {mine}</p> : null}
        </div>
        <button onClick={() => toggleFav(t.id)} aria-label={fav ? 'Убрать из избранного' : 'В избранное'} className="icon-btn h-9 w-9">
          <Heart size={18} className={fav ? 'fill-pink text-pink' : ''} />
        </button>
        <button
          onClick={() => play(t.id, list)}
          aria-label={active && playing ? 'Пауза' : 'Играть'}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-accent to-pink text-white shadow-glow transition active:scale-90 hover:brightness-110"
        >
          {active && playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="translate-x-[1px]" />}
        </button>
      </div>
    </motion.article>
  );
}
