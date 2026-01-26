// build-functions.js
// Собирает Cloudflare Pages Functions с зависимостями используя esbuild
import * as esbuild from 'esbuild';
import { glob } from 'glob';
import path from 'path';
import fs from 'fs/promises';

const functionsDir = './functions';
const outputDir = './functions-dist';

async function buildFunctions() {
  // Найти все .ts файлы кроме .lib.ts
  const files = await glob('**/*.ts', {
    cwd: functionsDir,
    ignore: ['**/*.lib.ts'],
    absolute: false,
  });

  console.log(`Found ${files.length} function files to build`);

  // Очистить output директорию
  await fs.rm(outputDir, { recursive: true, force: true });
  await fs.mkdir(outputDir, { recursive: true });

  // Собрать каждый файл
  for (const file of files) {
    const inputPath = path.join(functionsDir, file);
    const outputPath = path.join(outputDir, file.replace(/\.ts$/, '.js'));
    const outputDirPath = path.dirname(outputPath);

    await fs.mkdir(outputDirPath, { recursive: true });

    try {
      await esbuild.build({
        entryPoints: [inputPath],
        bundle: true,
        outfile: outputPath,
        format: 'esm',
        target: 'es2022',
        platform: 'browser',
        external: [],
        minify: false,
        sourcemap: false,
        logLevel: 'info',
      });

      console.log(`✓ Built: ${file}`);
    } catch (error) {
      console.error(`✗ Failed to build ${file}:`, error);
      throw error;
    }
  }

  console.log(`\n✓ All functions built successfully to ${outputDir}/`);
  console.log('\nNext steps:');
  console.log('1. Delete old /functions directory');
  console.log('2. Rename /functions-dist to /functions');
  console.log('3. Commit and push to trigger deployment');
}

buildFunctions().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
