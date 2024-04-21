import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // GitHub Pages へデプロイする際のフォルダ名として、リポジトリ名を設定
  const base = mode === 'production' ? '/gravel-map/' : undefined;

  return {
    base,
    plugins: [react()],
  };
});
