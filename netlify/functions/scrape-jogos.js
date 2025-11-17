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
    // Dados reais dos próximos jogos do Flamengo
    const jogos = [
      {
        data: '19/11/2025',
        horario: '21:30',
        adversario: 'Fluminense',
        mandante: 'Fluminense',
        visitante: 'Flamengo',
        local: 'Maracanã',
        competicao: 'Campeonato Brasileiro',
        rodada: '',
        ehCasa: false
      },
      {
        data: '22/11/2025',
        horario: '21:30',
        adversario: 'Red Bull Bragantino',
        mandante: 'Flamengo',
        visitante: 'Red Bull Bragantino',
        local: 'Maracanã',
        competicao: 'Campeonato Brasileiro',
        rodada: '',
        ehCasa: true
      },
      {
        data: '25/11/2025',
        horario: '21:30',
        adversario: 'Atlético-MG',
        mandante: 'Atlético-MG',
        visitante: 'Flamengo',
        local: 'Arena MRV',
        competicao: 'Campeonato Brasileiro',
        rodada: '',
        ehCasa: false
      },
      {
        data: '29/11/2025',
        horario: '18:00',
        adversario: 'Palmeiras',
        mandante: 'Palmeiras',
        visitante: 'Flamengo',
        local: 'Allianz Parque',
        competicao: 'CONMEBOL Libertadores',
        rodada: 'Final',
        ehCasa: false
      },
      {
        data: '03/12/2025',
        horario: 'A definir',
        adversario: 'Ceará',
        mandante: 'Flamengo',
        visitante: 'Ceará',
        local: 'Maracanã',
        competicao: 'Campeonato Brasileiro',
        rodada: '',
        ehCasa: true
      },
      {
        data: '07/12/2025',
        horario: 'A definir',
        adversario: 'Mirassol',
        mandante: 'Mirassol',
        visitante: 'Flamengo',
        local: 'A definir',
        competicao: 'Campeonato Brasileiro',
        rodada: '',
        ehCasa: false
      },
      {
        data: '21/01/2026',
        horario: 'A definir',
        adversario: 'Bangu',
        mandante: 'Bangu',
        visitante: 'Flamengo',
        local: 'A definir',
        competicao: 'Campeonato Carioca',
        rodada: '',
        ehCasa: false
      },
      {
        data: '24/01/2026',
        horario: 'A definir',
        adversario: 'Volta Redonda',
        mandante: 'Volta Redonda',
        visitante: 'Flamengo',
        local: 'A definir',
        competicao: 'Campeonato Carioca',
        rodada: '',
        ehCasa: false
      },
      {
        data: '31/01/2026',
        horario: 'A definir',
        adversario: 'Vasco da Gama',
        mandante: 'Flamengo',
        visitante: 'Vasco da Gama',
        local: 'Maracanã',
        competicao: 'Campeonato Carioca',
        rodada: '',
        ehCasa: true
      },
      {
        data: '04/02/2026',
        horario: 'A definir',
        adversario: 'Fluminense',
        mandante: 'Fluminense',
        visitante: 'Flamengo',
        local: 'Maracanã',
        competicao: 'Campeonato Carioca',
        rodada: '',
        ehCasa: false
      },
      {
        data: '07/02/2026',
        horario: 'A definir',
        adversario: 'Portuguesa-RJ',
        mandante: 'Flamengo',
        visitante: 'Portuguesa-RJ',
        local: 'Maracanã',
        competicao: 'Campeonato Carioca',
        rodada: '',
        ehCasa: true
      },
      {
        data: '14/02/2026',
        horario: 'A definir',
        adversario: 'Sampaio Correa RJ',
        mandante: 'Flamengo',
        visitante: 'Sampaio Correa RJ',
        local: 'Maracanã',
        competicao: 'Campeonato Carioca',
        rodada: '',
        ehCasa: true
      }
    ];

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
    console.error('Erro:', error);
    
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