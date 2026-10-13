'use client';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingCart, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/store';

export default function CartDrawer() {
  const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity, total } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={toggleCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-pink-100 bg-rose-50">
              <div className="flex items-center gap-2">
                <ShoppingCart size={20} className="text-rose-600" />
                <h2 className="font-bold text-charcoal">Shopping Cart</h2>
                {cart.length > 0 && (
                  <span className="bg-rose-600 text-white text-xs px-2 py-0.5 rounded-full">{cart.length}</span>
                )}
              </div>
              <button onClick={toggleCart} className="p-2 hover:bg-rose-100 rounded-full transition-colors">
                <X size={18} className="text-rose-600" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center gap-4"
                >
                  <ShoppingBag size={64} className="text-rose-200" />
                  <div>
                    <h3 className="font-semibold text-charcoal mb-1">Your cart is empty</h3>
                    <p className="text-sm text-gray-400">Discover our beautiful products</p>
                  </div>
                  <Link
                    href="/products"
                    onClick={toggleCart}
                    className="bg-rose-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-rose-700 transition-colors"
                  >
                    Shop Now
                  </Link>
                </motion.div>
              ) : (
                cart.map((item, index) => (
                  <motion.div
                    key={item.product.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-3 p-3 bg-rose-50/50 rounded-2xl border border-pink-100"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-rose-100">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.title}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-charcoal line-clamp-2 mb-1">{item.product.title}</h4>
                      <p className="text-xs text-gray-400 mb-2">{item.product.category}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full bg-rose-100 hover:bg-rose-200 flex items-center justify-center transition-colors"
                          >
                            <Minus size={10} className="text-rose-600" />
                          </button>
                          <span className="text-sm font-semibold text-charcoal w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full bg-rose-100 hover:bg-rose-200 flex items-center justify-center transition-colors"
                          >
                            <Plus size={10} className="text-rose-600" />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-rose-600">Rs. {(item.product.salePrice * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1 hover:text-red-500 text-gray-400 transition-colors flex-shrink-0 self-start"
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-4 border-t border-pink-100 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Subtotal ({cart.reduce((s,i) => s+i.quantity, 0)} items)</span>
                  <span className="font-bold text-rose-600 text-lg">Rs. {total.toLocaleString()}</span>
                </div>
                <p className="text-xs text-green-600 text-center bg-green-50 py-1 rounded-lg">✅ Cash on Delivery Available</p>
                <Link
                  href="/products"
                  onClick={toggleCart}
                  className="block w-full text-center py-3 border border-rose-300 text-rose-600 rounded-2xl text-sm font-medium hover:bg-rose-50 transition-colors"
                >
                  Continue Shopping
                </Link>
                <p className="text-xs text-center text-gray-400">Visit individual products to place your order</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
