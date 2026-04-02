import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { CheckCircle, Upload, X, Mic, Square, Check, LayoutDashboard } from 'lucide-react';

export default function LandingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    companyName: '',
    whatsapp: '',
    websiteUrl: '',
    photos: [],
    logo: null,
    brandColors: { primary: '#6366f1', secondary: '#ffffff', other1: '#000000', other2: '#d1d5db' },
    additionalInfo: ''
  });

  // Audio recording states
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrlLocal, setAudioUrlLocal] = useState(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

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

  // Audio Functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrlLocal(URL.createObjectURL(blob));
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      alert('Não foi possível acessar o microfone. Verifique as permissões do seu navegador.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  const removeAudio = () => {
    setAudioBlob(null);
    setAudioUrlLocal(null);
  };


  const submitForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let logoUrl = null;
      let photosUrls = [];
      let finalAudioUrl = null;

      // Upload Audio
      if (audioBlob) {
        const fileName = `audio_${Date.now()}.webm`;
        const { data, error } = await supabase.storage.from('leads-media').upload(fileName, audioBlob);
        if (!error && data) {
          const { data: publicUrlData } = supabase.storage.from('leads-media').getPublicUrl(fileName);
          finalAudioUrl = publicUrlData.publicUrl;
        }
      }

      // Upload Logo
      if (formData.logo) {
        const fileExt = formData.logo.name.split('.').pop();
        const fileName = `logo_${Date.now()}.${fileExt}`;
        const { data, error } = await supabase.storage.from('leads-media').upload(fileName, formData.logo);
        if (!error && data) {
          const { data: publicUrlData } = supabase.storage.from('leads-media').getPublicUrl(fileName);
          logoUrl = publicUrlData.publicUrl;
        }
      }

      // Upload Photos
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
        company_name: formData.companyName || 'Projeto sem nome',
        whatsapp: formData.whatsapp,
        website_url: formData.websiteUrl,
        photos_urls: JSON.stringify(photosUrls),
        has_logo: formData.logo ? 'Sim' : 'Não',
        logo_url: logoUrl,
        brand_colors: JSON.stringify(formData.brandColors),
        additional_info: formData.additionalInfo,
        audio_url: finalAudioUrl, // Needs DB update
        has_website: formData.websiteUrl ? 'Sim' : 'Não',
        has_photos: formData.photos.length > 0 ? 'Sim' : 'Não'
      };

      const { error } = await supabase.from('leads').insert([payload]);

      if (error) {
        throw error;
      }
      setIsSuccess(true);
    } catch (err) {
      console.error('Submission error:', err);
      alert('Houve um erro ao enviar. Certifique-se de que a tabela e o bucket do Supabase estejam atualizados.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-4 py-12 md:py-20 selection:bg-indigo-500/30">
      
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="w-full max-w-3xl z-10">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10 mb-4 border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
            <LayoutDashboard className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
             Onboarding do Projeto
          </h1>
          <p className="text-slate-400 text-lg mt-4 max-w-xl mx-auto leading-relaxed">
            Grave um breve áudio contando sobre sua empresa, e anexe sua identidade visual. Cuidaremos do resto.
          </p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onSubmit={submitForm}
                className="space-y-10"
              >
                
                {/* 1. Identification */}
                <section className="space-y-5">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800/80 pb-2">Identificação Básica</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="text-sm font-medium text-slate-300 block mb-2">Nome da Empresa / Projeto</label>
                      <input 
                        type="text" 
                        required
                        value={formData.companyName}
                        onChange={(e) => updateForm('companyName', e.target.value)}
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder-slate-600"
                        placeholder="Nome do seu negócio"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300 block mb-2">Seu WhatsApp</label>
                      <input 
                        type="text" 
                        required
                        value={formData.whatsapp}
                        onChange={(e) => updateForm('whatsapp', handlePhoneMask(e.target.value))}
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder-slate-600"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                  </div>
                </section>

                {/* 2. Audio Briefing */}
                <section className="space-y-5">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800/80 pb-2">Briefing em Áudio</h3>
                  <p className="text-sm text-slate-400">Grave um áudio nos contando o que sua empresa faz, quem é seu público, e o que você espera dessa landing page.</p>
                  
                  <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                     {!audioBlob ? (
                       <div className="space-y-4 w-full">
                          {isRecording ? (
                            <div className="flex flex-col items-center justify-center gap-4">
                               <div className="flex items-center justify-center w-20 h-20 bg-red-500/10 rounded-full animate-pulse border-2 border-red-500/50">
                                 <Mic className="w-8 h-8 text-red-500" />
                               </div>
                               <span className="text-red-400 font-medium">Gravando seu briefing...</span>
                               <button 
                                 type="button"
                                 onClick={stopRecording}
                                 className="mt-4 px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-lg flex items-center gap-2 transition-colors"
                               >
                                 <Square className="w-4 h-4" /> Parar Gravação
                               </button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center gap-4">
                               <button 
                                 type="button"
                                 onClick={startRecording}
                                 className="flex items-center justify-center w-20 h-20 bg-indigo-500 hover:bg-indigo-400 rounded-full text-white shadow-xl hover:scale-105 transition-all"
                               >
                                 <Mic className="w-8 h-8" />
                               </button>
                               <span className="text-slate-300 font-medium">Toque para começar a falar</span>
                            </div>
                          )}
                       </div>
                     ) : (
                       <div className="space-y-4 w-full flex flex-col items-center">
                          <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 font-medium text-sm">
                             <Check className="w-4 h-4" /> Áudio salvo com sucesso!
                          </div>
                          
                          {audioUrlLocal && (
                            <audio src={audioUrlLocal} controls className="w-full max-w-sm outline-none mt-2 rounded bg-slate-900 border border-slate-800" />
                          )}

                          <button 
                             type="button"
                             onClick={removeAudio}
                             className="text-sm text-red-400 hover:text-red-300 font-medium mt-2"
                          >
                             Apagar e gravar novamente
                          </button>
                       </div>
                     )}
                  </div>
                </section>

                {/* 3. Existing Assets */}
                <section className="space-y-5">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800/80 pb-2">Seus Links</h3>
                  <div>
                    <label className="text-sm font-medium text-slate-300 block mb-2">Tem um site ou link atual?</label>
                    <input 
                      type="url" 
                      value={formData.websiteUrl}
                      onChange={(e) => updateForm('websiteUrl', e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder-slate-600"
                      placeholder="https://suaempresa.com.br"
                    />
                  </div>
                </section>

                {/* 4. Visuals & Media */}
                <section className="space-y-5">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800/80 pb-2">Identidade Visual</h3>
                  
                  {/* Colors */}
                  <div className="bg-slate-950/30 p-4 border border-slate-800/50 rounded-xl">
                      <label className="text-sm font-medium text-slate-300 block mb-4">Cores da sua marca</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="flex flex-col gap-2">
                              <span className="text-xs text-slate-400 uppercase font-semibold">Cor Primária</span>
                              <div className="flex items-center gap-2">
                                <input type="color" value={formData.brandColors.primary} onChange={(e) => updateColor('primary', e.target.value)} className="h-10 w-12 p-1 bg-slate-900 border border-slate-700 rounded-lg cursor-pointer shrink-0" />
                                <input type="text" value={formData.brandColors.primary} onChange={(e) => updateColor('primary', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-xs text-white uppercase focus:outline-none" />
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <span className="text-xs text-slate-400 uppercase font-semibold">Secundária</span>
                              <div className="flex items-center gap-2">
                                <input type="color" value={formData.brandColors.secondary} onChange={(e) => updateColor('secondary', e.target.value)} className="h-10 w-12 p-1 bg-slate-900 border border-slate-700 rounded-lg cursor-pointer shrink-0" />
                                <input type="text" value={formData.brandColors.secondary} onChange={(e) => updateColor('secondary', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-xs text-white uppercase focus:outline-none" />
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <span className="text-xs text-slate-400 uppercase font-semibold">Outra Cor 1</span>
                              <div className="flex items-center gap-2">
                                <input type="color" value={formData.brandColors.other1} onChange={(e) => updateColor('other1', e.target.value)} className="h-10 w-12 p-1 bg-slate-900 border border-slate-700 rounded-lg cursor-pointer shrink-0" />
                                <input type="text" value={formData.brandColors.other1} onChange={(e) => updateColor('other1', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-xs text-white uppercase focus:outline-none" />
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <span className="text-xs text-slate-400 uppercase font-semibold">Outra Cor 2</span>
                              <div className="flex items-center gap-2">
                                <input type="color" value={formData.brandColors.other2} onChange={(e) => updateColor('other2', e.target.value)} className="h-10 w-12 p-1 bg-slate-900 border border-slate-700 rounded-lg cursor-pointer shrink-0" />
                                <input type="text" value={formData.brandColors.other2} onChange={(e) => updateColor('other2', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-xs text-white uppercase focus:outline-none" />
                              </div>
                            </div>
                      </div>
                  </div>

                  {/* Logo Upload */}
                  <div>
                    <label className="text-sm font-medium text-slate-300 block mb-2">Envie seu Logotipo (Opcional)</label>
                    <label className="flex items-center justify-center w-full h-24 px-4 transition bg-slate-950/50 border-2 border-slate-800 border-dashed rounded-xl appearance-none cursor-pointer hover:border-indigo-500/50 hover:bg-slate-900 focus:outline-none">
                        <span className="flex flex-col items-center space-y-2 text-slate-400">
                            <Upload className="w-6 h-6" />
                            <span className="font-medium text-sm">Clique para enviar a Logo (PNG, JPG)</span>
                        </span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                    </label>
                    {formData.logo && (
                      <div className="mt-3 p-3 bg-slate-800/80 rounded-lg flex items-center justify-between border border-slate-700">
                        <span className="text-sm text-slate-300 truncate">{formData.logo.name}</span>
                        <button type="button" onClick={() => updateForm('logo', null)} className="text-red-400 hover:text-red-300"><X className="w-4 h-4" /></button>
                      </div>
                    )}
                  </div>

                  {/* Photos Upload */}
                  <div>
                    <label className="text-sm font-medium text-slate-300 block mb-2">Envie fotos da empresa/serviço (Opcional)</label>
                    <label className="flex items-center justify-center w-full h-24 px-4 transition bg-slate-950/50 border-2 border-slate-800 border-dashed rounded-xl appearance-none cursor-pointer hover:border-indigo-500/50 hover:bg-slate-900 focus:outline-none">
                        <span className="flex flex-col items-center space-y-2 text-slate-400">
                            <Upload className="w-6 h-6" />
                            <span className="font-medium text-sm">Clique para escolher várias fotos</span>
                        </span>
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotosUpload} />
                    </label>

                    {formData.photos.length > 0 && (
                      <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                        {formData.photos.map((photo, i) => (
                          <div key={i} className="relative flex-shrink-0 w-24 h-24 bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                            <img src={URL.createObjectURL(photo)} alt="preview" className="w-full h-full object-cover" />
                            <button type="button" onClick={() => removePhoto(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 shadow-lg"><X className="w-3 h-3" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </section>

                {/* 5. Additional Information */}
                <section className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800/80 pb-2">Extras</h3>
                  <label className="text-sm font-medium text-slate-300 block">Esqueceu de falar algo no áudio? (Opcional)</label>
                  <textarea 
                      value={formData.additionalInfo}
                      onChange={(e) => updateForm('additionalInfo', e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white h-24 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder-slate-600"
                      placeholder="Deixe textos complementares, links de pasta do Drive, etc."
                  />
                </section>

                {/* Submit */}
                <div className="pt-6 border-t border-slate-800/60">
                   <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-6 py-4 bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-400 hover:shadow-[0_0_20px_-5px_var(--tw-shadow-color)] shadow-indigo-500 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Fazendo upload e finalizando...' : 'Enviar Tudo para Geração'}
                    </button>
                </div>
                
              </motion.form>
            ) : (
              /* SUCCESS STATE */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 py-10"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 mb-2 border border-emerald-500/20">
                  <CheckCircle className="w-10 h-10 text-emerald-400" />
                </div>
                <h2 className="text-3xl font-bold text-white">Pronto, recebemos!</h2>
                <p className="text-slate-400 text-lg max-w-sm mx-auto">
                  Breve enviaremos o link final exclusivo da sua identidade na web.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
    </div>
  );
}
