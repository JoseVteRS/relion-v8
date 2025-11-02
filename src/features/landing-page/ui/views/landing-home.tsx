"use client";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Gift,
  Heart,
  List,
  Lock,
  Share2,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";

export const LandingHome = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Iniciar sesión
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm">Empezar gratis</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-32 md:pb-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              <span>Gestiona tus listas de regalos de forma inteligente</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6">
              Listas de regalos
              <span className="text-primary block">sin complicaciones</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Crea, comparte y gestiona tus listas de regalos. Organiza eventos,
              cumpleaños y ocasiones especiales de forma fácil y divertida.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto">
                  Crear lista gratis
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Ver ejemplo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Todo lo que necesitas para tus listas de regalos
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Funciones potentes diseñadas para hacer que compartir deseos sea
                sencillo y divertido
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 rounded-xl border bg-card">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Gift className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Listas ilimitadas
                </h3>
                <p className="text-muted-foreground">
                  Crea tantas listas como quieras para diferentes ocasiones:
                  cumpleaños, Navidad, bodas y más.
                </p>
              </div>

              <div className="p-6 rounded-xl border bg-card">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Comparte fácilmente
                </h3>
                <p className="text-muted-foreground">
                  Comparte tus listas con familiares y amigos. Todos pueden ver
                  qué regalos están disponibles.
                </p>
              </div>

              <div className="p-6 rounded-xl border bg-card">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Privacidad total
                </h3>
                <p className="text-muted-foreground">
                  Elige si tus listas son públicas o privadas. Control total sobre
                  quién puede ver tus regalos.
                </p>
              </div>

              <div className="p-6 rounded-xl border bg-card">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <List className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Organización perfecta
                </h3>
                <p className="text-muted-foreground">
                  Agrega descripciones, precios y enlaces. Mantén todo
                  organizado en un solo lugar.
                </p>
              </div>

              <div className="p-6 rounded-xl border bg-card">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Seguimiento en tiempo real
                </h3>
                <p className="text-muted-foreground">
                  Ve qué regalos han sido reservados o comprados. Evita
                  duplicados y ahorra tiempo.
                </p>
              </div>

              <div className="p-6 rounded-xl border bg-card">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Listas favoritas
                </h3>
                <p className="text-muted-foreground">
                  Guarda las listas de tus seres queridos como favoritas para
                  acceder fácilmente.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-muted/50 py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Cómo funciona
                </h2>
                <p className="text-lg text-muted-foreground">
                  En tres sencillos pasos tendrás tu lista lista
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    1
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Crea tu lista
                  </h3>
                  <p className="text-muted-foreground">
                    Regístrate gratis y crea tu primera lista de regalos.
                    Agrega los regalos que deseas recibir.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    2
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Comparte
                  </h3>
                  <p className="text-muted-foreground">
                    Comparte el enlace de tu lista con familiares y amigos.
                    Ellos podrán ver qué regalos están disponibles.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    3
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Disfruta
                  </h3>
                  <p className="text-muted-foreground">
                    Recibe notificaciones cuando alguien reserve o compre un
                    regalo. ¡Es así de fácil!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Marketing Banner */}
        <section className="relative overflow-hidden py-20 md:py-32">
          {/* Background Image with Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('/images/bg-banner.webp')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/50 to-black/60" />
          </div>
          
          {/* Content */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="mx-auto max-w-4xl text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary-foreground text-sm font-medium mb-6 backdrop-blur-sm">
                <Gift className="w-4 h-4" />
                <span>Prepara tu Navidad 2024</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Crea tu lista de regalos
                <span className="block text-primary">de Navidad perfecta</span>
              </h2>
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                Organiza tus regalos navideños de forma inteligente. Comparte tu lista de Navidad con familia y amigos. 
                Evita regalos duplicados y asegúrate de recibir exactamente lo que deseas estas fiestas navideñas.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/dashboard">
                  <Button size="lg" variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Crear mi lista de Navidad
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                  >
                    Ver listas de ejemplo
                  </Button>
                </Link>
              </div>
              
              {/* Stats */}
              <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">100%</div>
                  <div className="text-sm text-white/80">Gratis para Navidad</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">∞</div>
                  <div className="text-sm text-white/80">Regalos navideños</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">🎄</div>
                  <div className="text-sm text-white/80">Listo para Reyes</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="p-8 md:p-12 rounded-2xl border bg-gradient-to-br from-primary/5 to-primary/10">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                ¿Listo para crear tu primera lista?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Únete a miles de personas que ya están usando Relion para
                gestionar sus listas de regalos
              </p>
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto">
                  Empezar ahora
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Logo />
            </div>
            <nav className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link
                href="/"
                className="hover:text-foreground transition-colors"
              >
                Inicio
              </Link>
              <Link
                href="/dashboard"
                className="hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/login"
                className="hover:text-foreground transition-colors"
              >
                Iniciar sesión
              </Link>
            </nav>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Relion. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

