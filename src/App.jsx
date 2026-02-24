import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  FileText,
  Upload,
  Dna,
  AlertTriangle,
  Activity,
  Printer,
  ChevronRight,
  X,
  Check,
  FlaskConical,
} from 'lucide-react';

// Dados iniciais de simulação (Oncologia)
const INITIAL_DATA = [
  { id: 1, gene: 'BRCA1', variant: 'c.5266dup', zygosity: 'Heterozigoto', acmg: 'Patogênica', drug: 'Olaparibe', response: 'Sensível' },
  { id: 2, gene: 'TP53', variant: 'c.743G>A', zygosity: 'Homozigoto', acmg: 'Patogênica', drug: 'Vários', response: 'Resistência' },
  { id: 3, gene: 'EGFR', variant: 'c.2573T>G', zygosity: 'Heterozigoto', acmg: 'Provavelmente Patogênica', drug: 'Erlotinibe', response: 'Sensível' },
  { id: 4, gene: 'KRAS', variant: 'c.35G>A', zygosity: 'Heterozigoto', acmg: 'Benigna', drug: 'N/A', response: 'Neutro' },
];

const App = () => {
  const [view, setView] = useState('dashboard');
  const [data, setData] = useState(INITIAL_DATA);
  const [showImportModal, setShowImportModal] = useState(false);
  const [csvText, setCsvText] = useState('');

  const patient = {
    nome: 'João Silva Sauro',
    id: 'SRR12345678',
    idade: '45 anos',
    dataExame: '20/02/2026',
    clinico: 'Dr. Roberto Calheiros',
  };

  // Processamento do CSV colado
  const handleImportCSV = () => {
    try {
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) return;

      const newData = lines.slice(1).map((line, index) => {
        const columns = line.split(',');
        return {
          id: Date.now() + index,
          gene: columns[0]?.trim() || 'N/A',
          variant: columns[1]?.trim() || 'N/A',
          zygosity: columns[2]?.trim() || 'Desconhecida',
          acmg: columns[3]?.trim() || 'VUS',
          drug: columns[5]?.trim() || 'N/A',
          response: columns[6]?.trim() || 'N/A',
        };
      });

      setData(newData);
      setShowImportModal(false);
      setCsvText('');
    } catch (err) {
      console.error('Erro ao processar CSV');
    }
  };

  // Estatísticas para o Dashboard
  const stats = useMemo(() => {
    const total = data.length;
    const patogenica = data.filter((m) => m.acmg?.toLowerCase().includes('patogênica')).length;
    const perc = total > 0 ? Math.round((patogenica / total) * 100) : 0;
    return { total, patogenica, perc };
  }, [data]);

  const getAcmgBadge = (label = '') => {
    const l = label.toLowerCase();
    if (l.includes('provavelmente')) return 'bg-orange-100 text-orange-700 border-orange-200';
    if (l.includes('patogênica')) return 'bg-red-100 text-red-700 border-red-200';
    if (l.includes('vus')) return 'bg-purple-100 text-purple-700 border-purple-200';
    return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Dna size={22} />
          </div>
          <span className="font-bold text-xl tracking-tight">GenoSUS</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'dashboard' ? 'bg-blue-600 shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-semibold text-sm">Dashboard</span>
          </button>
          <button
            onClick={() => setView('report')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'report' ? 'bg-blue-600 shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <FileText size={20} />
            <span className="font-semibold text-sm">Laudo Clínico</span>
          </button>
        </nav>

        <div className="p-4 mt-auto border-t border-slate-800">
          <div className="bg-slate-800/50 p-4 rounded-xl mb-4">
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-2">Amostra Ativa</p>
            <p className="text-xs font-mono font-bold text-blue-400">{patient.id}</p>
          </div>
          <button
            onClick={() => setShowImportModal(true)}
            className="w-full py-3 bg-white text-slate-900 rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors shadow-lg"
          >
            <Upload size={14} /> Importar CSV
          </button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b h-16 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Bioinformática</span>
            <ChevronRight size={14} />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {view === 'dashboard' ? 'Análise de Variantes' : 'Visualização de Laudo'}
            </span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-shadow">
            <Printer size={16} /> Exportar PDF
          </button>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          {view === 'dashboard' ? (
            <div className="space-y-6">
              {/* Cards de Resumo */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <FlaskConical size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Variantes</p>
                    <p className="text-2xl font-black">{stats.total}</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                  <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Patogênicas</p>
                    <p className="text-2xl font-black">{stats.patogenica}</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <Activity size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Alvos Farmaco</p>
                    <p className="text-2xl font-black">{data.filter((d) => d.drug !== 'N/A').length}</p>
                  </div>
                </div>
              </div>

              {/* Tabela e Gráfico */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-slate-800 mb-6">Patogenicidade</h3>
                  <div className="flex flex-col items-center">
                    <div className="relative w-32 h-32 mb-6">
                      <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                        <circle cx="18" cy="18" r="16" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                        <circle
                          cx="18"
                          cy="18"
                          r="16"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="4"
                          strokeDasharray={`${stats.perc} 100`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black">{stats.perc}%</span>
                      </div>
                    </div>
                    <div className="w-full space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-red-500">PATOGÉNICA</span>
                        <span>{stats.patogenica}</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500" style={{ width: `${stats.perc}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">Lista de Variantes Detectadas</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase">
                        <tr>
                          <th className="py-3 px-6">Gene</th>
                          <th className="py-3 px-6">HGVSc</th>
                          <th className="py-3 px-6">Classificação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {data.map((m) => (
                          <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-4 px-6 font-bold text-blue-600">{m.gene}</td>
                            <td className="py-4 px-6 font-mono text-xs">{m.variant}</td>
                            <td className="py-4 px-6">
                              <span className={`px-2 py-1 rounded-md text-[10px] font-bold border uppercase ${getAcmgBadge(m.acmg)}`}>
                                {m.acmg}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Laudo Visual */
            <div className="bg-white shadow-2xl mx-auto max-w-[800px] min-h-[1000px] p-12 border-t-[12px] border-slate-900 rounded-t-lg">
              <div className="flex justify-between border-b pb-8 mb-8">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tighter">GenoSUS</h1>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Relatório de Sequenciamento Genómico</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold">ID: {patient.id}</p>
                  <p className="text-xs text-slate-400">{patient.dataExame}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-10 bg-slate-50 p-6 rounded-xl border">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Paciente</p>
                  <p className="font-bold">{patient.nome}</p>
                  <p className="text-xs text-slate-500">Idade: {patient.idade}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Médico Solicitante</p>
                  <p className="font-bold">{patient.clinico}</p>
                </div>
              </div>

              <div className="mb-10">
                <h3 className="font-black text-slate-900 uppercase text-xs mb-4 border-b pb-2">Interpretação Clínica</h3>
                <p className="text-sm leading-relaxed text-slate-600 italic">
                  Foram identificadas variantes genéticas associadas a risco aumentado de patologias oncológicas. A variante
                  {' '}
                  {data[0]?.gene}
                  {' '}
                  {data[0]?.variant}
                  {' '}
                  é classificada como patogénica conforme critérios ACMG.
                </p>
              </div>

              <div>
                <h3 className="font-black text-slate-900 uppercase text-xs mb-4 border-b pb-2">Tabela de Variantes Clínicas</h3>
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white">
                      <th className="py-2 px-4">Gene</th>
                      <th className="py-2 px-4">Variante</th>
                      <th className="py-2 px-4">Classificação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {data
                      .filter((m) => m.acmg.toLowerCase().includes('patogênica'))
                      .map((m, i) => (
                        <tr key={i}>
                          <td className="py-3 px-4 font-bold">{m.gene}</td>
                          <td className="py-3 px-4 font-mono">{m.variant}</td>
                          <td className="py-3 px-4 text-red-600 font-bold uppercase text-[10px]">{m.acmg}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal de Importação */}
      {showImportModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold">Importar Dados CSV</h3>
              <button onClick={() => setShowImportModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-500 mb-4">Cole as linhas do seu CSV abaixo (incluindo o cabeçalho):</p>
              <textarea
                className="w-full h-48 p-4 border rounded-xl font-mono text-xs bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="gene,variante,zigosidade,acmg,impacto,medicamento,resposta"
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
              />
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setShowImportModal(false)} className="px-4 py-2 font-bold text-slate-500">
                  Cancelar
                </button>
                <button
                  onClick={handleImportCSV}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2"
                >
                  <Check size={18} /> Processar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
