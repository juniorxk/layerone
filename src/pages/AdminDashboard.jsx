import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { LogOut, ChevronRight, Copy, CheckCircle2, User, Building, MapPin, Search } from 'lucide-react';

export default function AdminDashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [search, setSearch] = useState('');
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

  const generatePrompt = (lead) => {
    const promptTemplate = `Você é um Web Designer experiente e Copywriter de Alta Conversão. 
Abaixo estão as informações completas do negócio do meu cliente. Com base nelas, gere um escopo de Landing Page (Copy completa e instruções de layout).

1. SOBRE O NEGÓCIO
- Nome da Empresa: ${lead.company_name}
- Descrição Breve: ${lead.company_description}
- Local de Atendimento: ${lead.location}
- Tem site?: ${lead.has_website} ${lead.website_url ? `(${lead.website_url})` : ''}

2. PRODUTOS/SERVIÇOS
- Principal Produto: ${lead.core_product}
- Ticket Médio: ${lead.average_price}
- Oferta/Condição: ${lead.special_offer || 'Nenhuma'}

3. O CLIENTE IDEAL
- Quem compra: ${lead.target_audience}
- Problema do cliente: ${lead.customer_problem}
- Porque escolhem essa empresa: ${lead.differentiator}

4. DIFERENCIAIS
- Pontos fortes: ${lead.key_strengths}

5. PROVA SOCIAL
- Depoimentos: ${lead.testimonials || 'Nenhum informado'}

6. CONTATO & VISUAL
- WhatsApp: ${lead.whatsapp}
- Método preferido: ${lead.contact_method}
- Tem logo?: ${lead.has_logo}
- Cores da marca: ${lead.brand_colors || 'Não especificado'}
- Prazo desejado: ${lead.delivery_timeline}
- Informação Extra: ${lead.additional_info || 'Nenhuma'}

Por favor, crie uma estrutura de Landing Page focada em conversão dividida da seguinte forma:
- Hero Section (Headline chamativa, Subheadline, CTA Principal)
- Seção de Problema (Qual dor do cliente?)
- Apresentação da Solução/Serviços
- Benefícios e Diferenciais
- Prova Social (Como usar as avaliações)
- Oferta / CTA Final
- FAQ
Forneça as diretrizes de design ideais com base na marca (Cores sugeridas, tipo de imagens).
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
    l.company_name?.toLowerCase().includes(search.toLowerCase()) || 
    l.core_product?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row text-slate-100 font-sans">
      
      {/* SIDEBAR */}
      <div className="w-full md:w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-screen shrink-0">
        <header className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-500/10 p-1.5 rounded-lg border border-indigo-500/20">
              <Building className="w-4 h-4 text-indigo-400" />
            </div>
            <h1 className="font-semibold text-white tracking-tight">Leads Captados</h1>
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
              placeholder="Buscar por empresa..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-sm text-slate-500 text-center">Carregando...</div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-4 text-sm text-slate-500 text-center">Nenhum lead encontrado.</div>
          ) : (
            <div className="divide-y divide-slate-800/50">
              {filteredLeads.map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`w-full text-left p-4 hover:bg-slate-800/50 transition-colors border-l-2 ${selectedLead?.id === lead.id ? 'bg-slate-800 border-indigo-500' : 'border-transparent'}`}
                >
                  <p className="font-medium text-slate-200 truncate">{lead.company_name}</p>
                  <p className="text-xs text-slate-400 mt-1 truncate">{lead.core_product}</p>
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    <span>{new Date(lead.created_at).toLocaleDateString('pt-BR')}</span>
                    {lead.whatsapp && <span className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">WhatsApp</span>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 bg-slate-950 flex flex-col h-screen overflow-hidden">
        {selectedLead ? (
          <>
            <header className="px-8 py-6 border-b border-slate-800 bg-slate-900/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  {selectedLead.company_name}
                </h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{selectedLead.location}</span>
                  <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />{selectedLead.target_audience}</span>
                </div>
              </div>
              
              <button
                onClick={() => handleCopyPrompt(selectedLead)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm ${copiedId === selectedLead.id ? 'bg-emerald-500 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'}`}
              >
                {copiedId === selectedLead.id ? (
                  <><CheckCircle2 className="w-4 h-4" /> Prompt Copiado!</>
                ) : (
                  <><Copy className="w-4 h-4" /> Copiar Prompt para I.A.</>
                )}
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 md:p-8">
              <div className="max-w-4xl mx-auto space-y-8">
                
                {/* Section 1: Business Overview */}
                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6 border-b border-slate-800 pb-2">1. Sobre o Negócio</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">O que a empresa faz?</p>
                      <p className="text-sm text-slate-200">{selectedLead.company_description}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Site</p>
                      <p className="text-sm text-slate-200">
                        {selectedLead.has_website === 'Sim' ? (
                          <a href={selectedLead.website_url} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">{selectedLead.website_url}</a>
                        ) : 'Não possui'}
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 2: Product/Offer */}
                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6 border-b border-slate-800 pb-2">2. Oferta</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Produto Principal</p>
                      <p className="text-sm font-medium text-white">{selectedLead.core_product}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Ticket Médio</p>
                      <span className="inline-flex px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs font-medium">{selectedLead.average_price}</span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Promoção Ativa</p>
                      <p className="text-sm text-amber-400 font-medium">{selectedLead.special_offer || 'Nenhuma'}</p>
                    </div>
                  </div>
                </section>

                {/* Section 3: Audience Info */}
                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6 border-b border-slate-800 pb-2">3. Cliente e Posicionamento</h3>
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Problema que o cliente enfrenta</p>
                      <p className="text-sm text-slate-200 mt-1 p-3 bg-slate-950 rounded-lg border border-slate-800/60">{selectedLead.customer_problem}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Porque escolhem sua empresa?</p>
                      <p className="text-sm text-slate-200 mt-1 p-3 bg-slate-950 rounded-lg border border-slate-800/60">{selectedLead.differentiator}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Principais Pontos Fortes e Diferenciais</p>
                      <p className="text-sm text-slate-200 mt-1 p-3 bg-slate-950 rounded-lg border border-slate-800/60 whitespace-pre-wrap leading-relaxed">{selectedLead.key_strengths}</p>
                    </div>
                  </div>
                </section>

                {/* Section 4: Contact & Details */}
                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                   <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6 border-b border-slate-800 pb-2">4. Contato e Logística</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div>
                        <p className="text-xs text-slate-400 mb-1">WhatsApp</p>
                        <p className="text-sm font-medium text-emerald-400">{selectedLead.whatsapp}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Método de Contato</p>
                        <p className="text-sm text-slate-200">{selectedLead.contact_method}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Tem Logo?</p>
                        <p className="text-sm text-slate-200">{selectedLead.has_logo}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Cores da Marca</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {selectedLead.brand_colors?.startsWith('#') && (
                            <div className="w-4 h-4 rounded-full border border-slate-700" style={{ backgroundColor: selectedLead.brand_colors }}></div>
                          )}
                          <p className="text-sm text-slate-200 uppercase">{selectedLead.brand_colors || 'Nenhuma'}</p>
                        </div>
                      </div>
                   </div>
                   {selectedLead.additional_info && (
                     <div className="mt-6 border-t border-slate-800 pt-6">
                        <p className="text-xs text-slate-400 mb-1">Informações Adicionais</p>
                        <p className="text-sm text-slate-200 italic">"{selectedLead.additional_info}"</p>
                     </div>
                   )}
                </section>

              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8">
            <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mb-4 border border-slate-800">
              <Building className="w-8 h-8 text-slate-700" />
            </div>
            <p className="text-lg font-medium text-slate-400">Selecione um lead para ver os detalhes</p>
            <p className="text-sm max-w-sm text-center mt-2">Os dados dos formulários preenchidos aparecerão na lista ao lado.</p>
          </div>
        )}
      </div>
    </div>
  );
}
