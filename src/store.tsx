import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { COVERS, TRACKS } from './data/tracks';
import type { Track } from './types';

export type Repeat = 'off' | 'all' | 'one';
export type Hist = { id: string; at: number };

const load = <T,>(k: string, d: T): T => {
  try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : d; } catch { return d; }
};
const save = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage недоступен */ } };

interface Store {
  tracks: Track[];
  current?: Track;
  queue: string[];
  playing: boolean;
  volume: number;
  repeat: Repeat;
  shuffle: boolean;
  expanded: boolean;
  notice: string | null;
  durations: Record<string, number>;
  favorites: string[];
  history: Hist[];
  plays: Record<string, number>;
  play: (id: string, list?: string[]) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (t: number) => void;
  setVolume: (v: number) => void;
  cycleRepeat: () => void;
  toggleShuffle: () => void;
  setExpanded: (b: boolean) => void;
  closePlayer: () => void;
  toggleFav: (id: string) => void;
  clearHistory: () => void;
  addFiles: (f: FileList | File[]) => void;
  flash: (m: string) => void;
}

const Ctx = createContext<Store>(null as unknown as Store);
const TimeCtx = createContext({ time: 0, duration: 0 });
export const useStore = () => useContext(Ctx);
export const useTime = () => useContext(TimeCtx);

export function StoreProvider({ children }: { children: ReactNode }) {
  const audio = useMemo(() => new Audio(), []);
  const [uploads, setUploads] = useState<Track[]>([]);
  const tracks = useMemo(() => [...uploads, ...TRACKS], [uploads]);

  const [currentId, setCurrentId] = useState<string | null>(null);
  const [queue, setQueue] = useState<string[]>([]);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [durations, setDurations] = useState<Record<string, number>>({});
  const [volume, setVolumeState] = useState(() => load('bt:vol', 0.8));
  const [repeat, setRepeat] = useState<Repeat>(() => load('bt:repeat', 'off'));
  const [shuffle, setShuffle] = useState(() => load('bt:shuffle', false));
  const [expanded, setExpanded] = useState(() => load('bt:expanded', false));
  const [favorites, setFavorites] = useState<string[]>(() => load('bt:fav', []));
  const [history, setHistory] = useState<Hist[]>(() => load('bt:hist', []));
  const [notice, setNotice] = useState<string | null>(null);

  // Актуальные значения для обработчиков событий <audio>
  const S = useRef({ tracks, queue, currentId, repeat, shuffle });
  S.current = { tracks, queue, currentId, repeat, shuffle };

  const noticeTimer = useRef<number>();
  const flash = useCallback((m: string) => {
    setNotice(m);
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(null), 3200);
  }, []);

  const startTrack = useCallback((id: string) => {
    const t = S.current.tracks.find((x) => x.id === id);
    if (!t) return;
    S.current.currentId = id;
    setCurrentId(id);
    setTime(0);
    setDuration(t.duration ?? 0);
    if (!t.src) {
      audio.pause();
      audio.removeAttribute('src');
      setPlaying(false);
      flash('У этого DEMO-трека нет аудиофайла. Подключите запись — см. «О проекте».');
      return;
    }
    audio.src = t.src;
    audio.play().catch(() => { setPlaying(false); flash('Не удалось запустить воспроизведение'); });
    setHistory((h) => { const n = [{ id, at: Date.now() }, ...h].slice(0, 100); save('bt:hist', n); return n; });
  }, [audio, flash]);

  const step = useCallback((dir: 1 | -1, auto = false) => {
    const { tracks: ts, queue: q, currentId: cur, shuffle: sh, repeat: rp } = S.current;
    const playable = (id: string) => !!ts.find((t) => t.id === id)?.src;
    const list = q.length ? q : ts.map((t) => t.id);
    const i = list.indexOf(cur ?? '');
    let cand: string | undefined;
    if (sh) {
      const pool = list.filter((id) => id !== cur && playable(id));
      cand = pool[Math.floor(Math.random() * pool.length)];
    } else {
      for (let k = 1; k <= list.length; k++) {
        const j = i + dir * k;
        if (auto && rp !== 'all' && (j < 0 || j >= list.length)) break;
        const id = list[((j % list.length) + list.length) % list.length];
        if (playable(id)) { cand = id; break; }
      }
    }
    if (cand) startTrack(cand);
    else if (auto) { setPlaying(false); setTime(0); }
    else flash('Нет других треков с подключённым аудио');
  }, [startTrack, flash]);

  const toggle = useCallback(() => {
    const t = S.current.tracks.find((x) => x.id === S.current.currentId);
    if (!t) return;
    if (!t.src) { flash('У этого DEMO-трека нет аудиофайла'); return; }
    if (audio.paused) audio.play().catch(() => flash('Не удалось запустить воспроизведение'));
    else audio.pause();
  }, [audio, flash]);

  const play = useCallback((id: string, list?: string[]) => {
    if (list) { S.current.queue = list; setQueue(list); }
    const t = S.current.tracks.find((x) => x.id === id);
    if (id === S.current.currentId && t?.src) { toggle(); return; }
    startTrack(id);
  }, [startTrack, toggle]);

  const next = useCallback(() => step(1), [step]);
  const prev = useCallback(() => { if (audio.currentTime > 3) audio.currentTime = 0; else step(-1); }, [audio, step]);
  const seek = useCallback((t: number) => { if (isFinite(t)) { audio.currentTime = t; setTime(t); } }, [audio]);
  const setVolume = useCallback((v: number) => { setVolumeState(v); save('bt:vol', v); }, []);
  const cycleRepeat = useCallback(() => setRepeat((r) => { const n: Repeat = r === 'off' ? 'all' : r === 'all' ? 'one' : 'off'; save('bt:repeat', n); return n; }), []);
  const toggleShuffle = useCallback(() => setShuffle((s) => { save('bt:shuffle', !s); return !s; }), []);
  const setExp = useCallback((b: boolean) => { setExpanded(b); save('bt:expanded', b); }, []);
  const closePlayer = useCallback(() => { audio.pause(); audio.removeAttribute('src'); S.current.currentId = null; setCurrentId(null); setPlaying(false); }, [audio]);
  const toggleFav = useCallback((id: string) => setFavorites((f) => { const n = f.includes(id) ? f.filter((x) => x !== id) : [id, ...f]; save('bt:fav', n); return n; }), []);
  const clearHistory = useCallback(() => { setHistory([]); save('bt:hist', []); }, []);

  const addFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files).filter((f) => f.type.startsWith('audio/') || /\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(f.name));
    if (!arr.length) { flash('Выберите аудиофайл (mp3, wav, ogg, m4a)'); return; }
    const now = Date.now();
    const added: Track[] = arr.map((f, i) => ({
      id: `local-${now}-${i}`,
      title: f.name.replace(/\.[^.]+$/, ''),
      artists: 'Мой файл',
      cover: COVERS[(now + i) % COVERS.length],
      src: URL.createObjectURL(f),
      category: [],
      description: 'Файл с вашего устройства. Он доступен до обновления страницы — для постоянного хранения добавьте его в public/audio.',
      addedAt: new Date(now).toISOString(),
      local: true,
    }));
    setUploads((u) => [...added, ...u]);
    flash(`Добавлено треков: ${added.length}`);
  }, [flash]);

  // События <audio>
  useEffect(() => {
    const on: Record<string, () => void> = {
      play: () => setPlaying(true),
      pause: () => setPlaying(false),
      timeupdate: () => setTime(audio.currentTime),
      loadedmetadata: () => {
        setDuration(audio.duration);
        const id = S.current.currentId;
        if (id && isFinite(audio.duration)) setDurations((d) => ({ ...d, [id]: audio.duration }));
      },
      ended: () => step(1, true),
      error: () => { if (audio.getAttribute('src')) { flash('Файл не найден или не поддерживается'); setPlaying(false); } },
    };
    Object.entries(on).forEach(([e, f]) => audio.addEventListener(e, f));
    return () => Object.entries(on).forEach(([e, f]) => audio.removeEventListener(e, f));
  }, [audio, step, flash]);

  useEffect(() => { audio.volume = volume; }, [audio, volume]);
  useEffect(() => { audio.loop = repeat === 'one'; }, [audio, repeat]);

  const current = tracks.find((t) => t.id === currentId);

  // Управление с экрана блокировки / медиаклавиш
  useEffect(() => {
    if (!('mediaSession' in navigator) || !current) return;
    navigator.mediaSession.metadata = new MediaMetadata({ title: current.title, artist: current.artists });
    navigator.mediaSession.setActionHandler('play', toggle);
    navigator.mediaSession.setActionHandler('pause', toggle);
    navigator.mediaSession.setActionHandler('nexttrack', next);
    navigator.mediaSession.setActionHandler('previoustrack', prev);
  }, [current, toggle, next, prev]);

  // Локальная статистика прослушиваний (только на этом устройстве)
  const plays = useMemo(() => history.reduce<Record<string, number>>((a, h) => ((a[h.id] = (a[h.id] || 0) + 1), a), {}), [history]);

  const value = useMemo<Store>(() => ({
    tracks, current, queue, playing, volume, repeat, shuffle, expanded, notice, durations, favorites, history, plays,
    play, toggle, next, prev, seek, setVolume, cycleRepeat, toggleShuffle, setExpanded: setExp, closePlayer, toggleFav, clearHistory, addFiles, flash,
  }), [tracks, current, queue, playing, volume, repeat, shuffle, expanded, notice, durations, favorites, history, plays,
    play, toggle, next, prev, seek, setVolume, cycleRepeat, toggleShuffle, setExp, closePlayer, toggleFav, clearHistory, addFiles, flash]);

  const timeValue = useMemo(() => ({ time, duration }), [time, duration]);

  return (
    <Ctx.Provider value={value}>
      <TimeCtx.Provider value={timeValue}>{children}</TimeCtx.Provider>
    </Ctx.Provider>
  );
}
