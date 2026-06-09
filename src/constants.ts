import { iPhoneModel, CameraModel, Testimonial, Feature } from './types';

export const IPHONE_MODELS: iPhoneModel[] = [
  {
    id: 'i17-basic',
    name: 'iPhone 17 Basic',
    series: 'Terbaru',
    pricePerDay: 250000,
    specs: {
      chip: 'A19 Bionic',
      camera: '48MP Main',
      display: '6.1" Super Retina XDR'
    },
    image: 'https://www.pngmart.com/files/24/Apple-iPhone-17-Pro-Max-PNG-File.png',
    isNew: true
  },
  {
    id: 'i16-pro',
    name: 'iPhone 16 Pro Max',
    series: 'Terbaru',
    pricePerDay: 220000,
    specs: {
      chip: 'A18 Pro',
      camera: 'Triple 48MP',
      display: '6.9" ProMotion'
    },
    image: 'https://media-cdn.bnn.in.th/426794/iPhone_16_Pro_Max_Desert_Titanium_1-square_medium.jpg',
    isNew: true
  },
  {
    id: 'i15-pro',
    name: 'iPhone 15 Pro',
    series: 'Pro',
    pricePerDay: 180000,
    specs: {
      chip: 'A17 Pro',
      camera: '48MP Main',
      display: '6.1" ProMotion'
    },
    image: 'https://cdn.ithinkdiff.com/wp-content/uploads/2022/09/iPhone-15-Ultra.jpg'
  }
];

export const CAMERA_MODELS: CameraModel[] = [
  {
    id: 'sony-a7iv',
    name: 'Sony A7 IV',
    brand: 'Sony',
    pricePerDay: 350000,
    specs: {
      sensor: '33MP Full-Frame',
      video: '4K 60p 10-bit',
      iso: '50-204800'
    },
    image: 'https://www.photoscala.de/wp-content/uploads/2019/07/A7RIV_FE2470GM_right.png',
    isNew: true
  },
  {
    id: 'canon-r6',
    name: 'Canon EOS R6 Mark II',
    brand: 'Canon',
    pricePerDay: 380000,
    specs: {
      sensor: '24.2MP Full-Frame',
      video: '4K 60p Uncropped',
      iso: '100-204800'
    },
    image: 'https://i.pcmag.com/imagery/articles/02Fsk9Qsruz1sAvIzL4jCAY-3.png',
    isNew: true
  },
  {
    id: 'fuji-xt5',
    name: 'Fujifilm X-T5',
    brand: 'Fujifilm',
    pricePerDay: 250000,
    specs: {
      sensor: '40MP APS-C',
      video: '6.2K 30p',
      iso: '125-12800'
    },
    image: 'https://fujifilm-korea.co.kr/image/product/nj/rl/ufqugyhf/thumbnail/185202245mtjp.png'
  }
];

export const EDITING_SERVICES = [
  {
    title: 'Content Editing',
    description: 'Jasa edit video TikTok, Reels, dan video pendek lainnya untuk kebutuhan konten harian Anda.',
    price: '75.000',
    icon: 'Video'
  },
  {
    title: 'Professional Cinematic',
    description: 'Editing video profesional untuk event, wedding, atau profile bisnis dengan kualitas tinggi.',
    price: '250.000',
    icon: 'Film'
  },
  {
    title: 'Photo Enhancing',
    description: 'Editing foto produk atau personal supaya terlihat lebih estetik dan profesional.',
    price: '25.000',
    icon: 'Image'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Rian Hidayat',
    role: 'Content Creator',
    content: 'Sewa di SevePhone prosesnya gampang banget! Barunya kinclong, dan jasa edit videonya juga sat-set hasilnya memuaskan.',
    avatar: 'https://i.pravatar.cc/150?u=1'
  },
  {
    id: '2',
    name: 'Siska Amelia',
    role: 'Traveler',
    content: 'Harga merakyat tapi pelayanan sultan. Jasa edit fotonya ngebantu banget pas lagi liburan tapi males ngedit sendiri.',
    avatar: 'https://i.pravatar.cc/150?u=2'
  },
  {
    id: '3',
    name: 'Budi Santoso',
    role: 'Mahasiswa',
    content: 'Buat gaya-gayaan wisuda oke banget sewa iPhone 16 Pro di sini. Jasa editnya juga bikin hasil wisuda makin keren!',
    avatar: 'https://i.pravatar.cc/150?u=3'
  }
];

export const FEATURES: Feature[] = [
  {
    title: 'Harga Bersahabat',
    description: 'Tarif sewa iPhone & Kamera harian yang terjangkau untuk semua kalangan, kompetitif dan transparan.',
    icon: 'Banknote'
  },
  {
    title: 'Jasa Editing',
    description: 'Bukan cuma alatnya, kami juga bantu editkan konten Anda sampai siap tayang.',
    icon: 'Clapperboard'
  },
  {
    title: 'Customer Service',
    description: 'Siap membantu Anda 24/7 untuk konsultasi unit maupun bantuan selama masa sewa.',
    icon: 'Headphones'
  }
];
