export default function InputForm({ data, updateData }) {
  const handleChange = (e) => {
    updateData({ [e.target.name]: e.target.value });
  };

  const handleBenefitChange = (index, value) => {
    const newBenefits = [...data.benefits];
    newBenefits[index] = value;
    updateData({ benefits: newBenefits });
  };

  return (
    <div className="space-y-6">
      
      {/* Brand Profile */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">Brand Name</label>
          <input 
            type="text" 
            name="brandName"
            value={data.brandName} 
            onChange={handleChange}
            placeholder="Acme Corp"
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all placeholder:text-slate-400"
          />
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">One-line Purpose</label>
          <input 
            type="text" 
            name="purpose"
            value={data.purpose} 
            onChange={handleChange}
            placeholder="We build rockets for the masses."
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all placeholder:text-slate-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">Target Audience</label>
          <input 
            type="text" 
            name="targetAudience"
            value={data.targetAudience} 
            onChange={handleChange}
            placeholder="Gen-Z entrepreneurs, B2B SaaS founders..."
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="h-px w-full bg-slate-100" />

      {/* Value & Positioning */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">3 Core Benefits</label>
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <input 
                key={i}
                type="text" 
                value={data.benefits[i]} 
                onChange={(e) => handleBenefitChange(i, e.target.value)}
                placeholder={`Benefit 0${i + 1}`}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all placeholder:text-slate-400"
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">Differentiation (Unique Value)</label>
          <textarea 
            name="differentiation"
            value={data.differentiation} 
            onChange={handleChange}
            placeholder="Faster, cheaper, better design..."
            rows={2}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all resize-none placeholder:text-slate-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">Tone of Voice (Optional)</label>
          <input 
            type="text" 
            name="tone"
            value={data.tone} 
            onChange={handleChange}
            placeholder="Professional but witty, authoritative..."
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="h-px w-full bg-slate-100" />

      {/* Offer & Conversion */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">Products / Services</label>
          <textarea 
            name="products"
            value={data.products} 
            onChange={handleChange}
            placeholder="1. Web App Dev\n2. UI/UX Design\n3. SEO Audits"
            rows={3}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all resize-none placeholder:text-slate-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">Primary CTA</label>
            <input 
              type="text" 
              name="primaryCTA"
              value={data.primaryCTA} 
              onChange={handleChange}
              placeholder="Book a Call"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all placeholder:text-slate-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">Secondary CTA</label>
            <input 
              type="text" 
              name="secondaryCTA"
              value={data.secondaryCTA} 
              onChange={handleChange}
              placeholder="Learn More"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>
      
    </div>
  );
}
