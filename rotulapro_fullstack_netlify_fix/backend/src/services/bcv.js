import * as cheerio from 'cheerio';

function parseNumber(text) {
  const match = String(text).match(/\d+[\d.,]*/);
  if (!match) return null;
  return Number(match[0].replace(/\./g, '').replace(',', '.'));
}

export async function fetchEuroBcvRate() {
  const url = process.env.BCV_URL || 'https://www.bcv.org.ve/';
  const response = await fetch(url, {
    headers: { 'user-agent': 'RotulaPro/1.0 (+cotizador)' }
  });
  if (!response.ok) throw new Error(`BCV respondió ${response.status}`);
  const html = await response.text();
  const $ = cheerio.load(html);

  let rate = null;
  const euroBlock = $('#euro, [id*=euro], [class*=euro]').first().text();
  rate = parseNumber(euroBlock);

  if (!rate) {
    const body = $('body').text().replace(/\s+/g, ' ');
    const euroIndex = body.toLowerCase().indexOf('euro');
    const slice = euroIndex >= 0 ? body.slice(euroIndex, euroIndex + 140) : body;
    rate = parseNumber(slice);
  }

  if (!rate) throw new Error('No se pudo extraer la tasa Euro BCV automáticamente');
  return { currency: 'EUR', rate, source: url, fetched_at: new Date().toISOString() };
}
