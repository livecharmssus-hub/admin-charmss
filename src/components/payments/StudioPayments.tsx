import React, { useState } from 'react';
import { Building2, DollarSign, Calendar, ArrowRight, AlertCircle, Search } from 'lucide-react';

interface StudioPayment {
  id: string;
  studio_name: string;
  pending_amount: number;
  commission_amount: number;
  net_amount: number;
  due_date: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  models_count: number;
  last_payment_date: string;
}

interface StudioPaymentsProps {
  onTransferPayment: (studio: StudioPayment) => void;
}

const MOCK_STUDIO_PAYMENTS: StudioPayment[] = [
  {
    id: '1',
    studio_name: 'Dreamscape Productions',
    pending_amount: 15000.00,
    commission_amount: 9000.00,
    net_amount: 6000.00,
    due_date: '2024-10-15',
    priority: 'high',
    models_count: 15,
    last_payment_date: '2024-09-15'
  },
  {
    id: '2',
    studio_name: 'Starlight Entertainment',
    pending_amount: 22000.00,
    commission_amount: 12760.00,
    net_amount: 9240.00,
    due_date: '2024-10-20',
    priority: 'urgent',
    models_count: 22,
    last_payment_date: '2024-09-20'
  },
  {
    id: '3',
    studio_name: 'Platinum Models Agency',
    pending_amount: 8500.00,
    commission_amount: 4675.00,
    net_amount: 3825.00,
    due_date: '2024-10-25',
    priority: 'medium',
    models_count: 18,
    last_payment_date: '2024-09-25'
  },
  {
    id: '4',
    studio_name: 'Diamond Entertainment Group',
    pending_amount: 18000.00,
    commission_amount: 10800.00,
    net_amount: 7200.00,
    due_date: '2024-10-10',
    priority: 'urgent',
    models_count: 25,
    last_payment_date: '2024-09-10'
  }
];

export default function StudioPayments({ onTransferPayment }: StudioPaymentsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const filteredPayments = MOCK_STUDIO_PAYMENTS.filter(payment => {
    const matchesSearch = payment.studio_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || payment.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'Urgente';
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Media';
      case 'low':
        return 'Baja';
      default:
        return priority;
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const totalPending = filteredPayments.reduce((sum, p) => sum + p.pending_amount, 0);
  const totalCommission = filteredPayments.reduce((sum, p) => sum + p.commission_amount, 0);
  const urgentCount = filteredPayments.filter(p => p.priority === 'urgent').length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Pagos Pendientes a Studios
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {filteredPayments.length} studios requieren pago
            {urgentCount > 0 && ` • ${urgentCount} urgentes`}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar studio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm w-full sm:w-64"
            />
          </div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="all">Todas las prioridades</option>
            <option value="urgent">Urgente</option>
            <option value="high">Alta</option>
            <option value="medium">Media</option>
            <option value="low">Baja</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Total Pendiente</p>
              <p className="text-2xl font-bold">${totalPending.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm mb-1">Comisiones Totales</p>
              <p className="text-2xl font-bold">${totalCommission.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-emerald-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm mb-1">Studios Activos</p>
              <p className="text-2xl font-bold">{filteredPayments.length}</p>
            </div>
            <Building2 className="h-8 w-8 text-purple-200" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filteredPayments.length === 0 ? (
          <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-8 text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">No se encontraron studios</p>
          </div>
        ) : (
          filteredPayments.map((payment) => (
            <div
              key={payment.id}
              className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                        {payment.studio_name}
                      </h4>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(payment.priority)}`}>
                        {getPriorityText(payment.priority)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {payment.models_count} modelos activas
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-shrink-0">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Monto Pendiente</p>
                    <p className="text-base font-bold text-gray-900 dark:text-white">
                      ${payment.pending_amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Comisión</p>
                    <p className="text-base font-semibold text-emerald-600 dark:text-emerald-400">
                      ${payment.commission_amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Neto a Studio</p>
                    <p className="text-base font-semibold text-blue-600 dark:text-blue-400">
                      ${payment.net_amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Fecha Límite</p>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <p className={`text-sm font-medium ${
                        isOverdue(payment.due_date)
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {new Date(payment.due_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onTransferPayment(payment)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all font-medium text-sm flex-shrink-0 w-full lg:w-auto"
                >
                  <DollarSign className="h-4 w-4" />
                  Transferir Pago
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {isOverdue(payment.due_date) && (
                <div className="mt-3 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>Pago vencido - Requiere atención inmediata</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
