import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { LogOut, CheckCircle2, User, Building, MapPin, Search, Phone, Mail, MessageSquare, Trash2, ArrowRight, Mic, Globe, Copy } from 'lucide-react';

export default function AdminDashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching leads:', error);
    } else {
      setLeads(data || []);
      if (data && data.length > 0 && !selectedLead) {
        setSelectedLead(data[0]);
      }
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const handleDeleteLead = async (lead) => {
    if (window.confirm(`Tem certeza que deseja deletar permanentemente o lead da empresa "${lead.company_name}"?`)) {
       const { error } = await supabase.from('leads').delete().eq('id', lead.id);
       if (!error) {
          setLeads(prev => prev.filter(l => l.id !== lead.id));
          if (selectedLead?.id === lead.id) setSelectedLead(null);
       } else {
          alert('Erro ao deletar lead.');
       }
    }
  };

  const parseJsonSafe = (jsonStr) => {
    if (!jsonStr) return null;
    try {
      if (typeof jsonStr === 'object') return jsonStr;
      return JSON.parse(jsonStr);
    } catch {
      return null;
    }
  };

  const generatePrompt = (lead) => {
    const colors = parseJsonSafe(lead.brand_colors) || {};
    let colorsText = "Não especificado";
    if (colors.primary) {
       colorsText = `Primária: ${colors.primary}, Secundária: ${colors.secondary}, Outra 1: ${colors.other1}, Outra 2: ${colors.other2}`;
    } else if (lead.brand_colors) {
       colorsText = lead.brand_colors;
    }

    const promptTemplate = `Nova Solicitação de Landing Page:
    
Empresa: ${lead.company_name}
WhatsApp: ${lead.whatsapp}
Site Atual: ${lead.website_url || 'Nenhum'}
Cores da Marca: ${colorsText}
Áudio gravado: ${lead.audio_url ? 'Sim' : 'Não'}

*Para gerar o prompt completo, clique em "Ir para Generator" no topo da página.*
`;
    return promptTemplate;
  };

  const handleCopyPrompt = async (lead) => {
    const prompt = generatePrompt(lead);
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedId(lead.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const filteredLeads = leads.filter(l => 
    l.company_name?.toLowerCase().includes(search.toLowerCase())
  );

  const renderColors = (colorsJson) => {
    const colors = parseJsonSafe(colorsJson);
    if (!colors) return <p className="text-sm text-slate-400">Nenhuma</p>;
    if (typeof colors === 'string') return <p className="text-sm text-slate-200 uppercase">{colors}</p>;

    return (
      <div className="flex gap-3">
        {colors.primary && (
          <div className="flex flex-col items-center gap-1" title={colors.primary}>
             <div className="w-8 h-8 rounded-full border-2 border-slate-700 shadow-md" style={{ backgroundColor: colors.primary }}></div>
             <span className="text-[10px] text-slate-500 uppercase">{colors.primary}</span>
          </div>
        )}
        {colors.secondary && (
          <div className="flex flex-col items-center gap-1" title={colors.secondary}>
             <div className="w-8 h-8 rounded-full border-2 border-slate-700 shadow-md" style={{ backgroundColor: colors.secondary }}></div>
             <span className="text-[10px] text-slate-500 uppercase">{colors.secondary}</span>
          </div>
        )}
        {colors.other1 && colors.other1 !== '#000000' && (
           <div className="flex flex-col items-center gap-1" title={colors.other1}>
             <div className="w-8 h-8 rounded-full border-2 border-slate-700 shadow-md" style={{ backgroundColor: colors.other1 }}></div>
             <span className="text-[10px] text-slate-500 uppercase">{colors.other1}</span>
          </div>
        )}
        {colors.other2 && colors.other2 !== '#d1d5db' && (
           <div className="flex flex-col items-center gap-1" title={colors.other2}>
             <div className="w-8 h-8 rounded-full border-2 border-slate-700 shadow-md" style={{ backgroundColor: colors.other2 }}></div>
             <span className="text-[10px] text-slate-500 uppercase">{colors.other2}</span>
          </div>
        )}
      </div>
    );
  };

  const renderPhotos = (photosJson) => {
     const urls = parseJsonSafe(photosJson);
     if (!urls || urls.length === 0) return null;
     return (
       <div className="mt-4">
         <p className="text-xs text-slate-400 mb-2">Fotos enviadas {urls.length > 0 && `(${urls.length})`}:</p>
         <div className="flex gap-4 overflow-x-auto pb-2">
            {urls.map((url, i) => (
              <a key={i} href={url} target="_blank" rel="noreferrer" className="block shrink-0 relative group">
                <div className="w-24 h-24 rounded-lg overflow-hidden border border-slate-700">
                  <img src={url} alt={`upload-${i}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                </div>
              </a>
            ))}
         </div>
       </div>
     );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row text-slate-100 font-sans">
      
      {/* SIDEBAR */}
      <div className="w-full md:w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-screen shrink-0 relative z-20">
        <header className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-500/10 p-1.5 rounded-lg border border-indigo-500/20">
              <Building className="w-4 h-4 text-indigo-400" />
            </div>
            <h1 className="font-semibold text-white tracking-tight">LayerOne</h1>
          </div>
          <button onClick={handleLogout} className="text-slate-400 hover:text-white transition-colors" title="Sair">
            <LogOut className="w-4 h-4" />
          </button>
        </header>

        <div className="p-4 border-b border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar projeto..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-sm text-slate-500 text-center">Carregando...</div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-4 text-sm text-slate-500 text-center">Nenhum projeto encontrado.</div>
          ) : (
            <div className="divide-y divide-slate-800/50">
              {filteredLeads.map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`w-full text-left p-4 hover:bg-slate-800/50 transition-colors border-l-2 ${selectedLead?.id === lead.id ? 'bg-slate-800 border-indigo-500' : 'border-transparent'}`}
                >
                  <p className="font-medium text-slate-200 truncate">{lead.company_name}</p>
                  <p className="text-xs text-slate-400 mt-1 truncate">{lead.whatsapp}</p>
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    <span>{new Date(lead.created_at).toLocaleDateString('pt-BR')}</span>
                    {lead.audio_url && <span className="bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded flex items-center gap-1"><Mic className="w-3 h-3"/> Áudio</span>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 bg-slate-950 flex flex-col h-screen overflow-hidden relative z-10 w-full">
        {selectedLead ? (
          <>
             <header className="px-8 py-6 border-b border-slate-800 bg-slate-900/50 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 shrink-0">
              <div className="flex items-center gap-4">
                 {selectedLead.logo_url && (
                   <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-slate-700">
                     <img src={selectedLead.logo_url} alt="Logo" className="max-w-full max-h-full object-contain" />
                   </div>
                 )}
                 <div>
                  <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                    {selectedLead.company_name}
                  </h2>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDeleteLead(selectedLead)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/20"
                >
                  <Trash2 className="w-4 h-4" /> 
                  <span className="hidden sm:inline">Deletar</span>
                </button>

                <button
                  onClick={() => handleCopyPrompt(selectedLead)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm ${copiedId === selectedLead.id ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'}`}
                >
                  {copiedId === selectedLead.id ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span className="hidden sm:inline">Info Rápida</span>
                </button>

                <button
                  onClick={() => navigate(`/admin/generator/${selectedLead.id}`)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20"
                >
                  Ir para Generator
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 md:p-8">
              <div className="max-w-4xl mx-auto space-y-8">
                
                {/* Section 1: Audio Briefing */}
                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6 border-b border-slate-800 pb-2">1. Áudio Briefing</h3>
                  {selectedLead.audio_url ? (
                    <div className="flex flex-col gap-4">
                       <p className="text-sm text-slate-300">Ouça o áudio gravado sobre o projeto para entender o contexto antes de ir para o Generator:</p>
                       <audio src={selectedLead.audio_url} controls className="w-full max-w-lg outline-none rounded-lg bg-slate-950 border border-slate-800" />
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic">Nenhum áudio foi gravado para este projeto.</p>
                  )}
                </section>

                {/* Section 2: Contact & Assets */}
                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                   <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6 border-b border-slate-800 pb-2">2. Contato & Site Atual</h3>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="flex flex-col bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                        <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2"><MessageSquare className="w-3.5 h-3.5"/> WhatsApp</span>
                        <p className="text-sm font-medium text-white">{selectedLead.whatsapp || 'Não informado'}</p>
                      </div>
                      <div className="flex flex-col bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                        <span className="flex items-center gap-1.5 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2"><Globe className="w-3.5 h-3.5"/> Site Atual</span>
                        <p className="text-sm font-medium text-white truncate" title={selectedLead.website_url}>
                          {selectedLead.website_url ? <a href={selectedLead.website_url} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">{selectedLead.website_url}</a> : 'Não possui'}
                        </p>
                      </div>
                   </div>
                </section>

                {/* Section 3: Visuals */}
                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                   <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6 border-b border-slate-800 pb-2">3. Visual e Arquivos Extras</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs text-slate-400 mb-2">Cores da Marca</p>
                        {renderColors(selectedLead.brand_colors)}
                      </div>
                      {selectedLead.has_logo === 'Sim' && (
                        <div>
                          <p className="text-xs text-slate-400 mb-1">Logotipo</p>
                          <p className="text-sm text-slate-200">{selectedLead.logo_url ? <a href={selectedLead.logo_url} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">Ver Logotipo Original</a> : 'Enviado mas URL não capturada.'}</p>
                        </div>
                      )}
                   </div>
                   
                   {/* Render multiple photos */}
                   {renderPhotos(selectedLead.photos_urls)}

                   {selectedLead.additional_info && (
                     <div className="mt-8 bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <p className="text-xs font-bold uppercase text-slate-500 mb-2">Informações Adicionais (Extra)</p>
                        <p className="text-sm text-slate-200 italic leading-relaxed">"{selectedLead.additional_info}"</p>
                     </div>
                   )}
                </section>

              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8">
            <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mb-4 border border-slate-800 shadow-inner">
              <Mic className="w-8 h-8 text-slate-700" />
            </div>
            <p className="text-lg font-medium text-slate-400">Selecione um projeto para ouvir o briefing</p>
            <p className="text-sm max-w-sm text-center mt-2">Clique na lista ao lado para iniciar a construção da Landing Page.</p>
          </div>
        )}
      </div>
    </div>
  );
}
