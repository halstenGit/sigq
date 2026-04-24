const fs = require('fs');
const zlib = require('zlib');
const path = require('path');
const { execSync } = require('child_process');

// Extrair JSON usando sed
console.log('🔧 Extraindo JSONs do bundler...\n');

try {
  // Extrair manifest
  const manifestJson = execSync(
    `sed -n '172,176p' "Halsten Template · standalone.html" | sed '1d;$d'`,
    { encoding: 'utf8' }
  ).trim();

  // Encontrar onde termina o JSON (última linha antes de </script>)
  const manifestLines = fs.readFileSync('Halsten Template · standalone.html', 'utf8').split('\n');
  let manifestJsonStr = '';
  for (let i = 172; i < 176; i++) {
    const line = manifestLines[i] || '';
    if (line.includes('</script>')) break;
    if (i > 172) manifestJsonStr += line;
  }

  const manifest = JSON.parse(manifestJsonStr);
  console.log('✅ Manifest carregado');
  console.log(`   ${Object.keys(manifest).length} assets encontrados\n`);

  // Agrupar assets por tipo
  const byMime = {};
  Object.entries(manifest).forEach(([id, data]) => {
    const mime = data.mime;
    if (!byMime[mime]) byMime[mime] = [];
    byMime[mime].push({ id, size: data.data.length, compressed: data.compressed });
  });

  console.log('=== ASSETS ===\n');
  Object.entries(byMime).forEach(([mime, items]) => {
    console.log(`${mime}: ${items.length} arquivo(s)`);
  });

  // Extrair e descompactar assets
  const outputDir = 'halsten-extracted';
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  console.log(`\n\n=== EXTRAINDO ASSETS PARA ${outputDir}/ ===\n`);

  let count = 0;
  for (const [id, assetData] of Object.entries(manifest)) {
    try {
      const buffer = Buffer.from(assetData.data, 'base64');
      let finalBuffer = buffer;

      if (assetData.compressed) {
        finalBuffer = zlib.gunzipSync(buffer);
      }

      // Determinar extensão
      let ext = 'bin';
      if (assetData.mime.includes('font')) ext = assetData.mime.split('/')[1] || 'font';
      if (assetData.mime.includes('image')) ext = assetData.mime.split('/')[1] || 'img';
      if (assetData.mime === 'application/json') ext = 'json';
      if (assetData.mime.includes('text')) ext = assetData.mime.split('/')[1] || 'txt';

      const filename = `${count++}_${ext}`;
      const filepath = path.join(outputDir, filename);

      fs.writeFileSync(filepath, finalBuffer);
      console.log(`✓ ${filename} (${(finalBuffer.length / 1024).toFixed(1)}KB) - ${assetData.mime}`);

    } catch (e) {
      console.log(`✗ Erro: ${id.substring(0, 8)} - ${e.message}`);
    }
  }

  console.log(`\n✅ Concluído! Assets em: ${outputDir}/`);

} catch (error) {
  console.error('❌ Erro:', error.message);
}
