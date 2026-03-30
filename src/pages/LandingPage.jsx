import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { ChevronRight, ChevronLeft, CheckCircle, ArrowRight } from 'lucide-react';

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
    whatsapp: '',
    contactMethod: '',
    hasLogo: '',
    brandColors: '',
    deliveryTimeline: '',
    additionalInfo: ''
  });

  const updateForm = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

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
      const { error } = await supabase.from('leads').insert([{
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
        whatsapp: formData.whatsapp,
        contact_method: formData.contactMethod,
        has_logo: formData.hasLogo,
        brand_colors: formData.brandColors,
        delivery_timeline: formData.deliveryTimeline,
        additional_info: formData.additionalInfo
      }]);

      if (error) throw error;
      setIsSuccess(true);
    } catch (err) {
      console.error('Submission error:', err);
      alert('Houve um erro ao enviar. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-indigo-500/30">
      
      {/* Background ambient light */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="w-full max-w-2xl z-10">
        
        {/* Progress header (hidden on intro and success) */}
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

        {/* Form Container */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key={currentStep}
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
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

                      <div className="space-y-3">
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
                        <p className="text-xs text-slate-500 pt-1">Se quiser, você pode pedir envio depois no WhatsApp</p>
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
                          onChange={(e) => updateForm('whatsapp', e.target.value)}
                          placeholder="(00) 00000-0000"
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-300">Quer que o cliente entre em contato como?</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {['WhatsApp', 'Formulário', 'Ambos'].map(opt => (
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
                      <div className="space-y-3">
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
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-300">Tem alguma cor que você gosta ou usa na marca?</label>
                        <div className="flex gap-3">
                          <input 
                            type="color" 
                            value={formData.brandColors.startsWith('#') ? formData.brandColors : '#6366f1'}
                            onChange={(e) => updateForm('brandColors', e.target.value)}
                            className="h-12 w-16 p-1 bg-slate-950/50 border border-slate-800 rounded-xl cursor-pointer"
                          />
                          <input 
                            type="text" 
                            value={formData.brandColors}
                            onChange={(e) => updateForm('brandColors', e.target.value)}
                            placeholder="Ex: Azul, vermelho, ou hex #000"
                            className="flex-1 bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                          />
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
                        <label className="text-sm font-medium text-slate-300">Quando você gostaria que sua página estivesse pronta?</label>
                        <div className="flex flex-col gap-3">
                          {['O mais rápido possível', 'Essa semana', 'Sem pressa'].map(opt => (
                            <button
                              key={opt}
                              onClick={() => updateForm('deliveryTimeline', opt)}
                              className={`py-4 px-4 rounded-xl border text-sm font-medium text-left transition-all ${formData.deliveryTimeline === opt ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-300">Quer adicionar mais alguma informação importante?</label>
                        <textarea 
                          value={formData.additionalInfo}
                          onChange={(e) => updateForm('additionalInfo', e.target.value)}
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white h-24 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
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
                      {isSubmitting ? 'Enviando...' : (currentStep === steps.length - 1 ? 'Finalizar e Enviar' : 'Continuar')}
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
