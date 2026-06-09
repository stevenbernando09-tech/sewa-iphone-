import React from 'react';
import { motion } from 'motion/react';
import { EDITING_SERVICES } from '../constants';
import { Video, Film, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import * as Icons from 'lucide-react';

const EditingSection = () => {
  return (
    <section className="py-24 bg-zinc-950 text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-black mb-4">Layanan Editing Lokal</h2>
          <p className="text-zinc-400 max-w-xl mx-auto font-medium">Bukan cuma alat, kami bantu kreasikan konten Anda dengan hasil kelas dunia.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {EDITING_SERVICES.map((service, index) => {
            const IconComponent = (Icons as any)[service.icon];
            
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] hover:border-zinc-700 transition-all group"
              >
                <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white transition-colors">
                  <IconComponent className="w-8 h-8 text-white group-hover:text-black" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-zinc-400 mb-8 font-medium leading-relaxed">
                  {service.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-1">Mulai Dari</p>
                    <p className="text-2xl font-display font-black">Rp {service.price}</p>
                  </div>
                  <button className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-colors">
                    Pesan
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <div className="mt-20 flex flex-wrap justify-center gap-8 opacity-50">
           <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]">
             <CheckCircle2 className="w-4 h-4" /> Revisi Sampai Puas
           </div>
           <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]">
             <CheckCircle2 className="w-4 h-4" /> Hasil High Definition
           </div>
           <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]">
             <CheckCircle2 className="w-4 h-4" /> Pengerjaan Cepat
           </div>
        </div>
      </div>
    </section>
  );
};

export default EditingSection;
