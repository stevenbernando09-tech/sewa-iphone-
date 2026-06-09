import React from 'react';
import { motion } from 'motion/react';
import { IPHONE_MODELS, CAMERA_MODELS } from '../constants';
import { Smartphone, Cpu, Camera, Monitor, ArrowUpRight, Aperture, Zap, Video } from 'lucide-react';
import { Link } from 'react-router-dom';

const PackageSection = () => {
  // Take top 2 iPhones and top 1 Camera for home page feature
  const featuredUnits = [
    { ...IPHONE_MODELS[0], type: 'phone' },
    { ...CAMERA_MODELS[0], type: 'camera' },
    { ...IPHONE_MODELS[1], type: 'phone' }
  ];

  return (
    <section className="py-24 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <h2 className="text-3xl md:text-5xl font-display font-black mb-4 uppercase tracking-tighter">Unit Pilihan</h2>
            <p className="text-zinc-500 max-w-xl font-medium">Teknologi mutakhir iPhone & Kamera untuk hasil konten yang profesional.</p>
          </div>
          <Link
            to="/packages"
            className="inline-flex items-center gap-2 text-black font-black uppercase tracking-widest text-xs border-b-2 border-zinc-200 hover:border-black transition-all"
          >
            Lihat Katalog <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {featuredUnits.map((device: any, index) => (
            <motion.div
              key={device.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-50 rounded-[2rem] border border-zinc-200 overflow-hidden group hover:bg-white hover:shadow-2xl transition-all duration-500"
            >
              {/* Product Info */}
              <div className="p-8 pb-0">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                      {device.type === 'phone' ? device.series : device.brand}
                    </span>
                    <h3 className="text-2xl font-bold tracking-tight uppercase">{device.name}</h3>
                  </div>
                  {device.isNew && (
                    <span className="bg-black text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {device.type === 'phone' ? 'NEW' : 'HOT'}
                    </span>
                  )}
                </div>
                
                <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-3">Mulai Dari</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-display font-black">
                      Rp {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(device.pricePerDay)}
                    </span>
                    <span className="text-zinc-400 font-bold font-display text-sm">/hari</span>
                </div>
              </div>

              {/* Specs Icons */}
              <div className="flex justify-around p-6 mt-4 border-y border-zinc-200 bg-white group-hover:bg-zinc-50 transition-colors">
                {device.type === 'phone' ? (
                  <>
                    <div className="flex flex-col items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                        <Cpu className="w-5 h-5 text-black" />
                        <span className="text-[10px] font-black uppercase tracking-tighter">{device.specs.chip.split(' ')[0]}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-5 h-5 text-black" />
                        <span className="text-[10px] font-black uppercase tracking-tighter">{device.specs.camera.split(' ')[0]}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                        <Monitor className="w-5 h-5 text-black" />
                        <span className="text-[10px] font-black uppercase tracking-tighter">{device.specs.display.split('"')[0]}"</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                        <Aperture className="w-5 h-5 text-black" />
                        <span className="text-[10px] font-black uppercase tracking-tighter">{device.specs.sensor.split(' ')[0]}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                        <Video className="w-5 h-5 text-black" />
                        <span className="text-[10px] font-black uppercase tracking-tighter">{device.specs.video.split(' ')[0]}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                        <Zap className="w-5 h-5 text-black" />
                        <span className="text-[10px] font-black uppercase tracking-tighter">ISO</span>
                    </div>
                  </>
                )}
              </div>

              <div className="p-8">
                <img
                  src={device.image}
                  alt={device.name}
                  className="w-full h-48 object-contain rounded-2xl group-hover:scale-110 transition-transform duration-700 filter grayscale group-hover:grayscale-0"
                  referrerPolicy="no-referrer"
                />
                <Link 
                  to="/packages"
                  className="w-full mt-6 block text-center bg-zinc-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-colors shadow-lg"
                >
                  Detail Paket
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PackageSection;
