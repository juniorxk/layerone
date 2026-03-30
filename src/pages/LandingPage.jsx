import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { ChevronRight, ChevronLeft, CheckCircle, ArrowRight, Layout, Upload, X } from 'lucide-react';

const steps = [
  { id: 'intro', title: 'Intro' },
  { id: 'business', title: 'Sobre seu negócio' },
  { id: 'product', title: 'Sobre o que você vende' },
  { id: 'customer', title: 'Sobre seu cliente' },
  { id: 'differentiators', title: 'Diferenciais' },
  { id: 'proof', title: 'Prova (opcional)' },
  { id: 'contact', title: 'Contato' },
  { id: 'visuals', title: 'Visual' },
  { id: 'final', title: 'Final' }
];

export default function LandingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    companyName: '',
    companyDescription: '',
    location: '',
    hasWebsite: '',
    websiteUrl: '',
    coreProduct: '',
    averagePrice: '',
    specialOffer: '',
    targetAudience: '',
    customerProblem: '',
    differentiator: '',
    keyStrengths: '',
    testimonials: '',
    hasPhotos: '',
    photos: [],
    whatsapp: '',
    telephone: '',
    email: '',
    contactMethod: '',
    hasLogo: '',
    logo: null,
    brandColors: { primary: '#6366f1', secondary: '#ffffff', other1: '#000000', other2: '#d1d5db' },
    additionalInfo: ''
  });

  const updateForm = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const updateColor = (colorKey, value) => {
    setFormData(prev => ({
      ...prev,
      brandColors: { ...prev.brandColors, [colorKey]: value }
    }));
  };

  const handlePhoneMask = (value) => {
    let raw = value.replace(/\D/g, '');
    raw = raw.substring(0, 11);
    
    if (raw.length === 0) return '';
    if (raw.length <= 2) return `(${raw}`;
    if (raw.length <= 6) return `(${raw.substring(0, 2)}) ${raw.substring(2)}`;
    if (raw.length <= 10) return `(${raw.substring(0, 2)}) ${raw.substring(2, 6)}-${raw.substring(6)}`;
    return `(${raw.substring(0, 2)}) ${raw.substring(2, 7)}-${raw.substring(7)}`;
  };

  const handleLogoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      updateForm('logo', e.target.files[0]);
    }
  };

  const handlePhotosUpload = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData(prev => ({ ...prev, photos: [...prev.photos, ...newFiles] }));
    }
  };

  const removePhoto = (index) => {
    setFormData(prev => {
      const newPhotos = [...prev.photos];
      newPhotos.splice(index, 1);
      return { ...prev, photos: newPhotos };
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      submitForm();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    try {
      let logoUrl = null;
      let photosUrls = [];

      if (formData.logo) {
        const fileExt = formData.logo.name.split('.').pop();
        const fileName = `logo_${Date.now()}.${fileExt}`;
        const { data, error } = await supabase.storage.from('leads-media').upload(fileName, formData.logo);
        if (!error && data) {
          const { data: publicUrlData } = supabase.storage.from('leads-media').getPublicUrl(fileName);
          logoUrl = publicUrlData.publicUrl;
        }
      }

      if (formData.photos.length > 0) {
        for (const file of formData.photos) {
          const fileExt = file.name.split('.').pop();
          const fileName = `photo_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
          const { data, error } = await supabase.storage.from('leads-media').upload(fileName, file);
          if (!error && data) {
            const { data: publicUrlData } = supabase.storage.from('leads-media').getPublicUrl(fileName);
            photosUrls.push(publicUrlData.publicUrl);
          }
        }
      }

      const payload = {
        company_name: formData.companyName,
        company_description: formData.companyDescription,
        location: formData.location,
        has_website: formData.hasWebsite,
        website_url: formData.websiteUrl,
        core_product: formData.coreProduct,
        average_price: formData.averagePrice,
        special_offer: formData.specialOffer,
        target_audience: formData.targetAudience,
        customer_problem: formData.customerProblem,
        differentiator: formData.differentiator,
        key_strengths: formData.keyStrengths,
        testimonials: formData.testimonials,
        has_photos: formData.hasPhotos,
        photos_urls: JSON.stringify(photosUrls),
        whatsapp: formData.whatsapp,
        telephone: formData.telephone,
        email: formData.email,
        contact_method: formData.contactMethod,
        has_logo: formData.hasLogo,
        logo_url: logoUrl,
        brand_colors: JSON.stringify(formData.brandColors),
        additional_info: formData.additionalInfo
      };

      const { error } = await supabase.from('leads').insert([payload]);

      if (error) {
        throw error;
      }
      setIsSuccess(true);
    } catch (err) {
      console.error('Submission error:', err);
      alert('Houve um erro ao enviar. Certifique-se de que o bucket "leads-media" esteja configurado no Supabase como Public, ou tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-indigo-500/30">
      
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="w-full max-w-2xl z-10">
        
        {currentStep > 0 && !isSuccess && (
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-3 tracking-widest uppercase">
              <span>Etapa {currentStep} de {steps.length - 1}</span>
              <span>{Math.round((currentStep / (steps.length - 1)) * 100)}%</span>
            </div>
            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key={currentStep}
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={{ duration: 0.4 }}
              >
                {/* STEP 0: Intro */}
                {currentStep === 0 && (
                  <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10 mb-2">
                      <Layout className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
                      Crie sua<br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                        Landing Page de Alta Conversão
                      </span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
                      Leva menos de 3 minutos. Com essas respostas, vamos criar sua landing page completa e pronta para vender.
                    </p>
                    <div className="pt-6">
                      <button 
                        onClick={nextStep}
                        className="w-full md:w-auto px-8 py-4 bg-white text-slate-900 font-semibold rounded-2xl hover:scale-[1.02] hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)] transition-all flex items-center justify-center gap-2 mx-auto"
                      >
                        Começar agora
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 1: Business */}
                {currentStep === 1 && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-semibold text-white">Sobre seu negócio</h2>
                    
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-300">Qual o nome da sua empresa?</label>
                        <input 
                          type="text" 
                          value={formData.companyName}
                          onChange={(e) => updateForm('companyName', e.target.value)}
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                          placeholder="Ex: Acme Corp"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-300">O que sua empresa faz? (explique de forma simples)</label>
                        <textarea 
                          value={formData.companyDescription}
                          onChange={(e) => updateForm('companyDescription', e.target.value)}
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white h-24 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                          placeholder="Ex: Vendemos roupas femininas, Fazemos reformas de casa..."
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-300">Em qual cidade ou região você atende?</label>
                        <input 
                          type="text" 
                          value={formData.location}
                          onChange={(e) => updateForm('location', e.target.value)}
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-300">Você já tem um site?</label>
                        <div className="flex gap-4">
                          {['Não', 'Sim'].map(opt => (
                            <button
                              key={opt}
                              onClick={() => updateForm('hasWebsite', opt)}
                              className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${formData.hasWebsite === opt ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      {formData.hasWebsite === 'Sim' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3">
                          <label className="text-sm font-medium text-slate-300">Se tiver, qual o link?</label>
                          <input 
                            type="url" 
                            value={formData.websiteUrl}
                            onChange={(e) => updateForm('websiteUrl', e.target.value)}
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                          />
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 2: Product */}
                {currentStep === 2 && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-semibold text-white">Sobre o que você vende</h2>
                    
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-300">Qual é o principal produto ou serviço que você quer vender?</label>
                        <input 
                          type="text" 
                          value={formData.coreProduct}
                          onChange={(e) => updateForm('coreProduct', e.target.value)}
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-300">Quanto custa, em média, o que você vende?</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {['Até R$50', 'R$50 a R$200', 'R$200 a R$1.000', 'Acima de R$1.000'].map(opt => (
                            <button
                              key={opt}
                              onClick={() => updateForm('averagePrice', opt)}
                              className={`py-3 px-4 rounded-xl border text-sm font-medium text-left transition-all ${formData.averagePrice === opt ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-300">Você tem alguma promoção ou condição especial hoje?</label>
                        <input 
                          type="text" 
                          value={formData.specialOffer}
                          onChange={(e) => updateForm('specialOffer', e.target.value)}
                          placeholder="Ex: desconto, frete grátis, parcelamento..."
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Customer */}
                {currentStep === 3 && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-semibold text-white">Sobre seu cliente</h2>
                    
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-300">Quem costuma comprar de você?</label>
                        <input 
                          type="text" 
                          value={formData.targetAudience}
                          onChange={(e) => updateForm('targetAudience', e.target.value)}
                          placeholder="Ex: Pessoas construindo casa, Donos de carro..."
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-300">Qual o principal problema dessas pessoas?</label>
                        <textarea 
                          value={formData.customerProblem}
                          onChange={(e) => updateForm('customerProblem', e.target.value)}
                          placeholder="Ex: Não encontram preço bom, demora na entrega..."
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white h-24 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-300">Por que o cliente escolhe você e não outro?</label>
                        <textarea 
                          value={formData.differentiator}
                          onChange={(e) => updateForm('differentiator', e.target.value)}
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white h-24 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: Differentiators */}
                {currentStep === 4 && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-semibold text-white">Diferenciais</h2>
                    
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-300">Cite até 3 pontos fortes do seu negócio:</label>
                        <textarea 
                          value={formData.keyStrengths}
                          onChange={(e) => updateForm('keyStrengths', e.target.value)}
                          placeholder="Ex: 1. Preço justo&#10;2. Rapidez na entrega&#10;3. Atendimento humanizado"
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white h-32 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5: Proof */}
                {currentStep === 5 && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-semibold text-white">Prova Social</h2>
                      <span className="text-xs px-2 py-1 bg-slate-800 text-slate-400 rounded-md font-medium">Opcional</span>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-300">Você tem depoimentos de clientes? (Cole aqui)</label>
                        <textarea 
                          value={formData.testimonials}
                          onChange={(e) => updateForm('testimonials', e.target.value)}
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white h-32 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                        />
                      </div>

                      <div className="space-y-4">
                        <label className="text-sm font-medium text-slate-300">Você tem fotos do seu negócio ou produtos?</label>
                        <div className="flex gap-4">
                          {['Sim', 'Não'].map(opt => (
                            <button
                              key={opt}
                              onClick={() => updateForm('hasPhotos', opt)}
                              className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${formData.hasPhotos === opt ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>

                        {formData.hasPhotos === 'Sim' && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4">
                            <label className="flex items-center justify-center w-full h-32 px-4 transition bg-slate-950/50 border-2 border-slate-800 border-dashed rounded-xl appearance-none cursor-pointer hover:border-indigo-500/50 hover:bg-slate-900 focus:outline-none">
                                <span className="flex flex-col items-center space-y-2 text-slate-400">
                                    <Upload className="w-6 h-6" />
                                    <span className="font-medium text-sm">Clique para escolher as fotos</span>
                                </span>
                                <input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotosUpload} />
                            </label>

                            {formData.photos.length > 0 && (
                              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                                {formData.photos.map((photo, i) => (
                                  <div key={i} className="relative flex-shrink-0 w-24 h-24 bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                                    <img src={URL.createObjectURL(photo)} alt="preview" className="w-full h-full object-cover" />
                                    <button onClick={() => removePhoto(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 shadow-lg"><X className="w-3 h-3" /></button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 6: Contact */}
                {currentStep === 6 && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-semibold text-white">Contato</h2>
                      <span className="text-xs px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Importante
                      </span>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-300">Qual é o seu WhatsApp?</label>
                        <input 
                          type="tel" 
                          value={formData.whatsapp}
                          onChange={(e) => updateForm('whatsapp', handlePhoneMask(e.target.value))}
                          placeholder="(11) 99999-9999"
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder-slate-600"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-300">Tem um telefone fixo ou alternativo? (Opcional)</label>
                        <input 
                          type="tel" 
                          value={formData.telephone}
                          onChange={(e) => updateForm('telephone', handlePhoneMask(e.target.value))}
                          placeholder="(11) 4002-8922"
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder-slate-600"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-300">Qual o seu e-mail comercial? (Opcional)</label>
                        <input 
                          type="email" 
                          value={formData.email}
                          onChange={(e) => updateForm('email', e.target.value)}
                          placeholder="contato@suaempresa.com.br"
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder-slate-600"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-300">Quer que o cliente entre em contato como?</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {['WhatsApp', 'Telefone', 'E-mail', 'Todos'].map(opt => (
                            <button
                              key={opt}
                              onClick={() => updateForm('contactMethod', opt)}
                              className={`py-3 px-2 rounded-xl border text-sm font-medium transition-all ${formData.contactMethod === opt ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 7: Visuals */}
                {currentStep === 7 && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-semibold text-white">Visual da Marca</h2>
                    
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <label className="text-sm font-medium text-slate-300">Você tem logo da empresa?</label>
                        <div className="flex gap-4">
                          {['Sim', 'Não'].map(opt => (
                            <button
                              key={opt}
                              onClick={() => updateForm('hasLogo', opt)}
                              className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${formData.hasLogo === opt ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>

                        {formData.hasLogo === 'Sim' && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4">
                             <label className="flex items-center justify-center w-full h-32 px-4 transition bg-slate-950/50 border-2 border-slate-800 border-dashed rounded-xl appearance-none cursor-pointer hover:border-indigo-500/50 hover:bg-slate-900 focus:outline-none">
                                <span className="flex flex-col items-center space-y-2 text-slate-400">
                                    <Upload className="w-6 h-6" />
                                    <span className="font-medium text-sm">Selecione seu Logotipo (PNG, JPG)</span>
                                </span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                            </label>
                            {formData.logo && (
                              <div className="mt-3 p-3 bg-slate-800/80 rounded-lg flex items-center justify-between border border-slate-700">
                                <span className="text-sm text-slate-300 truncate">{formData.logo.name}</span>
                                <button onClick={() => updateForm('logo', null)} className="text-red-400 hover:text-red-300"><X className="w-4 h-4" /></button>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </div>

                      <div className="space-y-4 pt-4 border-t border-slate-800">
                        <label className="text-sm font-medium text-slate-300">Selecione as cores da sua marca</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                           <div className="flex flex-col gap-2">
                             <span className="text-xs text-slate-400 uppercase font-semibold">Cor Primária</span>
                             <div className="flex items-center gap-2">
                               <input type="color" value={formData.brandColors.primary} onChange={(e) => updateColor('primary', e.target.value)} className="h-10 w-12 p-1 bg-slate-950 border border-slate-700 rounded-lg cursor-pointer shrink-0" />
                               <input type="text" value={formData.brandColors.primary} onChange={(e) => updateColor('primary', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-xs text-white uppercase" />
                             </div>
                           </div>
                           <div className="flex flex-col gap-2">
                             <span className="text-xs text-slate-400 uppercase font-semibold">Secundária</span>
                             <div className="flex items-center gap-2">
                               <input type="color" value={formData.brandColors.secondary} onChange={(e) => updateColor('secondary', e.target.value)} className="h-10 w-12 p-1 bg-slate-950 border border-slate-700 rounded-lg cursor-pointer shrink-0" />
                               <input type="text" value={formData.brandColors.secondary} onChange={(e) => updateColor('secondary', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-xs text-white uppercase" />
                             </div>
                           </div>
                           <div className="flex flex-col gap-2">
                             <span className="text-xs text-slate-400 uppercase font-semibold">Outra Cor 1</span>
                             <div className="flex items-center gap-2">
                               <input type="color" value={formData.brandColors.other1} onChange={(e) => updateColor('other1', e.target.value)} className="h-10 w-12 p-1 bg-slate-950 border border-slate-700 rounded-lg cursor-pointer shrink-0" />
                               <input type="text" value={formData.brandColors.other1} onChange={(e) => updateColor('other1', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-xs text-white uppercase" />
                             </div>
                           </div>
                           <div className="flex flex-col gap-2">
                             <span className="text-xs text-slate-400 uppercase font-semibold">Outra Cor 2</span>
                             <div className="flex items-center gap-2">
                               <input type="color" value={formData.brandColors.other2} onChange={(e) => updateColor('other2', e.target.value)} className="h-10 w-12 p-1 bg-slate-950 border border-slate-700 rounded-lg cursor-pointer shrink-0" />
                               <input type="text" value={formData.brandColors.other2} onChange={(e) => updateColor('other2', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-xs text-white uppercase" />
                             </div>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 8: Final */}
                {currentStep === 8 && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-semibold text-white">Finalizando</h2>
                    
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-300">Quer adicionar mais alguma informação importante?</label>
                        <textarea 
                          value={formData.additionalInfo}
                          onChange={(e) => updateForm('additionalInfo', e.target.value)}
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white h-32 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                          placeholder="Fale mais qualquer detalhe que julgar necessário para construirmos a sua Landing Page."
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Navigation Buttons */}
                {currentStep > 0 && (
                  <div className="mt-10 flex gap-4 pt-6 md:pt-8 border-t border-slate-800/60">
                    <button 
                      onClick={prevStep}
                      className="px-6 py-3.5 rounded-xl border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Voltar
                    </button>
                    
                    <button 
                      onClick={nextStep}
                      disabled={isSubmitting}
                      className="flex-1 px-6 py-3.5 bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-400 hover:shadow-[0_0_20px_-5px_var(--tw-shadow-color)] shadow-indigo-500 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Enviando e Salvando Imagens...' : (currentStep === steps.length - 1 ? 'Finalizar e Enviar' : 'Continuar')}
                      {!isSubmitting && currentStep < steps.length - 1 && <ChevronRight className="w-5 h-5" />}
                    </button>
                  </div>
                )}

              </motion.div>
            ) : (
              /* SUCCESS STATE */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 py-10"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 mb-2">
                  <CheckCircle className="w-10 h-10 text-emerald-400" />
                </div>
                <h2 className="text-3xl font-bold text-white">Tudo Certo!</h2>
                <p className="text-slate-400 text-lg max-w-sm mx-auto">
                  Recebemos suas informações com sucesso. Em breve, sua Landing Page estará pronta para voar.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
    </div>
  );
}
