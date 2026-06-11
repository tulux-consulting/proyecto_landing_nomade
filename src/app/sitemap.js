import { DestinosRepository } from '../repositories/index';

export default async function sitemap() {
  const baseUrl = 'https://nomade-landing.vercel.app';

  // Obtener destinos para indexación dinámica si fuesen accesibles públicamente
  let dynamicDestinations = [];
  try {
    const destinos = await DestinosRepository.getAll();
    dynamicDestinations = destinos
      .filter((d) => !d.archivado && d.estado === 'Disponible')
      .map((d) => ({
        url: `${baseUrl}/destinos/${d.id}`,
        lastModified: new Date(d.fecha),
        changeFrequency: 'weekly',
        priority: 0.6,
      }));
  } catch (e) {
    console.error('Error al generar sitemap dinámico para destinos:', e);
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...dynamicDestinations,
  ];
}
