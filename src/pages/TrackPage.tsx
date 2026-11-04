import { motion } from 'framer-motion';
import { Heart, Pause, Play, Share2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import Section from '../components/Section';
import TrackCard from '../components/TrackCard';
import Wave from '../components/Wave';
import { CATEGORY_LABELS } from '../data/tracks';
import { fmt } from '../lib';
import { useStore } from '../store';
import NotFound from './NotFound';

export default function TrackPage() {
  const { id } = useParams();
  const { tracks, play, current, playing, favorites, toggleFav, durations, plays, flash } = useStore();
  const t = tracks.find((x) => x.id === id);
  if (!t) return <NotFound />;

  const active = current?.id === t.id;
  const fav = favorites.includes(t.id);
  const ids = tracks.map((x) => x.id);
  const similar = [...tracks.filter((x) => x.id !== t.id && x.category.some((c) => t.category.includes(c))), ...tracks.filter((x) => x.id !== t.id)]
    .filter((x, i, a) => a.indexOf(x) === i).slice(0, 5);

  const share = async () => {
    try { await navigator.clipboard.writeText(location.href); flash('Ссылка скопирована'); } catch { flash('Не удалось скопировать ссылку'); }
  };

  return (
    <div className="pt-8">
      <div className="grid gap-8 md:grid-cols-[minmax(0,360px)_1fr] md:items-center lg:grid-cols-[minmax(0,440px)_1fr] lg:gap-12">
        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative mx-auto w-full max-w-sm md:max-w-none">
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-accent/40 to-pink/30 blur-3xl" />
          <img src={t.cover} alt={t.title} className="relative aspect-square w-full rounded-3xl object-cover shadow-glow" />
        </motion.div>

        <div>
          <div className="flex flex-wrap gap-2">
            {t.demo && <span className="rounded-md bg-white/10 px-2.5 py-1 text-xs font-semibold tracking-wider">DEMO</span>}
            {t.local && <span className="rounded-md bg-white/10 px-2.5 py-1 text-xs font-semibold tracking-wider">МОЙ ФАЙЛ</span>}
            {t.category.map((c) => <span key={c} className="rounded-md bg-accent/20 px-2.5 py-1 text-xs text-accent">{CATEGORY_LABELS[c]}</span>)}
          </div>
          <h1 className="mt-4 font-accent text-4xl font-bold leading-tight sm:text-5xl">{t.title}</h1>
          <p className="mt-2 text-lg text-muted">{t.artists}</p>
          <p className="mt-1 text-sm text-muted">
            Длительность: {fmt(t.duration ?? durations[t.id])}{plays[t.id] ? ` · Вы слушали: ${plays[t.id]}` : ''}
          </p>

          <Wave playing={active && playing} bars={56} className="mt-6 h-16 max-w-xl" />

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => play(t.id, ids)} className="btn-primary px-8">
              {active && playing ? <><Pause size={18} fill="currentColor" /> Пауза</> : <><Play size={18} fill="currentColor" /> Слушать</>}
            </button>
            <button onClick={() => toggleFav(t.id)} className="btn-ghost"><Heart size={18} className={fav ? 'fill-pink text-pink' : ''} /> {fav ? 'В избранном' : 'В избранное'}</button>
            <button onClick={share} className="btn-ghost"><Share2 size={18} /> Поделиться</button>
          </div>

          <h2 className="mt-8 font-display text-lg font-bold">Описание</h2>
          <p className="mt-2 max-w-2xl text-white/70">{t.description}</p>
        </div>
      </div>

      <Section title="Похожие композиции">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-5">
          {similar.map((x) => <TrackCard key={x.id} t={x} list={ids} />)}
        </div>
      </Section>
    </div>
  );
}
