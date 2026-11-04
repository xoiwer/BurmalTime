import type { ReactNode } from 'react';

export default function Empty({ icon, title, text, children }: { icon: ReactNode; title: string; text: string; children?: ReactNode }) {
  return (
    <div className="glass mx-auto mt-10 flex max-w-lg flex-col items-center gap-3 rounded-3xl p-10 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-accent/15 text-accent">{icon}</div>
      <h3 className="font-display text-xl font-bold">{title}</h3>
      <p className="text-sm text-muted">{text}</p>
      {children && <div className="mt-2 flex flex-wrap justify-center gap-3">{children}</div>}
    </div>
  );
}
