import type { Category, Track } from '../types';

const A = (p: string) => import.meta.env.BASE_URL + p;

export const CATEGORY_LABELS: Record<Category, string> = {
  best: 'Лучшие мешапы',
  energy: 'Энергичные миксы',
  rare: 'Редкие версии',
  fan: 'Фанатские подборки',
};

export const COVERS = ['purple-crown', 'violet-stage', 'electric-noise', 'neon-cat', 'glitch-title', 'blue-hour'].map(
  (n) => A(`assets/covers/${n}.svg`),
);

/*
 * КАК ДОБАВИТЬ СВОЙ ТРЕК
 * 1. Положите файл в public/audio/ (например public/audio/my-mashup.mp3).
 * 2. Скопируйте любой объект ниже, поменяйте id, title, artists, description.
 * 3. Укажите  src: A('audio/my-mashup.mp3')  и уберите  demo: true.
 * Используйте только свои записи или те, на которые есть разрешение.
 */
const demo = (id: string, n: number, title: string, category: Category[], day: number, description: string): Track => ({
  id,
  title,
  artists: 'Авторы не указаны',
  cover: COVERS[n],
  category,
  addedAt: `2026-10-0${day}`,
  description,
  demo: true,
});

const note = 'Демонстрационная карточка: аудиофайл не подключён. Добавьте запись в public/audio и укажите путь в src/data/tracks.ts.';

export const TRACKS: Track[] = [
  demo('demo-purple-crown', 0, 'Purple Crown', ['best'], 6, note),
  demo('demo-violet-stage', 1, 'Violet Stage', ['best', 'fan'], 5, note),
  demo('demo-electric-noise', 2, 'Electric Noise', ['energy'], 4, note),
  demo('demo-neon-cat', 3, 'Neon Cat', ['fan'], 3, note),
  demo('demo-glitch-title', 4, 'Glitch Title', ['energy', 'rare'], 2, note),
  demo('demo-blue-hour', 5, 'Blue Hour', ['rare'], 1, note),
];
