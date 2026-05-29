import React, { useState, useEffect } from 'react';
import { AlertTriangle, Box, Users, Activity, Plus, AlertCircle, ArrowRightLeft, CheckCircle } from 'lucide-react';

// ==========================================
// CAMADA DE SERVIÇOS HTTP (API)
// ==========================================
const API_URL = 'http://127.0.0.1:8000/api';

const api = {
  getInsumos: async () => {
    const res = await fetch(`${API_URL}/insumos`);
    if (!res.ok) throw new Error('Erro ao buscar insumos');
    return res.json();
  },
  createInsumo: async (data) => {
    const res = await fetch(`${API_URL}/insumos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Erro ao criar insumo');
    return res.json();
  },
  getProfissionais: async () => {
    const res = await fetch(`${API_URL}/profissionais`);
    if (!res.ok) throw new Error('Erro ao buscar profissionais');
    return res.json();
  },
  createProfissional: async (data) => {
    const res = await fetch(`${API_URL}/profissionais`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Erro ao criar profissional');
    }
    return res.json();
  },
  createMovimentacao: async (data) => {
    const res = await fetch(`${API_URL}/movimentacoes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Erro ao registrar movimentação');
    }
    return res.json();
  }
};

// ==========================================
// COMPONENTE PRINCIPAL E ROTAS
// ==========================================
export default function App() {
  const [view, setView] = useState('dashboard');
  const [insumos, setInsumos] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setGlobalError('');
    try {
      const [insumosData, profData] = await Promise.all([
        api.getInsumos(),
        api.getProfissionais()
      ]);
      setInsumos(insumosData);
      setProfissionais(profData);
    } catch (err) {
      setGlobalError('Erro de conexão com a API. Verifique se o Back-end está rodando.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- SUB-COMPONENTES DE VISUALIZAÇÃO ---

  const renderDashboard = () => {
    const insumosCriticos = insumos.filter(i => i.quantidade_atual < i.estoque_minimo);
    const insumosZerados = insumos.filter(i => i.quantidade_atual === 0);

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Tático</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-600">
            <div className="flex items-center text-gray-600 mb-2">
              <Box className="w-5 h-5 mr-2 text-blue-600" /> <h3 className="font-semibold">Total Insumos</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{insumos.length}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
            <div className="flex items-center text-gray-600 mb-2">
              <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" /> <h3 className="font-semibold">Abaixo do Mínimo</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{insumosCriticos.length}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-600">
            <div className="flex items-center text-gray-600 mb-2">
              <AlertCircle className="w-5 h-5 mr-2 text-red-600" /> <h3 className="font-semibold">Estoque Zerado</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{insumosZerados.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Nível Crítico (Ação Necessária)</h3>
          {insumosCriticos.length === 0 ? (
            <p className="text-green-600 font-medium flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" /> Nenhum alerta de estoque crítico no momento.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-700">
                    <th className="p-3 border-b font-semibold">Insumo</th>
                    <th className="p-3 border-b font-semibold">Qtd Atual</th>
                    <th className="p-3 border-b font-semibold">Estoque Mínimo</th>
                    <th className="p-3 border-b font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {insumosCriticos.map(i => (
                    <tr key={i.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{i.nome}</td>
                      <td className="p-3 font-bold text-gray-900">{i.quantidade_atual}</td>
                      <td className="p-3 text-gray-600">{i.estoque_minimo}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold text-white ${i.quantidade_atual === 0 ? 'bg-red-600' : 'bg-yellow-500'}`}>
                          {i.quantidade_atual === 0 ? 'Zerado' : 'Crítico'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderFormularioMovimentacao = () => {
    const [formData, setFormData] = useState({ tipo: 'entrada', quantidade: 1, insumo_id: '', profissional_id: '' });
    const [msg, setMsg] = useState({ type: '', text: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setMsg({ type: '', text: '' });
      setIsSubmitting(true);
      try {
        await api.createMovimentacao({
          ...formData,
          quantidade: parseInt(formData.quantidade),
          insumo_id: parseInt(formData.insumo_id),
          profissional_id: parseInt(formData.profissional_id)
        });
        setMsg({ type: 'success', text: 'Movimentação registrada com sucesso!' });
        setFormData({ tipo: 'entrada', quantidade: 1, insumo_id: '', profissional_id: '' });
        fetchData();
      } catch (err) {
        setMsg({ type: 'error', text: err.message });
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <ArrowRightLeft className="w-6 h-6 mr-2 text-blue-600" /> Registrar Movimentação
        </h2>
        
        {msg.text && (
          <div className={`p-4 mb-6 rounded-md ${msg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Movimentação</label>
              <select 
                required
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.tipo}
                onChange={e => setFormData({...formData, tipo: e.target.value})}
              >
                <option value="entrada">Entrada (+)</option>
                <option value="saida">Saída (-)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
              <input 
                type="number" min="1" required
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.quantidade}
                onChange={e => setFormData({...formData, quantidade: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Insumo / Medicamento</label>
            <select 
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.insumo_id}
              onChange={e => setFormData({...formData, insumo_id: e.target.value})}
            >
              <option value="">Selecione um insumo...</option>
              {insumos.map(i => (
                <option key={i.id} value={i.id}>{i.nome} (Estoque: {i.quantidade_atual})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profissional Responsável</label>
            <select 
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.profissional_id}
              onChange={e => setFormData({...formData, profissional_id: e.target.value})}
            >
              <option value="">Selecione um profissional...</option>
              {profissionais.map(p => (
                <option key={p.id} value={p.id}>{p.nome} - {p.registro_conselho}</option>
              ))}
            </select>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Processando...' : 'Confirmar Movimentação'}
            </button>
          </div>
        </form>
      </div>
    );
  };

  // ==========================================
  // RENDERIZAÇÃO DA APLICAÇÃO
  // ==========================================
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar de Navegação */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold tracking-wider">FESF-SUS</h1>
          <p className="text-sm text-gray-400">Controle de Estoque</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setView('dashboard')}
            className={`w-full flex items-center p-3 rounded-md transition ${view === 'dashboard' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
          >
            <Activity className="w-5 h-5 mr-3" /> Dashboard
          </button>
          <button 
            onClick={() => setView('movimentacao')}
            className={`w-full flex items-center p-3 rounded-md transition ${view === 'movimentacao' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
          >
            <ArrowRightLeft className="w-5 h-5 mr-3" /> Movimentações
          </button>
        </nav>
      </aside>

      {/* Área de Conteúdo Principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-700 capitalize">
            {view === 'dashboard' ? 'Visão Geral' : 'Gestão de Movimentações'}
          </h2>
          <div className="flex space-x-2">
            <button onClick={fetchData} className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-1 bg-blue-50 rounded-md">
              Atualizar Dados
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {globalError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
              <strong className="font-bold">Aviso! </strong>
              <span className="block sm:inline">{globalError}</span>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 font-medium">Carregando dados...</p>
            </div>
          ) : (
            <>
              {view === 'dashboard' && renderDashboard()}
              {view === 'movimentacao' && renderFormularioMovimentacao()}
            </>
          )}
        </div>
      </main>
    </div>
  );
}