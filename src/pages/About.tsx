import { FolderPlus, ShieldCheck, Smartphone } from 'lucide-react';
import UploadButton from '../components/UploadButton';

const cards = [
  { icon: FolderPlus, title: 'Как подключить аудио', text: 'Положите файл в public/audio, затем добавьте запись в src/data/tracks.ts и укажите путь в поле src. Подробности — в README.' },
  { icon: Smartphone, title: 'Свой файл прямо сейчас', text: 'Кнопка ниже добавляет mp3/wav/ogg с вашего устройства. Файл живёт до обновления страницы и никуда не загружается.' },
  { icon: ShieldCheck, title: 'Только легальная музыка', text: 'Используйте собственные записи или те, на которые есть разрешение правообладателей. Счётчики прослушиваний не выдумываются: показывается только ваша локальная статистика.' },
];

export default function About() {
  return (
    <div className="pt-8">
      <h1 className="font-display text-3xl font-extrabold sm:text-4xl">О проекте</h1>
      <p className="mt-3 max-w-2xl text-white/70">BurmalTime — фанатская музыкальная платформа с мешапами, ремиксами и нарезками. Всё работает во frontend: без сервера и базы данных.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {cards.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-2xl border border-white/5 bg-card p-6">
            <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-accent/15 text-accent"><Icon size={22} /></div>
            <h3 className="font-display font-bold">{title}</h3>
            <p className="mt-2 text-sm text-muted">{text}</p>
          </div>
        ))}
      </div>
      <div className="mt-8"><UploadButton className="btn-primary" /></div>
    </div>
  );
}
