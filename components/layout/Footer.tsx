'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Mail, Phone, MapPin, Heart } from 'lucide-react';
import { useSiteSettings, useCategories } from '@/lib/store';

export default function Footer() {
  const { settings } = useSiteSettings();
  const { activeCategories: categories } = useCategories();

  return (
    <footer className="bg-gradient-to-br from-charcoal to-gray-900 text-white">
      {/* Trust Badges Bar */}
      <div className="border-b border-gray-700/60 bg-gray-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              { icon: '🚚', title: 'Fast Delivery', desc: 'Every city in Pakistan' },
              { icon: '✨', title: '100% Quality Checked', desc: 'Markaz verified suppliers' },
              { icon: '💵', title: 'Cash on Delivery', desc: 'Pay at your doorstep (COD)' },
              { icon: '🔄', title: 'Easy Returns', desc: '7-Day hassle free policy' },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-gray-800/40 border border-gray-700/40 hover:bg-gray-800/70 transition-colors">
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <p className="font-bold text-xs sm:text-sm text-rose-300">{badge.title}</p>
                  <p className="text-[11px] text-gray-400">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 p-1 flex items-center justify-center">
                <Image src="/images/logo.svg" alt="Women's Store Pakistan" width={40} height={40} className="w-full h-full brightness-0 invert opacity-90 object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-rose-200 text-base leading-tight">Women's Store</h3>
                <p className="text-[10px] text-gray-400 tracking-widest font-bold">PAKISTAN</p>
              </div>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              Budget-friendly luxury for every Pakistani woman. Curated elegance in makeup, jewelry, suits, and accessories fulfilled in verified partnership with official Markaz suppliers.
            </p>
            <div className="flex items-center gap-2 pt-1">
              {settings.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer"
                  className="p-2 bg-blue-600/20 hover:bg-blue-600/40 rounded-xl transition-colors text-blue-400" title="Facebook">
                  <Facebook size={16} />
                </a>
              )}
              {settings.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer"
                  className="p-2 bg-pink-600/20 hover:bg-pink-600/40 rounded-xl transition-colors text-pink-400" title="Instagram">
                  <Instagram size={16} />
                </a>
              )}
              {settings.tiktokUrl && (
                <a href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer"
                  className="p-2 bg-purple-600/20 hover:bg-purple-600/40 rounded-xl transition-colors text-purple-400 font-bold text-xs" title="TikTok">
                  🎵
                </a>
              )}
              {settings.whatsappNumber && (
                <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noopener noreferrer"
                  className="p-2 bg-green-600/20 hover:bg-green-600/40 rounded-xl transition-colors text-green-400 font-bold text-xs" title="WhatsApp Chat">
                  💬
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-rose-300 mb-4 text-xs tracking-wider uppercase">Quick Links</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {[
                { href: '/', label: 'Home' },
                { href: '/products', label: 'All Products' },
                { href: '/about', label: 'About Us (Markaz Partnership)' },
                { href: '/contact', label: 'Contact Us & Order Tracking' },
                { href: '/wishlist', label: 'Saved Wishlist' },
                { href: '/admin', label: 'Super-Admin Panel' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-400 hover:text-rose-300 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Dynamic Categories */}
          <div>
            <h4 className="font-bold text-rose-300 mb-4 text-xs tracking-wider uppercase">Categories</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {categories.map(c => (
                <li key={c.id}>
                  <Link href={`/products?category=${c.slug}`} className="text-gray-400 hover:text-rose-300 transition-colors flex items-center gap-1.5">
                    <span>{c.icon}</span> {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Dynamic Contact Info */}
          <div>
            <h4 className="font-bold text-rose-300 mb-4 text-xs tracking-wider uppercase">Contact & Support</h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex items-start gap-2.5">
                <Phone size={15} className="text-rose-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] text-gray-500 font-semibold">WhatsApp Order & Inquiries</p>
                  <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noopener noreferrer"
                    className="text-gray-300 hover:text-rose-300 transition-colors font-medium">
                    +{settings.whatsappNumber}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail size={15} className="text-rose-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] text-gray-500 font-semibold">Support Email</p>
                  <a href={`mailto:${settings.supportEmail}`}
                    className="text-gray-300 hover:text-rose-300 transition-colors break-all">
                    {settings.supportEmail}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="text-rose-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] text-gray-500 font-semibold">Location</p>
                  <span className="text-gray-300">{settings.address}</span>
                </div>
              </li>
              <li className="text-[11px] text-gray-400 bg-gray-800/60 p-2 rounded-xl">
                ⏰ {settings.businessHours}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Women's Store Pakistan. All rights reserved. Fulfilled in verified partnership with Markaz suppliers.
          </p>
          <p className="flex items-center gap-1.5 text-gray-400">
            Designed with <Heart size={12} className="text-rose-500 fill-rose-500" /> for Pakistani Women
          </p>
        </div>
      </div>
    </footer>
  );
}
