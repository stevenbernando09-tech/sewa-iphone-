import React from 'react';
import { Banknote, Info, Headphones } from 'lucide-react';
import { FEATURES } from '../constants';
import * as Icons from 'lucide-react';
import { motion } from 'motion/react';

const Features = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-black mb-4 uppercase tracking-tighter">Kenapa SevePhone?</h2>
          <p className="text-zinc-600 max-w-xl mx-auto font-medium">Bukan sekadar sewa gadget, kami memberikan pengalaman premium dengan kemudahan yang tak tertandingi.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES.map((feature, index) => {
            const IconComponent = (Icons as any)[feature.icon];
            
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 rounded-3xl border border-zinc-100 bg-white hover:bg-zinc-950 hover:text-white transition-all duration-500"
              >
                <div className="w-14 h-14 bg-zinc-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:bg-zinc-800 transition-all duration-300">
                  <IconComponent className="w-7 h-7 text-black group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-zinc-500 group-hover:text-zinc-400 leading-relaxed font-medium">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
