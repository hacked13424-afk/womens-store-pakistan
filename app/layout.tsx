import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/store';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: "Women's Store Pakistan - Budget Friendly Luxury",
  description: "Shop the finest makeup, artificial jewelry, unstitched suits, bags & more. Quality Pakistani women's fashion at affordable prices. COD available.",
  keywords: 'women store pakistan, pakistani fashion, makeup, jewelry, lawn suits, bags, COD',
  openGraph: {
    title: "Women's Store Pakistan",
    description: 'Budget Friendly Luxury for Pakistani Women',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen" style={{ backgroundColor: '#fffbf7' }}>
        <AppProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CartDrawer />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#fff1f2',
                color: '#1a1a2e',
                border: '1px solid #fda4af',
              },
              success: { iconTheme: { primary: '#be123c', secondary: '#fff' } },
            }}
          />
        </AppProvider>
      </body>
    </html>
  );
}
