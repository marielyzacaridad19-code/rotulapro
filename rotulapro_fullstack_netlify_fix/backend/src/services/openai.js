import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'missing' });

export async function estimateVehicleParts({ make, model, year, parts, marginCm }) {
  if (!process.env.OPENAI_API_KEY) throw new Error('Falta OPENAI_API_KEY');

  const prompt = `
Eres un asistente técnico para un sistema de cotización de rotulación vehicular llamado RotulaPro.
Necesito medidas aproximadas en centímetros para calcular material de vinil.
Vehículo: ${make} ${model} ${year}.
Partes seleccionadas: ${parts.join(', ')}.
Margen extra por lado: ${marginCm} cm.

Devuelve SOLO JSON válido con esta forma:
{
  "vehicle":"marca modelo año",
  "warning":"medidas estimadas, confirmar antes de imprimir o cortar",
  "parts":[
    {"name":"Capó","baseWidthCm":130,"baseHeightCm":110,"finalWidthCm":150,"finalHeightCm":130,"quantity":1,"areaM2":1.95,"confidence":"media"}
  ],
  "totalAreaM2": 1.95,
  "notes":["..."]
}
No inventes precisión perfecta. Si no estás seguro, usa confianza baja o media.
`;

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
    input: prompt
  });

  const text = response.output_text || '{}';
  const cleaned = text.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();
  return JSON.parse(cleaned);
}
