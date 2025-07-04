import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CreditCard, Calendar, DollarSign, Upload, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useAuth } from '../hooks/useAuth';
import { supabase, Payment, Unit } from '../lib/supabase';

export function Payments() {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const [payments, setPayments] = useState<(Payment & { unit: Unit })[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, [profile]);

  const fetchPayments = async () => {
    try {
      let query = supabase
        .from('payments')
        .select(`
          *,
          unit:units(*)
        `)
        .order('due_date', { ascending: false });

      if (profile?.role === 'residente') {
        // Solo pagos de las unidades del residente
        const { data: userUnits } = await supabase
          .from('units')
          .select('id')
          .eq('resident_id', profile.id);
        
        if (userUnits && userUnits.length > 0) {
          const unitIds = userUnits.map(unit => unit.id);
          query = query.in('unit_id', unitIds);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async (paymentId: string) => {
    try {
      const { error } = await supabase
        .from('payments')
        .update({
          status: 'pagado',
          paid_at: new Date().toISOString(),
        })
        .eq('id', paymentId);

      if (error) throw error;
      
      fetchPayments();
      setShowPaymentModal(false);
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pagado': return 'success';
      case 'vencido': return 'error';
      default: return 'warning';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pagado': return CheckCircle;
      case 'vencido': return AlertCircle;
      default: return Clock;
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
              {t('payments.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {profile?.role === 'admin' ? 'Gestión de todos los pagos' : t('payments.myPayments')}
            </p>
          </div>
          
          {profile?.role === 'admin' && (
            <Button>
              <DollarSign size={20} className="mr-2" />
              Generar Cuotas
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
                  {t('payments.pendingPayments')}
                </p>
                <p className="text-3xl font-bold text-orange-600">
                  {payments.filter(p => p.status === 'pendiente').length}
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
                  Pagos Realizados
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {payments.filter(p => p.status === 'pagado').length}
                </p>
              </div>
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pagos Vencidos
                </p>
                <p className="text-3xl font-bold text-red-600">
                  {payments.filter(p => p.status === 'vencido').length}
                </p>
              </div>
              <AlertCircle size={24} className="text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Pagos */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('payments.paymentHistory')}
          </h2>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {t('payments.noPayments')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment, index) => {
                const StatusIcon = getStatusIcon(payment.status);
                return (
                  <motion.div
                    key={payment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <StatusIcon size={24} className={`text-${getStatusColor(payment.status) === 'success' ? 'green' : getStatusColor(payment.status) === 'error' ? 'red' : 'orange'}-600`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {payment.unit?.name} - {t('payments.monthlyFee')}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {t('payments.dueDate')}: {new Date(payment.due_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-white">
                          ${payment.amount.toFixed(2)}
                        </p>
                        <Badge variant={getStatusColor(payment.status)}>
                          {t(`common.${payment.status}`)}
                        </Badge>
                      </div>
                      
                      {payment.status === 'pendiente' && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedPayment(payment);
                            setShowPaymentModal(true);
                          }}
                        >
                          {profile?.role === 'admin' ? t('payments.markAsPaid') : t('payments.payNow')}
                        </Button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Pago */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title={profile?.role === 'admin' ? 'Marcar como Pagado' : 'Realizar Pago'}
      >
        {selectedPayment && (
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Detalles del Pago
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Unidad:</span>
                  <span className="font-medium">{selectedPayment.unit?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Monto:</span>
                  <span className="font-medium">${selectedPayment.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Vencimiento:</span>
                  <span className="font-medium">
                    {new Date(selectedPayment.due_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {profile?.role === 'residente' && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    {t('payments.uploadReceipt')}
                  </p>
                  <Button variant="outline" size="sm">
                    Seleccionar Archivo
                  </Button>
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowPaymentModal(false)}
                className="flex-1"
              >
                {t('common.cancel')}
              </Button>
              <Button
                onClick={() => handleMarkAsPaid(selectedPayment.id)}
                className="flex-1"
              >
                {profile?.role === 'admin' ? 'Confirmar Pago' : 'Procesar Pago'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}