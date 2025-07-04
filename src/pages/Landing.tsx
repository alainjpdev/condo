import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  CreditCard, 
  Calendar, 
  AlertTriangle, 
  Vote,
  Users,
  Star,
  Home,
  Moon,
  Sun,
  Globe
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { useTheme } from '../contexts/ThemeContext';

export function Landing() {
  const { t, i18n } = useTranslation();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLanguageChange = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
  };

  const features = [
    {
      icon: CreditCard,
      title: t('landing.features.payment.title'),
      description: t('landing.features.payment.description'),
    },
    {
      icon: Calendar,
      title: t('landing.features.reservations.title'),
      description: t('landing.features.reservations.description'),
    },
    {
      icon: AlertTriangle,
      title: t('landing.features.incidents.title'),
      description: t('landing.features.incidents.description'),
    },
    {
      icon: Vote,
      title: t('landing.features.votes.title'),
      description: t('landing.features.votes.description'),
    },
  ];

  const stats = [
    { label: t('landing.stats.residents'), value: '500+' },
    { label: t('landing.stats.units'), value: '150+' },
    { label: t('landing.stats.providers'), value: '25+' },
    { label: t('landing.stats.satisfaction'), value: '98%' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Building2 size={32} className="text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Gourmet PA
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLanguageChange}
                className="flex items-center space-x-2"
              >
                <Globe size={20} />
                <span>{i18n.language.toUpperCase()}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </Button>
              
              <Link to="/login">
                <Button variant="outline" size="sm">
                  {t('auth.login')}
                </Button>
              </Link>
              
              <Link to="/register">
                <Button size="sm">
                  {t('auth.register')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                {t('landing.hero.title')}
              </h1>
              <p className="text-xl md:text-2xl text-blue-600 dark:text-blue-400 mb-4">
                {t('landing.hero.subtitle')}
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                {t('landing.hero.description')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/login">
                  <Button size="lg" className="w-full sm:w-auto">
                    {t('landing.hero.ctaLogin')}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    {t('landing.hero.ctaRegister')}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
          
          {/* Floating Icons Animation */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{ 
                rotate: 360,
                x: [0, 30, 0],
                y: [0, -30, 0]
              }}
              transition={{ 
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-1/4 left-1/4 text-blue-300 dark:text-blue-600 opacity-20"
            >
              <Home size={64} />
            </motion.div>
            <motion.div
              animate={{ 
                rotate: -360,
                x: [0, -30, 0],
                y: [0, 30, 0]
              }}
              transition={{ 
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-1/3 right-1/4 text-indigo-300 dark:text-indigo-600 opacity-20"
            >
              <Building2 size={48} />
            </motion.div>
            <motion.div
              animate={{ 
                rotate: 360,
                x: [0, 20, 0],
                y: [0, -20, 0]
              }}
              transition={{ 
                duration: 30,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute bottom-1/4 left-1/3 text-purple-300 dark:text-purple-600 opacity-20"
            >
              <Users size={56} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('landing.features.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('landing.features.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card hover className="h-full text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <feature.icon size={32} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 dark:bg-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('landing.stats.title')}
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-blue-100 text-lg">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Únete a nuestra comunidad y experimenta la gestión moderna de condominios.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                {t('auth.register')}
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-blue-600">
                {t('auth.login')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Building2 size={28} className="text-blue-400" />
              <h3 className="text-xl font-bold">Gourmet PA</h3>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400">
                © 2025 Gourmet PA. Todos los derechos reservados.
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Sistema moderno de administración de condominio
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}