import { PRESETS } from '../config/presets';

export default function DesignSettings({ data, updateData }) {
  const handleChange = (e) => {
    updateData({ [e.target.name]: e.target.value });
  };

  const handleCheckbox = (e) => {
    updateData({ [e.target.name]: e.target.checked });
  };

  const handlePresetSelect = (e) => {
    updateData({ theme: PRESETS[e.target.value] });
  };

  const handleThemeChange = (category, key, value) => {
    updateData({
      theme: {
        ...data.theme,
        id: "custom",
        name: "Custom (Define your own theme)",
        [category]: {
          ...(typeof data.theme[category] === 'object' ? data.theme[category] : {}),
          [key]: value
        }
      }
    });
  };

  const handleMoodMotionChange = (key, value) => {
    updateData({
      theme: {
        ...data.theme,
        id: "custom",
        name: "Custom (Define your own theme)",
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Design System Config */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">Aesthetic Preset</label>
            <select 
              value={data.theme.id} 
              onChange={handlePresetSelect}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 appearance-none cursor-pointer"
            >
              {Object.values(PRESETS).map(preset => (
                <option key={preset.id} value={preset.id}>{preset.name}</option>
              ))}
            </select>
          </div>

          <div className="col-span-2 bg-slate-50 border border-slate-100 rounded-lg p-3 space-y-4">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">Palette Customization</label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Primary/Dark</label>
                <div className="flex bg-white rounded border border-slate-200 overflow-hidden items-center focus-within:ring-2 focus-within:ring-indigo-500/40">
                  <input 
                    type="color" 
                    value={data.theme.palette.primary} 
                    onChange={(e) => handleThemeChange('palette', 'primary', e.target.value)}
                    className="w-8 h-8 rounded-none border-0 cursor-pointer p-0"
                  />
                  <input 
                    type="text" 
                    value={data.theme.palette.primary}
                    onChange={(e) => handleThemeChange('palette', 'primary', e.target.value)}
                    className="w-full text-xs px-2 outline-none uppercase font-mono text-slate-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Secondary/Light</label>
                <div className="flex bg-white rounded border border-slate-200 overflow-hidden items-center focus-within:ring-2 focus-within:ring-indigo-500/40">
                  <input 
                    type="color" 
                    value={data.theme.palette.secondary} 
                    onChange={(e) => handleThemeChange('palette', 'secondary', e.target.value)}
                    className="w-8 h-8 rounded-none border-0 cursor-pointer p-0"
                  />
                  <input 
                    type="text" 
                    value={data.theme.palette.secondary}
                    onChange={(e) => handleThemeChange('palette', 'secondary', e.target.value)}
                    className="w-full text-xs px-2 outline-none uppercase font-mono text-slate-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Accent</label>
                <div className="flex bg-white rounded border border-slate-200 overflow-hidden items-center focus-within:ring-2 focus-within:ring-indigo-500/40">
                  <input 
                    type="color" 
                    value={data.theme.palette.accent} 
                    onChange={(e) => handleThemeChange('palette', 'accent', e.target.value)}
                    className="w-8 h-8 rounded-none border-0 cursor-pointer p-0"
                  />
                  <input 
                    type="text" 
                    value={data.theme.palette.accent}
                    onChange={(e) => handleThemeChange('palette', 'accent', e.target.value)}
                    className="w-full text-xs px-2 outline-none uppercase font-mono text-slate-600"
                  />
                </div>
              </div>
            </div>

            {data.theme.id === 'custom' && (
              <div className="space-y-3 pt-2 border-t border-slate-200/60">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Headings Font</label>
                    <input type="text" value={data.theme.typography.headings} onChange={(e) => handleThemeChange('typography', 'headings', e.target.value)} className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded outline-none" placeholder="e.g. Inter" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Accent/Mono Font</label>
                    <input type="text" value={data.theme.typography.accent} onChange={(e) => handleThemeChange('typography', 'accent', e.target.value)} className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded outline-none" placeholder="e.g. Playfair" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Image Mood / Art Direction</label>
                  <input type="text" value={data.theme.mood} onChange={(e) => handleMoodMotionChange('mood', e.target.value)} className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded outline-none" placeholder="Photographic, dark shadows..." />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Motion Style</label>
                  <input type="text" value={data.theme.motion} onChange={(e) => handleMoodMotionChange('motion', e.target.value)} className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded outline-none" placeholder="Snappy, spring-based..." />
                </div>
              </div>
            )}
          </div>

          <div className="col-span-2">
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

      {/* Advanced Parameters */}
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
