const axios = require('axios');
const cheerio = require('cheerio');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const url = 'https://ge.globo.com/futebol/times/flamengo/agenda-de-jogos-do-flamengo/';
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);
    const jogos = [];

    // Selecionar todos os cards de jogos
    $('a.sc-eldPxv').each((index, element) => {
      const $el = $(element);
      
      // Extrair data e horário
      const dataHorario = $el.find('.sc-imWYAI.cYNmqd span.sc-jXbUNg').map((i, span) => $(span).text().trim()).get();
      const data = dataHorario[0] || '';
      const horario = dataHorario[1] || '';
      
      // Extrair competição, rodada e local
      const infoJogo = $el.find('.sc-cwHptR .sc-imWYAI.cYNmqd span.sc-jXbUNg').map((i, span) => $(span).text().trim()).get();
      const competicao = infoJogo[0] || '';
      const rodada = infoJogo[1] || '';
      const local = infoJogo[2] || '';
      
      // Extrair times (adversário e Flamengo)
      const times = $el.find('.sc-koXPp span.sc-eeDRCY').map((i, span) => $(span).text().trim()).get();
      
      // Identificar qual é o adversário (o que não é Flamengo)
      let adversario = '';
      if (times.length >= 2) {
        adversario = times[0] === 'Flamengo' ? times[1] : times[0];
      }
      
      // Determinar se é casa ou fora
      const mandante = times[0] || '';
      const visitante = times[1] || '';
      const ehCasa = mandante === 'Flamengo';
      
      // Só adicionar se tiver pelo menos data e adversário
      if (data && adversario) {
        jogos.push({
          data: data,
          horario: horario || 'A definir',
          adversario: adversario,
          mandante: mandante,
          visitante: visitante,
          local: local || 'A definir',
          competicao: competicao || 'Competição não informada',
          rodada: rodada,
          ehCasa: ehCasa
        });
      }
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        jogos: jogos.slice(0, 15), // Limitar a 15 jogos
        total: jogos.length,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Erro no scraping:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Erro ao buscar jogos do Flamengo',
        message: error.message,
        jogos: []
      })
    };
  }
};