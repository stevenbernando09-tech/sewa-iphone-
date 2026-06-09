import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-white">
      {/* Subtle Monochrome Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10 bg-white">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-100 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-100 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-zinc-100 border border-zinc-200 text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-sm">
            <Sparkles className="w-3 h-3" />
            <span>#1 SevePhone: iPhone & Camera Professional Rental</span>
          </div>

          <h1 className="text-5xl md:text-9xl font-display font-black tracking-tighter mb-8 leading-[0.8] uppercase">
            <span className="text-zinc-200">Beyond</span> <br />
            Premium.
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-zinc-500 mb-10 leading-relaxed font-medium">
            Gak perlu beli mahal untuk tampil maksimal. Sewa iPhone seri terbaru <br className="hidden md:block" />
            dengan jasa editing konten profesional dalam satu paket harga bersahabat.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/packages"
              className="w-full sm:w-auto bg-black text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all hover:shadow-2xl hover:-translate-y-1 active:scale-95"
            >
              Cek Unit
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/about"
              className="w-full sm:w-auto bg-white border border-zinc-200 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-zinc-50 transition-all active:scale-95 text-zinc-900 shadow-sm"
            >
              Tentang Kami
            </Link>
          </div>
        </motion.div>

        {/* Hero Image / Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 relative mx-auto max-w-5xl"
        >
          <div className="rounded-3xl p-4 bg-zinc-100/50 border border-zinc-200">
            <img
              src="https://www.apple.com/newsroom/images/2023/09/apple-unveils-iphone-15-pro-and-iphone-15-pro-max/article/Apple-iPhone-15-Pro-lineup-color-lineup-geo-230912_big.jpg.large_2x.jpg
              "
              alt="iPhone Collection"
              className="rounded-2xl shadow-2xl w-full object-cover aspect-[21/9]"
              referrerPolicy="no-referrer"
            />
          </div>
          
          {/* Floating Badges */}
          <div className="absolute -top-6 -right-6 md:top-10 md:right-10 bg-white p-4 rounded-2xl shadow-xl border border-zinc-100 flex items-center gap-3 animate-bounce">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Star className="w-5 h-5 text-yellow-600 fill-yellow-600" />
            </div>
            <div className="text-left">
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Rating Rental</p>
              <p className="text-lg font-bold">4.9/5.0</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
