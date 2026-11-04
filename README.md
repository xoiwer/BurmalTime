# BurmalTime

Музыкальный сайт мешапов: React + Vite + TypeScript + Tailwind CSS + Framer Motion + Lucide + HTML5 Audio.
Работает полностью во frontend: без сервера и базы данных. Избранное, история и громкость хранятся в LocalStorage.

## Запуск

Нужен Node.js 18+ (https://nodejs.org).

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # готовый сайт в папке dist/
npm run preview    # проверить сборку локально
npm run typecheck  # проверка типов
```

## Как добавить свою музыку

1. Положите файл в `public/audio/` (например `public/audio/my-mashup.mp3`).
2. Откройте `src/data/tracks.ts`, скопируйте любую карточку, поменяйте `id`, `title`, `artists`, `description`.
3. Укажите `src: A('audio/my-mashup.mp3')` и уберите `demo: true`.
4. Длительность определяется из файла сама (или задайте `duration` в секундах).
5. Свои обложки кладите в `public/assets/covers/` и подключайте через поле `cover`.

Быстрая проверка без правки кода: кнопка «Добавить свой файл» (каталог и «О проекте») — файл доступен до обновления страницы.

Используйте только собственные записи или те, на которые у вас есть разрешение. Счётчики прослушиваний не выдуманы:
показывается только локальная статистика пользователя на его устройстве.

## Публикация в интернете

Сначала `npm run build` — результат в `dist/`. Маршрутизация на HashRouter (`/#/mashups`), поэтому настройка редиректов не нужна.

**Netlify (проще всего):** откройте https://app.netlify.com/drop и перетащите папку `dist`.

**Cloudflare Pages / Vercel:** подключите репозиторий GitHub, Build command `npm run build`, Output directory `dist`.

**GitHub Pages:** загрузите проект в репозиторий, затем `npm run build` и опубликуйте содержимое `dist` в ветку `gh-pages`
(или используйте GitHub Actions). Vite уже настроен с `base: './'`.

Лимит размера файлов зависит от хостинга: для больших треков используйте mp3 128–192 kbps.

## Структура

```
src/
  main.tsx, App.tsx      вход, роутер
  store.tsx              плеер (Audio API), избранное, история, загрузка файлов
  data/tracks.ts         каталог треков (здесь добавляются записи)
  components/            Layout, Player, TrackCard, Wave, Section, ...
  pages/                 Home, Catalog, TrackPage, Favorites, History, About, NotFound
public/assets/           логотип, обложки, фон; public/audio/ — ваши записи
```

## Загрузка на GitHub

Папки `src` и `public` должны попасть в репозиторий целиком. Надёжнее всего через git:

```bash
cd burmaltime
git init && git add . && git commit -m "BurmalTime"
git branch -M main
git remote add origin https://github.com/ВАШ_ЛОГИН/ВАШ_РЕПОЗИТОРИЙ.git
git push -u origin main
```

Через сайт GitHub («Add file → Upload files») перетаскивайте **сами папки** `src` и `public`, а не только файлы из корня.
После загрузки вкладка Actions запустит проверку `npm install` и `npm run build` (файл `.github/workflows/build.yml`).
