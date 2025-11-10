const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

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

  let browser = null;

  try {
    // Iniciar o navegador headless
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    
    // Navegar para a página
    await page.goto('https://www.espn.com.br/futebol/time/calendario/_/id/819/bra.flamengo', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Aguardar a tabela de jogos carregar
    await page.waitForSelector('tbody.Table__TBODY', { timeout: 10000 });

    // Extrair os dados dos jogos
    const jogos = await page.evaluate(() => {
      const rows = document.querySelectorAll('tbody.Table__TBODY tr.Table__TR');
      const results = [];

      rows.forEach(row => {
        try {
          // Data
          const dataEl = row.querySelector('td:first-child span');
          const data = dataEl ? dataEl.textContent.trim() : '';

          // Adversário - pegar o nome do time (não Flamengo)
          const teams = row.querySelectorAll('.Table__Team');
          let adversario = '';
          let mandante = '';
          let visitante = '';
          let ehCasa = false;

          if (teams.length >= 2) {
            const time1 = teams[0].textContent.trim();
            const time2 = teams[1].textContent.trim();
            
            if (time1.includes('Flamengo')) {
              mandante = 'Flamengo';
              visitante = time2;
              adversario = time2;
              ehCasa = true;
            } else {
              mandante = time1;
              visitante = 'Flamengo';
              adversario = time1;
              ehCasa = false;
            }
          }

          // Horário
          const horarioEl = row.querySelector('td:nth-child(2)');
          const horario = horarioEl ? horarioEl.textContent.trim() : '';

          // Competição
          const competicaoEl = row.querySelector('.Schedule__League');
          const competicao = competicaoEl ? competicaoEl.textContent.trim() : '';

          // Local (se disponível)
          const localEl = row.querySelector('.Schedule__Location');
          const local = localEl ? localEl.textContent.trim() : '';

          // Só adicionar se tiver data e adversário
          if (data && adversario) {
            results.push({
              data,
              horario: horario || 'A definir',
              adversario,
              mandante,
              visitante,
              local: local || 'A definir',
              competicao: competicao || 'A definir',
              ehCasa
            });
          }
        } catch (error) {
          console.error('Erro ao processar linha:', error);
        }
      });

      return results;
    });

    await browser.close();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        jogos: jogos.slice(0, 15),
        total: jogos.length,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    if (browser) {
      await browser.close();
    }

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