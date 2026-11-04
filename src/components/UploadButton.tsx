import { Upload } from 'lucide-react';
import { useStore } from '../store';

export default function UploadButton({ className = 'btn-ghost' }: { className?: string }) {
  const { addFiles } = useStore();
  return (
    <label className={`${className} cursor-pointer`}>
      <Upload size={18} /> Добавить свой файл
      <input
        type="file"
        accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac,.flac"
        multiple
        hidden
        onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ''; }}
      />
    </label>
  );
}
