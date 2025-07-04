import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  Home, 
  CreditCard, 
  Calendar, 
  AlertTriangle, 
  TrendingUp,
  Users,
  Building2,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

export function Dashboard() {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    totalUnits: 0,
    pendingPayments: 0,
    activeReservations: 0,
    openIncidents: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      if (profile?.role === 'admin') {
        // Estadísticas para administrador
        const [unitsRes, paymentsRes, reservationsRes, incidentsRes] = await Promise.all([
          supabase.from('units').select('id', { count: 'exact' }),
          supabase.from('payments').select('id', { count: 'exact' }).eq('status', 'pendiente'),
          supabase.from('reservations').select('id', { count: 'exact' }).eq('status', 'aprobado'),
          supabase.from('incidents').select('id', { count: 'exact' }).neq('status', 'resuelto'),
        ]);

        setStats({
          totalUnits: unitsRes.count || 0,
          pendingPayments: paymentsRes.count || 0,
          activeReservations: reservationsRes.count || 0,
          openIncidents: incidentsRes.count || 0,
        });
      } else if (profile?.role === 'residente') {
        // Estadísticas para residente
        const [paymentsRes, reservationsRes, incidentsRes] = await Promise.all([
          supabase
            .from('payments')
            .select('id', { count: 'exact' })
            .eq('status', 'pendiente')
            .in('unit_id', 
              supabase.from('units').select('id').eq('resident_id', profile.id)
            ),
          supabase
            .from('reservations')
            .select('id', { count: 'exact' })
            .eq('user_id', profile.id)
            .eq('status', 'aprobado'),
          supabase
            .from('incidents')
            .select('id', { count: 'exact' })
            .eq('reporter_id', profile.id)
            .neq('status', 'resuelto'),
        ]);

        setStats({
          totalUnits: 1, // Asumiendo que tiene una unidad
          pendingPayments: paymentsRes.count || 0,
          activeReservations: reservationsRes.count || 0,
          openIncidents: incidentsRes.count || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const statCards = [
    {
      title: t('dashboard.stats.totalUnits'),
      value: stats.totalUnits,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      title: t('dashboard.stats.pendingPayments'),
      value: stats.pendingPayments,
      icon: CreditCard,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
    },
    {
      title: t('dashboard.stats.activeReservations'),
      value: stats.activeReservations,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      title: t('dashboard.stats.openIncidents'),
      value: stats.openIncidents,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900',
    },
  ];

  const quickActions = [
    { name: 'Hacer un Pago', icon: CreditCard, href: '/payments', color: 'bg-blue-600' },
    { name: 'Nueva Reserva', icon: Calendar, href: '/reservations', color: 'bg-green-600' },
    { name: 'Reportar Incidencia', icon: AlertTriangle, href: '/incidents', color: 'bg-red-600' },
    { name: 'Votar', icon: TrendingUp, href: '/votes', color: 'bg-purple-600' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center md:text-left"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {getGreeting()}, {profile?.full_name}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          {t('dashboard.welcome')} - {t(`roles.${profile?.role}`)}
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card hover>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon size={24} className={stat.color} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      {profile?.role === 'residente' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('dashboard.quickActions')}
              </h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action) => (
                  <Button
                    key={action.name}
                    variant="ghost"
                    className="h-20 flex-col space-y-2"
                    onClick={() => window.location.href = action.href}
                  >
                    <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center`}>
                      <action.icon size={20} className="text-white" />
                    </div>
                    <span className="text-sm">{action.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t('dashboard.recentActivity')}
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">
                    Nuevo pago registrado
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Hace 2 horas
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">
                    Reserva aprobada
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Hace 4 horas
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">
                    Nueva incidencia reportada
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Hace 1 día
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Próximos Eventos
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Calendar size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Reunión de Consorcio
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    15 de Febrero - 7:00 PM
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <Clock size={20} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Mantenimiento Ascensores
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    18 de Febrero - 9:00 AM
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}