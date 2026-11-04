export type Category = 'best' | 'energy' | 'rare' | 'fan';

export interface Track {
  id: string;
  title: string;
  artists: string;
  cover: string;
  /** Путь к аудио. Если не задан — карточка работает как DEMO (без звука). */
  src?: string;
  /** Секунды. Необязательно: реальная длительность определяется из файла при первом воспроизведении. */
  duration?: number;
  category: Category[];
  description: string;
  addedAt: string; // ISO-дата
  demo?: boolean;
  local?: boolean; // файл добавлен пользователем с устройства
}
