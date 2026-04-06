/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  X, 
  ArrowRight, 
  Scissors, 
  Shirt, 
  Sparkles, 
  MapPin, 
  Phone, 
  Instagram, 
  Facebook,
  ChevronRight,
  ShoppingBag
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini for image generation
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const IMAGES = [
  {
    id: 'hero',
    prompt: 'A high-end, cinematic fashion shot of a woman in a premium, elegant Moroccan modest dress (hijab fashion), standing in a beautiful riad courtyard with soft sunlight. The dress is made of flowing silk, minimalist and modern yet traditional. High-fashion photography, 8k resolution.',
    fallback: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1920'
  },
  {
    id: 'product',
    prompt: 'A close-up of a luxury silk hijab with intricate embroidery, draped elegantly on a minimalist stand. Soft natural light, premium aesthetic, neutral colors, 8k resolution.',
    fallback: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'atelier',
    prompt: 'A premium fashion atelier in Morocco, with rolls of high-quality fabrics, a vintage sewing machine, and a mood board with sketches of modest dresses. Warm, creative atmosphere, 8k resolution.',
    fallback: 'https://images.unsplash.com/photo-1558603668-6570496b66f8?auto=format&fit=crop&q=80&w=800'
  }
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('FR');
  const [generatedImages, setGeneratedImages] = useState<Record<string, string>>({});

  const handleScroll = () => setScrolled(window.scrollY > 50);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    // Generate images on load
    const generateAllImages = async () => {
      const newImages: Record<string, string> = {};
      for (const img of IMAGES) {
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: img.prompt }] },
          });
          
          for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
              newImages[img.id] = `data:image/png;base64,${part.inlineData.data}`;
              break;
            }
          }
        } catch (error) {
          console.error(`Failed to generate image ${img.id}:`, error);
          newImages[img.id] = img.fallback;
        }
      }
      setGeneratedImages(newImages);
    };

    generateAllImages();
  }, []);

  const navItems = ['Philosophy', 'Collections', 'The Atelier', 'Contact'];
  const languages = [
    { code: 'FR', flag: '🇫🇷', label: 'Français' },
    { code: 'EN', flag: '🇬🇧', label: 'English' },
    { code: 'AR', flag: '🇸🇦', label: 'العربية' },
    { code: 'ES', flag: '🇪🇸', label: 'Español' },
  ];

  return (
    <div className="min-h-screen selection:bg-gold selection:text-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-paper/95 backdrop-blur-md py-4 shadow-sm' : 'bg-paper/40 backdrop-blur-sm py-8'}`}>
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center relative">
          <div className="flex items-center gap-4 md:gap-12 text-ink">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="group flex items-center gap-2 md:gap-3 text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium"
            >
              <Menu className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:scale-110" />
            </button>
            <div className="hidden lg:flex gap-8">
              {navItems.slice(0, 3).map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-xs uppercase tracking-[0.2em] font-medium hover:text-gold transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center text-center text-ink pointer-events-none">
            <div className="relative">
              <h1 className="text-3xl md:text-[2.35rem] lg:text-[2.6rem] font-serif tracking-tight leading-none">
                LAMSA
              </h1>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 md:w-20 h-1 bg-gradient-to-r from-transparent via-[#b9b3a5] to-transparent"></div>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-8 text-ink">
            <div className="hidden lg:flex gap-8">
              {navItems.slice(3).map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-xs uppercase tracking-[0.2em] font-medium hover:text-gold transition-colors">
                  {item}
                </a>
              ))}
            </div>
            <button className="bg-ink text-paper px-4 md:px-6 py-2 md:py-2.5 rounded-full text-[10px] md:text-xs uppercase tracking-widest font-semibold transition-colors hover:bg-[#b9b3a5] hover:text-ink active:bg-[#b9b3a5] active:text-ink">
              Shop
            </button>
          </div>
        </div>
      </nav>

      {/* Fullscreen Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[60] bg-paper flex flex-col overflow-y-auto"
          >
            <div className="p-8 flex justify-between items-center text-ink">
              <h1 className="text-3xl font-serif">LAMSA</h1>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-ink/5 rounded-full transition-colors">
                <X className="w-8 h-8" />
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-center items-center gap-6">
              {navItems.map((item, i) => (
                <motion.a
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-3xl md:text-4xl font-serif hover:italic hover:text-gold transition-all duration-500 text-ink"
                >
                  {item}
                </motion.a>
              ))}
            </div>
            <div className="mt-16 border-t border-ink/10 px-8 py-8">
              <div className="mx-auto max-w-xl text-center">
                <span className="text-[10px] uppercase tracking-[0.6em] text-ink/60">
                  SÉLECTIONNER LA LANGUE
                </span>
                <div className="mt-6 flex items-center justify-center gap-4">
                  {languages.map(({ code, flag }) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setSelectedLanguage(code)}
                      className={`flex flex-col items-center justify-center gap-2 px-2 py-2 transition-all duration-300 ${selectedLanguage === code ? 'text-ink' : 'text-ink/70 hover:text-[#a09687]'}`}
                    >
                      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-paper shadow-sm text-2xl transition-colors duration-300 ${selectedLanguage === code ? '' : 'hover:bg-[#a09687]/10'}">
                        {flag}
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.4em] opacity-90">
                        {code}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
            src="/images/products/photo_elegante.png"
            alt="Luxury Modest Fashion"
            className="w-full h-full object-cover object-[center_18%] md:object-center brightness-[0.88] scale-[1.03] md:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-paper/80 via-transparent to-paper"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center text-ink">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <span className="text-[10px] md:text-[11px] uppercase tracking-[0.45em] mb-4 md:mb-5 block font-medium opacity-70">
              Creativity in Every Stitch
            </span>
            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[8.5rem] font-serif leading-[0.9] mb-6 md:mb-8">
              Timeless <br />
              <span className="italic">Elegance</span>
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 mt-8 md:mt-12">
              <button className="w-full md:w-auto group flex items-center justify-center gap-4 bg-ink text-paper px-6 md:px-10 py-4 md:py-5 rounded-full text-xs md:text-sm uppercase tracking-widest font-bold transition-all duration-500 shadow-xl hover:bg-[#b9b3a5] hover:text-ink active:bg-[#b9b3a5] active:text-ink focus-visible:bg-[#b9b3a5] focus-visible:text-ink">
                Explore Collections
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform" />
              </button>
              <p className="max-w-md sm:max-w-sm text-center md:text-left text-sm md:text-base leading-relaxed opacity-70 md:border-l border-ink/20 md:pl-6">
                Redefining modest fashion through the lens of Moroccan heritage and contemporary design.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Vertical Rail Text */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:block">
          <p className="vertical-text text-[10px] uppercase tracking-[0.8em] opacity-40 font-bold">
            MODESTY IN EVERY LINE • TRADITION IN EVERY FABRIC
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" className="py-20 md:py-32 bg-paper relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-24 items-center">
            <div className="relative px-4 md:px-0">
              <div className="oval-mask aspect-[4/5] overflow-hidden bg-ink/5 max-w-md mx-auto lg:max-w-none">
                <motion.img 
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 1.5 }}
                  src="/images/products/tissue.jpg"
                  alt="Lamsa Couture"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-12 -right-12 w-48 md:w-64 h-48 md:h-64 bg-gold/10 rounded-full blur-3xl -z-10"></div>
            </div>

            <div className="space-y-8 md:space-y-12 text-center lg:text-left">
              <div className="space-y-4">
                <span className="text-[#b9b3a5] text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold">Our Philosophy</span>
                <h3 className="text-4xl md:text-6xl font-serif leading-tight">
                  The Art of <br />
                  <span className="italic">Modesty</span>
                </h3>
              </div>
              
              <p className="text-base md:text-lg leading-relaxed text-ink/70 font-light max-w-xl mx-auto lg:mx-0">
                At LAMSA, we believe that modesty is the ultimate form of sophistication. Our collections are a tribute to the modern woman who seeks elegance without compromise, blending ethereal fabrics with structured silhouettes.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 md:pt-8">
                <div className="space-y-4 flex flex-col items-center lg:items-start">
                  <div className="w-12 h-12 rounded-full bg-[#b9b3a5]/10 flex items-center justify-center text-[#b9b3a5]">
                    <Scissors className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-xl">Hand-Stitched</h4>
                  <p className="text-sm text-ink/60">Every piece is meticulously crafted by our master artisans.</p>
                </div>
                <div className="space-y-4 flex flex-col items-center lg:items-start">
                  <div className="w-12 h-12 rounded-full bg-[#b9b3a5]/10 flex items-center justify-center text-[#b9b3a5]">
                    <Shirt className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-xl">Premium Silks</h4>
                  <p className="text-sm text-ink/60">Only the finest natural fibers touch your skin.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section id="collections" className="py-20 md:py-32 bg-ink text-paper">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 md:mb-24 gap-8 text-center md:text-left">
            <div className="space-y-4">
              <span className="text-[#b9b3a5] text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold">Collections</span>
              <h3 className="text-4xl md:text-7xl font-serif">Timeless Chic Collection</h3>
              <p className="max-w-xl text-sm md:text-base leading-relaxed opacity-80 text-paper/80">
                Nouvelle sélection de silhouettes raffinées, inspirée par les textures luxueuses et les lignes modernes.
              </p>
            </div>
            <button className="group flex items-center gap-3 text-[10px] md:text-xs uppercase tracking-widest font-bold border-b border-paper/30 pb-2 hover:border-gold transition-colors">
              View All Collections
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              { title: 'Satin Serenity Abaya', desc: 'Signature abaya en soie, sophistication pure.', price: 'MAD 2,400', image: '/images/products/Timeless_Chic.jpg' },
              { title: 'Sahara Dawn Wrap', desc: 'Drapé léger en tons neutres pour un style intemporel.', price: 'MAD 1,200', image: '/images/products/jilbab.jpg' },
              { title: 'Rif Elegance Caftan', desc: 'Caftan moderne aux lignes épurées et à la silhouette fluide.', price: 'MAD 3,800', image: '/images/products/tissue_langue.jpg' }
            ].map((product, i) => (
              <motion.div 
                key={product.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="aspect-[3/4] bg-paper/5 overflow-hidden mb-8 relative">
                  <img 
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[#b9b3a5]/0 group-hover:bg-[#b9b3a5]/10 transition-colors duration-500"></div>
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ShoppingBag className="w-6 h-6 text-[#b9b3a5]" />
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h4 className="text-2xl font-serif group-hover:text-[#b9b3a5] transition-colors">{product.title}</h4>
                    <p className="text-sm text-paper/50 font-light">{product.desc}</p>
                  </div>
                  <span className="text-[#b9b3a5] font-medium">{product.price}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Atelier Section */}
      <section id="the-atelier" className="py-20 md:py-32 bg-paper">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="order-2 lg:order-1 space-y-8 md:space-y-12 text-center lg:text-left">
              <div className="space-y-4">
                <span className="text-[#b9b3a5] text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold">Craftsmanship</span>
                <h3 className="text-4xl md:text-6xl font-serif">The Atelier <br /><span className="italic">Lamsa</span></h3>
              </div>
              <p className="text-base md:text-lg leading-relaxed text-ink/70 font-light max-w-xl mx-auto lg:mx-0">
                Our atelier in the heart of Morocco is where tradition is preserved. We work with local artisans to ensure every stitch tells a story of heritage, using techniques passed down through generations.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {[
                  'Ethically sourced fabrics',
                  'Sustainable production',
                  'Artisan-led design',
                  'Custom tailoring available'
                ].map((feature) => (
                  <div key={feature} className="flex items-center justify-center lg:justify-start gap-4">
                    <div className="w-1.5 h-1.5 bg-gold rounded-full shrink-0"></div>
                    <span className="text-[10px] md:text-sm uppercase tracking-widest font-medium opacity-70">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2 relative px-4 md:px-0">
              <div className="aspect-square overflow-hidden rounded-2xl shadow-2xl max-w-md mx-auto lg:max-w-none">
                <img 
                  src="/images/products/tissue.jpg"
                  alt="Luxury fabric drape"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -top-6 md:-top-12 -left-2 md:-left-12 bg-white p-4 md:p-8 rounded-xl shadow-xl">
                <p className="text-2xl md:text-4xl font-serif text-[#b9b3a5]">100%</p>
                <p className="text-[8px] md:text-[10px] uppercase tracking-widest font-bold opacity-50">Handcrafted</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-paper border-t border-ink/5 pt-32 pb-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-32">
            <div className="space-y-8">
              <h2 className="text-4xl font-serif">LAMSA</h2>
              <p className="text-sm leading-relaxed opacity-60">
                The premier Moroccan modest fashion house. Blending tradition and contemporary design for the modern woman.
              </p>
              <div className="flex gap-6">
                <Instagram className="w-5 h-5 cursor-pointer hover:text-gold transition-colors" />
                <Facebook className="w-5 h-5 cursor-pointer hover:text-gold transition-colors" />
              </div>
            </div>

            <div className="space-y-8">
              <h4 className="text-xs uppercase tracking-[0.3em] font-bold">Quick Links</h4>
              <nav className="flex flex-col gap-4">
                {navItems.map(item => (
                  <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-sm hover:text-gold transition-colors">{item}</a>
                ))}
              </nav>
            </div>

            <div className="space-y-8">
              <h4 className="text-xs uppercase tracking-[0.3em] font-bold">Visit Us</h4>
              <div className="space-y-4 text-sm opacity-60">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-1 text-gold" />
                  <p>124 Avenue Hassan II,<br />Casablanca, Morocco</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gold" />
                  <p>+212 522 00 00 00</p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h4 className="text-xs uppercase tracking-[0.3em] font-bold">Newsletter</h4>
              <p className="text-sm opacity-60">Join our circle for exclusive insights into modest fashion trends.</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="flex-1 bg-ink/5 border-none rounded-full px-6 py-3 text-sm focus:ring-1 focus:ring-gold transition-all"
                />
                <button className="bg-ink text-paper p-3 rounded-full transition-colors hover:bg-[#b9b3a5] hover:text-ink active:bg-[#b9b3a5] active:text-ink">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-ink/5 gap-8">
            <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">
              © 2026 LAMSA MODEST FASHION • MAISON DE COUTURE
            </p>
            <div className="flex gap-12 text-[10px] uppercase tracking-widest opacity-40 font-bold">
              <a href="#" className="hover:text-gold">Privacy Policy</a>
              <a href="#" className="hover:text-gold">Terms of Service</a>
              <a href="#" className="hover:text-gold">Shipping & Returns</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
