export default function PageSelector({ data, updateData }) {
  const pagesConfig = [
    { id: 'landing', label: 'Landing Page' }, // Will be forced true visually
    { id: 'about', label: 'About Page' },
    { id: 'services', label: 'Services Page' },
    { id: 'pricing', label: 'Pricing Page' },
    { id: 'blog', label: 'Blog Engine' },
    { id: 'faq', label: 'FAQ Directory' },
    { id: 'contact', label: 'Contact Page' }
  ];

  const togglePage = (id) => {
    if (id === 'landing') return; // Cannot toggle landing
    const newPages = { ...data.pages, [id]: !data.pages[id] };
    updateData({ pages: newPages });
  };

  const handleCustomPageChange = (e) => {
    const newPages = { ...data.pages, custom: e.target.value };
    updateData({ pages: newPages });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {pagesConfig.map(page => {
          const isSelected = data.pages[page.id];
          const isForced = page.id === 'landing';
          
          return (
            <button
              key={page.id}
              onClick={() => togglePage(page.id)}
              disabled={isForced}
              className={`
                flex items-center gap-2.5 px-3 py-2.5 rounded-md border text-sm transition-all text-left
                ${isSelected 
                  ? 'border-indigo-500/50 bg-indigo-500/10 flex-row text-indigo-300 shadow-sm' 
                  : 'border-slate-700/60 bg-slate-900 text-slate-400 hover:border-slate-600 hover:bg-slate-800'
                }
                ${isForced ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className={`w-4 h-4 rounded-full border flex-none flex items-center justify-center
                ${isSelected ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-600 bg-slate-800'}
              `}>
                {isSelected && <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </div>
              <span className="font-medium mr-auto tracking-tight">{page.label}</span>
              {isForced && <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">Required</span>}
            </button>
          )
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800/60">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Custom Page Target</label>
        <input 
          type="text" 
          value={data.pages.custom} 
          onChange={handleCustomPageChange}
          placeholder="e.g. Careers, Investor Relations..."
          className="w-full px-3 py-2 bg-slate-950/50 border border-slate-700/60 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-500"
        />
      </div>
    </div>
  );
}
