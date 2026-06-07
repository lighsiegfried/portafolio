const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT, 'dist');
const ZIP_NAME = 'lambda.zip';
const ZIP_PATH = path.join(DIST_DIR, ZIP_NAME);
const TMP_DIR = path.join(DIST_DIR, '_lambda_build');

function removeDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copy(src, dest) {
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    ensureDir(dest);
    for (const entry of fs.readdirSync(src)) {
      copy(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

function createZip(sourceDir, outputPath) {
  const isWin = process.platform === 'win32';

  if (isWin) {
    execSync(
      `powershell -NoProfile -Command "Compress-Archive -Path '${sourceDir}\\*' -DestinationPath '${outputPath}' -Force"`,
      { stdio: 'inherit' }
    );
  } else {
    execSync(`cd "${sourceDir}" && zip -r "${outputPath}" .`, { stdio: 'inherit' });
  }
}

function build() {
  console.log('\n  Lambda Build — Mini ERP Backend');
  console.log('  ───────────────────────────────\n');

  const start = Date.now();

  removeDir(DIST_DIR);
  ensureDir(TMP_DIR);

  const srcDir = path.join(ROOT, 'src');
  const pkgJson = path.join(ROOT, 'package.json');
  const pkgLock = path.join(ROOT, 'package-lock.json');

  console.log('  [1/4] Copiando src/ ...');
  copy(srcDir, path.join(TMP_DIR, 'src'));

  console.log('  [2/4] Copiando package.json ...');
  fs.copyFileSync(pkgJson, path.join(TMP_DIR, 'package.json'));

  if (fs.existsSync(pkgLock)) {
    console.log('  [2b/4] Copiando package-lock.json ...');
    fs.copyFileSync(pkgLock, path.join(TMP_DIR, 'package-lock.json'));
  }

  console.log('  [3/4] Instalando dependencias de producción ...');
  execSync('npm ci --omit=dev --ignore-scripts', { cwd: TMP_DIR, stdio: 'inherit' });

  console.log('  [4/4] Empaquetando lambda.zip ...');
  ensureDir(DIST_DIR);
  createZip(TMP_DIR, ZIP_PATH);

  removeDir(TMP_DIR);

  const stats = fs.statSync(ZIP_PATH);
  const sizeKB = (stats.size / 1024).toFixed(1);
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);

  console.log(`\n  ✅ lambda.zip creado (${sizeKB} KB) en ${elapsed}s`);
  console.log(`  📦 ${ZIP_PATH}\n`);
}

build();
