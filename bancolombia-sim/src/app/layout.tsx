import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Navbar from '@/components/Navbar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Bancolombia Simulador de Inversiones | Copy Trading',
  description:
    'Plataforma de simulación de inversiones y Copy Trading. Capital virtual, mercados globales y estrategias de expertos. Prototipo conceptual educativo.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <AppProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-[var(--border)] bg-black py-8">
            <div className="mx-auto max-w-7xl px-4 text-center text-sm text-neutral-500">
              <p className="font-medium text-neutral-400">
                Bancolombia · Simulador de Inversiones (Prototipo Conceptual)
              </p>
              <p className="mt-2">
                Todo el dinero y las operaciones son 100% simulados. No se realizan depósitos, retiros ni
                inversiones reales. Esta es una demostración educativa sin afiliación oficial con
                Bancolombia S.A.
              </p>
              <p className="mt-1 text-xs">
                Inspirado en experiencias de plataformas como BingX · Datos de mercado simulados
              </p>
            </div>
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
