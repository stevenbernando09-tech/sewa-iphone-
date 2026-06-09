import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Calendar, Clock, Smartphone, Camera, ChevronRight, ChevronLeft, 
  CreditCard, SmartphoneNfc, Wallet, Landmark, QrCode, Clipboard, Check, 
  Upload, Shield, FileText, Sparkles, CheckCircle2, ChevronDown, Award, RefreshCw
} from 'lucide-react';
import { iPhoneModel, CameraModel } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: {
    type: 'phone' | 'camera';
    item: iPhoneModel | CameraModel;
  } | null;
}

export const BookingModal = ({ isOpen, onClose, selectedItem }: BookingModalProps) => {
  if (!selectedItem) return null;

  const { type, item } = selectedItem;
  
  // Steps: 'criteria' | 'payment_method' | 'checkout' | 'success'
  const [currentStep, setCurrentStep] = useState<'criteria' | 'payment_method' | 'checkout' | 'success'>('criteria');

  // Customer State
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });

  // Errors state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Criteria Selection States
  const [startDate, setStartDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().substring(0, 10);
  });
  const [duration, setDuration] = useState(1);
  
  // iPhone Specific criteria
  const [iphoneStorage, setIphoneStorage] = useState<'128GB' | '256GB' | '512GB' | '1TB'>('256GB');
  const [iphoneColor, setIphoneColor] = useState('Natural Titanium');
  const [minBatteryHealth, setMinBatteryHealth] = useState('95%+');

  // Camera Specific criteria
  const [cameraLens, setCameraLens] = useState<'body_only' | 'lens_50' | 'lens_2470' | 'lens_1635'>('lens_2470');
  const [cameraSdCard, setCameraSdCard] = useState<'64GB' | '128GB' | '256GB'>('128GB');
  const [mountType, setMountType] = useState('Native Mount');

  // Accessories Multi-Select
  const [selectedAccs, setSelectedAccs] = useState<string[]>([]);

  // Payment Selection State
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'dana' | 'ovo' | 'bank_transfer'>('qris');
  const [selectedBank, setSelectedBank] = useState<'bca' | 'mandiri' | 'bni'>('bca');
  const [eWalletPhone, setEWalletPhone] = useState('');
  
  // File Upload State (for proof of transfer)
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCurrentStep('criteria');
      setOrderId('SL-' + Math.floor(100000 + Math.random() * 900000));
      setProofFile(null);
      setProofPreview(null);
      setFormErrors({});
      // Reset accessories
      setSelectedAccs([]);
    }
  }, [isOpen, selectedItem]);

  // Pricing Parameters
  const getStorageCost = () => {
    if (type !== 'phone') return 0;
    switch (iphoneStorage) {
      case '256GB': return 25000;
      case '512GB': return 50000;
      case '1TB': return 90000;
      default: return 0;
    }
  };

  const getLensCost = () => {
    if (type !== 'camera') return 0;
    switch (cameraLens) {
      case 'lens_50': return 40000;
      case 'lens_1635': return 80000;
      case 'lens_2470': return 110000;
      default: return 0; // body only
    }
  };

  const getSdCardCost = () => {
    if (type !== 'camera') return 0;
    switch (cameraSdCard) {
      case '128GB': return 15000;
      case '256GB': return 35000;
      default: return 0; // 64gb is free
    }
  };

  const getAccessoriesCost = () => {
    let cost = 0;
    if (selectedAccs.includes('mic')) cost += 40000;
    if (selectedAccs.includes('tripod')) cost += 15000;
    if (selectedAccs.includes('gimbal')) cost += 50000;
    if (selectedAccs.includes('light')) cost += 20000;
    return cost;
  };

  const getBaseCost = () => item.pricePerDay;

  const getCostPerDay = () => {
    return getBaseCost() + getStorageCost() + getLensCost() + getSdCardCost() + getAccessoriesCost();
  };

  const getTotalCost = () => {
    return getCostPerDay() * duration;
  };

  const validateCriteriaForm = () => {
    const errors: Record<string, string> = {};
    if (!customerInfo.name.trim()) errors.name = 'Nama lengkap wajib diisi';
    if (!customerInfo.phone.trim()) {
      errors.phone = 'No. WhatsApp aktif wajib diisi';
    } else if (!/^[0-9+ ]{8,15}$/.test(customerInfo.phone.trim())) {
      errors.phone = 'Format No. WhatsApp tidak valid';
    }
    if (!customerInfo.email.trim()) {
      errors.email = 'Alamat email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      errors.email = 'Format email tidak valid';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 'criteria') {
      if (validateCriteriaForm()) {
        setCurrentStep('payment_method');
      }
    } else if (currentStep === 'payment_method') {
      if (paymentMethod === 'dana' || paymentMethod === 'ovo') {
        if (!eWalletPhone.trim()) {
          setFormErrors({ ewallet: `No. ${paymentMethod.toUpperCase()} aktif wajib diisi` });
          return;
        }
      }
      setFormErrors({});
      setCurrentStep('checkout');
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 'payment_method') {
      setCurrentStep('criteria');
    } else if (currentStep === 'checkout') {
      setCurrentStep('payment_method');
    }
  };

  // Drag and Drop files
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setProofFile(file);
      const url = URL.createObjectURL(file);
      setProofPreview(url);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProofFile(file);
      const url = URL.createObjectURL(file);
      setProofPreview(url);
    }
  };

  const handleOrderSubmission = () => {
    setIsSubmitting(true);
    // Simulating upload & database entry for 1.8 seconds
    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentStep('success');
    }, 1800);
  };

  const copyTransferDetail = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const toggleAccessories = (val: string) => {
    setSelectedAccs(prev => prev.includes(val) ? prev.filter(a => a !== val) : [...prev, val]);
  };

  // Accessory details for mapping
  const accessoriesOptions = [
    { id: 'mic', name: 'Wireless Microphone Dual Ch', desc: 'Cocok untuk vlog / talkshow', price: 40000 },
    { id: 'tripod', name: 'Professional Heavy-Duty Tripod', desc: 'Sangat stabil dan kokoh', price: 15000 },
    { id: 'gimbal', name: '3-Axis Gimbal Stabilizer', desc: 'Hasil video super sinematik', price: 50000 },
    { id: 'light', name: 'LED Video Ring / Fill Light', desc: 'Penerangan studio darurat', price: 20000 },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white text-zinc-950 w-full max-w-4xl rounded-[2.5rem] shadow-2xl border border-zinc-200 overflow-hidden z-10 flex flex-col md:flex-row max-h-[90vh]"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-black transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* LEFT: Mini Sidebar Invoice Summary */}
            <div className="w-full md:w-80 bg-zinc-950 text-white p-8 md:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-900 overflow-y-auto shrink-0 select-none">
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] bg-white/10 text-zinc-300 font-bold uppercase tracking-[0.25em] px-3 py-1 rounded-full">
                    SewaLens Bill
                  </span>
                  <div className="mt-4 flex items-center gap-3">
                    {type === 'phone' ? (
                      <Smartphone className="w-8 h-8 text-white shrink-0" />
                    ) : (
                      <Camera className="w-8 h-8 text-white shrink-0" />
                    )}
                    <div>
                      <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest leading-none mb-1">
                        Model Unit
                      </p>
                      <h4 className="text-lg font-display font-black leading-tight uppercase tracking-tight">
                        {item.name}
                      </h4>
                    </div>
                  </div>
                </div>

                <div className="border-t border-zinc-900 pt-6 space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Rincian invoice</p>
                  
                  {/* Real-time items */}
                  <div className="space-y-3 text-xs font-mono">
                    <div className="flex justify-between text-zinc-400">
                      <span>Harga unit (base):</span>
                      <span className="text-white">{formatRupiah(getBaseCost())}/hr</span>
                    </div>

                    {/* Specific criteria updates in text */}
                    {type === 'phone' && (
                      <div className="flex justify-between text-zinc-400">
                        <span>Penyimpanan ({iphoneStorage}):</span>
                        <span className="text-white">+{formatRupiah(getStorageCost())}/hr</span>
                      </div>
                    )}

                    {type === 'camera' && (
                      <>
                        <div className="flex justify-between text-zinc-400">
                          <span>Kriteria Lensa:</span>
                          <span className="text-white">+{formatRupiah(getLensCost())}/hr</span>
                        </div>
                        <div className="flex justify-between text-zinc-400">
                          <span>Penyimpanan SD Card:</span>
                          <span className="text-white">+{formatRupiah(getSdCardCost())}/hr</span>
                        </div>
                      </>
                    )}

                    {selectedAccs.length > 0 && (
                      <div className="flex justify-between text-zinc-400">
                        <span>Aksesoris ({selectedAccs.length}):</span>
                        <span className="text-white">+{formatRupiah(getAccessoriesCost())}/hr</span>
                      </div>
                    )}

                    <div className="flex justify-between text-zinc-400">
                      <span>Durasi Sewa:</span>
                      <span className="text-white">{duration} Hari</span>
                    </div>

                    {startDate && (
                      <div className="flex justify-between text-zinc-400">
                        <span>Mulai Tanggal:</span>
                        <span className="text-white">{startDate}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-zinc-900 mt-10">
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest leading-none mb-1">
                  ESTIMASI TOTAL INVESTASI
                </p>
                <p className="text-3xl font-display font-black text-white">
                  {formatRupiah(getTotalCost())}
                </p>
                <div className="flex items-center gap-1.5 text-[9px] text-zinc-400 mt-2 font-mono uppercase tracking-wider">
                  <Shield className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Garansi Aman & Bebas Cacat</span>
                </div>
              </div>
            </div>

            {/* RIGHT: Main Action Workspace Form */}
            <div className="flex-1 p-8 md:p-12 overflow-y-auto bg-white">
              {/* Stepper Indicators */}
              {currentStep !== 'success' && (
                <div className="flex items-center justify-between border-b border-zinc-100 pb-6 mb-8 select-none">
                  {[
                    { key: 'criteria', label: '1. Kriteria Unit' },
                    { key: 'payment_method', label: '2. Cara Bayar' },
                    { key: 'checkout', label: '3. Konfirmasi' },
                  ].map((step, idx) => {
                    const isPassed = 
                      (currentStep === 'payment_method' && idx === 0) ||
                      (currentStep === 'checkout' && (idx === 0 || idx === 1));
                    const isActive = currentStep === step.key;

                    return (
                      <div key={step.key} className="flex items-center gap-3">
                        <span className={`text-xs font-black uppercase tracking-widest ${
                          isActive 
                            ? 'text-black font-extrabold pb-0.5 border-b-2 border-black' 
                            : isPassed 
                              ? 'text-zinc-400 line-through' 
                              : 'text-zinc-300'
                        }`}>
                          {step.label}
                        </span>
                        {idx < 2 && <ChevronRight className="w-4 h-4 text-zinc-200" />}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Form Content Steps Slider */}
              <AnimatePresence mode="wait">
                {currentStep === 'criteria' && (
                  <motion.div
                    key="criteria"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-2xl font-display font-black uppercase tracking-tight text-black flex items-center gap-2">
                        Pilih Kriteria Unit & Penyewa
                      </h3>
                      <p className="text-xs text-zinc-400 font-medium leading-relaxed mt-1">
                        Silakan lengkapi preferensi kustom alat sewa Anda agar dicocokkan oleh tim Customer Service kami.
                      </p>
                    </div>

                    {/* Customer Personal Details */}
                    <div className="bg-zinc-50 rounded-3xl p-6 border border-zinc-150 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1.5 col-span-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Nama Penyewa</label>
                        <input 
                          type="text" 
                          placeholder="Nama Lengkap Anda"
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                          className={`bg-white border rounded-xl py-2 px-3 text-xs font-bold text-zinc-900 outline-none ${formErrors.name ? 'border-red-500' : 'border-zinc-200 focus:border-black'}`}
                        />
                        {formErrors.name && <span className="text-[9px] text-red-500 font-bold">{formErrors.name}</span>}
                      </div>

                      <div className="flex flex-col gap-1.5 col-span-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">No. WhatsApp Aktif</label>
                        <input 
                          type="tel" 
                          placeholder="Contoh: 0812345678"
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                          className={`bg-white border rounded-xl py-2 px-3 text-xs font-bold text-zinc-900 outline-none ${formErrors.phone ? 'border-red-500' : 'border-zinc-200 focus:border-black'}`}
                        />
                        {formErrors.phone && <span className="text-[9px] text-red-500 font-bold">{formErrors.phone}</span>}
                      </div>

                      <div className="flex flex-col gap-1.5 col-span-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Alamat Email</label>
                        <input 
                          type="email" 
                          placeholder="nama@email.com"
                          value={customerInfo.email}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                          className={`bg-white border rounded-xl py-2 px-3 text-xs font-bold text-zinc-900 outline-none ${formErrors.email ? 'border-red-500' : 'border-zinc-200 focus:border-black'}`}
                        />
                        {formErrors.email && <span className="text-[9px] text-red-500 font-bold">{formErrors.email}</span>}
                      </div>
                    </div>

                    {/* Criteria Details: iPhone vs Camera */}
                    {type === 'phone' ? (
                      /* IPHONE CRITERIA OPTION GRID */
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Storage */}
                          <div className="flex flex-col gap-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Penyimpanan (Storage)</label>
                            <div className="grid grid-cols-2 gap-2">
                              {(['128GB', '256GB', '512GB', '1TB'] as const).map((cap) => {
                                let costText = 'Free';
                                if (cap === '256GB') costText = '+Rp 25rb';
                                if (cap === '512GB') costText = '+Rp 50rb';
                                if (cap === '1TB') costText = '+Rp 90rb';
                                return (
                                  <button
                                    key={cap}
                                    type="button"
                                    onClick={() => setIphoneStorage(cap)}
                                    className={`p-2.5 text-left border rounded-xl transition-all ${
                                      iphoneStorage === cap 
                                        ? 'bg-black border-black text-white font-bold' 
                                        : 'bg-zinc-50 border-zinc-200 text-zinc-800 hover:border-zinc-400'
                                    }`}
                                  >
                                    <p className="text-xs font-black">{cap}</p>
                                    <p className={`text-[8px] uppercase font-mono ${iphoneStorage === cap ? 'text-zinc-300' : 'text-zinc-400'}`}>{costText}</p>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Color */}
                          <div className="flex flex-col gap-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Preferensi Warna</label>
                            <select 
                              value={iphoneColor}
                              onChange={(e) => setIphoneColor(e.target.value)}
                              className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs font-bold text-zinc-800 focus:border-black outline-none"
                            >
                              <option value="Natural Titanium">Natural Titanium</option>
                              <option value="Desert Titanium">Desert Titanium</option>
                              <option value="White Titanium">White Titanium</option>
                              <option value="Black Titanium">Black Titanium</option>
                              <option value="Space Black">Space Black</option>
                              <option value="Deep Purple">Deep Purple</option>
                            </select>
                            <span className="text-[8.5px] text-zinc-400 font-medium">Tim CS akan mengonfirmasi ketersediaan warna fisik.</span>
                          </div>

                          {/* Battery Health minimum */}
                          <div className="flex flex-col gap-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Battery Health (Kondisi Baterai)</label>
                            <div className="grid grid-cols-2 gap-2">
                              {['95% - 100% (Sangat Sehat)', '100% (Kondisi Like-New)'].map((opt) => {
                                const minOpt = opt.includes('100%') ? '100%' : '95%+';
                                return (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={() => setMinBatteryHealth(minOpt)}
                                    className={`p-2.5 text-left border rounded-xl transition-all text-xs font-bold flex flex-col justify-between ${
                                      minBatteryHealth === minOpt 
                                        ? 'bg-black border-black text-white' 
                                        : 'bg-zinc-50 border-zinc-200 text-zinc-800 hover:border-zinc-400'
                                    }`}
                                  >
                                    <span>{minOpt}</span>
                                    <span className={`text-[7px] uppercase tracking-wider block mt-1 ${minBatteryHealth === minOpt ? 'text-zinc-300' : 'text-zinc-400'}`}>
                                      {minOpt === '100%' ? 'Premium Match' : 'Standar Seve'}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* CAMERA CRITERIA OPTION GRID */
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Lens Selection Criteria */}
                          <div className="flex flex-col gap-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Bundling Lensa Kamera</label>
                            <div className="grid grid-cols-1 gap-2">
                              {[
                                { id: 'body_only', name: 'Body Only', cost: 'Gratis' },
                                { id: 'lens_50', name: 'Prime Lens 50mm f/1.8', cost: '+Rp 40rb/hari' },
                                { id: 'lens_1635', name: 'Wide Lens 16-35mm f/4', cost: '+Rp 80rb/hari' },
                                { id: 'lens_2470', name: 'Cinema 24-70mm f/2.8', cost: '+Rp 110rb/hari' },
                              ].map((lens) => (
                                <button
                                  key={lens.id}
                                  type="button"
                                  onClick={() => setCameraLens(lens.id as any)}
                                  className={`p-3 text-left border rounded-xl flex justify-between items-center transition-all ${
                                    cameraLens === lens.id 
                                      ? 'bg-black border-black text-white font-bold' 
                                      : 'bg-zinc-50 border-zinc-200 text-zinc-800 hover:border-zinc-400'
                                  }`}
                                >
                                  <div>
                                    <p className="text-xs font-extrabold">{lens.name}</p>
                                  </div>
                                  <span className={`text-[8.5px] font-mono uppercase ${cameraLens === lens.id ? 'text-zinc-300' : 'text-zinc-400'}`}>
                                    {lens.cost}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* SD Card capacity */}
                          <div className="flex flex-col gap-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Penyimpanan SD Card</label>
                            <div className="grid grid-cols-1 gap-2">
                              {[
                                { id: '64GB', name: '64GB High-Speed SD', cost: 'Free' },
                                { id: '128GB', name: '128GB Extreme Pro 170MB/s', cost: '+Rp 15rb/hr' },
                                { id: '256GB', name: '256GB Cinema RAW 200MB/s', cost: '+Rp 35rb/hr' },
                              ].map((sd) => (
                                <button
                                  key={sd.id}
                                  type="button"
                                  onClick={() => setCameraSdCard(sd.id as any)}
                                  className={`p-3 text-left border rounded-xl flex justify-between items-center transition-all ${
                                    cameraSdCard === sd.id 
                                      ? 'bg-black border-black text-white font-bold' 
                                      : 'bg-zinc-50 border-zinc-200 text-zinc-800 hover:border-zinc-400'
                                  }`}
                                >
                                  <div>
                                    <p className="text-xs font-extrabold">{sd.name}</p>
                                  </div>
                                  <span className={`text-[8.5px] font-mono uppercase ${cameraSdCard === sd.id ? 'text-zinc-300' : 'text-zinc-400'}`}>
                                    {sd.cost}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Mount Options */}
                          <div className="flex flex-col gap-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Preferensi Mount Lensa</label>
                            <select 
                              value={mountType}
                              onChange={(e) => setMountType(e.target.value)}
                              className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs font-bold text-zinc-800 focus:border-black outline-none"
                            >
                              <option value="Native Mount">Native Mount (Sony E / Canon RF / Fuji X)</option>
                              <option value="EF adapter bundle">Dengan Mount Adapter EF to RF (+Rp 10.000)</option>
                              <option value="EF model adaptation">Dengan Adapter EF to E-Mount (+Rp 15.000)</option>
                            </select>
                            <span className="text-[8.5px] text-zinc-400 font-medium">Alat sewa akan disiapkan langsung dengan adapter terpasang rapi.</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Accessories Multi-Select (Applies to both) */}
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2.5 block">
                        Aksesoris Tambahan (Opsional)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {accessoriesOptions.map((acc) => {
                          const hasAcc = selectedAccs.includes(acc.id);
                          return (
                            <div
                              key={acc.id}
                              onClick={() => toggleAccessories(acc.id)}
                              className={`flex justify-between items-center border p-3.5 rounded-2xl cursor-pointer transition-all ${
                                hasAcc 
                                  ? 'bg-zinc-950 border-black text-white shadow-md' 
                                  : 'bg-zinc-50 border-zinc-200 text-zinc-800 hover:border-zinc-300'
                              }`}
                            >
                              <div>
                                <p className={`text-xs font-bold ${hasAcc ? 'text-white' : 'text-zinc-900'}`}>{acc.name}</p>
                                <p className={`text-[9px] ${hasAcc ? 'text-zinc-450' : 'text-zinc-450'}`}>{acc.desc}</p>
                              </div>
                              <span className="text-[10px] font-black shrink-0 font-mono pl-3">
                                +Rp {acc.price.toLocaleString('id-ID')}/hr
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Duration slider & Date picker */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-50 p-6 rounded-3xl border border-zinc-150">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-[9.5px] font-black uppercase tracking-widest text-zinc-450 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Durasi Sewa Harian</span>
                          </label>
                          <span className="text-sm font-black text-zinc-900 bg-zinc-200/60 px-3 py-0.5 rounded-full">{duration} Hari</span>
                        </div>
                        <input 
                          type="range"
                          min="1"
                          max="30"
                          value={duration}
                          onChange={(e) => setDuration(parseInt(e.target.value))}
                          className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-black"
                        />
                        <div className="flex justify-between text-[8px] text-zinc-400 font-bold uppercase tracking-wider">
                          <span>1 hari</span>
                          <span>7 hari (Diskon 5%)</span>
                          <span>14 hari (Diskon 10%)</span>
                          <span>30 hari</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[9.5px] font-black uppercase tracking-widest text-zinc-450 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Mulai Tanggal Sewa</span>
                        </label>
                        <input 
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="bg-white border border-zinc-200 rounded-xl p-2.5 text-xs font-bold focus:border-black outline-none text-zinc-800"
                        />
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-6 border-t border-zinc-100 flex justify-end">
                      <button
                        onClick={handleNextStep}
                        className="bg-black hover:bg-zinc-800 text-white px-10 py-4.5 rounded-2xl text-xs font-black uppercase tracking-widest tracking-[0.25em] flex items-center gap-2"
                      >
                        <span>Pilih Pembayaran</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {currentStep === 'payment_method' && (
                  <motion.div
                    key="payment_method"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-2xl font-display font-black uppercase tracking-tight text-black flex items-center gap-2">
                        Pilih Metode Pembayaran
                      </h3>
                      <p className="text-xs text-zinc-400 font-medium leading-relaxed mt-1">
                        Dukung transaksi aman melalui instrumen e-Wallet instan (DANA, OVO), QRIS instan, maupun Transfer Bank.
                      </p>
                    </div>

                    {/* Payment Types Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {/* QRIS */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('qris')}
                        className={`p-6 border rounded-3xl transition-all text-left flex flex-col justify-between h-40 ${
                          paymentMethod === 'qris' 
                            ? 'bg-black border-black text-white shadow-xl' 
                            : 'bg-zinc-50 border-zinc-200 text-zinc-800 hover:border-zinc-400'
                        }`}
                      >
                        <QrCode className="w-8 h-8" />
                        <div>
                          <p className="text-xs font-black uppercase tracking-wider">QRIS Barcode</p>
                          <p className={`text-[8px] mt-1 ${paymentMethod === 'qris' ? 'text-zinc-300' : 'text-zinc-400'}`}>
                            Scan instan via e-wallet atau M-Banking Anda
                          </p>
                        </div>
                      </button>

                      {/* DANA */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('dana')}
                        className={`p-6 border rounded-3xl transition-all text-left flex flex-col justify-between h-40 ${
                          paymentMethod === 'dana' 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-xl' 
                            : 'bg-zinc-50 border-zinc-200 text-zinc-800 hover:border-zinc-400'
                        }`}
                      >
                        <Wallet className="w-8 h-8" />
                        <div>
                          <p className="text-xs font-black uppercase tracking-wider">DANA E-Wallet</p>
                          <p className={`text-[8px] mt-1 ${paymentMethod === 'dana' ? 'text-zinc-100' : 'text-zinc-400'}`}>
                            Gunakan dompet digital DANA
                          </p>
                        </div>
                      </button>

                      {/* OVO */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('ovo')}
                        className={`p-6 border rounded-3xl transition-all text-left flex flex-col justify-between h-40 ${
                          paymentMethod === 'ovo' 
                            ? 'bg-indigo-900 border-indigo-900 text-white shadow-xl' 
                            : 'bg-zinc-50 border-zinc-200 text-zinc-800 hover:border-zinc-400'
                        }`}
                      >
                        <SmartphoneNfc className="w-8 h-8" />
                        <div>
                          <p className="text-xs font-black uppercase tracking-wider">OVO E-Wallet</p>
                          <p className={`text-[8px] mt-1 ${paymentMethod === 'ovo' ? 'text-zinc-200' : 'text-zinc-400'}`}>
                            Instan payment OVO Cash
                          </p>
                        </div>
                      </button>

                      {/* BANK TRANSFER */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('bank_transfer')}
                        className={`p-6 border rounded-3xl transition-all text-left flex flex-col justify-between h-40 ${
                          paymentMethod === 'bank_transfer' 
                            ? 'bg-zinc-950 border-zinc-950 text-white shadow-xl' 
                            : 'bg-zinc-50 border-zinc-200 text-zinc-800 hover:border-zinc-400'
                        }`}
                      >
                        <Landmark className="w-8 h-8" />
                        <div>
                          <p className="text-xs font-black uppercase tracking-wider">Bank Transfer</p>
                          <p className={`text-[8px] mt-1 ${paymentMethod === 'bank_transfer' ? 'text-zinc-300' : 'text-zinc-400'}`}>
                            BCA, Mandiri, atau BNI ke Virtual Account
                          </p>
                        </div>
                      </button>
                    </div>

                    {/* Payment detail fields */}
                    <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-150">
                      {paymentMethod === 'qris' && (
                        <div className="flex gap-4 items-center">
                          <QrCode className="w-10 h-10 text-neutral-800 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-zinc-900">QRIS All Payment</p>
                            <p className="text-[10px] text-zinc-400 font-medium leading-relaxed mt-1">
                              Setelah menekan tombol Lanjutkan, sebuah QRIS resmi SewaLens Studios akan muncul di layar. Scan kode langsung menggunakan GoPay, ShopeePay, DANA, OVO, LinkAja, atau aplikasi m-Banking kesayangan Anda.
                            </p>
                          </div>
                        </div>
                      )}

                      {(paymentMethod === 'dana' || paymentMethod === 'ovo') && (
                        <div className="space-y-3">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                              No. Handphone Terdaftar di {paymentMethod.toUpperCase()}
                            </label>
                            <input 
                              type="tel"
                              placeholder="Contoh: 081298765432"
                              value={eWalletPhone}
                              onChange={(e) => setEWalletPhone(e.target.value)}
                              className={`bg-white border rounded-xl py-3 px-4 text-xs font-bold text-zinc-900 outline-none w-full max-w-md ${formErrors.ewallet ? 'border-red-500' : 'border-zinc-200 focus:border-black'}`}
                            />
                            {formErrors.ewallet && <span className="text-[9px] text-red-500 font-bold">{formErrors.ewallet}</span>}
                          </div>
                          <p className="text-[9.5px] text-zinc-400 leading-relaxed font-medium">
                            Aplikasi kami akan mengirimkan invoice notifikasi langsung ke aplikasi {paymentMethod.toUpperCase()} Anda untuk mempermudah eksekusi saldo.
                          </p>
                        </div>
                      )}

                      {paymentMethod === 'bank_transfer' && (
                        <div className="space-y-4">
                          <div className="flex flex-col gap-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Pilih Virtual Account Bank</label>
                            <div className="flex gap-3">
                              {(['bca', 'mandiri', 'bni'] as const).map((b) => (
                                <button
                                  key={b}
                                  type="button"
                                  onClick={() => setSelectedBank(b)}
                                  className={`px-6 py-3.5 rounded-xl border text-xs font-black uppercase tracking-widest transition-all ${
                                    selectedBank === b 
                                      ? 'bg-zinc-900 border-zinc-900 text-white' 
                                      : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-400'
                                  }`}
                                >
                                  {b}
                                </button>
                              ))}
                            </div>
                          </div>
                          <p className="text-[9.5px] text-zinc-500 leading-relaxed font-medium">
                            Anda akan melakukan transfer transfer-rekening interaktif atau instan virtual account ke Bank {selectedBank.toUpperCase()} terafiliasi dengan SevePhone Studios.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Navigation Actions */}
                    <div className="pt-6 border-t border-zinc-100 flex justify-between">
                      <button
                        onClick={handlePrevStep}
                        className="border border-zinc-200 hover:border-zinc-400 text-zinc-800 px-8 py-4.5 rounded-2xl text-xs font-black uppercase tracking-widest tracking-[0.2em] flex items-center gap-2"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Kembali</span>
                      </button>

                      <button
                        onClick={handleNextStep}
                        className="bg-black hover:bg-zinc-800 text-white px-10 py-4.5 rounded-2xl text-xs font-black uppercase tracking-widest tracking-[0.25em] flex items-center gap-2"
                      >
                        <span>Lanjutkan</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {currentStep === 'checkout' && (
                  <motion.div
                    key="checkout"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-2xl font-display font-black uppercase tracking-tight text-black flex items-center gap-2">
                        Pembayaran & Unggah Bukti
                      </h3>
                      <p className="text-xs text-zinc-400 font-medium leading-relaxed mt-1">
                        Silakan lakukan pembayaran sesuai dengan rincian di bawah dan unggah bukti transfer guna disetujui CS dalam 15 menit.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                      {/* Left: Payment Action Details */}
                      <div className="md:col-span-6 space-y-4">
                        {paymentMethod === 'qris' && (
                          <div className="bg-zinc-50 rounded-3xl border border-zinc-150 p-6 flex flex-col items-center">
                            {/* QRIS BRAND HEADER */}
                            <div className="w-full text-center border-b border-zinc-200 pb-3 mb-4 select-none">
                              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.25em] block mb-1">METODE SCAN QRIS</span>
                              <div className="font-display font-extrabold text-sm text-zinc-900 tracking-wider flex justify-center items-center gap-1.5">
                                <QrCode className="w-4 h-4" />
                                <span>QRIS GPN INDONESIA</span>
                              </div>
                            </div>

                            {/* SVG GENERATOR QRIS BARCODE */}
                            <div className="relative border-4 border-zinc-950 p-4 rounded-2xl bg-white shadow-md w-48 h-48 flex items-center justify-center overflow-hidden">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-full h-full select-none" shapeRendering="crispEdges">
                                <rect width="100" height="100" fill="#ffffff" />
                                {/* Corners anchors */}
                                <rect x="5" y="5" width="20" height="20" fill="#000000" />
                                <rect x="8" y="8" width="14" height="14" fill="#ffffff" />
                                <rect x="11" y="11" width="8" height="8" fill="#000000" />

                                <rect x="75" y="5" width="20" height="20" fill="#000000" />
                                <rect x="78" y="8" width="14" height="14" fill="#ffffff" />
                                <rect x="81" y="11" width="8" height="8" fill="#000000" />

                                <rect x="5" y="75" width="20" height="20" fill="#000000" />
                                <rect x="8" y="78" width="14" height="14" fill="#ffffff" />
                                <rect x="11" y="81" width="8" height="8" fill="#000000" />

                                {/* QR Random pixels vectors simulated cleanly */}
                                <rect x="35" y="10" width="10" height="5" fill="#000000" />
                                <rect x="55" y="15" width="15" height="10" fill="#000000" />
                                <rect x="40" y="30" width="20" height="5" fill="#000000" />
                                <rect x="10" y="35" width="15" height="5" fill="#000000" />
                                <rect x="70" y="40" width="10" height="15" fill="#000000" />
                                <rect x="30" y="45" width="5" height="10" fill="#000000" />
                                <rect x="15" y="50" width="10" height="15" fill="#000000" />
                                <rect x="30" y="70" width="15" height="15" fill="#000000" />
                                <rect x="50" y="55" width="10" height="20" fill="#000000" />
                                <rect x="65" y="65" width="15" height="10" fill="#000000" />

                                {/* Center logo backdrop */}
                                <rect x="40" y="40" width="20" height="20" fill="#ffffff" rx="2" />
                                <text x="50" y="52" fontSize="5.5" fontWeight="900" fill="#000000" textAnchor="middle" fontFamily="sans-serif">QRIS</text>
                              </svg>
                              <div className="absolute inset-0 border border-blue-500/20 pointer-events-none animate-pulse" />
                            </div>

                            <p className="text-[10px] text-zinc-500 text-center font-bold uppercase tracking-widest mt-4">
                              SEVALENS CREATIVE INDONESIA
                            </p>
                            <span className="text-[8px] text-zinc-400 mt-1 block">NMID: ID102026030112</span>
                          </div>
                        )}

                        {(paymentMethod === 'dana' || paymentMethod === 'ovo') && (
                          <div className="bg-zinc-50 rounded-3xl border border-zinc-150 p-6 space-y-4">
                            <span className="text-[9px] bg-zinc-900 text-zinc-100 font-bold uppercase tracking-[0.25em] px-3 py-1 rounded-full w-fit block">
                              E-WALLET BILLING
                            </span>
                            <div>
                              <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">E-Wallet</p>
                              <p className="text-md font-bold text-zinc-900 uppercase">
                                {paymentMethod.toUpperCase()} (Push Notification)
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">Nomor HP</p>
                              <p className="text-md font-black text-zinc-900">{eWalletPhone}</p>
                            </div>

                            <div className="p-4 bg-yellow-50 text-yellow-800 rounded-xl border border-yellow-200 text-[10.5px] leading-relaxed font-medium">
                              Silakan buka aplikasi <strong>{paymentMethod.toUpperCase()}</strong> pada hp Anda secara berkala. Segera lakukan pembayaran di menu notifikasi/beranda dalam waktu 5 menit.
                            </div>
                          </div>
                        )}

                        {paymentMethod === 'bank_transfer' && (
                          <div className="bg-zinc-50 rounded-3xl border border-zinc-150 p-6 space-y-4">
                            <span className="text-[9px] bg-zinc-900 text-zinc-100 font-bold uppercase tracking-[0.25em] px-3 py-1 rounded-full w-fit block">
                              REKENING TRANSFER
                            </span>
                            
                            {/* Bank details to transfer */}
                            <div className="space-y-4">
                              <div>
                                <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">Nama Bank</p>
                                <p className="text-lg font-black text-black uppercase">BANK {selectedBank.toUpperCase()}</p>
                              </div>

                              <div>
                                <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">Nomor Virtual Account</p>
                                <div className="flex items-center gap-3 mt-1">
                                  <p className="text-xl font-mono text-zinc-950 font-black tracking-widest">
                                    {selectedBank === 'bca' ? '8627 5615 2575' : selectedBank === 'mandiri' ? '185-2022-45-12' : '2453 972 3112'}
                                  </p>
                                  <button
                                    onClick={() => copyTransferDetail(selectedBank === 'bca' ? '862756152575' : selectedBank === 'mandiri' ? '18520224512' : '24539723112')}
                                    className="p-1.5 hover:bg-zinc-200 text-zinc-500 hover:text-black rounded-lg transition-colors border border-zinc-200 bg-white"
                                    title="Salin nomor"
                                  >
                                    {copiedText ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Clipboard className="w-3.5 h-3.5" />}
                                  </button>
                                </div>
                              </div>

                              <div>
                                <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">Atas Nama Rekening</p>
                                <p className="text-md font-bold text-zinc-900">PT SEVALENS CREATIVE INDONESIA</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right: Drag and Drop proof of transfer */}
                      <div className="md:col-span-6 space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-450 block">
                          Unggah Bukti Pembayaran / Kontrak (Wajib)
                        </label>
                        
                        <div 
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          className={`border-2 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center text-center transition-all min-h-[16rem] cursor-pointer relative ${
                            isDragging 
                              ? 'border-black bg-zinc-50' 
                              : proofFile 
                                ? 'border-zinc-300 bg-white' 
                                : 'border-zinc-200 bg-zinc-50 hover:bg-neutral-100'
                          }`}
                          onClick={() => document.getElementById('rental-proof-uploader')?.click()}
                        >
                          <input 
                            id="rental-proof-uploader"
                            type="file" 
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />

                          {proofPreview ? (
                            <div className="space-y-4 w-full h-full">
                              <img 
                                src={proofPreview} 
                                alt="Pratinjau Bukti" 
                                className="w-full h-28 object-contain rounded-xl mx-auto border border-zinc-200"
                              />
                              <div>
                                <p className="text-xs font-bold text-zinc-900">{proofFile?.name}</p>
                                <p className="text-[10px] text-zinc-400 font-mono mt-1 mt-0.5">
                                  {((proofFile?.size || 0) / 1024).toFixed(1)} KB (Klik untuk ganti bukti)
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="w-12 h-12 bg-white rounded-full border border-zinc-200 flex items-center justify-center mx-auto shadow-sm">
                                <Upload className="w-5 h-5 text-zinc-400" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-zinc-900">Seret & Jatuhkan Bukti Transfer</p>
                                <p className="text-[10px] text-zinc-400 font-medium leading-relaxed mt-1">
                                  Mendukung format JPG, PNG atau PDF. Maksimal ukuran file 5MB.
                                </p>
                              </div>
                              <span className="inline-block mt-4 bg-black text-white text-[9.5px]/[1] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl">
                                Pilih File Bukti
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Order ID Tag */}
                        <div className="flex justify-between items-center bg-zinc-50 border border-zinc-150 p-4 rounded-2xl select-none font-mono text-[10.5px]">
                          <span className="text-zinc-500 uppercase tracking-widest font-bold">KODE BOOKING NYA</span>
                          <span className="text-black font-extrabold">{orderId}</span>
                        </div>
                      </div>
                    </div>

                    {/* Submit Section */}
                    <div className="pt-6 border-t border-zinc-100 flex justify-between items-center select-none">
                      <button
                        onClick={handlePrevStep}
                        disabled={isSubmitting}
                        className="border border-zinc-200 hover:border-zinc-400 text-zinc-850 px-8 py-4.5 rounded-2xl text-xs font-black uppercase tracking-widest tracking-[0.2em] flex items-center gap-2"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Kembali</span>
                      </button>

                      <button
                        onClick={handleOrderSubmission}
                        disabled={isSubmitting || !proofFile}
                        className={`px-12 py-5 rounded-2xl text-xs font-black uppercase tracking-widest tracking-[0.25em] flex items-center gap-2.5 transition-all shadow-xl active:scale-95 ${
                          proofFile 
                            ? 'bg-black text-white hover:bg-zinc-850 cursor-pointer' 
                            : 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200'
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin text-white-400" />
                            <span>Mendaftarkan Sewa...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Kirim & Selesaikan Sewa</span>
                          </>
                        )}
                      </button>
                    </div>

                    {!proofFile && (
                      <span className="text-[10px] font-bold text-red-500 uppercase block tracking-wider text-right italic-none">
                        * Harap melampirkan screenshot bukti transfer / pembayaran Anda untuk kelancaran pendaftaran sewa.
                      </span>
                    )}
                  </motion.div>
                )}

                {currentStep === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center space-y-6 flex flex-col items-center justify-center"
                  >
                    <div className="w-20 h-20 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center shadow-md">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-3xl font-display font-black uppercase tracking-tight text-black">
                        Persetujuan Berhasil Didaftarkan!
                      </h3>
                      <p className="text-sm text-zinc-500 font-medium max-w-lg leading-relaxed">
                        Terima kasih, pembayaran untuk pemesanan sewa <strong>{item.name}</strong> dengan Kode Booking <strong>{orderId}</strong> telah diterima oleh sistem SewaLens.
                      </p>
                    </div>

                    {/* Booking metadata values */}
                    <div className="w-full max-w-md bg-zinc-50 border border-zinc-150 p-6 rounded-[2rem] space-y-3.5 text-left font-sans shadow-inner select-none">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-200 pb-2 mb-2">
                        Summary Order Pendaftaran
                      </p>
                      
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-500 font-bold uppercase tracking-wider">Nama Klien</span>
                        <span className="text-zinc-900 font-black">{customerInfo.name}</span>
                      </div>

                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-500 font-bold uppercase tracking-wider">Metode Bayar</span>
                        <span className="text-zinc-900 font-mono font-black uppercase">{paymentMethod}</span>
                      </div>

                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-500 font-bold uppercase tracking-wider">Estimasi Unit</span>
                        <span className="text-zinc-900 font-black uppercase">{item.name}</span>
                      </div>

                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-500 font-bold uppercase tracking-wider">Durasi & Mulai</span>
                        <span className="text-zinc-900 font-black uppercase">{duration} hari • {startDate}</span>
                      </div>

                      {type === 'phone' ? (
                        <div className="flex justify-between text-xs border-t border-zinc-200/60 pt-3">
                          <span className="text-zinc-500 font-bold uppercase tracking-wider">Kriteria Model</span>
                          <span className="text-black font-extrabold">{iphoneStorage} • {iphoneColor} • {minBatteryHealth} BH</span>
                        </div>
                      ) : (
                        <div className="flex justify-between text-xs border-t border-zinc-200/60 pt-3">
                          <span className="text-zinc-500 font-bold uppercase tracking-wider">Kriteria Model</span>
                          <span className="text-black font-extrabold">{cameraLens === 'body_only' ? 'Body' : cameraLens === 'lens_50' ? '50mm' : cameraLens === 'lens_1635' ? '16-35mm' : '24-70mm'} Lens • {cameraSdCard} SD</span>
                        </div>
                      )}
                    </div>

                    <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-[11px] leading-relaxed max-w-md text-zinc-500 font-medium">
                      Tim Customer Service SevePhone akan menghubungi Anda melalui WhatsApp di nomor <strong>{customerInfo.phone}</strong> dalam kurun waktu 5-15 menit untuk instruksi penjemputan unit fisik beserta penyerahan kontrak jaminan aman.
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={onClose}
                        className="bg-zinc-950 hover:bg-black text-white px-10 py-4.5 rounded-2xl text-xs font-black uppercase tracking-widest tracking-[0.25em] transition-all duration-300"
                      >
                        Kembali ke Katalog
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
