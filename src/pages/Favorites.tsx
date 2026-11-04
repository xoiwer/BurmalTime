import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Empty from '../components/Empty';
import TrackCard from '../components/TrackCard';
import { useStore } from '../store';

export default function Favorites() {
  const { tracks, favorites } = useStore();
  const list = favorites.map((id) => tracks.find((t) => t.id === id)).filter(Boolean) as typeof tracks;
  const ids = list.map((t) => t.id);
  return (
    <div className="pt-8">
      <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Избранное</h1>
      <p className="mt-1 text-muted">Сохраняется в браузере (LocalStorage)</p>
      {list.length ? (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-5">{list.map((t) => <TrackCard key={t.id} t={t} list={ids} />)}</div>
      ) : (
        <Empty icon={<Heart size={30} />} title="Пока пусто" text="Нажмите на сердечко у любого трека — он появится здесь.">
          <Link to="/mashups" className="btn-primary">Открыть каталог</Link>
        </Empty>
      )}
    </div>
  );
}
