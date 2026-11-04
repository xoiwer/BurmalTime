import { AnimatePresence, motion } from 'framer-motion';
import { Clock, Heart, Home as HomeIcon, Info, Music2, Search } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import About from '../pages/About';
import Catalog from '../pages/Catalog';
import Favorites from '../pages/Favorites';
import History from '../pages/History';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import TrackPage from '../pages/TrackPage';
import { useStore } from '../store';
import { PlayerBar, PlayerSheet } from './Player';

const NAV = [
  { to: '/', label: 'Главная', icon: HomeIcon, end: true },
  { to: '/mashups', label: 'Все мешапы', icon: Music2 },
  { to: '/favorites', label: 'Избранное', icon: Heart },
  { to: '/history', label: 'История', icon: Clock },
  { to: '/about', label: 'О проекте', icon: Info },
];
const logo = import.meta.env.BASE_URL + 'assets/logo/burmaltime-logo.svg';

export default function Layout() {
  const loc = useLocation();
  const navigate = useNavigate();
  const { current, expanded, notice, favorites } = useStore();
  const [q, setQ] = useState('');
  const submit = (e: FormEvent) => { e.preventDefault(); navigate(`/mashups${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`); };

  return (
    <div className="relative min-h-screen">
      <div className="aurora-bg fixed inset-0 -z-10" />

      {/* Боковое меню (ПК) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col gap-8 border-r border-white/5 bg-bg-2/60 p-5 backdrop-blur-xl lg:flex">
        <img src={logo} alt="BurmalTime" className="h-14 self-start" />
        <nav className="flex flex-col gap-1.5">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-gradient-to-r from-accent/80 to-pink/70 text-white shadow-glow' : 'text-muted hover:bg-white/5 hover:text-white'}`}>
              <Icon size={19} /> {label}
            </NavLink>
          ))}
        </nav>
        <p className="mt-auto text-xs text-muted">BurmalTime v1.0<br />Мешапы, ремиксы, нарезки</p>
      </aside>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/5 bg-bg/70 px-4 py-3 backdrop-blur-xl md:px-8">
          <img src={logo} alt="BurmalTime" className="h-9 lg:hidden" />
          <form onSubmit={submit} className="relative ml-auto max-w-md flex-1 lg:ml-0">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Поиск по мешапам…" className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-muted focus:border-accent/60" />
          </form>
          <NavLink to="/favorites" className="btn-primary !px-4 !py-2.5 text-sm">
            <Heart size={16} /> <span className="hidden sm:inline">Избранное</span> ({favorites.length})
          </NavLink>
        </header>

        <main className="mx-auto max-w-[1400px] px-4 pb-52 md:px-8 lg:pb-40">
          <AnimatePresence mode="wait">
            <motion.div key={loc.pathname} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
              <Routes location={loc}>
                <Route path="/" element={<Home />} />
                <Route path="/mashups" element={<Catalog />} />
                <Route path="/track/:id" element={<TrackPage />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/history" element={<History />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Нижнее меню (телефон и планшет) */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-white/10 bg-bg-2/90 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex min-w-0 flex-1 flex-col items-center gap-1 py-2.5 text-[10px] transition ${isActive ? 'text-accent' : 'text-muted'}`}>
            <Icon size={21} /> <span className="truncate">{label.replace('Все ', '')}</span>
          </NavLink>
        ))}
      </nav>

      <AnimatePresence>{current && <PlayerBar key="bar" />}</AnimatePresence>
      <AnimatePresence>{current && expanded && <PlayerSheet key="sheet" />}</AnimatePresence>

      <div className="pointer-events-none fixed inset-x-0 bottom-40 z-[80] flex justify-center px-4 lg:bottom-28">
        <AnimatePresence>
          {notice && (
            <motion.div key={notice} initial={{ opacity: 0, y: 12, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8 }} className="glass max-w-sm rounded-2xl bg-bg-2/90 px-5 py-3 text-center text-sm shadow-glow">
              {notice}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
