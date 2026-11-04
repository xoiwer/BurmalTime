import { SearchX, Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import Empty from '../components/Empty';
import TrackCard from '../components/TrackCard';
import UploadButton from '../components/UploadButton';
import { CATEGORY_LABELS } from '../data/tracks';
import { useStore } from '../store';

export default function Catalog() {
  const { tracks, plays } = useStore();
  const [sp, setSp] = useSearchParams();
  const q = sp.get('q') ?? '';
  const cat = sp.get('cat') ?? 'all';
  const sort = sp.get('sort') ?? 'new';
  const set = (k: string, v: string) => { const n = new URLSearchParams(sp); if (v) n.set(k, v); else n.delete(k); setSp(n, { replace: true }); };

  const list = tracks
    .filter((t) => (cat === 'all' ? true : cat === 'mine' ? t.local : t.category.includes(cat as never)))
    .filter((t) => `${t.title} ${t.artists}`.toLowerCase().includes(q.trim().toLowerCase()))
    .sort((a, b) =>
      sort === 'old' ? a.addedAt.localeCompare(b.addedAt)
      : sort === 'title' ? a.title.localeCompare(b.title, 'ru')
      : sort === 'popular' ? (plays[b.id] || 0) - (plays[a.id] || 0)
      : b.addedAt.localeCompare(a.addedAt));
  const ids = list.map((t) => t.id);
  const chips: [string, string][] = [['all', 'Все'], ...(Object.entries(CATEGORY_LABELS) as [string, string][]), ['mine', 'Мои файлы']];

  return (
    <div className="pt-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Все мешапы</h1>
          <p className="mt-1 text-muted">{list.length} из {tracks.length} треков</p>
        </div>
        <UploadButton />
      </div>

      <div className="mt-6 flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input value={q} onChange={(e) => set('q', e.target.value)} placeholder="Поиск по названию или автору" className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-11 pr-4 outline-none transition placeholder:text-muted focus:border-accent/60" />
        </div>
        <select value={sort} onChange={(e) => set('sort', e.target.value)} aria-label="Сортировка" className="rounded-full border border-white/10 bg-bg-2 px-5 py-3 outline-none focus:border-accent/60">
          <option value="new">Сначала новые</option>
          <option value="old">Сначала старые</option>
          <option value="title">По названию А–Я</option>
          <option value="popular">Чаще слушаю я</option>
        </select>
      </div>

      <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:flex-wrap md:px-0">
        {chips.map(([k, label]) => (
          <button key={k} onClick={() => set('cat', k === 'all' ? '' : k)} className={`chip shrink-0 ${cat === k ? 'chip-on' : ''}`}>{label}</button>
        ))}
      </div>

      {list.length ? (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-5">
          {list.map((t) => <TrackCard key={t.id} t={t} list={ids} />)}
        </div>
      ) : (
        <Empty icon={<SearchX size={30} />} title="Ничего не найдено" text="Попробуйте изменить запрос или сбросить фильтры.">
          <button className="btn-primary" onClick={() => setSp({}, { replace: true })}>Сбросить</button>
        </Empty>
      )}
    </div>
  );
}
