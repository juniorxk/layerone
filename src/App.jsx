import { useState } from 'react';
import InputForm from './components/InputForm';
import IndustrySelector from './components/IndustrySelector';
import PageSelector from './components/PageSelector';
import DesignSettings from './components/DesignSettings';
import PromptPreview from './components/PromptPreview';
import { Settings, Layout, Code, TerminalSquare } from 'lucide-react';

import { PRESETS } from './config/presets';
import { CATEGORIES } from './config/categories';
import { SECTIONS } from './config/sections';

const defaultCategory = CATEGORIES[0];
const initialLandingSections = SECTIONS.reduce((acc, section) => {
  acc[section.id] = defaultCategory.recommended.includes(section.id);
  return acc;
}, {});

const initialState = {
  // Landing Page Structure
  landingCategory: defaultCategory.id,
  landingSections: initialLandingSections,
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
  language: "English",
  enableBlogAuto: false
};

function App() {
  const [data, setData] = useState(initialState);
  const [liveUpdate, setLiveUpdate] = useState(true);

  // Partial update helper
  const updateData = (updates) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const resetForm = () => {
    if (confirm("Reset all inputs to default?")) {
      setData(initialState);
    }
  };

  return (
    <div className="flex h-screen w-full bg-neutral-100 font-sans overflow-hidden">
      
      {/* LEFT PANEL - CONTROLS (40%) */}
      <div className="w-full md:w-[45%] lg:w-[40%] flex flex-col bg-white border-r border-neutral-200 shadow-sm relative z-10">
        
        {/* Header */}
        <header className="flex-none p-5 pb-4 border-b border-neutral-100 flex items-center justify-between bg-white z-20">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 p-1.5 rounded-md">
              <TerminalSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-slate-900 leading-none">LayerOne</h1>
              <p className="text-xs text-slate-500 mt-0.5">Prompt Operating System</p>
            </div>
          </div>
          <button 
            onClick={resetForm}
            className="text-xs font-medium text-slate-400 hover:text-slate-700 transition-colors"
          >
            Reset
          </button>
        </header>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-10 pb-32">
          
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Layout className="w-4 h-4 text-slate-500" />
              <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Business Context</h2>
            </div>
            <div className="space-y-5">
              <InputForm data={data} updateData={updateData} />
              <IndustrySelector data={data} updateData={updateData} />
            </div>
          </section>

          <hr className="border-neutral-100" />

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Layout className="w-4 h-4 text-slate-500" />
              <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Page Architecture</h2>
            </div>
            <PageSelector data={data} updateData={updateData} />
          </section>

          <hr className="border-neutral-100" />

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-4 h-4 text-slate-500" />
              <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Parameters & Design</h2>
            </div>
            <DesignSettings data={data} updateData={updateData} />
          </section>
        </div>
      </div>

      {/* RIGHT PANEL - PREVIEW (60%) */}
      <div className="hidden md:flex flex-col w-[55%] lg:w-[60%] bg-neutral-50 h-full relative">
        <header className="flex-none p-4 border-b border-neutral-200 bg-neutral-100/50 flex justify-between items-center backdrop-blur-sm z-10">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-slate-600" />
            <h2 className="text-sm font-medium text-slate-700">Prompt Output Engine</h2>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer">
              <div className={`w-8 h-4 rounded-full relative transition-colors ${liveUpdate ? 'bg-indigo-500' : 'bg-slate-300'}`}>
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

        <div className="flex-1 overflow-hidden p-6">
          <PromptPreview data={data} liveUpdate={liveUpdate} />
        </div>
      </div>
    </div>
  );
}

export default App;
