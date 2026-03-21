export default function DesignSettings({ data, updateData }) {
  const handleChange = (e) => {
    updateData({ [e.target.name]: e.target.value });
  };

  const handleCheckbox = (e) => {
    updateData({ [e.target.name]: e.target.checked });
  };

  return (
    <div className="space-y-6">
      
      {/* Design System Config */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">Aesthetic Preset</label>
            <select 
              name="aestheticPreset"
              value={data.aestheticPreset} 
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 appearance-none cursor-pointer"
            >
              <option value="Preset A — Organic Authority">Preset A — Organic Authority (Trust + Warmth)</option>
              <option value="Preset B — Dark Premium">Preset B — Dark Premium (Luxury + Power)</option>
              <option value="Preset C — Tech Edge">Preset C — Tech Edge (Modern SaaS)</option>
              <option value="Preset D — Editorial Impact">Preset D — Editorial Impact (Story + Brand)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">Style Intensity</label>
            <select 
              name="styleIntensity"
              value={data.styleIntensity} 
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 appearance-none cursor-pointer"
            >
              <option value="Minimal">Minimal (Subtle)</option>
              <option value="Balanced">Balanced (Standard)</option>
              <option value="High-impact">High-Impact (Bold)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-slate-100" />

      {/* Advanced Parameters (Collapsible-like but flat for speed) */}
      <div className="space-y-4 pt-1">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Advanced Parameters</h3>
        
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">SEO Focus Keywords (Comma separated)</label>
          <input 
            type="text" 
            name="seoKeywords"
            value={data.seoKeywords} 
            onChange={handleChange}
            placeholder="e.g. affordable housing, luxury apartments"
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Location (Local SEO)</label>
            <input 
              type="text" 
              name="location"
              value={data.location} 
              onChange={handleChange}
              placeholder="e.g. Austin, TX"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Language output</label>
            <input 
              type="text" 
              name="language"
              value={data.language} 
              onChange={handleChange}
              placeholder="e.g. English"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        <label className="flex items-center gap-3 pt-2 cursor-pointer group">
          <div className="relative">
            <input 
              type="checkbox" 
              name="enableBlogAuto"
              checked={data.enableBlogAuto} 
              onChange={handleCheckbox}
              className="sr-only"
            />
            <div className={`w-8 h-4.5 rounded-full border transition-colors ${data.enableBlogAuto ? 'bg-indigo-500 border-indigo-500' : 'bg-slate-200 border-slate-300 group-hover:bg-slate-300'}`}></div>
            <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow transition-all ${data.enableBlogAuto ? 'left-4' : 'left-0.5'}`}></div>
          </div>
          <span className="text-sm font-medium text-slate-700">Enable Blog Architecture Auto-generation</span>
        </label>

      </div>
      
    </div>
  );
}
