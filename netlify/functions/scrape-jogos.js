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
    
    // Verificar se a API Key existe
    if (!API_KEY) {
      console.error('API_KEY não configurada!');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'API Key não configurada no Netlify',
          message: 'Configure API_FOOTBALL_KEY nas variáveis de ambiente',
          jogos: []
        })
      };
    }

    console.log('Buscando jogos do Flamengo...');

    // Chamar a API-Football
    const response = await axios.get('https://v3.football.api-sports.io/fixtures', {
      params: {
        team: 127,      // ID do Flamengo
        season: 2024,   // Temporada atual
        next: 15        // Próximos 15 jogos
      },
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'v3.football.api-sports.io'
      },
      timeout: 10000
    });

    console.log('Resposta da API:', {
      status: response.status,
      total: response.data.response?.length || 0
    });

    const fixtures = response.data.response || [];
    
    // Se não houver jogos futuros, buscar também temporada 2025
    if (fixtures.length === 0) {
      console.log('Tentando buscar jogos de 2025...');
      const response2025 = await axios.get('https://v3.football.api-sports.io/fixtures', {
        params: {
          team: 127,
          season: 2025,
          next: 15
        },
        headers: {
          'x-rapidapi-key': API_KEY,
          'x-rapidapi-host': 'v3.football.api-sports.io'
        },
        timeout: 10000
      });
      
      fixtures.push(...(response2025.data.response || []));
    }

    // Mapear os dados
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

    console.log(`Retornando ${jogos.length} jogos`);

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
        details: error.response?.data || null,
        jogos: []
      })
    };
  }
};