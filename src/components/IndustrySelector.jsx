export default function IndustrySelector({ data, updateData }) {
  const industries = [
    "Healthcare", "Real Estate", "Legal", "SaaS", 
    "E-commerce", "Education", "Marketing Agency", 
    "Local Business", "Other"
  ];

  const handleSelect = (e) => {
    updateData({ industry: e.target.value });
  };

  const getHelperContext = (industry) => {
    switch(industry) {
      case "Healthcare": return "Suggested tone: Empathetic, Trustworthy. Key section: Patient Testimonials.";
      case "Real Estate": return "Suggested tone: Aspirational, Professional. Key section: Property Listings / Portfolios.";
      case "SaaS": return "Suggested tone: Innovative, Direct. Key section: Interactive Product Demo & Pricing Grid.";
      case "Local Business": return "Suggested tone: Community-focused, Friendly. Key section: Map & Operating Hours.";
      case "E-commerce": return "Suggested tone: Exciting, Action-oriented. Key section: Featured Products & Reviews.";
      default: return "";
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 mt-2">
      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">Industry Sector</label>
      <select 
        value={data.industry} 
        onChange={handleSelect}
        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 appearance-none cursor-pointer transition-all"
      >
        <option value="" disabled>Select an industry...</option>
        {industries.map(ind => (
          <option key={ind} value={ind}>{ind}</option>
        ))}
      </select>
      
      {data.industry && getHelperContext(data.industry) && (
        <div className="mt-3 text-xs text-indigo-700 bg-indigo-50/50 p-2.5 rounded border border-indigo-100/50 flex items-start gap-2">
           <svg className="w-4 h-4 flex-none mt-0.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="leading-relaxed">{getHelperContext(data.industry)}</span>
        </div>
      )}
    </div>
  );
}
