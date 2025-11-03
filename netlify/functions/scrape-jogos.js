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

    // ATENÇÃO: Você precisará ajustar estes seletores depois de inspecionar a página
    $('.proximos-jogos-lista .jogo-item, .agenda-jogo, .game-card').each((index, element) => {
      const $el = $(element);
      
      const jogo = {
        data: $el.find('.jogo-data, .game-date, [class*="data"]').text().trim(),
        horario: $el.find('.jogo-horario, .game-time, [class*="horario"]').text().trim(),
        adversario: $el.find('.jogo-adversario, .team-name, [class*="adversario"]').text().trim(),
        local: $el.find('.jogo-local, .venue, [class*="local"]').text().trim(),
        competicao: $el.find('.jogo-competicao, .competition, [class*="competicao"]').text().trim()
      };

      if (jogo.adversario) {
        jogos.push(jogo);
      }
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        jogos: jogos.slice(0, 10),
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