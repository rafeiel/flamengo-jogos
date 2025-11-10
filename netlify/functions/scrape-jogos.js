const axios = require('axios');

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
    // SUBSTITUA 'SUA_API_KEY_AQUI' pela sua chave da API-Football
    const API_KEY = process.env.API_FOOTBALL_KEY;
    
    // ID do Flamengo na API-Football: 127
    const response = await axios.get('https://v3.football.api-sports.io/fixtures', {
      params: {
        team: 127,  // ID do Flamengo
        season: 2024,
        next: 15    // Próximos 15 jogos
      },
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'v3.football.api-sports.io'
      }
    });

    const fixtures = response.data.response || [];
    const jogos = fixtures.map(fixture => {
      const homeTeam = fixture.teams.home.name;
      const awayTeam = fixture.teams.away.name;
      const ehCasa = homeTeam === 'Flamengo';
      const adversario = ehCasa ? awayTeam : homeTeam;

      // Formatar data
      const date = new Date(fixture.fixture.date);
      const dataFormatada = date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit',
        year: 'numeric'
      });
      const horarioFormatado = date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      return {
        data: dataFormatada,
        horario: horarioFormatado,
        adversario: adversario,
        mandante: homeTeam,
        visitante: awayTeam,
        local: fixture.fixture.venue.name || 'A definir',
        competicao: fixture.league.name || 'A definir',
        rodada: fixture.league.round || '',
        ehCasa: ehCasa
      };
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        jogos: jogos,
        total: jogos.length,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Erro ao buscar jogos:', error.response?.data || error.message);
    
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