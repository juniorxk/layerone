import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import InputForm from '../components/InputForm';
import IndustrySelector from '../components/IndustrySelector';
import PageSelector from '../components/PageSelector';
import DesignSettings from '../components/DesignSettings';
import PromptPreview from '../components/PromptPreview';
import { Settings, Layout, Code, TerminalSquare, ArrowLeft } from 'lucide-react';

import { PRESETS } from '../config/presets';
import { CATEGORIES } from '../config/categories';
import { SECTIONS } from '../config/sections';
import { LANDING_STYLES } from '../config/styles';

const defaultCategory = CATEGORIES[0];
const initialLandingSections = SECTIONS.reduce((acc, section) => {
  acc[section.id] = defaultCategory.recommended.includes(section.id);
  return acc;
}, {});

const initialState = {
  // Landing Page Structure
  landingCategory: defaultCategory.id,
  landingStyle: LANDING_STYLES[0].id,
  landingSections: initialLandingSections,
  sectionContent: {},
  // Business Info
  brandName: "",
  purpose: "",
  industry: "",
  targetAudience: "",
  // Value & Positioning
  benefits: ["", "", ""],
  differentiation: "",
  howItWorks: "",
  tone: "",
  // Offer
  products: "",
  pricing: "",
  // Conversion
  primaryCTA: "",
  secondaryCTA: "",
  // Page Builder
  pages: { landing: true, about: false, services: false, contact: false, blog: false, pricing: false, faq: false, custom: "" },
  // Design Config
  theme: PRESETS["preset-a"],
  styleIntensity: "Balanced", // Minimal, Balanced, High-impact
  // Advanced Controls
  seoKeywords: "",
  location: "",
  language: "Portuguese",
  enableBlogAuto: false
};

export default function PromptGenerator() {
  const [data, setData] = useState(initialState);
  const [liveUpdate, setLiveUpdate] = useState(true);
  
  const { leadId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (leadId) {
      const fetchLead = async () => {
        const { data: lead, error } = await supabase
          .from('leads')
          .select('*')
          .eq('id', leadId)
          .single();
          
        if (lead && !error) {
           const benefitsArray = lead.key_strengths 
             ? lead.key_strengths.split('\n').filter(b => b.trim()).slice(0,3)
             : ["", "", ""];
           // Ensure length 3
           while(benefitsArray.length < 3) benefitsArray.push("");

           setData(prev => ({
              ...prev,
              brandName: lead.company_name || "",
              industry: lead.core_product || "",
              targetAudience: lead.target_audience || "",
              purpose: lead.company_description || "",
              differentiation: lead.differentiator || "",
              pricing: lead.average_price || "",
              location: lead.location || "",
              benefits: benefitsArray,
              tone: "Profissional, acolhedor e focado em conversão",
              primaryCTA: "Agendar Consulta via WhatsApp"
           }));
        }
      };
      fetchLead();
    }
  }, [leadId]);

  const updateData = (updates) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const resetForm = () => {
    if (confirm("Reset all inputs to default?")) {
      setData(initialState);
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 font-sans text-slate-100 overflow-hidden">
      
      {/* LEFT PANEL - CONTROLS (40%) */}
      <div className="w-full md:w-[45%] lg:w-[40%] flex flex-col bg-slate-900 border-r border-slate-800 shadow-sm relative z-10">
        
        {/* Header */}
        <header className="flex-none p-5 pb-4 border-b border-slate-800 flex items-center justify-between bg-slate-900 z-20">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-500/10 p-1.5 rounded-md border border-indigo-500/20">
              <TerminalSquare className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-white leading-none">LayerOne</h1>
              <p className="text-xs text-slate-400 mt-0.5">Prompt Operating System</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {leadId && (
              <button 
                onClick={() => navigate('/admin')}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md text-xs font-medium transition-colors border border-slate-700"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Voltar
              </button>
            )}
            <button 
              onClick={resetForm}
              className="text-xs font-medium text-slate-500 hover:text-white transition-colors"
            >
              Reset
            </button>
          </div>
        </header>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-10 pb-32 custom-scrollbar">
          
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Layout className="w-4 h-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Business Context</h2>
            </div>
            <div className="space-y-5">
              <InputForm data={data} updateData={updateData} />
              <IndustrySelector data={data} updateData={updateData} />
            </div>
          </section>

          <hr className="border-slate-800/60" />

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Layout className="w-4 h-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Page Architecture</h2>
            </div>
            <PageSelector data={data} updateData={updateData} />
          </section>

          <hr className="border-slate-800/60" />

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-4 h-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Parameters & Design</h2>
            </div>
            <DesignSettings data={data} updateData={updateData} />
          </section>
        </div>
      </div>

      {/* RIGHT PANEL - PREVIEW (60%) */}
      <div className="hidden md:flex flex-col w-[55%] lg:w-[60%] bg-slate-950 h-full relative">
        <header className="flex-none p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center backdrop-blur-sm z-10">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-medium text-slate-300">Prompt Output Engine</h2>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-400 cursor-pointer">
              <div className={`w-8 h-4 rounded-full relative transition-colors ${liveUpdate ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={liveUpdate} 
                  onChange={(e) => setLiveUpdate(e.target.checked)}
                />
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${liveUpdate ? 'left-[18px]' : 'left-0.5'}`} />
              </div>
              Live Mode
            </label>
          </div>
        </header>

        <div className="flex-1 overflow-hidden p-6 relative">
             {/* Background ambient light */}
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
          <PromptPreview data={data} liveUpdate={liveUpdate} />
        </div>
      </div>
    </div>
  );
}
