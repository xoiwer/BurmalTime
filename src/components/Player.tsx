import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward, Volume1, Volume2, VolumeX, X } from 'lucide-react';
import type { CSSProperties } from 'react';
import { fmt } from '../lib';
import { useStore, useTime } from '../store';
import Wave from './Wave';

function Progress() {
  const { seek, current } = useStore();
  const { time, duration } = useTime();
  const p = duration ? (time / duration) * 100 : 0;
  return (
    <div className="flex w-full items-center gap-3 text-[11px] tabular-nums text-muted">
      <span className="w-9 text-right">{fmt(time)}</span>
      <input
        aria-label="Перемотка" type="range" min={0} max={duration || 0} step={0.1} value={Math.min(time, duration || 0)}
        disabled={!current?.src} onChange={(e) => seek(+e.target.value)} className="range flex-1" style={{ '--p': `${p}%` } as CSSProperties}
      />
      <span className="w-9">{fmt(duration)}</span>
    </div>
  );
}

function Controls({ big = false }: { big?: boolean }) {
  const { playing, toggle, next, prev, shuffle, toggleShuffle, repeat, cycleRepeat } = useStore();
  const RepeatIcon = repeat === 'one' ? Repeat1 : Repeat;
  const sz = big ? 'h-12 w-12' : 'h-10 w-10';
  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-3">
      <button onClick={toggleShuffle} aria-label="Перемешать" aria-pressed={shuffle} className={`icon-btn h-9 w-9 ${shuffle ? '!text-accent' : ''}`}><Shuffle size={18} /></button>
      <button onClick={prev} aria-label="Предыдущий" className="icon-btn h-10 w-10"><SkipBack size={20} fill="currentColor" /></button>
      <button onClick={toggle} aria-label={playing ? 'Пауза' : 'Играть'} className={`${sz} grid shrink-0 place-items-center rounded-full bg-white text-bg shadow-glow transition active:scale-90 hover:scale-105`}>
        {playing ? <Pause size={big ? 24 : 20} fill="currentColor" /> : <Play size={big ? 24 : 20} fill="currentColor" className="translate-x-[1px]" />}
      </button>
      <button onClick={next} aria-label="Следующий" className="icon-btn h-10 w-10"><SkipForward size={20} fill="currentColor" /></button>
      <button onClick={cycleRepeat} aria-label="Повтор" className={`icon-btn h-9 w-9 ${repeat !== 'off' ? '!text-accent' : ''}`}><RepeatIcon size={18} /></button>
    </div>
  );
}

function Volume() {
  const { volume, setVolume } = useStore();
  const Icon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  return (
    <div className="flex items-center gap-2">
      <button onClick={() => setVolume(volume ? 0 : 0.8)} aria-label="Звук" className="icon-btn h-9 w-9"><Icon size={19} /></button>
      <input aria-label="Громкость" type="range" min={0} max={1} step={0.01} value={volume} onChange={(e) => setVolume(+e.target.value)} className="range w-24" style={{ '--p': `${volume * 100}%` } as CSSProperties} />
    </div>
  );
}

/** Нижний закреплённый плеер (компактный режим) */
export function PlayerBar() {
  const { current, playing, toggle, next, setExpanded, closePlayer } = useStore();
  const { time, duration } = useTime();
  if (!current) return null;
  return (
    <motion.div
      initial={{ y: 120, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 120, opacity: 0 }}
      transition={{ type: 'spring', damping: 26, stiffness: 240 }}
      className="fixed inset-x-2 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-50 overflow-hidden rounded-2xl glass bg-bg-2/80 shadow-card lg:inset-x-0 lg:bottom-0 lg:rounded-none lg:border-x-0 lg:border-b-0"
    >
      <div className="absolute inset-x-0 top-0 h-[2px] bg-white/10 md:hidden">
        <div className="h-full bg-gradient-to-r from-accent to-pink" style={{ width: `${duration ? (time / duration) * 100 : 0}%` }} />
      </div>
      <div className="mx-auto grid max-w-[1800px] grid-cols-[1fr_auto] items-center gap-3 px-3 py-2.5 md:grid-cols-[minmax(0,1fr)_minmax(320px,560px)_minmax(0,1fr)] md:px-5 md:py-3">
        <button onClick={() => setExpanded(true)} className="flex min-w-0 items-center gap-3 text-left" aria-label="Развернуть плеер">
          <img src={current.cover} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover shadow-glow" />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{current.title}</p>
            <p className="truncate text-xs text-muted">{current.artists}</p>
          </div>
          <Wave playing={playing} bars={14} className="ml-2 hidden h-7 w-20 xl:flex" />
        </button>

        <div className="hidden flex-col gap-1.5 md:flex"><Controls /><Progress /></div>
        <div className="flex items-center gap-1 md:hidden">
          <button onClick={toggle} aria-label={playing ? 'Пауза' : 'Играть'} className="grid h-11 w-11 place-items-center rounded-full bg-white text-bg active:scale-90">
            {playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="translate-x-[1px]" />}
          </button>
          <button onClick={next} aria-label="Следующий" className="icon-btn h-10 w-10"><SkipForward size={20} fill="currentColor" /></button>
        </div>

        <div className="hidden items-center justify-end gap-1 md:flex">
          <Volume />
          <button onClick={() => setExpanded(true)} aria-label="Расширенный режим" className="icon-btn h-9 w-9"><ChevronUp size={20} /></button>
          <button onClick={closePlayer} aria-label="Закрыть плеер" className="icon-btn h-9 w-9"><X size={18} /></button>
        </div>
      </div>
    </motion.div>
  );
}

/** Расширенный режим: на телефоне — на весь экран, на ПК — большая панель с очередью */
export function PlayerSheet() {
  const { current, playing, queue, tracks, play, setExpanded } = useStore();
  if (!current) return null;
  const list = (queue.length ? queue : tracks.map((t) => t.id)).map((id) => tracks.find((t) => t.id === id)).filter(Boolean) as typeof tracks;
  return (
    <motion.div
      initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 260 }}
      className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-bg-2/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-2xl md:inset-x-0 md:top-auto md:h-[440px] md:rounded-t-3xl md:border-t md:border-white/10 md:shadow-glow"
    >
      <div className="pointer-events-none absolute inset-0 opacity-40" style={{ background: 'radial-gradient(60% 60% at 20% 30%, rgba(168,85,247,.35), transparent 70%)' }} />
      <button onClick={() => setExpanded(false)} aria-label="Свернуть плеер" className="icon-btn absolute right-4 top-4 z-10 h-10 w-10 bg-white/5"><ChevronDown size={22} /></button>
      <div className="relative mx-auto grid w-full max-w-6xl flex-1 gap-6 p-6 pt-14 md:grid-cols-[220px_1fr] md:items-center md:pt-6 lg:grid-cols-[220px_1fr_300px]">
        <motion.img
          initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15, duration: 0.5 }}
          src={current.cover} alt="" className="mx-auto aspect-square w-full max-w-[280px] rounded-3xl object-cover shadow-glow md:max-w-[220px]"
        />
        <div className="flex flex-col gap-5">
          <div className="text-center md:text-left">
            <h3 className="font-display text-2xl font-extrabold md:text-3xl">{current.title}</h3>
            <p className="text-muted">{current.artists}</p>
          </div>
          <Wave playing={playing} bars={48} className="h-14 w-full" />
          <Progress />
          <Controls big />
          <div className="flex justify-center md:justify-start"><Volume /></div>
        </div>
        <div className="hidden max-h-[340px] flex-col gap-1 overflow-y-auto pr-1 lg:flex">
          <p className="mb-1 text-sm font-semibold text-muted">Очередь</p>
          {list.map((t) => (
            <button key={t.id} onClick={() => play(t.id)} className={`flex items-center gap-3 rounded-lg p-2 text-left transition hover:bg-white/5 ${t.id === current.id ? 'bg-white/10' : ''}`}>
              <img src={t.cover} alt="" className="h-9 w-9 rounded-md object-cover" />
              <span className="truncate text-sm">{t.title}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
