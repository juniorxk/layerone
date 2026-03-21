import { useState, useMemo } from 'react';
import { Copy, Check } from 'lucide-react';

export default function PromptPreview({ data, liveUpdate }) {
  const [copied, setCopied] = useState(false);

  // Core Prompt Generation Logic
  const generatedPrompt = useMemo(() => {
    // Determine Pages to generate
    const selectedPagesArray = Object.entries(data.pages)
      .filter(([key, val]) => (typeof val === 'boolean' && val) || (key === 'custom' && val.length > 0))
      .map(([key, val]) => key === 'custom' ? val : key);

    return `
# INSTRUCTION: WordPress Theme Generation via LayerOne

You are an expert Frontend Engineer and WordPress Theme Developer.
Your task is to generate a complete, production-ready WordPress theme based on the structured specifications below. 
Do not ignore any of these parameters. Optimize for speed, modern aesthetics, and exact layout specifications.

---

## 1. Context Block
- **Brand Definition**: ${data.brandName || '[Not provided]'}
- **One-line Purpose**: ${data.purpose || '[Not provided]'}
- **Industry Context**: ${data.industry || '[Not provided]'}
- **Target Audience**: ${data.targetAudience || '[Not provided]'}

---

## 2. Design Instructions
- **Aesthetic Preset**: ${data.aestheticPreset}
- **Style Intensity**: ${data.styleIntensity}
- **Brand Tone**: ${data.tone || 'Professional yet accessible'}

---

## 3. Page Requirements
You must generate the following pages. Use appropriate routing/template structure:
- Landing Page (Home) — REQUIRED
${selectedPagesArray.filter(p => p !== 'landing').map(p => `- ${p.charAt(0).toUpperCase() + p.slice(1)} Page`).join('\n')}

---

## 4. Content Inputs (Inject strictly into structure)
**Value Proposition / Core Benefits:**
${data.benefits.filter(Boolean).map(b => `- ${b}`).join('\n') || '- [Awaiting benefits]'}

**Differentiation Factor:**
> ${data.differentiation || '[Not provided]'}

**Services / Products:**
${data.products || '[Not provided]'}

**Pricing & Offers:**
${data.pricing || '[Not provided]'}

**Conversion Architecture:**
- Primary CTA: "${data.primaryCTA || 'Get Started'}"
- Secondary CTA: "${data.secondaryCTA || 'Learn More'}"

---

## 5. Advanced Variables
- **SEO Keywords**: ${data.seoKeywords || '[None specified]'}
- **Local SEO Target**: ${data.location || '[None specified]'}
- **Language**: ${data.language || 'English'}
- **Auto-Generate Blog Architecture**: ${data.enableBlogAuto ? 'YES' : 'NO'}

---

## 6. Technical Requirements
1. **Output Format**: Generate a functional WordPress theme package (or strictly valid React/HTML components if acting as an intermediate layer), using Tailwind CSS for styling.
2. **Animations**: Integrate subtle entrance animations (e.g., GSAP or Tailwind animations) fitting the "${data.styleIntensity}" intensity level.
3. **Structure**: File architecture must be clear. Ensure all components are modular and well documented.
4. **Responsive**: Mobile-first approach strictly required.

---

## 7. Final Directive
Begin execution immediately. Provide the complete code blocks and instructions for deployment. Do not skip components.
    `.trim();
  }, [data]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col relative bg-[#0d1117] rounded-xl overflow-hidden border border-slate-700/50 shadow-2xl">
      
      {/* Code Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-slate-700/50">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
        </div>
        <div className="text-xs font-mono text-slate-400">layerone.prompt.md</div>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-xs font-semibold rounded transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy Prompt'}
        </button>
      </div>

      {/* Code Body */}
      <div className="flex-1 overflow-y-auto p-5 font-mono text-[13px] leading-relaxed relative">
        {!liveUpdate && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <div className="bg-[#161b22] border border-slate-700/50 px-4 py-2 rounded-md text-slate-300 text-sm flex items-center gap-2 shadow-xl">
              <span className="w-2 h-2 rounded-full border border-slate-500"></span>
              Live Update Paused
            </div>
          </div>
        )}

        <pre className="text-slate-300 whitespace-pre-wrap select-all">
          <code className="language-markdown">
            {generatedPrompt}
          </code>
        </pre>
      </div>
      
    </div>
  );
}
