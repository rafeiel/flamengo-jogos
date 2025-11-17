import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Trophy, AlertCircle, Loader2 } from 'lucide-react';

export default function App() {
  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJogos();
  }, []);

  const fetchJogos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/.netlify/functions/scrape-jogos');
      
      if (!response.ok) {
        throw new Error('Erro ao buscar jogos');
      }
      
      const data = await response.json();
      setJogos(data.jogos || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
 <div className="min-h-screen bg-gradient-to-br from-red-950 via-black to-red-950">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-red-900/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/9/93/Flamengo-RJ_%28BRA%29.png" 
                alt="Flamengo" 
                className="w-16 h-16 md:w-20 md:h-20 object-contain"
              />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
                  Próximos Jogos do Flamengo
                </h1>
                <p className="text-red-400 text-sm md:text-base">
                  Acompanhe a agenda do Mengão
                </p>
              </div>
            </div>
            <button
              onClick={fetchJogos}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Loader2 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-red-500 animate-spin mb-4" />
            <p className="text-white text-lg">Carregando jogos...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-white font-semibold mb-1">Erro ao carregar jogos</h3>
              <p className="text-red-300">{error}</p>
              <button
                onClick={fetchJogos}
                className="mt-3 text-red-400 hover:text-red-300 underline text-sm"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        )}

        {!loading && !error && jogos.length === 0 && (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-white text-xl">Nenhum jogo agendado no momento</p>
          </div>
        )}

        {!loading && !error && jogos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jogos.map((jogo, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-red-900/20 to-black/40 backdrop-blur-sm border border-red-900/30 rounded-xl p-6 hover:border-red-700/50 transition-all hover:shadow-lg hover:shadow-red-900/20"
              >
                {/* Competição */}
                {jogo.competicao && (
                  <div className="flex items-center gap-2 mb-4">
                    <Trophy className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 text-sm font-semibold uppercase">
                      {jogo.competicao}
                    </span>
                  </div>
                )}

                {/* Adversário */}
                <h3 className="text-2xl font-bold text-white mb-4">
                  Flamengo vs {jogo.adversario}
                </h3>

                {/* Data e Hora */}
                <div className="space-y-3">
                  {jogo.data && (
                    <div className="flex items-center gap-3 text-gray-300">
                      <Calendar className="w-5 h-5 text-red-500" />
                      <span>{jogo.data}</span>
                    </div>
                  )}

                  {jogo.horario && (
                    <div className="flex items-center gap-3 text-gray-300">
                      <Clock className="w-5 h-5 text-red-500" />
                      <span>{jogo.horario}</span>
                    </div>
                  )}

                  {jogo.local && (
                    <div className="flex items-center gap-3 text-gray-300">
                      <MapPin className="w-5 h-5 text-red-500" />
                      <span>{jogo.local}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-sm border-t border-red-900/30 mt-12">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-gray-400 text-sm">
            Dados atualizados automaticamente do GloboEsporte.com
          </p>
        </div>
      </footer>
    </div>
  );
}