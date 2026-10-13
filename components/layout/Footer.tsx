'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Mail, Phone, MapPin, Heart } from 'lucide-react';
import { useSiteSettings, useCategories } from '@/lib/store';

export default function Footer() {
  const { settings } = useSiteSettings();
  const { activeCategories: categories } = useCategories();

  return (
    <footer className="bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      {/* Trust Badges Bar */}
      <div className="border-b border-gray-800 bg-gray-950/80">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              { icon: '🚚', title: 'Fast Delivery', desc: 'Every city in Pakistan' },
              { icon: '✨', title: '100% Quality Checked', desc: 'Markaz verified suppliers' },
              { icon: '💵', title: 'Cash on Delivery', desc: 'Pay at your doorstep (COD)' },
              { icon: '🔄', title: 'Easy Returns', desc: '7-Day hassle free policy' },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-3 p-3.5 rounded-2xl bg-gray-900/90 border border-gray-800 hover:border-pink-500/30 transition-colors shadow-sm">
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <p className="font-bold text-xs sm:text-sm text-pink-300">{badge.title}</p>
                  <p className="text-[11px] text-gray-300 font-medium">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 p-1 flex items-center justify-center border border-white/20">
                <Image src="/images/logo.svg" alt="Women's Store Pakistan" width={40} height={40} className="w-full h-full brightness-0 invert opacity-100 object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base leading-tight">Women's Store</h3>
                <p className="text-[10px] text-rose-400 tracking-widest font-bold">PAKISTAN</p>
              </div>
            </div>
            <p className="text-gray-200 text-xs sm:text-sm leading-relaxed font-normal">
              Budget-friendly luxury for every Pakistani woman. Curated elegance in makeup, jewelry, suits, and accessories fulfilled in verified partnership with official Markaz suppliers.
            </p>
            <div className="flex items-center gap-2 pt-1">
              {settings.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer"
                  className="p-2.5 bg-blue-600/30 hover:bg-blue-600/60 rounded-xl transition-colors text-blue-300 border border-blue-500/30" title="Facebook">
                  <Facebook size={16} />
                </a>
              )}
              {settings.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer"
                  className="p-2.5 bg-pink-600/30 hover:bg-pink-600/60 rounded-xl transition-colors text-pink-300 border border-pink-500/30" title="Instagram">
                  <Instagram size={16} />
                </a>
              )}
              {settings.tiktokUrl && (
                <a href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer"
                  className="p-2.5 bg-purple-600/30 hover:bg-purple-600/60 rounded-xl transition-colors text-purple-300 font-bold text-xs border border-purple-500/30" title="TikTok">
                  🎵
                </a>
              )}
              {settings.whatsappNumber && (
                <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noopener noreferrer"
                  className="p-2.5 bg-green-600/30 hover:bg-green-600/60 rounded-xl transition-colors text-green-300 font-bold text-xs border border-green-500/30" title="WhatsApp Chat">
                  💬
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-rose-400 mb-4 text-xs tracking-wider uppercase">Quick Links</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {[
                { href: '/', label: 'Home' },
                { href: '/products', label: 'All Products' },
                { href: '/about', label: 'About Us (Markaz Partnership)' },
                { href: '/contact', label: 'Contact Us & Order Tracking' },
                { href: '/wishlist', label: 'Saved Wishlist' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-200 hover:text-rose-300 font-medium transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Dynamic Categories */}
          <div>
            <h4 className="font-bold text-rose-400 mb-4 text-xs tracking-wider uppercase">Categories</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {categories.map(c => (
                <li key={c.id}>
                  <Link href={`/products?category=${c.slug}`} className="text-gray-200 hover:text-rose-300 font-medium transition-colors flex items-center gap-1.5">
                    <span>{c.icon}</span> {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Dynamic Contact Info */}
          <div>
            <h4 className="font-bold text-rose-400 mb-4 text-xs tracking-wider uppercase">Contact & Support</h4>
            <ul className="space-y-3.5 text-xs sm:text-sm">
              <li className="flex items-start gap-2.5">
                <Phone size={16} className="text-rose-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] text-gray-400 font-semibold">WhatsApp Order & Inquiries</p>
                  <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noopener noreferrer"
                    className="text-white hover:text-rose-300 transition-colors font-semibold">
                    +{settings.whatsappNumber}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail size={16} className="text-rose-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] text-gray-400 font-semibold">Support Email</p>
                  <a href={`mailto:${settings.supportEmail}`}
                    className="text-white hover:text-rose-300 transition-colors break-all font-medium">
                    {settings.supportEmail}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="text-rose-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] text-gray-400 font-semibold">Location</p>
                  <span className="text-gray-200 font-medium">{settings.address}</span>
                </div>
              </li>
              <li className="text-[11px] text-gray-200 bg-gray-900 border border-gray-800 p-2.5 rounded-xl font-medium">
                ⏰ {settings.businessHours}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-black">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-300">
          <p className="font-medium text-center sm:text-left">
            &copy; {new Date().getFullYear()} Women's Store Pakistan. All rights reserved. Fulfilled in verified partnership with Markaz suppliers.
          </p>
          <p className="flex items-center gap-1.5 text-gray-300 font-medium">
            Designed with <Heart size={13} className="text-rose-500 fill-rose-500" /> for Pakistani Women
          </p>
        </div>
      </div>
    </footer>
  );
}