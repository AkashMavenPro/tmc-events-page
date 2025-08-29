import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // --- This is the section for build configuration ---
  build: {
    // This tells Vite where to put the built files (the default is 'dist')
    outDir: 'build', // We'll use 'build' to match the folder name from Create React App

     // --- USE THIS SERVER CONFIGURATION INSTEAD ---
  server: {
    proxy: {
      // Any request to '/api' will be forwarded to YouTube's RSS feed
      '/api': {
        target: 'https://www.youtube.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/feeds/videos.xml'),
      },
    },
  },
  // ---------------------------------------------
    
    rollupOptions: {
      output: {
        // --- This is the key to creating predictable file names ---
        // It disables the random hash in the filenames for JS, CSS, and other assets.
        
        // For JavaScript entry files (like your main bundle)
        entryFileNames: `assets/bundle.js`,
        
        // For JavaScript code-split chunks (if your app gets bigger)
        chunkFileNames: `assets/[name].js`,
        
        // For CSS and other assets (like images, fonts, etc.)
        assetFileNames: `assets/[name].[ext]`
      }
    }
  }
});