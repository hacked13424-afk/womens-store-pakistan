'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { useProducts, useCategories } from '@/lib/store';
import { Product } from '@/lib/types';

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const { products } = useProducts();
  const { activeCategories: categories } = useCategories();
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'all');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setSelectedCategory(categoryParam || 'all');
  }, [categoryParam]);

  useEffect(() => {
    let result = [...products];
    if (selectedCategory !== 'all') {
      result = result.filter(p =>
        p.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory ||
        p.category.toLowerCase() === selectedCategory.replace(/-/g, ' ')
      );
    }
    if (search.trim()) {
      result = result.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      );
    }
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.salePrice - b.salePrice);
        break;
      case 'price-desc':
        result.sort((a, b) => b.salePrice - a.salePrice);
        break;
      case 'discount':
        result.sort(
          (a, b) =>
            (b.originalPrice - b.salePrice) / b.originalPrice -
            (a.originalPrice - a.salePrice) / a.originalPrice
        );
        break;
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    setFiltered(result);
  }, [products, selectedCategory, search, sortBy]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fffbf7' }}>
      {/* Page Header */}
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 border-b border-pink-100">
        <div className="max-w-[1400px] mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-charcoal mb-1">All Products</h1>
          <p className="text-gray-500">Discover our complete collection</p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
        {/* Search & Filter Bar */}
        <div className="flex flex-wrap gap-3 mb-6">
          {/* Search Input */}
          <div className="flex-1 min-w-48 flex items-center gap-2 bg-white border border-pink-100 rounded-full px-4 py-2 shadow-sm">
            <Search size={15} className="text-rose-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="flex-1 text-sm bg-transparent outline-none text-charcoal placeholder-rose-300"
            />
            {search && (
              <button onClick={() => setSearch('')}>
                <X size={14} className="text-rose-400" />
              </button>
            )}
          </div>

          {/* Sort Select */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="bg-white border border-pink-100 rounded-full px-4 py-2 text-sm text-charcoal outline-none shadow-sm"
          >
            <option value="featured">Featured First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="discount">Biggest Discount</option>
          </select>

          {/* Filters Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-rose-600 text-white rounded-full px-4 py-2 text-sm font-medium hover:bg-rose-700 transition-colors"
          >
            <SlidersHorizontal size={14} /> Filters
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-rose-600 text-white'
                : 'bg-white text-charcoal border border-pink-100 hover:border-rose-300'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                selectedCategory === cat.slug
                  ? 'bg-rose-600 text-white'
                  : 'bg-white text-charcoal border border-pink-100 hover:border-rose-300'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            Showing{' '}
            <span className="font-semibold text-charcoal">{filtered.length}</span>{' '}
            products
          </p>
        </div>

        {/* Products Grid */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <span className="text-6xl block mb-4">🛒</span>
            <h3 className="text-xl font-semibold text-charcoal mb-2">No products found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="shimmer w-20 h-20 rounded-full" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
