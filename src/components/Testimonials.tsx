import React from 'react';
import { TESTIMONIALS } from '../constants';
import { Quote } from 'lucide-react';
import { motion } from 'motion/react';

const Testimonials = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-black mb-4 uppercase tracking-tighter">Kepuasan Pelanggan</h2>
          <p className="text-zinc-500 max-w-xl mx-auto font-medium">Bukan cuma kata-kata, tapi bukti nyata dari ribuan klien kami.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-50 p-8 rounded-[2rem] relative border border-zinc-100 hover:bg-white hover:border-black hover:shadow-2xl transition-all group"
            >
              <div className="absolute top-8 right-8">
                <Quote className="w-10 h-10 text-zinc-900/5 group-hover:text-zinc-900/10" />
              </div>

              <div className="flex items-center gap-4 mb-6">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full border-2 border-white shadow-sm filter grayscale group-hover:grayscale-0 transition-all"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-bold text-zinc-950">{testimonial.name}</h4>
                  <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">{testimonial.role}</p>
                </div>
              </div>

              <p className="text-zinc-600 italic leading-relaxed font-medium">
                "{testimonial.content}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
