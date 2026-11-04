import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import Wave from '../components/Wave';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 text-center">
      <motion.h1 initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="grad-text font-accent text-8xl font-bold sm:text-9xl">404</motion.h1>
      <Wave bars={40} className="h-12 w-64" />
      <p className="text-xl font-display font-bold">Трек не найден</p>
      <p className="max-w-sm text-muted">Такой страницы нет — возможно, ссылка устарела. Вернёмся к музыке?</p>
      <Link to="/" className="btn-primary"><Home size={18} /> На главную</Link>
    </div>
  );
}
