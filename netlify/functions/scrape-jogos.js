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
    const API_KEY = process.env.API_FOOTBALL_KEY;
    
    // LOG PARA DEBUG
    console.log('API_KEY existe?', !!API_KEY);
    
    // DADOS DE TESTE - Remover depois
    const jogosTeste = [
      {
        data: '15/11/2024',
        horario: '18:30',
        adversario: 'Vasco',
        mandante: 'Flamengo',
        visitante: 'Vasco',
        local: 'Maracanã',
        competicao: 'Campeonato Brasileiro',
        rodada: 'Rodada 34',
        ehCasa: true
      },
      {
        data: '20/11/2024',
        horario: '21:00',
        adversario: 'Palmeiras',
        mandante: 'Palmeiras',
        visitante: 'Flamengo',
        local: 'Allianz Parque',
        competicao: 'Campeonato Brasileiro',
        rodada: 'Rodada 35',
        ehCasa: false
      }
    ];

    // RETORNAR DADOS DE TESTE PRIMEIRO
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        jogos: jogosTeste,
        total: jogosTeste.length,
        timestamp: new Date().toISOString(),
        debug: {
          hasApiKey: !!API_KEY
        }
      })
    };

    // SE OS DADOS DE TESTE APARECEREM, ENTÃO O PROBLEMA É NA API
    // Aí descomente o código abaixo:
    
    /*
    if (!API_KEY) {
      throw new Error('API_KEY não configurada');
    }

    const response = await axios.get('https://v3.football.api-sports.io/fixtures', {
      params: {
        team: 127,
        season: 2024,
        next: 15
      },
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'v3.football.api-sports.io'
      }
    });

    console.log('Resposta da API:', response.data);

    const fixtures = response.data.response || [];
    const jogos = fixtures.map(fixture => {
      const homeTeam = fixture.teams.home.name;
      const awayTeam = fixture.teams.away.name;
      const ehCasa = homeTeam === 'Flamengo';
      const adversario = ehCasa ? awayTeam : homeTeam;

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
    */

  } catch (error) {
    console.error('Erro completo:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Erro ao buscar jogos do Flamengo',
        message: error.message,
        stack: error.stack,
        jogos: []
      })
    };
  }
};