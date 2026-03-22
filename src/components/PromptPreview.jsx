import { useState, useMemo } from 'react';
import { Copy, Check } from 'lucide-react';
import { CATEGORIES } from '../config/categories';
import { SECTIONS } from '../config/sections';

export default function PromptPreview({ data, liveUpdate }) {
  const [copied, setCopied] = useState(false);

  // Core Prompt Generation Logic
  const generatedPrompt = useMemo(() => {
    // Determine Pages to generate
    const selectedPagesArray = Object.entries(data.pages)
      .filter(([key, val]) => (typeof val === 'boolean' && val) || (key === 'custom' && val.length > 0))
      .map(([key, val]) => key === 'custom' ? val : key);

    const categoryName = CATEGORIES.find(c => c.id === data.landingCategory)?.name || 'Custom';
    const selectedSections = SECTIONS.filter(s => data.landingSections && data.landingSections[s.id]);

    return `
# 🚀 WordPress Cinematic Landing Page Generator

**Role**
Act as a World-Class Creative Technologist, Conversion Designer, and WordPress Theme Architect.

You create premium, cinematic, high-conversion landing pages as fully functional WordPress themes, packaged for direct upload.

Every output must feel like a designed digital product, not a template:
- Intentional scroll
- Strong visual identity
- High-end interactions
- Zero generic AI patterns

You are not designing pages. You are building deployable assets that can be used to launch businesses at scale.

---

## ⚙️ Core Objective

Generate a complete WordPress theme (zip-ready structure) that:
- Can be uploaded via WordPress → Appearance → Themes
- Works immediately (no setup required)
- Includes animations, styles, and layout fully implemented
- Is optimized for conversion, SEO, and performance

---

## 🧠 Step 1 — Context Inputs

1. **Brand name + purpose**: ${data.brandName || '[Not provided]'} — ${data.purpose || '[Not provided]'}
2. **Main Category**: ${categoryName}
3. **Target audience**: ${data.targetAudience || '[Not provided]'}
4. **Primary goal (conversion)**: ${data.primaryCTA || 'Get Started'}
5. **3 Core benefits**:
${data.benefits.filter(Boolean).map(b => `   - ${b}`).join('\n') || '   - [Awaiting benefits]'}
6. **How it Works**: 
   ${data.howItWorks || '[Not provided]'}
7. **Aesthetic preset**: ${data.theme.name}
8. **Additional pages needed**: 
${selectedPagesArray.filter(p => p !== 'landing').map(p => `   - ${p.charAt(0).toUpperCase() + p.slice(1)} Page`).join('\n') || '   - [None]'}
9. **Language of the content**: ${data.language || 'English'}

*(Additional Business Context)*
- Industry: ${data.industry || '[Not provided]'}
- Differentiation: ${data.differentiation || '[Not provided]'}
- Services/Products: ${data.products || '[Not provided]'}
- Pricing: ${data.pricing || '[Not provided]'}
- Tone of Voice: ${data.tone || 'Professional yet accessible'}
- Style Intensity: ${data.styleIntensity}
- SEO Keywords: ${data.seoKeywords || '[None specified]'}
- Local SEO Target: ${data.location || '[None specified]'}
- Auto-Generate Blog Architecture: ${data.enableBlogAuto ? 'YES' : 'NO'}

---

## 🎨 Active Design System (MANDATORY)

You must strictly adhere to the following design system parameters for this build:

**Theme Identity**: ${data.theme.name}
- **Palette Rules**: 
  - Primary Base/Dark: ${data.theme.palette.primary}
  - Secondary Base/Light: ${data.theme.palette.secondary}
  - Highlight Accent: ${data.theme.palette.accent}
- **Typography Rules**: 
  - Headings: "${data.theme.typography.headings}"
  - Accent/Mono details: "${data.theme.typography.accent}"
  - Body Text: "${data.theme.typography.body}"
- **Image/Asset Mood**: ${data.theme.mood}
- **Interaction/Motion Style**: ${data.theme.motion}

---

## 🎨 Global Design Rules (NON-NEGOTIABLE)

**Visual Quality**
- No flat UI, no generic SaaS sections, no basic layouts
- Must include: Depth (shadows, blur, overlays), Large typography contrast, Strong spacing system

**Signature Elements**
- Noise Texture: Global subtle grain overlay (opacity 0.03–0.06)
- Rounded System: 24px–48px radius, No sharp edges
- Magnetic Buttons: Slight scale on hover, Smooth cubic-bezier easing
- Motion: All sections animated, No static blocks

---

## 🧩 Page Architecture (MANDATORY)

1. **Navbar**: Floating, Transparent → blur on scroll, CTA highlighted
${selectedSections.map((s, i) => {
  const customContent = data.sectionContent?.[s.id];
  const contentStr = customContent ? `\n   - **Specific Context**: ${customContent}` : '';
  return `${i + 2}. **${s.name}**: ${s.description}${contentStr}`;
}).join('\n')}
${selectedSections.length + 2}. **Footer**: Brand, Links.

---

## ⚙️ WordPress Technical Requirements

**Theme Structure (REQUIRED)**
theme-name/
├── style.css
├── functions.php
├── header.php
├── footer.php
├── front-page.php
├── index.php
├── page.php
├── single.php
├── assets/
│   ├── css/
│   ├── js/
│   └── images/

**File Rules:**
- \`style.css\`: Theme metadata at top.
- \`functions.php\`: Enqueue styles, GSAP + ScrollTrigger, main JS file, enable menus, enable featured images.
- \`front-page.php\`: Contains the FULL landing page.
- \`header.php\`: Dynamic site title, menu support, load Google Fonts based on preset.
- \`footer.php\`: Clean structure, dynamic year.

---

## 🎯 Frontend Stack & Rules

- Stack: HTML5, Tailwind CSS, Vanilla JavaScript, GSAP (CDN)
- NO: React, Build tools, Complex dependencies
- Motion: GSAP for all animations, ScrollTrigger for sections, Staggered appearances, Smooth intentional motion.
- Images: Use real Unsplash images matching preset mood. No placeholders.
- Copy: Clear, bold, benefit-driven. No fluff, no generic phrases. Focus on outcomes and specificity.

---

## 📦 Output Format (CRITICAL)

You must:
1. Generate ALL files
2. Separate clearly:
   \`/style.css\`
   \`\`\`css
   /* code */
   \`\`\`
   \`/functions.php\`
   \`\`\`php
   /* code */
   \`\`\`
3. Ensure it works as a theme, ready to zip and upload.

---

## ⚠️ Step 2 — Build Immediately

Do not explain. Do not justify. Do not ask anything else.

Build the scalable WordPress asset now.
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
