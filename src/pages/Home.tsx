import { motion } from 'framer-motion';
import { ArrowDown, Flame, Play, Sparkles, LayoutGrid, ChevronRight, History as HistoryIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Section from '../components/Section';
import TrackCard from '../components/TrackCard';
import Wave from '../components/Wave';
import { CATEGORY_LABELS } from '../data/tracks';
import { useStore } from '../store';

const logo = import.meta.env.BASE_URL + 'assets/logo/burmaltime-logo.svg';
const wavePic = import.meta.env.BASE_URL + 'assets/icons/waveform.svg';
const rise = (i: number) => ({ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 + i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } });

export default function Home() {
  const { tracks, plays, history, play } = useStore();
  const ids = tracks.map((t) => t.id);
  const popular = [...tracks].sort((a, b) => (plays[b.id] || 0) - (plays[a.id] || 0)).slice(0, 5);
  const fresh = [...tracks].sort((a, b) => b.addedAt.localeCompare(a.addedAt)).slice(0, 5);
  const recent = [...new Set(history.map((h) => h.id))].map((id) => tracks.find((t) => t.id === id)).filter(Boolean).slice(0, 5) as typeof tracks;

  const byCat = (k: keyof typeof CATEGORY_LABELS) => ({ key: k as string, title: CATEGORY_LABELS[k], to: `/mashups?cat=${k}`, list: tracks.filter((t) => t.category.includes(k)) });
  const collections = [
    byCat('best'),
    { key: 'popular', title: 'Самые популярные', to: '/mashups?sort=popular', list: popular },
    byCat('energy'),
    byCat('rare'),
    byCat('fan'),
  ];

  const listen = () => { const t = tracks.find((x) => x.src) ?? tracks[0]; if (t) play(t.id, ids); };

  return (
    <div className="pt-6">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-card via-bg-2 to-bg p-6 shadow-card sm:p-10 lg:p-14">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-accent/25 blur-[110px]" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-pink/15 blur-[110px]" />
        <motion.img {...rise(0)} src={logo} alt="BurmalTime" className="relative h-16 sm:h-20" />
        <motion.h1 {...rise(1)} className="relative mt-5 font-accent text-4xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl">
          ТВОЯ МУЗЫКА.<br /><span className="grad-text">ТВОЙ РИТМ.</span>
        </motion.h1>
        <motion.p {...rise(2)} className="relative mt-5 max-w-xl text-base text-white/70 sm:text-lg">
          Мешапы, ремиксы и музыкальные нарезки с Меллстроем — слушай, ищи и собирай своё избранное.
        </motion.p>
        <motion.div {...rise(3)} className="relative mt-7 flex flex-wrap gap-3">
          <button onClick={listen} className="btn-primary px-7"><Play size={18} fill="currentColor" /> Слушать сейчас</button>
          <button onClick={() => document.getElementById('popular')?.scrollIntoView({ behavior: 'smooth' })} className="btn-ghost">Узнать больше <ArrowDown size={16} /></button>
        </motion.div>
        <motion.div {...rise(4)} className="relative mt-10 flex items-end gap-6">
          <Wave bars={64} className="h-24 flex-1 sm:h-32" />
          <img src={wavePic} alt="" className="hidden h-24 opacity-60 xl:block" />
        </motion.div>
      </section>

      {recent.length > 0 && (
        <Section title="Недавно прослушанные" icon={<HistoryIcon size={22} />} to="/history">
          <Grid>{recent.map((t) => <TrackCard key={t.id} t={t} list={ids} />)}</Grid>
        </Section>
      )}

      <Section id="popular" title="Популярное" icon={<Flame size={22} />} to="/mashups?sort=popular" hint="Сортировка по вашим прослушиваниям на этом устройстве">
        <Grid>{popular.map((t) => <TrackCard key={t.id} t={t} list={ids} />)}</Grid>
      </Section>

      <Section title="Новинки" icon={<Sparkles size={22} />} to="/mashups">
        <Grid>{fresh.map((t) => <TrackCard key={t.id} t={t} list={ids} />)}</Grid>
      </Section>

      <Section title="Подборки" icon={<LayoutGrid size={22} />}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c) => (
            <Link key={c.key} to={c.to} className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-card p-3.5 transition hover:border-accent/40 hover:shadow-glow">
              <div className="flex -space-x-5">
                {(c.list.length ? c.list : tracks).slice(0, 3).map((t) => <img key={t.id} src={t.cover} alt="" className="h-14 w-14 rounded-xl border-2 border-card object-cover transition group-hover:-translate-y-1" />)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display font-bold">{c.title}</p>
                <p className="text-xs text-muted">{c.list.length} {plural(c.list.length)}</p>
              </div>
              <ChevronRight className="text-muted transition group-hover:translate-x-1 group-hover:text-white" />
            </Link>
          ))}
        </div>
      </Section>
    </div>
  );
}

const Grid = ({ children }: { children: ReactNode }) => <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-5">{children}</div>;
export const plural = (n: number) => (n % 10 === 1 && n % 100 !== 11 ? 'трек' : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100) ? 'трека' : 'треков');
