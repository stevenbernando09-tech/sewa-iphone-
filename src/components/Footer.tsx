import React from 'react';
import { Globe, Share2, MessageCircle, Smartphone, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-zinc-400 py-32 leading-relaxed">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-20 pb-20 border-b border-zinc-900">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-10 group">
              <div className="bg-white p-2 rounded-xl group-hover:rotate-6 transition-transform">
                <Smartphone className="w-6 h-6 text-black" />
              </div>
              <span className="text-2xl font-display font-black text-white tracking-tighter">
                SEVE<span className="text-zinc-600 font-light italic">PHONE</span>
              </span>
            </Link>
            <p className="text-sm font-medium mb-10 pr-4">
              Premium rental & professional editing. <br />
              <span className="text-white mt-2 block italic text-xs">#ElegantServiceAffordablePrice</span>
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                <Share2 className="w-5 h-5" />
              </a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-8">Eksplorasi</h4>
            <ul className="flex flex-col gap-5 text-xs font-bold uppercase tracking-widest">
              <li><Link to="/" className="hover:text-white transition-colors">Beranda</Link></li>
              <li><Link to="/packages" className="hover:text-white transition-colors">Unit Katalog</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Tentang Kami</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-8">Layanan</h4>
            <ul className="flex flex-col gap-5 text-xs font-bold uppercase tracking-widest">
              <li><a href="#" className="hover:text-white transition-colors">Sewa Harian</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sewa Konten</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Partner Bisnis</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-8">Update Eksklusif</h4>
            <p className="text-xs mb-6 font-medium">Info unit terbaru & tips konten mingguan.</p>
            <div className="relative">
              <input
                type="email"
                placeholder="Email aktif kamu"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-5 text-xs focus:border-zinc-500 outline-none transition-colors"
              />
              <button className="absolute right-2 top-2 bg-white p-2 rounded-xl hover:scale-105 transition-transform">
                <Send className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em]">
          <p>© 2024 SEVEPHONE INDONESIA. SELURUH HAK CIPTA DILINDUNGI.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">TERMS OF SERVICE</a>
            <a href="#" className="hover:text-white transition-colors">PRIVACY POLICY</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
