import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, History, Target, Users } from 'lucide-react';

const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-32 pb-24 bg-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-20 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-zinc-600 font-black uppercase tracking-[0.2em] text-sm mb-4 block">Tentang SevePhone</span>
            <h1 className="text-4xl md:text-8xl font-display font-black mb-8 leading-[0.9] uppercase tracking-tighter">
              Gak Perlu <span className="text-zinc-300">Beli</span> Mahal.
            </h1>
            <div className="space-y-6 text-zinc-500 text-lg font-medium leading-relaxed">
              <p>
                SevePhone lahir dari keinginan sederhana: memberikan kesempatan bagi semua orang untuk merasakan pengalaman menggunakan gadget dan kamera terbaik dunia tanpa harus mengeluarkan modal besar.
              </p>
              <p>
                Berdiri sejak 2021 di Bangka, kami telah melayani ribuan pelanggan, mulai dari konten kreator profesional, fotografer, hingga tech-enthusiast yang ingin mencoba seri iPhone atau Mirrorless terbaru sebelum memutuskan untuk membeli.
              </p>
            </div>
          </motion.div>

          <div className="relative">
            <div className="absolute inset-0 bg-zinc-100 rounded-[3rem] rotate-3 -z-10" />
            <img
              src="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2674&auto=format&fit=crop"
              alt="Team Workshop"
              className="rounded-[3rem] shadow-2xl border border-white filter grayscale hover:grayscale-0 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Stats / Numbers */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {[
            { label: 'Pelanggan Puas', value: '5,000+', icon: Users },
            { label: 'Unit Tersedia', value: '150+', icon: Target },
            { label: 'Tahun Pengalaman', value: '4+', icon: History },
          ].map((stat, i) => (
            <div key={i} className="bg-zinc-50 p-10 rounded-[2.5rem] border border-zinc-100 text-center flex flex-col items-center group hover:bg-black transition-colors duration-500">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 group-hover:bg-zinc-800 transition-colors">
                <stat.icon className="w-6 h-6 text-black group-hover:text-white" />
              </div>
              <p className="text-4xl font-display font-black mb-2 group-hover:text-white transition-colors">{stat.value}</p>
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs group-hover:text-zinc-400 transition-colors">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="bg-zinc-950 rounded-[3rem] p-12 md:p-20 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-900 blur-[100px]" />
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-display font-black mb-10 tracking-widest uppercase italic">Nilai Inti Kami</h2>
              <div className="space-y-6">
                {[
                  'Integritas: Semua unit dalam kondisi 100% original.',
                  'Transparansi: Gak ada biaya tersembunyi atau denda gaib.',
                  'Profesional: Hasil editan konten kelas dunia.',
                  'Inovasi: Unit terbaru selalu hadir paling cepat.'
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-white shrink-0" />
                    <p className="text-zinc-400 font-medium">{text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-zinc-900 p-10 rounded-[2.5rem] border border-zinc-800">
               <p className="text-2xl italic font-display text-zinc-300 leading-relaxed font-light">
                 "Kami tidak hanya menyewakan iPhone dan Kamera. Kami menyewakan momen berharga, kreativitas tanpa batas, dan karya visual yang bisa diraih semua orang."
               </p>
               <div className="mt-10 flex items-center gap-4 border-t border-zinc-800 pt-8">
                 <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center font-black text-black">S</div>
                 <div>
                   <p className="font-bold text-white">Robby Syamsudin</p>
                   <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Founder SevePhone</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default About;
