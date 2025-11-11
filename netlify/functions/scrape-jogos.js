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
    
    if (!API_KEY) {
      console.error('API_KEY não configurada!');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'API Key não configurada no Netlify',
          jogos: []
        })
      };
    }

    console.log('Buscando jogos do Flamengo...');

    // Buscar jogos de 2024 e 2025
    const anos = [2024, 2025];
    let todosJogos = [];

    for (const ano of anos) {
      try {
        console.log(`Tentando ano ${ano}...`);
        
        const response = await axios.get('https://v3.football.api-sports.io/fixtures', {
          params: {
            team: 127,      // ID do Flamengo
            season: ano,
            status: 'NS'    // NS = Not Started (jogos que não começaram)
          },
          headers: {
            'x-rapidapi-key': API_KEY,
            'x-rapidapi-host': 'v3.football.api-sports.io'
          },
          timeout: 10000
        });

        console.log(`Ano ${ano}: ${response.data.response?.length || 0} jogos encontrados`);
        
        if (response.data.response && response.data.response.length > 0) {
          todosJogos.push(...response.data.response);
        }
      } catch (error) {
        console.error(`Erro ao buscar ${ano}:`, error.message);
      }
    }

    // Ordenar por data (mais próximos primeiro)
    todosJogos.sort((a, b) => {
      return new Date(a.fixture.date) - new Date(b.fixture.date);
    });

    // Limitar aos próximos 15 jogos
    todosJogos = todosJogos.slice(0, 15);

    console.log(`Total de jogos futuros encontrados: ${todosJogos.length}`);

    // Mapear os dados
    const jogos = todosJogos.map(fixture => {
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

  } catch (error) {
    console.error('Erro detalhado:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
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