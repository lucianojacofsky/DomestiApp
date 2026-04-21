import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ShieldCheck, Clock, CheckCircle2, ArrowRight, Sparkles, Star, MapPin, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export default function Home() {
  return (
    <div className="space-y-32 pb-32 overflow-x-hidden">
      {/* Hero Section - Recipe 11 inspired */}
      <section className="relative pt-20 lg:pt-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-400 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400 rounded-full blur-[120px]" />
        </div>
        
        <div className="max-w-5xl mx-auto text-center space-y-10 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-indigo-100 text-indigo-600 text-sm font-semibold shadow-sm backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Nueva era en servicios domésticos</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-extrabold tracking-tight text-slate-900 leading-[0.9] md:leading-[0.85]"
          >
            Soluciones reales <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">para tu hogar.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Conectamos a los mejores profesionales con personas que valoran su tiempo. Calidad, confianza y seguridad en cada rincón de tu casa.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-6 pt-4"
          >
            <Link to="/register">
              <Button size="lg" className="btn-primary text-lg px-10 py-7 h-auto rounded-2xl">
                Empezar ahora <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-lg px-10 py-7 h-auto rounded-2xl border-2 hover:bg-slate-50">
                Ver servicios
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex justify-center font-display font-bold text-2xl">TRUSTED</div>
          <div className="flex justify-center font-display font-bold text-2xl">SECURE</div>
          <div className="flex justify-center font-display font-bold text-2xl">RELIABLE</div>
          <div className="flex justify-center font-display font-bold text-2xl">QUALITY</div>
        </div>
      </section>

      {/* Features - Bento Grid Style */}
      <section className="max-w-7xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">¿Por qué DomestiApp?</h2>
          <p className="text-slate-500 text-lg">Diseñado para tu tranquilidad y la de tu familia.</p>
        </div>
        
        <div className="grid md:grid-cols-12 gap-6 h-auto md:h-[600px]">
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-8 bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Seguridad Garantizada</h3>
              <p className="text-slate-600 text-lg max-w-md">
                Validamos la identidad y antecedentes de cada profesional. Tu seguridad es nuestra prioridad número uno.
              </p>
            </div>
            <div className="absolute bottom-0 right-0 -mb-10 -mr-10 w-64 h-64 bg-indigo-50 rounded-full opacity-50" />
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-4 bg-indigo-600 rounded-[2.5rem] p-10 text-white flex flex-col justify-center text-center"
          >
            <Zap className="w-12 h-12 mx-auto mb-6 text-indigo-200" />
            <h3 className="text-2xl font-bold mb-4">Respuesta Inmediata</h3>
            <p className="text-indigo-100">
              Recibe ofertas en menos de 15 minutos para servicios de urgencia.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-4 bg-slate-900 rounded-[2.5rem] p-10 text-white flex flex-col justify-center"
          >
            <Star className="w-10 h-10 text-yellow-400 mb-6" />
            <h3 className="text-2xl font-bold mb-2">4.9/5 Estrellas</h3>
            <p className="text-slate-400">Calificación promedio de nuestros usuarios satisfechos.</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-8 bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 flex items-center gap-10"
          >
            <div className="hidden lg:block w-1/3 aspect-square bg-slate-50 rounded-3xl" />
            <div>
              <h3 className="text-3xl font-bold mb-4">Pagos con MercadoPago</h3>
              <p className="text-slate-600 text-lg">
                Paga de forma simple y segura. El dinero se libera solo cuando confirmas que el trabajo está terminado.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories - Visual Grid */}
      <section className="bg-slate-900 py-32 text-white">
        <div className="max-w-7xl mx-auto px-4 space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-bold">Explora Categorías</h2>
              <p className="text-slate-400 text-xl">Todo lo que tu hogar necesita en un solo lugar.</p>
            </div>
            <Link to="/register">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white hover:text-slate-900 h-14 px-8 rounded-xl">
                Ver todas las categorías
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Limpieza', icon: '✨', count: '120+ Pros' },
              { name: 'Plomería', icon: '🚰', count: '85+ Pros' },
              { name: 'Electricidad', icon: '⚡', count: '64+ Pros' },
              { name: 'Jardinería', icon: '🌿', count: '42+ Pros' },
              { name: 'Pintura', icon: '🎨', count: '56+ Pros' },
              { name: 'Carpintería', icon: '🪚', count: '38+ Pros' },
              { name: 'Mudanzas', icon: '📦', count: '29+ Pros' },
              { name: 'Reparaciones', icon: '🛠️', count: '94+ Pros' },
            ].map((cat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                className="group bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all cursor-pointer"
              >
                <span className="text-4xl mb-6 block">{cat.icon}</span>
                <h4 className="text-xl font-bold mb-1">{cat.name}</h4>
                <p className="text-slate-500 text-sm">{cat.count}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-indigo-600 rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]" />
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold">¿Listo para transformar tu hogar?</h2>
            <p className="text-indigo-100 text-xl max-w-2xl mx-auto">
              Únete a miles de usuarios que ya confían en DomestiApp para sus servicios diarios.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 text-lg px-10 py-7 h-auto rounded-2xl font-bold">
                  Registrarme Gratis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
