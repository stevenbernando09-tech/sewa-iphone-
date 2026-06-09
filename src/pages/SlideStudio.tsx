import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, Camera, Check, Plus, RefreshCw, ExternalLink, 
  Lock, AlertCircle, Eye, ChevronLeft, ChevronRight, Sparkles, 
  FileSpreadsheet, ClipboardList, Send, Loader2, LogOut, CheckCircle2 
} from 'lucide-react';
import { IPHONE_MODELS, CAMERA_MODELS, EDITING_SERVICES } from '../constants';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

interface SelectedGear {
  id: string;
  name: string;
  price: number;
  type: 'phone' | 'camera';
  specs: string;
}

const SlideStudio = () => {
  // Auth state
  const [token, setToken] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<{ name: string; picture?: string; email: string } | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Form selections state
  const [projectTitle, setProjectTitle] = useState('Komersial Video - Toko Kopi Bangka');
  const [creatorName, setCreatorName] = useState('Kreatif Digital Studios');
  const [selectedGears, setSelectedGears] = useState<SelectedGear[]>([
    { id: 'i16-pro', name: 'iPhone 16 Pro Max', price: 220000, type: 'phone', specs: 'Triple 48MP Camera, 6.9" ProMotion' },
    { id: 'sony-a7iv', name: 'Sony A7 IV', price: 350000, type: 'camera', specs: '33MP Full-Frame, 4K 60p 10-bit' }
  ]);
  const [selectedServices, setSelectedServices] = useState<string[]>(['Content Editing']);
  const [customNotes, setCustomNotes] = useState('Semua perlengkapan disewa selama 3 hari produksi aktif. Konten siap ditayangkan dalam 48 jam pasca syuting.');
  const [accentColor, setAccentColor] = useState<'minimal' | 'dark' | 'border'>('minimal');

  // Preview sliders state
  const [activeSlide, setActiveSlide] = useState(0);

  // Generator engine state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [createdPresentation, setCreatedPresentation] = useState<{ id: string; url: string } | null>(null);

  // Initialize and check for pre-cached token
  useEffect(() => {
    const savedToken = sessionStorage.getItem('sevelens_oauth_token');
    if (savedToken) {
      setToken(savedToken);
      fetchUserProfile(savedToken);
    }

    // Capture OAuth responses
    const handleOAuthMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        const accessToken = event.data.token;
        setToken(accessToken);
        sessionStorage.setItem('sevelens_oauth_token', accessToken);
        fetchUserProfile(accessToken);
        setAuthError(null);
        setIsAuthenticating(false);
      } else if (event.data?.type === 'OAUTH_AUTH_FAILURE') {
        setAuthError(event.data.error || 'Autentikasi gagal diselesaikan.');
        setIsAuthenticating(false);
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, []);

  const fetchUserProfile = async (accessToken: string) => {
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUserProfile({
          name: data.name,
          picture: data.picture,
          email: data.email
        });
      } else {
        // Token might have expired
        handleLogout();
      }
    } catch (err) {
      console.error('Error fetching google user info:', err);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('sevelens_oauth_token');
    setToken(null);
    setUserProfile(null);
  };

  const triggerGoogleLogin = () => {
    setIsAuthenticating(true);
    setAuthError(null);

    const redirectUri = `${window.location.origin}/auth/callback`;
    const scopes = [
      'https://www.googleapis.com/auth/slides',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ].join(' ');

    const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID || 'dummy_id_placeholder',
      redirect_uri: redirectUri,
      response_type: 'token',
      scope: scopes,
      include_granted_scopes: 'true',
      state: 'sevelens_slides'
    }).toString();

    // Open popup
    const width = 550;
    const height = 650;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      googleOAuthUrl,
      'GoogleOAuthPopup',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`
    );
  };

  // Pricing calculator helpers
  const getGearsTotal = () => selectedGears.reduce((acc, curr) => acc + curr.price, 0);
  const getServicesTotal = () => {
    return EDITING_SERVICES
      .filter(s => selectedServices.includes(s.title))
      .reduce((acc, curr) => acc + (parseInt(curr.price.replace(/\./g, ''))), 0);
  };
  const getTotalEstimation = () => getGearsTotal() + getServicesTotal();

  // Toggle selections
  const toggleGear = (id: string, name: string, price: number, type: 'phone' | 'camera', specs: string) => {
    setSelectedGears(prev => {
      const exists = prev.find(g => g.id === id);
      if (exists) {
        return prev.filter(g => g.id !== id);
      } else {
        return [...prev, { id, name, price, type, specs }];
      }
    });
  };

  const toggleService = (title: string) => {
    setSelectedServices(prev => {
      if (prev.includes(title)) {
        return prev.filter(t => t !== title);
      } else {
        return [...prev, title];
      }
    });
  };

  // Google Slides REST integration
  const handleSlidesGeneration = async () => {
    setIsGenerating(true);
    setCreatedPresentation(null);

    // If client ID is missing, run simulated sandbox creation
    if (!GOOGLE_CLIENT_ID || !token) {
      // Sandbox Simulator Flow
      const steps = [
        'Mengecek integrasi SewaLens & Google Slides API...',
        'Membuat Presentasi Baru rasa Monokrom...',
        'Mengonfigurasi Slide 1 (Halaman Utama Proposal)...',
        'Menyusun Slide 2 (Spesifikasi Unit Sewa & Metadata)...',
        'Merakit Slide 3 (Paket Post-Production & Jasa Editing)...',
        'Membangun Slide 4 (Estimasi Harga & Ketentuan Sewa)...',
        'Mengaplikasikan Font Georgia & Monospace Elegance...',
        'Sukses! Presentasi siap dibuka.'
      ];

      for (let i = 0; i < steps.length; i++) {
        setGenerationStep(steps[i]);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      setCreatedPresentation({
        id: 'sandbox_presentation_id',
        url: 'https://docs.google.com/presentation/d/1_SandboxDemoPresentationUrlHereSewaLens/edit'
      });
      setIsGenerating(false);
      return;
    }

    try {
      setGenerationStep('Menghubungkan ke Google API...');
      
      // 1. Create a blank presentation
      const createResponse = await fetch('https://slides.googleapis.com/v1/presentations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: `SewaLens - Proposal ${projectTitle}`
        })
      });

      if (!createResponse.ok) {
        throw new Error('Gagal membuat presentasi baru di akun Google.');
      }

      const presentation = await createResponse.json();
      const presentationId = presentation.presentationId;
      const defaultSlideId = presentation.slides[0]?.objectId || 'p';

      setGenerationStep('Menyusun request tata letak slide...');

      // Compile Selected Assets Strings
      const gearText = selectedGears.length > 0 
        ? selectedGears.map(g => `• ${g.name} (${g.specs}) - Rp ${new Intl.NumberFormat('id-ID').format(g.price)}/hari`).join('\n')
        : '• Tidak ada unit gear yang dipilih.';

      const serviceText = selectedServices.length > 0
        ? EDITING_SERVICES.filter(s => selectedServices.includes(s.title))
            .map(s => `• Jasa ${s.title} (${s.description}) - Rp ${s.price}`).join('\n')
        : '• Tidak ada layanan editing yang dipilih.';

      const totalFormat = new Intl.NumberFormat('id-ID').format(getTotalEstimation());

      // Helper values for Slide layout
      const requests = [
        // Slide 1 - Title slide override (using the default slide)
        // Add a clean solid dark layout shape as top banner to slide 1
        {
          createShape: {
            objectId: 'slide1_banner',
            shapeType: 'RECTANGLE',
            elementProperties: {
              pageId: defaultSlideId,
              size: {
                width: { magnitude: 720, unit: 'PT' },
                height: { magnitude: 20, unit: 'PT' }
              },
              transform: {
                scaleX: 1, scaleY: 1, translateX: 0, translateY: 0, unit: 'PT'
              }
            }
          }
        },
        // Update background of banner to black
        {
          updateShapeProperties: {
            objectId: 'slide1_banner',
            shapeProperties: {
              shapeBackgroundFill: {
                solidFill: { color: { rgbColor: { red: 0, green: 0, blue: 0 } } }
              },
              outline: { propertyState: 'NOT_RENDERED' }
            },
            fields: 'shapeBackgroundFill.solidFill.color,outline'
          }
        },
        // Add brand label at standard top
        {
          createShape: {
            objectId: 'slide1_brand',
            shapeType: 'TEXT_BOX',
            elementProperties: {
              pageId: defaultSlideId,
              size: { width: { magnitude: 400, unit: 'PT' }, height: { magnitude: 40, unit: 'PT' } },
              transform: { scaleX: 1, scaleY: 1, translateX: 50, translateY: 40, unit: 'PT' }
            }
          }
        },
        {
          insertText: {
            objectId: 'slide1_brand',
            text: 'SEWALENS STUDIOS • PROPOSAL TEKNIS'
          }
        },
        {
          updateTextStyle: {
            objectId: 'slide1_brand',
            textRange: { type: 'ALL' },
            style: {
              fontFamily: 'Courier New',
              fontSize: { magnitude: 11, unit: 'PT' },
              bold: true,
              foregroundColor: { solidColor: { rgbColor: { red: 0.5, green: 0.5, blue: 0.5 } } }
            },
            fields: 'fontFamily,fontSize,bold,foregroundColor'
          }
        },
        // Main Project Title Text
        {
          createShape: {
            objectId: 'slide1_title',
            shapeType: 'TEXT_BOX',
            elementProperties: {
              pageId: defaultSlideId,
              size: { width: { magnitude: 620, unit: 'PT' }, height: { magnitude: 150, unit: 'PT' } },
              transform: { scaleX: 1, scaleY: 1, translateX: 50, translateY: 90, unit: 'PT' }
            }
          }
        },
        {
          insertText: {
            objectId: 'slide1_title',
            text: projectTitle.toUpperCase()
          }
        },
        {
          updateTextStyle: {
            objectId: 'slide1_title',
            textRange: { type: 'ALL' },
            style: {
              fontFamily: 'Georgia',
              fontSize: { magnitude: 42, unit: 'PT' },
              bold: true,
              foregroundColor: { solidColor: { rgbColor: { red: 0, green: 0, blue: 0 } } }
            },
            fields: 'fontFamily,fontSize,bold,foregroundColor'
          }
        },
        // Author details
        {
          createShape: {
            objectId: 'slide1_author',
            shapeType: 'TEXT_BOX',
            elementProperties: {
              pageId: defaultSlideId,
              size: { width: { magnitude: 620, unit: 'PT' }, height: { magnitude: 80, unit: 'PT' } },
              transform: { scaleX: 1, scaleY: 1, translateX: 50, translateY: 260, unit: 'PT' }
            }
          }
        },
        {
          insertText: {
            objectId: 'slide1_author',
            text: `Dipersiapkan untuk: ${creatorName}\nRencana perlengkapan & pasca-produksi premium.`
          }
        },
        {
          updateTextStyle: {
            objectId: 'slide1_author',
            textRange: { type: 'ALL' },
            style: {
              fontFamily: 'Arial',
              fontSize: { magnitude: 13, unit: 'PT' },
              bold: false,
              foregroundColor: { solidColor: { rgbColor: { red: 0.3, green: 0.3, blue: 0.3 } } }
            },
            fields: 'fontFamily,fontSize,bold,foregroundColor'
          }
        },

        // --- SLIDE 2: GEAR SPECIFICATION ---
        {
          createSlide: {
            objectId: 'slide_gear_spec',
            insertionIndex: 1,
            slideLayoutReference: { predefinedLayout: 'BLANK' }
          }
        },
        // Add decorative edge bar
        {
          createShape: {
            objectId: 'slide2_bar',
            shapeType: 'RECTANGLE',
            elementProperties: {
              pageId: 'slide_gear_spec',
              size: { width: { magnitude: 4, unit: 'PT' }, height: { magnitude: 405, unit: 'PT' } },
              transform: { scaleX: 1, scaleY: 1, translateX: 0, translateY: 0, unit: 'PT' }
            }
          }
        },
        {
          updateShapeProperties: {
            objectId: 'slide2_bar',
            shapeProperties: {
              shapeBackgroundFill: { solidFill: { color: { rgbColor: { red: 0.1, green: 0.1, blue: 0.1 } } } },
              outline: { propertyState: 'NOT_RENDERED' }
            },
            fields: 'shapeBackgroundFill.solidFill.color,outline'
          }
        },
        // Slide 2 Header
        {
          createShape: {
            objectId: 'slide2_header',
            shapeType: 'TEXT_BOX',
            elementProperties: {
              pageId: 'slide_gear_spec',
              size: { width: { magnitude: 600, unit: 'PT' }, height: { magnitude: 50, unit: 'PT' } },
              transform: { scaleX: 1, scaleY: 1, translateX: 50, translateY: 40, unit: 'PT' }
            }
          }
        },
        {
          insertText: {
            objectId: 'slide2_header',
            text: 'I. SPESIFIKASI DAFTAR GEAR'
          }
        },
        {
          updateTextStyle: {
            objectId: 'slide2_header',
            textRange: { type: 'ALL' },
            style: {
              fontFamily: 'Georgia',
              fontSize: { magnitude: 22, unit: 'PT' },
              bold: true,
              foregroundColor: { solidColor: { rgbColor: { red: 0, green: 0, blue: 0 } } }
            },
            fields: 'fontFamily,fontSize,bold,foregroundColor'
          }
        },
        // Slide 2 Body Content
        {
          createShape: {
            objectId: 'slide2_body',
            shapeType: 'TEXT_BOX',
            elementProperties: {
              pageId: 'slide_gear_spec',
              size: { width: { magnitude: 620, unit: 'PT' }, height: { magnitude: 240, unit: 'PT' } },
              transform: { scaleX: 1, scaleY: 1, translateX: 50, translateY: 110, unit: 'PT' }
            }
          }
        },
        {
          insertText: {
            objectId: 'slide2_body',
            text: `Berikut adalah rincian fungsionalitas unit kamera dan smartphone mewah yang telah diajukan untuk mendukung proyek Anda:\n\n${gearText}`
          }
        },
        {
          updateTextStyle: {
            objectId: 'slide2_body',
            textRange: { type: 'ALL' },
            style: {
              fontFamily: 'Arial',
              fontSize: { magnitude: 12, unit: 'PT' },
              foregroundColor: { solidColor: { rgbColor: { red: 0.15, green: 0.15, blue: 0.15 } } }
            },
            fields: 'fontFamily,fontSize,foregroundColor'
          }
        },

        // --- SLIDE 3: EDITING SERVICES ---
        {
          createSlide: {
            objectId: 'slide_edit_spec',
            insertionIndex: 2,
            slideLayoutReference: { predefinedLayout: 'BLANK' }
          }
        },
        // Slide 3 Header
        {
          createShape: {
            objectId: 'slide3_header',
            shapeType: 'TEXT_BOX',
            elementProperties: {
              pageId: 'slide_edit_spec',
              size: { width: { magnitude: 600, unit: 'PT' }, height: { magnitude: 50, unit: 'PT' } },
              transform: { scaleX: 1, scaleY: 1, translateX: 50, translateY: 40, unit: 'PT' }
            }
          }
        },
        {
          insertText: {
            objectId: 'slide3_header',
            text: 'II. LAYANAN PASCA-PRODUKSI'
          }
        },
        {
          updateTextStyle: {
            objectId: 'slide3_header',
            textRange: { type: 'ALL' },
            style: {
              fontFamily: 'Georgia',
              fontSize: { magnitude: 22, unit: 'PT' },
              bold: true,
              foregroundColor: { solidColor: { rgbColor: { red: 0, green: 0, blue: 0 } } }
            },
            fields: 'fontFamily,fontSize,bold,foregroundColor'
          }
        },
        // Slide 3 Body Content
        {
          createShape: {
            objectId: 'slide3_body',
            shapeType: 'TEXT_BOX',
            elementProperties: {
              pageId: 'slide_edit_spec',
              size: { width: { magnitude: 620, unit: 'PT' }, height: { magnitude: 240, unit: 'PT' } },
              transform: { scaleX: 1, scaleY: 1, translateX: 50, translateY: 110, unit: 'PT' }
            }
          }
        },
        {
          insertText: {
            objectId: 'slide3_body',
            text: `Guna menambah nilai konseptual visual, rincian pasca-produksi editing di bawah ini disertakan sebagai satu kesatuan paket artistik Anda:\n\n${serviceText}`
          }
        },
        {
          updateTextStyle: {
            objectId: 'slide3_body',
            textRange: { type: 'ALL' },
            style: {
              fontFamily: 'Arial',
              fontSize: { magnitude: 12, unit: 'PT' },
              foregroundColor: { solidColor: { rgbColor: { red: 0.15, green: 0.15, blue: 0.15 } } }
            },
            fields: 'fontFamily,fontSize,foregroundColor'
          }
        },

        // --- SLIDE 4: BUDGET & COST ESTIMATIONS ---
        {
          createSlide: {
            objectId: 'slide_cost_spec',
            insertionIndex: 3,
            slideLayoutReference: { predefinedLayout: 'BLANK' }
          }
        },
        // Slide 4 Header
        {
          createShape: {
            objectId: 'slide4_header',
            shapeType: 'TEXT_BOX',
            elementProperties: {
              pageId: 'slide_cost_spec',
              size: { width: { magnitude: 600, unit: 'PT' }, height: { magnitude: 50, unit: 'PT' } },
              transform: { scaleX: 1, scaleY: 1, translateX: 50, translateY: 40, unit: 'PT' }
            }
          }
        },
        {
          insertText: {
            objectId: 'slide4_header',
            text: 'III. RINCIAN BIAYA & CATATAN TEKNIS'
          }
        },
        {
          updateTextStyle: {
            objectId: 'slide4_header',
            textRange: { type: 'ALL' },
            style: {
              fontFamily: 'Georgia',
              fontSize: { magnitude: 22, unit: 'PT' },
              bold: true,
              foregroundColor: { solidColor: { rgbColor: { red: 0, green: 0, blue: 0 } } }
            },
            fields: 'fontFamily,fontSize,bold,foregroundColor'
          }
        },
        // Cost Box Card Area
        {
          createShape: {
            objectId: 'cost_card',
            shapeType: 'ROUNDED_RECTANGLE',
            elementProperties: {
              pageId: 'slide_cost_spec',
              size: { width: { magnitude: 300, unit: 'PT' }, height: { magnitude: 120, unit: 'PT' } },
              transform: { scaleX: 1, scaleY: 1, translateX: 50, translateY: 110, unit: 'PT' }
            }
          }
        },
        {
          updateShapeProperties: {
            objectId: 'cost_card',
            shapeProperties: {
              shapeBackgroundFill: { solidFill: { color: { rgbColor: { red: 0.96, green: 0.96, blue: 0.96 } } } },
              outline: {
                dashStyle: 'SOLID',
                weight: { magnitude: 1, unit: 'PT' },
                outlineFill: { solidFill: { color: { rgbColor: { red: 0.85, green: 0.85, blue: 0.85 } } } }
              }
            },
            fields: 'shapeBackgroundFill.solidFill.color,outline'
          }
        },
        // Text inside Cost card
        {
          createShape: {
            objectId: 'cost_card_text',
            shapeType: 'TEXT_BOX',
            elementProperties: {
              pageId: 'slide_cost_spec',
              size: { width: { magnitude: 280, unit: 'PT' }, height: { magnitude: 100, unit: 'PT' } },
              transform: { scaleX: 1, scaleY: 1, translateX: 60, translateY: 120, unit: 'PT' }
            }
          }
        },
        {
          insertText: {
            objectId: 'cost_card_text',
            text: `ESTIMASI INVESTASI PRODUKSI\n\nRp ${totalFormat}\n(Layanan Alat Harian & Editing)`
          }
        },
        {
          updateTextStyle: {
            objectId: 'cost_card_text',
            textRange: { type: 'ALL' },
            style: {
              fontFamily: 'Arial',
              fontSize: { magnitude: 11, unit: 'PT' },
              bold: false,
              foregroundColor: { solidColor: { rgbColor: { red: 0.4, green: 0.4, blue: 0.4 } } }
            },
            fields: 'fontFamily,fontSize,bold,foregroundColor'
          }
        },
        // Notes Section right side of Card
        {
          createShape: {
            objectId: 'slide4_notes',
            shapeType: 'TEXT_BOX',
            elementProperties: {
              pageId: 'slide_cost_spec',
              size: { width: { magnitude: 280, unit: 'PT' }, height: { magnitude: 150, unit: 'PT' } },
              transform: { scaleX: 1, scaleY: 1, translateX: 390, translateY: 110, unit: 'PT' }
            }
          }
        },
        {
          insertText: {
            objectId: 'slide4_notes',
            text: `CATATAN SYARAT & KETENTUAN:\n\n• ${customNotes}\n• Unit disewa dengan jaminan identitas valid.\n• Pembayaran lunas di awal sebelum serah-terima alat.`
          }
        },
        {
          updateTextStyle: {
            objectId: 'slide4_notes',
            textRange: { type: 'ALL' },
            style: {
              fontFamily: 'Arial',
              fontSize: { magnitude: 10, unit: 'PT' },
              foregroundColor: { solidColor: { rgbColor: { red: 0.3, green: 0.3, blue: 0.3 } } }
            },
            fields: 'fontFamily,fontSize,foregroundColor'
          }
        },
        // Brand Stamp Footer
        {
          createShape: {
            objectId: 'slide4_footer_stamp',
            shapeType: 'TEXT_BOX',
            elementProperties: {
              pageId: 'slide_cost_spec',
              size: { width: { magnitude: 620, unit: 'PT' }, height: { magnitude: 30, unit: 'PT' } },
              transform: { scaleX: 1, scaleY: 1, translateX: 50, translateY: 330, unit: 'PT' }
            }
          }
        },
        {
          insertText: {
            objectId: 'slide4_footer_stamp',
            text: 'SEVALENS INDONESIA • LAYANAN INTEGRATIF UTAMA'
          }
        },
        {
          updateTextStyle: {
            objectId: 'slide4_footer_stamp',
            textRange: { type: 'ALL' },
            style: {
              fontFamily: 'Courier New',
              fontSize: { magnitude: 9, unit: 'PT' },
              bold: true,
              foregroundColor: { solidColor: { rgbColor: { red: 0.6, green: 0.6, blue: 0.6 } } }
            },
            fields: 'fontFamily,fontSize,bold,foregroundColor'
          }
        },
      ];

      setGenerationStep('Menyusun lembaran slide dengan layout formal...');

      // Execute batchUpdate on the presentation
      const updateResponse = await fetch(`https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ requests })
      });

      if (!updateResponse.ok) {
        const errDetails = await updateResponse.json();
        console.error('Batch Update error details:', errDetails);
        throw new Error('Gagal memformat slide presentasi ke dalam skema monokrom.');
      }

      setGenerationStep('Menyelaraskan struktur visual & tipografi...');
      await new Promise(resolve => setTimeout(resolve, 800));

      setCreatedPresentation({
        id: presentationId,
        url: `https://docs.google.com/presentation/d/${presentationId}/edit`
      });
      setIsGenerating(false);

    } catch (err: any) {
      console.error('API Error generating slides:', err);
      setAuthError(err.message || 'Gagal memproses pembuatan presentasi.');
      setIsGenerating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white min-h-screen pt-28 pb-24"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 border-b border-zinc-100 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-zinc-400 mb-2">
              <Sparkles className="w-4.5 h-4.5 text-zinc-950" />
              <span>SewaLens Creative Studio</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-display font-black uppercase tracking-tighter leading-none">
              Slide Studio
            </h1>
            <p className="text-zinc-500 mt-2 text-sm font-medium max-w-xl">
              Hubungkan Google Slides Anda. Buat proposal pengajuan gear rental & editing kelas profesional secara instan dengan desain monokrom elegan.
            </p>
          </div>

          {/* User Sign-In Banner right aligned */}
          <div className="flex items-center gap-4">
            {token && userProfile ? (
              <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-200 py-2.5 px-4 rounded-2xl">
                {userProfile.picture ? (
                  <img src={userProfile.picture} alt={userProfile.name} className="w-8 h-8 rounded-full border border-black/10" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs uppercase">
                    {userProfile.name.charAt(0)}
                  </div>
                )}
                <div className="text-left">
                  <p className="text-xs font-bold leading-none text-zinc-900">{userProfile.name}</p>
                  <p className="text-[10px] text-zinc-400 font-medium">{userProfile.email}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  title="Putuskan Akun" 
                  className="p-1.5 hover:bg-zinc-200 rounded-lg text-zinc-500 hover:text-black transition-colors ml-2"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={triggerGoogleLogin}
                disabled={isAuthenticating}
                className="gsi-material-button font-bold text-xs"
                style={{ cursor: 'pointer' }}
              >
                <div className="gsi-material-button-state"></div>
                <div className="gsi-material-button-content-wrapper shadow-xl border border-zinc-200 rounded-2xl py-3 px-5 bg-white text-black hover:bg-zinc-50 transition-colors flex items-center gap-3">
                  <div className="gsi-material-button-icon">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: "block", width: "16px", height: "16px" }}>
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    </svg>
                  </div>
                  <span className="gsi-material-button-contents uppercase tracking-widest text-[10px]">Hubungkan Google Slides</span>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Auth status feedback */}
        {authError && (
          <div className="mb-8 p-4 bg-zinc-50 border border-zinc-200 text-zinc-800 rounded-2xl flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 text-black shrink-0" />
            <p className="font-bold">{authError}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* LEFT FORM COLUMN */}
          <div className="lg:col-span-5 space-y-8">
            {/* Input Texts */}
            <div className="bg-zinc-50 rounded-[2rem] border border-zinc-200 p-8 space-y-6">
              <h2 className="text-xl font-bold uppercase tracking-tight text-black border-b border-zinc-200 pb-4">
                1. Detail Project
              </h2>
              
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Judul Presentasi / Klien</label>
                <input 
                  type="text" 
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="bg-white border border-zinc-200 rounded-xl py-3.5 px-4 text-sm font-bold focus:border-black outline-none tracking-tight text-zinc-900 shadow-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Tim Kreatif / Penulis</label>
                <input 
                  type="text" 
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  className="bg-white border border-zinc-200 rounded-xl py-3.5 px-4 text-sm font-bold focus:border-black outline-none tracking-tight text-zinc-900 shadow-sm"
                />
              </div>
            </div>

            {/* Gear Multi-Select */}
            <div className="bg-zinc-50 rounded-[2rem] border border-zinc-200 p-8 space-y-6">
              <h2 className="text-xl font-bold uppercase tracking-tight text-black border-b border-zinc-200 pb-4">
                2. Pilih Unit Sewa
              </h2>
              
              <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-2">Seluruh Gadget (iPhone & Kamera)</p>
                
                {/* iPhones list */}
                {IPHONE_MODELS.map(phone => {
                  const isChecked = selectedGears.some(g => g.id === phone.id);
                  return (
                    <div 
                      key={phone.id}
                      onClick={() => toggleGear(phone.id, phone.name, phone.pricePerDay, 'phone', `${phone.specs.camera}, ${phone.specs.display}`)}
                      className={`flex items-center justify-between border p-4 rounded-2xl cursor-pointer transition-all ${
                        isChecked 
                          ? 'bg-black border-black text-white shadow-lg' 
                          : 'bg-white border-zinc-200 text-zinc-800 hover:border-zinc-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 shrink-0" />
                        <div>
                          <p className={`text-xs font-bold ${isChecked ? 'text-white' : 'text-zinc-900'}`}>{phone.name}</p>
                          <p className={`text-[9px] ${isChecked ? 'text-zinc-400' : 'text-zinc-500'}`}>{phone.specs.chip}</p>
                        </div>
                      </div>
                      <p className="text-xs font-black uppercase tracking-tight shrink-0">
                        Rp {new Intl.NumberFormat('id-ID').format(phone.pricePerDay)}/hr
                      </p>
                    </div>
                  );
                })}

                {/* Cameras list */}
                {CAMERA_MODELS.map(cam => {
                  const isChecked = selectedGears.some(g => g.id === cam.id);
                  return (
                    <div 
                      key={cam.id}
                      onClick={() => toggleGear(cam.id, cam.name, cam.pricePerDay, 'camera', `${cam.specs.sensor}, ${cam.specs.video}`)}
                      className={`flex items-center justify-between border p-4 rounded-2xl cursor-pointer transition-all ${
                        isChecked 
                          ? 'bg-black border-black text-white shadow-lg' 
                          : 'bg-white border-zinc-200 text-zinc-800 hover:border-zinc-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Camera className="w-5 h-5 shrink-0" />
                        <div>
                          <p className={`text-xs font-bold ${isChecked ? 'text-white' : 'text-zinc-900'}`}>{cam.name}</p>
                          <p className={`text-[9px] ${isChecked ? 'text-zinc-400' : 'text-zinc-500'}`}>{cam.specs.sensor}</p>
                        </div>
                      </div>
                      <p className="text-xs font-black uppercase tracking-tight shrink-0">
                        Rp {new Intl.NumberFormat('id-ID').format(cam.pricePerDay)}/hr
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Editing Services Selector */}
            <div className="bg-zinc-50 rounded-[2rem] border border-zinc-200 p-8 space-y-6">
              <h2 className="text-xl font-bold uppercase tracking-tight text-black border-b border-zinc-200 pb-4">
                3. Jasa Post-Production
              </h2>
              <div className="space-y-3">
                {EDITING_SERVICES.map(s => {
                  const isChecked = selectedServices.includes(s.title);
                  return (
                    <div 
                      key={s.title}
                      onClick={() => toggleService(s.title)}
                      className={`flex items-start justify-between border p-4 rounded-2xl cursor-pointer transition-all ${
                        isChecked 
                          ? 'border-black bg-zinc-950 text-white shadow-lg' 
                          : 'bg-white border-zinc-200 text-zinc-800 hover:border-zinc-400'
                      }`}
                    >
                      <div className="pr-4">
                        <p className={`text-xs font-bold ${isChecked ? 'text-white' : 'text-zinc-900'}`}>{s.title}</p>
                        <p className={`text-[10px] mt-1 pr-2 ${isChecked ? 'text-zinc-400' : 'text-zinc-500'}`}>{s.description}</p>
                      </div>
                      <p className="text-xs font-black uppercase shrink-0">
                        Rp {s.price}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom note & Generate */}
            <div className="bg-zinc-50 rounded-[2rem] border border-zinc-200 p-8 space-y-6">
              <h2 className="text-xl font-bold uppercase tracking-tight text-black border-b border-zinc-200 pb-4">
                4. Ketentuan Kustom
              </h2>
              <div className="flex flex-col gap-2">
                <textarea 
                  rows={3}
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  className="bg-white border border-zinc-200 rounded-2xl py-3.5 px-4 text-xs font-medium focus:border-black outline-none leading-relaxed tracking-tight text-zinc-800 shadow-sm resize-none"
                />
              </div>

              <div className="pt-4 border-t border-zinc-200 flex flex-col gap-4">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Biaya Diajukan /hari</p>
                  <p className="text-2xl font-display font-black text-black">
                    Rp {new Intl.NumberFormat('id-ID').format(getTotalEstimation())}
                  </p>
                </div>

                {isGenerating ? (
                  <div className="bg-black text-white p-5 rounded-2xl flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                    <p className="text-xs font-bold uppercase tracking-widest animate-pulse text-center">
                      {generationStep}
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleSlidesGeneration}
                    className="w-full bg-black text-white hover:bg-zinc-900 py-5 rounded-2xl font-black uppercase tracking-widest text-xs tracking-[0.2em] transition-all flex items-center justify-center gap-2.5 active:scale-95 shadow-xl"
                  >
                    <Send className="w-4 h-4" />
                    <span>{!GOOGLE_CLIENT_ID ? 'Jalankan Demo Slide Studio' : 'Build Google Slides'}</span>
                  </button>
                )}

                {!GOOGLE_CLIENT_ID && (
                  <span className="text-[10px] leading-relaxed text-zinc-400 font-medium block text-center italic-none">
                    * Google Client ID belum diisi di .env. Aplikasi otomatis berjalan dalam mode sandbox interaktif instan.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT LIVE WORKSPACE PREVIEW COLUMN */}
          <div className="lg:col-span-7 lg:sticky lg:top-28 space-y-8">
            <div className="bg-zinc-50 rounded-[2.5rem] border border-zinc-200 p-8 md:p-12 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-tight text-black">
                    Live Slide Presenter
                  </h3>
                  <p className="text-xs text-zinc-400 font-medium mt-1">Simulasi lembar presentasi Google Slides Anda.</p>
                </div>
                {/* Dots indicator */}
                <div className="flex gap-1.5 bg-zinc-200/50 p-2 rounded-xl">
                  {[0, 1, 2, 3].map((idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={`h-2.5 rounded-full transition-all ${activeSlide === idx ? 'w-6 bg-black' : 'w-2.5 bg-zinc-300'}`}
                    />
                  ))}
                </div>
              </div>

              {/* SLIDE CANVAS DISPLAY ZONE */}
              <div className="relative aspect-[16/9] w-full bg-white border border-zinc-200 rounded-3xl shadow-xl overflow-hidden flex flex-col justify-between p-10 group">
                {/* Thin top black bar on default slide or customized layout line */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-black" />

                {/* SLIDE 0: TITLE SLIDE HEADER */}
                {activeSlide === 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col justify-between py-2"
                  >
                    <div>
                      <p className="font-mono text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                        SEVALENS STUDIOS • PROPOSAL TEKNIS
                      </p>
                      <h2 className="text-3xl md:text-5xl font-display font-black text-black leading-none mt-6 uppercase tracking-tight">
                        {projectTitle || "NAMA PROJECT PERALATAN"}
                      </h2>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400 font-mono uppercase tracking-widest leading-relaxed">
                        Dipersiapkan untuk: <span className="text-black font-bold font-sans">{creatorName || "Tim Produksi"}</span>
                      </p>
                      <p className="text-[10px] text-zinc-400 italic mt-1">Desain Template: Minimalis Monokrom 16:9 • Didukung oleh SewaLens</p>
                    </div>
                  </motion.div>
                )}

                {/* SLIDE 1: EQUIPMENTS */}
                {activeSlide === 1 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col justify-between py-2"
                  >
                    <div>
                      <p className="font-mono text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-4 border-b border-zinc-250 pb-2">
                        I. SPESIFIKASI DAFTAR GEAR
                      </p>
                      <p className="text-[11px] text-zinc-600 mb-4 leading-relaxed font-medium">
                        Berikut rincian spesifikasi unit kamera dan smartphone mewah yang diajukan untuk kelancaran proyek Anda:
                      </p>
                      
                      <div className="space-y-2 max-h-36 overflow-y-auto pr-2 scrollbar-none font-mono text-[10px]/[1.5]">
                        {selectedGears.length > 0 ? (
                          selectedGears.map(gear => (
                            <div key={gear.id} className="flex justify-between items-center bg-zinc-50 border border-zinc-150 p-2.5 rounded-xl">
                              <span className="text-black font-bold uppercase tracking-tight">{gear.name}</span>
                              <span className="text-zinc-500 uppercase font-medium">{gear.specs.split(',')[0]}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-zinc-400 italic">Belum ada unit gear terpilih. Silakan centang formulir rincian sewa.</p>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-[8px] font-mono font-bold tracking-widest text-zinc-400 uppercase">
                      <span>Slide 2 dari 4</span>
                      <span>Est. Gear: Rp {new Intl.NumberFormat('id-ID').format(getGearsTotal())}/hr</span>
                    </div>
                  </motion.div>
                )}

                {/* SLIDE 2: EDITING */}
                {activeSlide === 2 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col justify-between py-2"
                  >
                    <div>
                      <p className="font-mono text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-4 border-b border-zinc-250 pb-2">
                        II. LAYANAN PASCA-PRODUKSI & EDITING
                      </p>
                      <p className="text-[11px] text-zinc-600 mb-4 leading-relaxed font-medium">
                        Layanan tambahan dari tim studio kreatif untuk memaksimalkan estafet kualitas visual yang profesional:
                      </p>
                      
                      <div className="space-y-2 max-h-36 overflow-y-auto pr-2 font-mono text-[10px]/[1.5]">
                        {selectedServices.length > 0 ? (
                          EDITING_SERVICES.filter(s => selectedServices.includes(s.title))
                            .map(s => (
                              <div key={s.title} className="flex justify-between items-start bg-zinc-50 border border-zinc-150 p-2.5 rounded-xl">
                                <span className="text-black font-bold uppercase tracking-tight">{s.title}</span>
                                <span className="text-zinc-500 uppercase">Rp {s.price}</span>
                              </div>
                            ))
                        ) : (
                          <p className="text-zinc-400 italic">Belum ada paket editing yang diajukan dalam deck proposal.</p>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-[8px] font-mono font-bold tracking-widest text-zinc-400 uppercase">
                      <span>Slide 3 dari 4</span>
                      <span>Post-Pro Jasa: Rp {new Intl.NumberFormat('id-ID').format(getServicesTotal())}</span>
                    </div>
                  </motion.div>
                )}

                {/* SLIDE 3: COST SUMMARY */}
                {activeSlide === 3 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col justify-between py-2"
                  >
                    <div>
                      <p className="font-mono text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-4 border-b border-zinc-250 pb-2">
                        III. ESTIMASI BIAYA & CATATAN TEKNIS
                      </p>
                      
                      <div className="grid grid-cols-12 gap-8 items-start mt-2">
                        {/* Summary total */}
                        <div className="col-span-6 bg-zinc-50 border border-zinc-200 rounded-2xl p-4 flex flex-col justify-center">
                          <p className="font-mono text-[8px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-2">Total Investasi</p>
                          <p className="text-2xl font-display font-black text-black">
                            Rp {new Intl.NumberFormat('id-ID').format(getTotalEstimation())}
                          </p>
                          <p className="text-[7.5px] font-mono text-zinc-400 mt-1 uppercase">Harga Bersih Sewa & Custom Post-Pro</p>
                        </div>

                        {/* Summary terms */}
                        <div className="col-span-6">
                          <p className="font-mono text-[8px] font-black tracking-widest text-zinc-950 uppercase mb-2">Catatan Proyek:</p>
                          <p className="text-[9px] text-zinc-500 leading-relaxed font-sans line-clamp-3">
                            {customNotes || "Amanat sewa sesuai syarat reguler SewaLens."}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-[8px] font-mono font-bold tracking-widest text-zinc-450 uppercase border-t border-zinc-100 pt-2">
                      <span>Slide 4 dari 4</span>
                      <span>SEVALENS INDONESIA • ALL RIGHTS RESERVED</span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Slider Button Controllers */}
              <div className="flex items-center justify-between gap-4 pt-4 border-t border-zinc-200">
                <button
                  disabled={activeSlide === 0}
                  onClick={() => setActiveSlide(prev => Math.max(0, prev - 1))}
                  className="bg-white hover:bg-zinc-100 border border-zinc-200 p-3 rounded-2xl text-black hover:scale-105 active:scale-95 disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <p className="text-[10px] font-mono font-black uppercase tracking-widest text-zinc-400">
                  Slide {activeSlide + 1} / 4
                </p>
                <button
                  disabled={activeSlide === 3}
                  onClick={() => setActiveSlide(prev => Math.min(3, prev + 1))}
                  className="bg-white hover:bg-zinc-100 border border-zinc-200 p-3 rounded-2xl text-black hover:scale-105 active:scale-95 disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PRE-BUILT SLIDESHOW SUCCESS CARD MODAL */}
            <AnimatePresence>
              {createdPresentation && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  className="bg-zinc-950 p-8 rounded-[2.5rem] text-white border border-zinc-800 shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 translate-x-12 -translate-y-12 w-48 h-48 bg-zinc-900 rounded-full blur-3xl opacity-50" />
                  
                  <div className="flex items-center gap-3.5 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-black shrink-0 relative">
                      <CheckCircle2 className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Google API Status: Selesai</span>
                      <h4 className="text-white text-lg font-bold tracking-tight uppercase leading-none">Presentasi Created!</h4>
                    </div>
                  </div>

                  <p className="text-zinc-400 text-xs leading-relaxed mb-8">
                    Proposal proposal estimasi sewa dan portofolio pasca-produksi untuk tim <span className="text-white font-bold">{creatorName}</span> telah sukses dideploy ke Google Slides Anda. Seluruh slide terformat secara rapi, elegan, dan monokromatik.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <a 
                      href={createdPresentation.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2.5 bg-white text-black hover:bg-zinc-100 py-4 px-8 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl active:scale-95"
                    >
                      <span>Buka Google Slides</span>
                      <ExternalLink className="w-4 h-4 text-black" />
                    </a>
                    <button 
                      onClick={() => setCreatedPresentation(null)}
                      className="bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 py-4 px-6 rounded-2xl text-xs font-bold uppercase transition-all"
                    >
                      Tutup Notifikasi
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SlideStudio;
