import { defineConfig } from 'tsup'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  entry: {
    background: 'src/background.ts',
    content: 'src/content.ts',
    popup: 'src/popup.ts'
  },
  format: ['cjs'],
  target: 'es2020',
  outDir: 'dist',
  clean: true,
  minify: process.env.NODE_ENV === 'production',
  sourcemap: process.env.NODE_ENV !== 'production',
  splitting: false,
  treeshake: true,
  onSuccess: async () => {
    // Generate manifest
    execSync('node scripts/build-manifest.js', { stdio: 'inherit' });
    
    // Copy public files
    const publicDir = path.resolve('public');
    const distDir = path.resolve('dist');
    
    if (fs.existsSync(publicDir)) {
      const files = fs.readdirSync(publicDir);
      files.forEach(file => {
        if (file !== 'manifest.json') { // Skip old manifest
          const srcPath = path.join(publicDir, file);
          const destPath = path.join(distDir, file);
          
          if (fs.statSync(srcPath).isDirectory()) {
            fs.cpSync(srcPath, destPath, { recursive: true });
          } else {
            fs.copyFileSync(srcPath, destPath);
          }
        }
      });
    }
    
    console.log('✅ Extension built successfully!')
  }
})