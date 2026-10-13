'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Truck, ShieldCheck, Banknote, RotateCcw, ArrowRight, Star } from 'lucide-react';
import { useProducts, useCategories, useSiteSettings } from '@/lib/store';
import ProductCard from '@/components/products/ProductCard';

const heroSlides = [
  {
    id: 1,
    image: '/images/hero-1.jpg',
    tag: 'New Collection',
    title: 'Elegance Meets',
    highlight: 'Affordability',
    subtitle: 'Discover premium Pakistani women\'s fashion that fits every budget.',
    cta: 'Shop Now',
    ctaHref: '/products',
    ctaSecondary: 'View Deals',
    ctaSecondaryHref: '/products?sale=true',
    promoCards: [
      { label: 'Up to 40% OFF', sub: 'This Season' },
      { label: 'COD Available', sub: 'Nationwide' },
    ],
  },
  {
    id: 2,
    image: '/images/hero-2.jpg',
    tag: 'Trending Now',
    title: 'Luxury Beauty &',
    highlight: 'Accessories',
    subtitle: 'From Kundan jewelry to matte lipstick sets — all in one place.',
    cta: 'Explore Beauty',
    ctaHref: '/products?category=makeup',
    ctaSecondary: 'View Jewelry',
    ctaSecondaryHref: '/products?category=artificial-jewelry',
    promoCards: [
      { label: 'Quality Checked', sub: 'By Markaz Experts' },
      { label: 'Fast Delivery', sub: '2-5 Business Days' },
    ],
  },
];

export default function HomePage() {
  const { products } = useProducts();
  const { activeCategories: categories } = useCategories();
  const { settings } = useSiteSettings();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [autoPlay]);

  const slide = heroSlides[currentSlide];
  const featured = products.filter(p => p.featured);
  const featuredProducts = featured.length > 0 ? featured : products;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fffbf7' }}>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[500px]">
            {/* Hero Text */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.5 }}
                className="z-10 order-2 lg:order-1"
              >
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-block bg-rose-100 text-rose-700 text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-wide"
                >
                  {slide.tag}
                </motion.span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal leading-tight mb-2">
                  {slide.title}
                </h1>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold gradient-text leading-tight mb-4">
                  {slide.highlight}
                </h1>
                <p className="text-gray-600 text-base sm:text-lg mb-6 leading-relaxed max-w-lg">
                  {slide.subtitle}
                </p>
                <div className="flex flex-wrap gap-3 mb-8">
                  <Link
                    href={slide.ctaHref}
                    className="inline-flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200"
                  >
                    {slide.cta} <ArrowRight size={16} />
                  </Link>
                  <Link
                    href={slide.ctaSecondaryHref}
                    className="inline-flex items-center gap-2 bg-white text-rose-600 px-6 py-3 rounded-full font-semibold text-sm border border-rose-200 hover:bg-rose-50 transition-colors"
                  >
                    {slide.ctaSecondary}
                  </Link>
                </div>

                {/* Floating Promo Cards */}
                <div className="flex flex-wrap gap-3">
                  {slide.promoCards.map((card, i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 1.5 }}
                      className="bg-white border border-pink-100 rounded-2xl px-4 py-2 shadow-md"
                    >
                      <p className="font-bold text-rose-600 text-sm">{card.label}</p>
                      <p className="text-xs text-gray-400">{card.sub}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Hero Image */}
            <div className="relative order-1 lg:order-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6 }}
                  className="relative rounded-3xl overflow-hidden shadow-2xl"
                  style={{ aspectRatio: '16/10' }}
                >
                  <Image
                    src={slide.image}
                    alt="Hero Banner"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* Slide Controls */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setCurrentSlide(i); setAutoPlay(false); }}
                    className={`rounded-full transition-all ${
                      i === currentSlide ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/50'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => { setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length); setAutoPlay(false); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
              >
                <ChevronLeft size={16} className="text-rose-600" />
              </button>
              <button
                onClick={() => { setCurrentSlide(prev => (prev + 1) % heroSlides.length); setAutoPlay(false); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
              >
                <ChevronRight size={16} className="text-rose-600" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Strip */}
      <section className="bg-white border-y border-pink-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
            {[
              { icon: Truck, label: 'Fast Nationwide Delivery' },
              { icon: ShieldCheck, label: '100% Quality Checked' },
              { icon: Banknote, label: 'Cash on Delivery' },
              { icon: RotateCcw, label: 'Easy 7-Day Returns' },
            ].map(({ icon: Icon, label }, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2"
              >
                <Icon size={18} className="text-rose-600" />
                <span className="text-sm font-medium text-charcoal">{label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-charcoal mb-2">Shop by Category</h2>
          <p className="text-gray-500">Explore our curated collections</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <Link
                href={`/products?category=${cat.slug}`}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-pink-50 hover:border-rose-200 hover:shadow-md transition-all text-center group"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform duration-200">{cat.icon}</span>
                <span className="text-xs font-semibold text-charcoal group-hover:text-rose-600 transition-colors">{cat.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-r from-rose-600 via-pink-500 to-rose-700 rounded-3xl overflow-hidden p-8 sm:p-12 text-white"
        >
          <div className="relative z-10">
            <span className="text-pink-200 text-sm font-medium tracking-wider">LIMITED TIME OFFER</span>
            <h3 className="text-2xl sm:text-4xl font-bold mt-1 mb-2">Budget Friendly Luxury</h3>
            <p className="text-pink-100 mb-5 max-w-lg">
              In partnership with verified Markaz suppliers, we bring you top-quality products at unbeatable prices. COD available across Pakistan.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-white text-rose-600 px-6 py-3 rounded-full font-bold text-sm hover:bg-rose-50 transition-colors"
            >
              Explore Deals <ArrowRight size={16} />
            </Link>
          </div>
          {/* Decorative circles */}
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full" />
          <div className="absolute -right-5 -bottom-5 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full" />
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-charcoal">Featured Products</h2>
            <p className="text-gray-500 mt-1">Handpicked for you</p>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-medium text-sm transition-colors"
          >
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {featuredProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </section>

      {/* Markaz Partnership Section */}
      <section className="bg-gradient-to-br from-pink-50 to-rose-50 py-12 mt-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-4xl mb-4 block">🤝</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-charcoal mb-3">Fulfilled via Markaz Partnership</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Every order placed on Women&apos;s Store Pakistan is fulfilled in partnership with official Markaz suppliers. This ensures quality control, reliable dispatch tracking, and safe Cash on Delivery across all of Pakistan.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {['Quality Verified', 'Tracked Dispatch', 'COD Available', 'Genuine Products'].map((badge, i) => (
                <span key={i} className="inline-flex items-center gap-1 bg-white border border-rose-200 text-rose-700 text-sm px-4 py-2 rounded-full font-medium">
                  <Star size={12} className="fill-rose-400 text-rose-400" /> {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
