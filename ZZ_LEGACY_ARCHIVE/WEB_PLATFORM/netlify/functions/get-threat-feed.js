
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const apiKey = process.env.PULSEDIVE_API_KEY;
  const pulsediveUrl = `https://pulsedive.com/api/explore.php?q=threat=Phishing&limit=1&pretty=1&key=${apiKey}`;

  try {
    const response = await fetch(pulsediveUrl);
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `Pulsedive API error: ${response.statusText}` }),
      };
    }

    const data = await response.json();
    
    // Extraer la información relevante de la respuesta de Pulsedive
    const latestThreat = data.results && data.results.length > 0 ? data.results[0] : null;

    if (!latestThreat) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          threat_level: 'BAJO',
          threat_emoji: '🟢',
          last_alert: 'No se han detectado nuevas amenazas de phishing recientemente.',
          last_alert_time: 'Ahora',
        }),
      };
    }

    // Formatear la alerta para que sea legible
    const threatName = latestThreat.name || 'Amenaza no especificada';
    const threatTime = new Date(latestThreat.stamp).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const formattedAlert = `Nueva amenaza detectada: ${threatName}`;

    return {
      statusCode: 200,
      body: JSON.stringify({
        threat_level: 'ALTO',
        threat_emoji: '🟠',
        last_alert: formattedAlert,
        last_alert_time: threatTime,
      }),
    };

  } catch (error) {
    console.error('Error fetching from Pulsedive:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'No se pudo conectar con el servicio de inteligencia de amenazas.',
        threat_level: 'INDETERMINADO',
        threat_emoji: '⚪',
        last_alert: 'Servicio de inteligencia no disponible.',
        last_alert_time: 'Ahora',
      }),
    };
  }
};
