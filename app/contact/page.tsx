'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, MessageCircle, Facebook, Instagram, Send, Package } from 'lucide-react';
import { useSiteSettings } from '@/lib/store';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const { settings } = useSiteSettings();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      toast.success('Message sent! We\'ll respond within 24 hours.');
      setForm({ name: '', email: '', subject: '', message: '' });
      setSending(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fffbf7' }}>
      {/* Hero */}
      <div className="bg-gradient-to-br from-rose-50 to-pink-100 border-b border-pink-100">
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold text-charcoal mb-2">Contact Us</h1>
            <p className="text-gray-500">We'd love to hear from you. Reach out any time!</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-4">
            {/* WhatsApp */}
            <motion.a
              href={`https://wa.me/${settings.whatsappNumber}`}
              target="_blank"
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-4 bg-green-50 border border-green-200 rounded-2xl p-4 hover:shadow-md transition-all block"
            >
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle size={18} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-charcoal text-sm">WhatsApp (Fastest)</p>
                <p className="text-green-600 text-sm">+{settings.whatsappNumber}</p>
              </div>
            </motion.a>

            {[
              { icon: Mail, label: 'Email Us', value: settings.supportEmail, href: `mailto:${settings.supportEmail}`, color: 'rose' },
              { icon: MapPin, label: 'Location', value: settings.address, href: '#', color: 'purple' },
              { icon: Clock, label: 'Business Hours', value: settings.businessHours, href: '#', color: 'amber' },
            ].map(({ icon: Icon, label, value, href, color }, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.01 }}
                className={`flex items-center gap-4 bg-${color}-50 border border-${color}-100 rounded-2xl p-4`}
              >
                <div className={`w-10 h-10 bg-${color}-100 rounded-full flex items-center justify-center flex-shrink-0`}>
                  <Icon size={18} className={`text-${color}-500`} />
                </div>
                <div>
                  <p className="font-semibold text-charcoal text-sm">{label}</p>
                  <a href={href} className="text-gray-500 text-sm hover:text-rose-600 transition-colors break-all">{value}</a>
                </div>
              </motion.div>
            ))}

            {/* Social Media */}
            <div className="bg-white border border-pink-100 rounded-2xl p-4">
              <p className="font-semibold text-charcoal text-sm mb-3">Follow Us</p>
              <div className="flex gap-3">
                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-xl text-xs font-medium hover:bg-blue-100 transition-colors">
                  <Facebook size={14} /> Facebook
                </a>
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-pink-50 text-pink-600 px-3 py-2 rounded-xl text-xs font-medium hover:bg-pink-100 transition-colors">
                  <Instagram size={14} /> Instagram
                </a>
                <a href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gray-50 text-gray-600 px-3 py-2 rounded-xl text-xs font-medium hover:bg-gray-100 transition-colors">
                  🎵 TikTok
                </a>
              </div>
            </div>

            {/* Order Tracking Info */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <Package size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-charcoal text-sm mb-1">Track Your Order</p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    After placing an order, you'll receive a unique <strong>Order ID</strong> (format: WSP-XXXXXX).
                    Share this ID on our WhatsApp or email to get real-time updates on your order status, dispatch details, and estimated delivery.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-pink-100 rounded-3xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-charcoal mb-1">Send us a Message</h2>
              <p className="text-sm text-gray-400 mb-5">We respond within 24 hours</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-charcoal mb-1">Your Name</label>
                    <input type="text" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))}
                      className="w-full border border-pink-100 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-rose-400 transition-colors"
                      placeholder="Fatima Ahmed" required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-charcoal mb-1">Email</label>
                    <input type="email" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))}
                      className="w-full border border-pink-100 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-rose-400 transition-colors"
                      placeholder="your@email.com" required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">Subject</label>
                  <input type="text" value={form.subject} onChange={e => setForm(p => ({...p, subject: e.target.value}))}
                    className="w-full border border-pink-100 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-rose-400 transition-colors"
                    placeholder="Order inquiry, product question..." required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">Message</label>
                  <textarea value={form.message} onChange={e => setForm(p => ({...p, message: e.target.value}))}
                    className="w-full border border-pink-100 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-rose-400 transition-colors resize-none"
                    rows={5} placeholder="Tell us how we can help you..." required />
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={sending}
                  className="w-full flex items-center justify-center gap-2 bg-rose-600 text-white py-3 rounded-2xl font-semibold hover:bg-rose-700 transition-colors disabled:opacity-70"
                >
                  <Send size={16} />{sending ? 'Sending...' : 'Send Message'}
                </motion.button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
