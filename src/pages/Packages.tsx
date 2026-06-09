import React, { useState } from 'react';
import { IPHONE_MODELS, CAMERA_MODELS } from '../constants';
import { Cpu, Camera, Monitor, Smartphone, CheckCircle2, ChevronRight, Aperture, Video, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { BookingModal } from '../components/BookingModal';
import { iPhoneModel, CameraModel } from '../types';

const Packages = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemForModal, setSelectedItemForModal] = useState<{ type: 'phone' | 'camera'; item: iPhoneModel | CameraModel } | null>(null);

  const handleSewaClick = (type: 'phone' | 'camera', item: iPhoneModel | CameraModel) => {
    setSelectedItemForModal({ type, item });
    setIsModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-32 pb-24 bg-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 text-center md:text-left">
          <h1 className="text-4xl md:text-8xl font-display font-black mb-4 uppercase tracking-tighter">Katalog Unit</h1>
          <p className="text-zinc-500 max-w-xl font-medium">Semua unit kami garansi resmi, kondisi prima, dan siap mendukung kreativitas Anda.</p>
        </div>

        {/* iPhone Section */}
        <div className="mb-24">
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-2xl font-display font-black uppercase tracking-widest text-zinc-950">iPhone Series</h2>
            <div className="h-px bg-zinc-200 flex-1"></div>
          </div>
          <div className="grid gap-12">
            {IPHONE_MODELS.map((device, index) => (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-zinc-50 rounded-[2.5rem] border border-zinc-200 overflow-hidden flex flex-col md:flex-row hover:bg-white hover:shadow-2xl transition-all duration-500 group"
              >
                {/* Image Side */}
                <div className="md:w-2/5 p-8 flex items-center justify-center relative overflow-hidden">
                  <img
                    src={device.image}
                    alt={device.name}
                    className="w-full h-72 object-contain relative z-10 group-hover:scale-110 transition-transform duration-700 filter grayscale group-hover:grayscale-0"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Content Side */}
                <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-black text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{device.series}</span>
                      {device.isNew && <span className="text-zinc-900 text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> New Release</span>}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-display font-black mb-6 tracking-tighter uppercase">{device.name}</h2>
                    
                    {/* Specs Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 p-6 bg-white rounded-2xl border border-zinc-100">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-zinc-400">
                          <Cpu className="w-4 h-4" />
                          <span className="text-[8px] font-black uppercase tracking-widest">Processor</span>
                        </div>
                        <p className="font-black text-xs text-zinc-900 uppercase">{device.specs.chip}</p>
                      </div>
                      <div className="flex flex-col gap-1 border-t sm:border-t-0 sm:border-l border-zinc-100 pt-4 sm:pt-0 sm:pl-6">
                        <div className="flex items-center gap-2 text-zinc-400">
                          <Camera className="w-4 h-4" />
                          <span className="text-[8px] font-black uppercase tracking-widest">Camera</span>
                        </div>
                        <p className="font-black text-xs text-zinc-900 uppercase">{device.specs.camera}</p>
                      </div>
                      <div className="flex flex-col gap-1 border-t sm:border-t-0 sm:border-l border-zinc-100 pt-4 sm:pt-0 sm:pl-6">
                        <div className="flex items-center gap-2 text-zinc-400">
                          <Monitor className="w-4 h-4" />
                          <span className="text-[8px] font-black uppercase tracking-widest">Display</span>
                        </div>
                        <p className="font-black text-xs text-zinc-900 uppercase">{device.specs.display}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="text-center sm:text-left">
                      <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Sewa</p>
                      <p className="text-3xl font-display font-black flex items-baseline gap-1 uppercase">
                        Rp {new Intl.NumberFormat('id-ID').format(device.pricePerDay)}
                        <span className="text-zinc-400 text-[10px]/[1] font-black uppercase tracking-widest mb-1 leading-none">/ hari</span>
                      </p>
                    </div>
                    <button 
                      onClick={() => handleSewaClick('phone', device)}
                      className="w-full sm:w-auto bg-black text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-zinc-800 transition-all hover:shadow-xl active:scale-95"
                    >
                      Sewa Sekarang
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Camera Section */}
        <div className="mb-24">
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-2xl font-display font-black uppercase tracking-widest text-zinc-950">Professional Camera</h2>
            <div className="h-px bg-zinc-200 flex-1"></div>
          </div>
          <div className="grid gap-12">
            {CAMERA_MODELS.map((camera, index) => (
              <motion.div
                key={camera.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-zinc-50 rounded-[2.5rem] border border-zinc-200 overflow-hidden flex flex-col md:flex-row-reverse hover:bg-white hover:shadow-2xl transition-all duration-500 group"
              >
                {/* Image Side */}
                <div className="md:w-2/5 p-8 flex items-center justify-center relative overflow-hidden">
                  <img
                    src={camera.image}
                    alt={camera.name}
                    className="w-full h-72 object-contain relative z-10 group-hover:scale-110 transition-transform duration-700 filter grayscale group-hover:grayscale-0"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Content Side */}
                <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-black text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{camera.brand}</span>
                      {camera.isNew && <span className="text-zinc-900 text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Hot Unit</span>}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-display font-black mb-6 tracking-tighter uppercase">{camera.name}</h2>
                    
                    {/* Specs Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 p-6 bg-white rounded-2xl border border-zinc-100">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-zinc-400">
                          <Aperture className="w-4 h-4" />
                          <span className="text-[8px] font-black uppercase tracking-widest">Sensor</span>
                        </div>
                        <p className="font-black text-xs text-zinc-900 uppercase">{camera.specs.sensor}</p>
                      </div>
                      <div className="flex flex-col gap-1 border-t sm:border-t-0 sm:border-l border-zinc-100 pt-4 sm:pt-0 sm:pl-6">
                        <div className="flex items-center gap-2 text-zinc-400">
                          <Video className="w-4 h-4" />
                          <span className="text-[8px] font-black uppercase tracking-widest">Video</span>
                        </div>
                        <p className="font-black text-xs text-zinc-900 uppercase">{camera.specs.video}</p>
                      </div>
                      <div className="flex flex-col gap-1 border-t sm:border-t-0 sm:border-l border-zinc-100 pt-4 sm:pt-0 sm:pl-6">
                        <div className="flex items-center gap-2 text-zinc-400">
                          <Zap className="w-4 h-4" />
                          <span className="text-[8px] font-black uppercase tracking-widest">ISO</span>
                        </div>
                        <p className="font-black text-xs text-zinc-900 uppercase">{camera.specs.iso}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="text-center sm:text-left">
                      <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Sewa</p>
                      <p className="text-3xl font-display font-black flex items-baseline gap-1 uppercase">
                        Rp {new Intl.NumberFormat('id-ID').format(camera.pricePerDay)}
                        <span className="text-zinc-400 text-[10px]/[1] font-black uppercase tracking-widest mb-1 leading-none">/ hari</span>
                      </p>
                    </div>
                    <button 
                      onClick={() => handleSewaClick('camera', camera)}
                      className="w-full sm:w-auto bg-black text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-zinc-800 transition-all hover:shadow-xl active:scale-95"
                    >
                      Sewa Sekarang
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <BookingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedItem={selectedItemForModal}
      />
    </motion.div>
  );
};

export default Packages;
