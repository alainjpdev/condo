import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, MapPin, Plus, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useAuth } from '../hooks/useAuth';
import { supabase, Reservation, CommonArea } from '../lib/supabase';

export function Reservations() {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const [reservations, setReservations] = useState<(Reservation & { area: CommonArea })[]>([]);
  const [commonAreas, setCommonAreas] = useState<CommonArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewReservation, setShowNewReservation] = useState(false);
  const [newReservation, setNewReservation] = useState({
    area_id: '',
    start_time: '',
    end_time: '',
    notes: '',
  });

  useEffect(() => {
    fetchReservations();
    fetchCommonAreas();
  }, [profile]);

  const fetchReservations = async () => {
    try {
      let query = supabase
        .from('reservations')
        .select(`
          *,
          area:common_areas(*)
        `)
        .order('start_time', { ascending: false });

      if (profile?.role === 'residente') {
        query = query.eq('user_id', profile.id);
      }

      const { data, error } = await query;
      if (error) throw error;
      setReservations(data || []);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommonAreas = async () => {
    try {
      const { data, error } = await supabase
        .from('common_areas')
        .select('*')
        .eq('available', true)
        .order('name');

      if (error) throw error;
      setCommonAreas(data || []);
    } catch (error) {
      console.error('Error fetching common areas:', error);
    }
  };

  const handleCreateReservation = async () => {
    try {
      if (!profile) return;

      const { error } = await supabase
        .from('reservations')
        .insert([{
          ...newReservation,
          user_id: profile.id,
        }]);

      if (error) throw error;

      setShowNewReservation(false);
      setNewReservation({
        area_id: '',
        start_time: '',
        end_time: '',
        notes: '',
      });
      fetchReservations();
    } catch (error) {
      console.error('Error creating reservation:', error);
    }
  };

  const handleUpdateStatus = async (reservationId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('id', reservationId);

      if (error) throw error;
      fetchReservations();
    } catch (error) {
      console.error('Error updating reservation:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprobado': return 'success';
      case 'rechazado': return 'error';
      default: return 'warning';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aprobado': return CheckCircle;
      case 'rechazado': return XCircle;
      default: return AlertCircle;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('reservations.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {profile?.role === 'admin' ? 'Gestión de todas las reservas' : t('reservations.myReservations')}
            </p>
          </div>
          
          {profile?.role === 'residente' && (
            <Button onClick={() => setShowNewReservation(true)}>
              <Plus size={20} className="mr-2" />
              {t('reservations.newReservation')}
            </Button>
          )}
        </div>
      </motion.div>

      {/* Áreas Comunes Disponibles */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('reservations.availableAreas')}
          </h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {commonAreas.map((area) => (
              <motion.div
                key={area.id}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {area.name}
                  </h3>
                  <MapPin size={20} className="text-blue-600" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {area.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Users size={16} className="text-gray-400" />
                    <span>{area.capacity} personas</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">${area.hourly_rate}/hora</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Reservas */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Reservas Recientes
          </h2>
        </CardHeader>
        <CardContent>
          {reservations.length === 0 ? (
            <div className="text-center py-8">
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {t('reservations.noReservations')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reservations.map((reservation, index) => {
                const StatusIcon = getStatusIcon(reservation.status);
                return (
                  <motion.div
                    key={reservation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <StatusIcon size={24} className={`text-${getStatusColor(reservation.status) === 'success' ? 'green' : getStatusColor(reservation.status) === 'error' ? 'red' : 'orange'}-600`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {reservation.area?.name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                          <div className="flex items-center space-x-1">
                            <Calendar size={16} />
                            <span>{new Date(reservation.start_time).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock size={16} />
                            <span>
                              {new Date(reservation.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                              {new Date(reservation.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <Badge variant={getStatusColor(reservation.status)}>
                        {t(`common.${reservation.status}`)}
                      </Badge>
                      
                      {profile?.role === 'admin' && reservation.status === 'pendiente' && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateStatus(reservation.id, 'rechazado')}
                          >
                            Rechazar
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(reservation.id, 'aprobado')}
                          >
                            Aprobar
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Nueva Reserva */}
      <Modal
        isOpen={showNewReservation}
        onClose={() => setShowNewReservation(false)}
        title={t('reservations.newReservation')}
      >
        <div className="space-y-6">
          <Select
            label={t('reservations.selectArea')}
            value={newReservation.area_id}
            onChange={(e) => setNewReservation({ ...newReservation, area_id: e.target.value })}
            options={[
              { value: '', label: 'Seleccionar área...' },
              ...commonAreas.map(area => ({
                value: area.id,
                label: `${area.name} - $${area.hourly_rate}/hora`
              }))
            ]}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('reservations.startTime')}
              type="datetime-local"
              value={newReservation.start_time}
              onChange={(e) => setNewReservation({ ...newReservation, start_time: e.target.value })}
            />
            <Input
              label={t('reservations.endTime')}
              type="datetime-local"
              value={newReservation.end_time}
              onChange={(e) => setNewReservation({ ...newReservation, end_time: e.target.value })}
            />
          </div>

          <Input
            label={t('reservations.notes')}
            value={newReservation.notes}
            onChange={(e) => setNewReservation({ ...newReservation, notes: e.target.value })}
            placeholder="Notas adicionales (opcional)"
          />

          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowNewReservation(false)}
              className="flex-1"
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleCreateReservation}
              className="flex-1"
              disabled={!newReservation.area_id || !newReservation.start_time || !newReservation.end_time}
            >
              {t('common.create')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}