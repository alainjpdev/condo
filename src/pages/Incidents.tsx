import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { AlertTriangle, Plus, Camera, User, Calendar, MapPin, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useAuth } from '../hooks/useAuth';
import { supabase, Incident, Unit, ServiceProvider } from '../lib/supabase';

export function Incidents() {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const [incidents, setIncidents] = useState<(Incident & { unit?: Unit; reporter: any; provider?: ServiceProvider })[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewIncident, setShowNewIncident] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [showIncidentDetail, setShowIncidentDetail] = useState(false);
  const [newIncident, setNewIncident] = useState({
    title: '',
    description: '',
    unit_id: '',
  });

  useEffect(() => {
    fetchIncidents();
    fetchUnits();
    fetchProviders();
  }, [profile]);

  const fetchIncidents = async () => {
    try {
      let query = supabase
        .from('incidents')
        .select(`
          *,
          unit:units(*),
          reporter:profiles!incidents_reporter_id_fkey(*),
          provider:service_providers(*)
        `)
        .order('created_at', { ascending: false });

      if (profile?.role === 'residente') {
        query = query.eq('reporter_id', profile.id);
      }

      const { data, error } = await query;
      if (error) throw error;
      setIncidents(data || []);
    } catch (error) {
      console.error('Error fetching incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnits = async () => {
    try {
      let query = supabase.from('units').select('*').order('name');
      
      if (profile?.role === 'residente') {
        query = query.eq('resident_id', profile.id);
      }

      const { data, error } = await query;
      if (error) throw error;
      setUnits(data || []);
    } catch (error) {
      console.error('Error fetching units:', error);
    }
  };

  const fetchProviders = async () => {
    try {
      const { data, error } = await supabase
        .from('service_providers')
        .select('*')
        .eq('available', true)
        .order('name');

      if (error) throw error;
      setProviders(data || []);
    } catch (error) {
      console.error('Error fetching providers:', error);
    }
  };

  const handleCreateIncident = async () => {
    try {
      if (!profile) return;

      const { error } = await supabase
        .from('incidents')
        .insert([{
          ...newIncident,
          reporter_id: profile.id,
        }]);

      if (error) throw error;

      setShowNewIncident(false);
      setNewIncident({
        title: '',
        description: '',
        unit_id: '',
      });
      fetchIncidents();
    } catch (error) {
      console.error('Error creating incident:', error);
    }
  };

  const handleUpdateStatus = async (incidentId: string, status: string, providerId?: string) => {
    try {
      const updateData: any = { status };
      if (providerId) {
        updateData.assigned_provider_id = providerId;
      }

      const { error } = await supabase
        .from('incidents')
        .update(updateData)
        .eq('id', incidentId);

      if (error) throw error;
      fetchIncidents();
    } catch (error) {
      console.error('Error updating incident:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resuelto': return 'success';
      case 'en_progreso': return 'warning';
      default: return 'error';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resuelto': return CheckCircle;
      case 'en_progreso': return Clock;
      default: return XCircle;
    }
  };

  const getPriorityColor = (createdAt: string) => {
    const daysSince = Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince > 7) return 'error';
    if (daysSince > 3) return 'warning';
    return 'info';
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
              {t('incidents.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {profile?.role === 'admin' ? 'Gestión de todas las incidencias' : t('incidents.myIncidents')}
            </p>
          </div>
          
          {profile?.role === 'residente' && (
            <Button onClick={() => setShowNewIncident(true)}>
              <Plus size={20} className="mr-2" />
              {t('incidents.newIncident')}
            </Button>
          )}
        </div>
      </motion.div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Nuevas
                </p>
                <p className="text-3xl font-bold text-red-600">
                  {incidents.filter(i => i.status === 'nuevo').length}
                </p>
              </div>
              <XCircle size={24} className="text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  En Progreso
                </p>
                <p className="text-3xl font-bold text-orange-600">
                  {incidents.filter(i => i.status === 'en_progreso').length}
                </p>
              </div>
              <Clock size={24} className="text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Resueltas
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {incidents.filter(i => i.status === 'resuelto').length}
                </p>
              </div>
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Incidencias */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Incidencias Recientes
          </h2>
        </CardHeader>
        <CardContent>
          {incidents.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {t('incidents.noIncidents')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {incidents.map((incident, index) => {
                const StatusIcon = getStatusIcon(incident.status);
                const priorityColor = getPriorityColor(incident.created_at);
                
                return (
                  <motion.div
                    key={incident.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => {
                      setSelectedIncident(incident);
                      setShowIncidentDetail(true);
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                        <StatusIcon size={24} className={`text-${getStatusColor(incident.status) === 'success' ? 'green' : getStatusColor(incident.status) === 'warning' ? 'orange' : 'red'}-600`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {incident.title}
                          </h3>
                          <Badge variant={priorityColor} size="sm">
                            {priorityColor === 'error' ? 'Alta' : priorityColor === 'warning' ? 'Media' : 'Baja'}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                          <div className="flex items-center space-x-1">
                            <MapPin size={16} />
                            <span>{incident.unit?.name || 'Área común'}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User size={16} />
                            <span>{incident.reporter?.full_name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar size={16} />
                            <span>{new Date(incident.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <Badge variant={getStatusColor(incident.status)}>
                        {t(`incidents.status${incident.status.charAt(0).toUpperCase() + incident.status.slice(1).replace('_', '')}`)}
                      </Badge>
                      
                      {profile?.role === 'admin' && incident.status !== 'resuelto' && (
                        <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                          {incident.status === 'nuevo' && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateStatus(incident.id, 'en_progreso')}
                            >
                              Asignar
                            </Button>
                          )}
                          {incident.status === 'en_progreso' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(incident.id, 'resuelto')}
                            >
                              Resolver
                            </Button>
                          )}
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

      {/* Modal Nueva Incidencia */}
      <Modal
        isOpen={showNewIncident}
        onClose={() => setShowNewIncident(false)}
        title={t('incidents.newIncident')}
      >
        <div className="space-y-6">
          <Input
            label={t('incidents.incidentTitle')}
            value={newIncident.title}
            onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
            placeholder="Ej: Fuga de agua en el baño"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('incidents.incidentDescription')}
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              rows={4}
              value={newIncident.description}
              onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
              placeholder="Describe detalladamente el problema..."
            />
          </div>

          <Select
            label={t('incidents.selectUnit')}
            value={newIncident.unit_id}
            onChange={(e) => setNewIncident({ ...newIncident, unit_id: e.target.value })}
            options={[
              { value: '', label: 'Área común' },
              ...units.map(unit => ({
                value: unit.id,
                label: unit.name
              }))
            ]}
          />

          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
            <Camera size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              {t('incidents.attachImage')}
            </p>
            <Button variant="outline" size="sm">
              Seleccionar Imagen
            </Button>
          </div>

          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowNewIncident(false)}
              className="flex-1"
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleCreateIncident}
              className="flex-1"
              disabled={!newIncident.title || !newIncident.description}
            >
              {t('incidents.reportIncident')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Detalle de Incidencia */}
      <Modal
        isOpen={showIncidentDetail}
        onClose={() => setShowIncidentDetail(false)}
        title="Detalle de Incidencia"
        size="lg"
      >
        {selectedIncident && (
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedIncident.title}
                </h3>
                <Badge variant={getStatusColor(selectedIncident.status)}>
                  {selectedIncident.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-300">Reportado por:</span>
                  <p className="font-medium">{selectedIncident.reporter?.full_name}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-300">Fecha:</span>
                  <p className="font-medium">{new Date(selectedIncident.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-300">Ubicación:</span>
                  <p className="font-medium">{selectedIncident.unit?.name || 'Área común'}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-300">Proveedor asignado:</span>
                  <p className="font-medium">{selectedIncident.provider?.name || 'Sin asignar'}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Descripción</h4>
              <p className="text-gray-600 dark:text-gray-300">{selectedIncident.description}</p>
            </div>

            {selectedIncident.image_url && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Imagen</h4>
                <img 
                  src={selectedIncident.image_url} 
                  alt="Incidencia" 
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}

            {profile?.role === 'admin' && selectedIncident.status !== 'resuelto' && (
              <div className="space-y-4">
                <Select
                  label="Asignar Proveedor"
                  options={[
                    { value: '', label: 'Seleccionar proveedor...' },
                    ...providers.map(provider => ({
                      value: provider.id,
                      label: `${provider.name} - ${provider.category}`
                    }))
                  ]}
                />
                
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => handleUpdateStatus(selectedIncident.id, 'en_progreso')}
                    className="flex-1"
                  >
                    Marcar en Progreso
                  </Button>
                  <Button
                    onClick={() => handleUpdateStatus(selectedIncident.id, 'resuelto')}
                    className="flex-1"
                  >
                    Marcar como Resuelto
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}