import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface Props { title: string; icon?: ReactNode; to?: string; hint?: string; id?: string; children: ReactNode }

export default function Section({ title, icon, to, hint, id, children }: Props) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mt-12 scroll-mt-24"
    >
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2.5 font-display text-2xl font-extrabold">
            <span className="text-accent">{icon}</span>
            {title}
          </h2>
          {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
        </div>
        {to && (
          <Link to={to} className="flex shrink-0 items-center gap-1 text-sm text-muted transition hover:text-white">
            Смотреть все <ArrowRight size={16} />
          </Link>
        )}
      </div>
      {children}
    </motion.section>
  );
}
