import { Clock, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Empty from '../components/Empty';
import TrackRow from '../components/TrackRow';
import { useStore } from '../store';

export default function History() {
  const { tracks, history, clearHistory } = useStore();
  const rows = history.map((h) => ({ h, t: tracks.find((t) => t.id === h.id) })).filter((r) => r.t) as { h: (typeof history)[number]; t: (typeof tracks)[number] }[];
  const ids = [...new Set(rows.map((r) => r.t.id))];
  return (
    <div className="pt-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">История</h1>
          <p className="mt-1 text-muted">Последние прослушивания на этом устройстве</p>
        </div>
        {rows.length > 0 && <button onClick={clearHistory} className="btn-ghost"><Trash2 size={16} /> Очистить</button>}
      </div>
      {rows.length ? (
        <div className="mt-6 flex max-w-3xl flex-col">
          {rows.map(({ h, t }) => <TrackRow key={h.at} t={t} list={ids} meta={new Date(h.at).toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })} />)}
        </div>
      ) : (
        <Empty icon={<Clock size={30} />} title="История пуста" text="Здесь появятся треки, которые вы послушали. Демо-карточки без аудио в историю не попадают.">
          <Link to="/mashups" className="btn-primary">Выбрать трек</Link>
        </Empty>
      )}
    </div>
  );
}
