'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, Shield, Truck, Star, Users, MessageCircle } from 'lucide-react';
import { useSiteSettings } from '@/lib/store';

export default function AboutPage() {
  const { settings } = useSiteSettings();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fffbf7' }}>
      {/* Hero */}
      <div className="bg-gradient-to-br from-rose-600 to-pink-500 text-white">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-5xl block mb-4">🌸</span>
            <h1 className="text-4xl sm:text-5xl font-bold mb-3">About Us</h1>
            <p className="text-rose-100 text-lg max-w-2xl mx-auto">
              Your trusted partner for budget-friendly luxury in Pakistan
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Our Story */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl font-bold text-charcoal mb-4">Our Story</h2>
          <div className="prose prose-rose max-w-none">
            <p className="text-gray-600 leading-relaxed text-base mb-4">
              Women's Store Pakistan was born from a simple belief: every Pakistani woman deserves access to quality fashion and beauty products without breaking the bank. We started as a small initiative to bridge the gap between premium products and affordable prices.
            </p>
            <p className="text-gray-600 leading-relaxed text-base mb-4">
              Our vision is to empower Pakistani women with access to curated, quality-checked products — from beautiful Kundan jewelry and embroidered lawn suits to premium makeup and elegant accessories — all delivered to their doorstep with Cash on Delivery.
            </p>
          </div>
        </motion.section>

        {/* Values */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl font-bold text-charcoal mb-6">What We Stand For</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Heart, title: 'Made for Pakistani Women', desc: 'Every product is curated with the Pakistani woman in mind — our climate, our culture, our style.' },
              { icon: Shield, title: 'Quality Guaranteed', desc: 'All products are quality-checked before dispatch. No compromises on what reaches your hands.' },
              { icon: Truck, title: 'Nationwide Delivery', desc: 'We deliver to all major cities and rural areas across Pakistan with reliable courier partners.' },
              { icon: Star, title: 'Budget Friendly Luxury', desc: 'Premium quality at prices that make sense for every household. Luxury shouldn\'t be a privilege.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -2 }}
                className="bg-white border border-pink-100 rounded-2xl p-5 hover:shadow-md transition-all"
              >
                <Icon size={24} className="text-rose-500 mb-3" />
                <h3 className="font-bold text-charcoal mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Markaz Partnership */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 rounded-3xl p-8"
        >
          <div className="flex items-start gap-4">
            <span className="text-4xl">🤝</span>
            <div>
              <h2 className="text-2xl font-bold text-charcoal mb-3">Our Markaz Partnership</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We are proud to operate in transparent partnership with official <strong>Markaz</strong> suppliers. Markaz is Pakistan's leading social commerce platform connecting resellers with verified wholesale suppliers.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                This partnership means:
              </p>
              <ul className="space-y-2 mb-4">
                {[
                  'Every product is sourced from verified, quality-checked suppliers',
                  'Orders are tracked from dispatch to delivery',
                  'Cash on Delivery is available and secured through Markaz logistics',
                  'Returns and quality complaints are handled professionally',
                  'You get genuine products at wholesale-backed prices',
                ].map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-rose-500 font-bold mt-0.5">✓</span>
                    {point}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-rose-600 font-medium">
                This transparency is our commitment to you. We believe you deserve to know exactly how your order is fulfilled.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Team / Mission */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="text-center">
            <Users size={40} className="text-rose-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-charcoal mb-3">Our Mission</h2>
            <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
              To become Pakistan's most trusted online destination for women's fashion and beauty — where quality meets affordability, and every woman feels valued.
            </p>
          </div>
        </motion.section>

        {/* CTA */}
        <div className="text-center">
          <Link
            href={`https://wa.me/${settings.whatsappNumber}`}
            target="_blank"
            className="inline-flex items-center gap-2 bg-green-500 text-white px-8 py-4 rounded-full font-bold text-base hover:bg-green-600 transition-colors shadow-lg"
          >
            <MessageCircle size={20} /> Chat with Us on WhatsApp
          </Link>
        </div>
      </div>
    </div>
  );
}
