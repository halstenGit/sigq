const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

async function extractHalsten() {
  const htmlPath = 'Halsten Template · standalone.html';
  const content = fs.readFileSync(htmlPath, 'utf8');

  // Extrair manifest JSON
  const manifestMatch = content.match(/<script type="__bundler\/manifest">\n([\s\S]*?)\n<\/script>/);
  const templateMatch = content.match(/<script type="__bundler\/template">\n([\s\S]*?)\n<\/script>/);

  if (!manifestMatch) {
    console.log('❌ Não foi possível encontrar manifest');
    return;
  }

  let manifest, template;

  try {
    // Extrair JSON do manifest
    const manifestContent = manifestMatch[1].trim();
    manifest = JSON.parse(manifestContent);
    console.log('✓ Manifest encontrado');
  } catch (e) {
    console.log('❌ Erro ao parsear manifest:', e.message);
    return;
  }

  if (templateMatch) {
    try {
      const templateContent = templateMatch[1].trim();
      template = JSON.parse(templateContent);
      console.log('✓ Template encontrado');
    } catch (e) {
      console.log('⚠ Erro ao parsear template:', e.message);
    }
  }

  console.log('✅ Manifest e template encontrados\n');

  // Analisar assets
  console.log('=== ASSETS NO BUNDLER ===\n');
  const assetsByMime = {};

  Object.entries(manifest).forEach(([id, data]) => {
    const mime = data.mime;
    if (!assetsByMime[mime]) assetsByMime[mime] = [];
    assetsByMime[mime].push({ id, size: data.data.length, compressed: data.compressed });
  });

  Object.entries(assetsByMime).forEach(([mime, items]) => {
    console.log(`${mime}: ${items.length} arquivo(s)`);
    items.slice(0, 2).forEach(item => {
      const sizeKb = (item.size / 1024).toFixed(1);
      console.log(`  └ ${item.id.substring(0, 8)}... (${sizeKb}KB${item.compressed ? ', comprimido' : ''})`);
    });
    if (items.length > 2) console.log(`  └ ... e mais ${items.length - 2}`);
  });

  // Analisar template
  console.log('\n\n=== ESTRUTURA DO TEMPLATE ===\n');
  console.log(JSON.stringify(template, null, 2).substring(0, 3000));

  // Extrair assets úteis
  console.log('\n\n=== EXTRAINDO ASSETS ÚTEIS ===\n');

  const outputDir = 'halsten-extracted';
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  for (const [id, assetData] of Object.entries(manifest)) {
    try {
      const mimeType = assetData.mime;

      // Decodificar base64
      const buffer = Buffer.from(assetData.data, 'base64');

      // Descompactar se necessário
      let finalBuffer = buffer;
      if (assetData.compressed) {
        finalBuffer = zlib.gunzipSync(buffer);
      }

      // Salvar de acordo com tipo
      let ext = 'bin';
      if (mimeType.includes('font')) ext = mimeType.split('/')[1] || 'font';
      if (mimeType.includes('image')) ext = mimeType.split('/')[1] || 'img';
      if (mimeType === 'application/json') ext = 'json';

      const filename = `${id.substring(0, 8)}.${ext}`;
      const filepath = path.join(outputDir, filename);

      fs.writeFileSync(filepath, finalBuffer);
      console.log(`✓ ${filename} (${(finalBuffer.length / 1024).toFixed(1)}KB)`);

    } catch (e) {
      console.log(`✗ Erro ao processar ${id.substring(0, 8)}: ${e.message}`);
    }
  }

  console.log(`\n✅ Assets extraídos em: ${outputDir}/`);
}

extractHalsten().catch(console.error);
