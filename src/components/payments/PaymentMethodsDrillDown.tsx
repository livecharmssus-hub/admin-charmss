import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Building2, User, DollarSign, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Model {
  id: string;
  name: string;
  stage_name: string;
  total_paid: number;
  commission_rate: number;
  pending_amount: number;
  last_payment_date: string;
  payment_status: 'up_to_date' | 'pending' | 'overdue';
  payment_history: PaymentHistoryItem[];
}

interface PaymentHistoryItem {
  id: string;
  date: string;
  amount: number;
  commission: number;
  method: string;
  status: 'completed' | 'pending' | 'failed';
}

interface Studio {
  id: string;
  name: string;
  total_paid: number;
  pending_amount: number;
  models_count: number;
  avg_commission: number;
  models: Model[];
}

interface PaymentMethodsDrillDownProps {
  onSelectModel?: (model: Model) => void;
}

const MOCK_STUDIOS: Studio[] = [
  {
    id: '1',
    name: 'Dreamscape Productions',
    total_paid: 125000.00,
    pending_amount: 15000.00,
    models_count: 15,
    avg_commission: 60,
    models: [
      {
        id: '1',
        name: 'Diana Herrera',
        stage_name: 'Di Goddess',
        total_paid: 35000.00,
        commission_rate: 60,
        pending_amount: 4500.00,
        last_payment_date: '2024-10-01',
        payment_status: 'pending',
        payment_history: [
          { id: 'p1', date: '2024-10-01', amount: 5000.00, commission: 3000.00, method: 'Bank Transfer', status: 'completed' },
          { id: 'p2', date: '2024-09-01', amount: 4800.00, commission: 2880.00, method: 'Bank Transfer', status: 'completed' },
          { id: 'p3', date: '2024-08-01', amount: 5200.00, commission: 3120.00, method: 'Bank Transfer', status: 'completed' }
        ]
      },
      {
        id: '2',
        name: 'Isabella Martinez',
        stage_name: 'Bella Charm',
        total_paid: 28000.00,
        commission_rate: 55,
        pending_amount: 3200.00,
        last_payment_date: '2024-09-28',
        payment_status: 'up_to_date',
        payment_history: [
          { id: 'p4', date: '2024-09-28', amount: 4500.00, commission: 2475.00, method: 'Bank Transfer', status: 'completed' },
          { id: 'p5', date: '2024-08-28', amount: 4200.00, commission: 2310.00, method: 'PayPal', status: 'completed' }
        ]
      }
    ]
  }
];

export default function PaymentMethodsDrillDown({ onSelectModel }: PaymentMethodsDrillDownProps) {
  const [expandedStudio, setExpandedStudio] = useState<string | null>('1');
  const [expandedModel, setExpandedModel] = useState<string | null>(null);

  const toggleStudio = (studioId: string) => {
    setExpandedStudio(expandedStudio === studioId ? null : studioId);
    setExpandedModel(null);
  };

  const toggleModel = (modelId: string) => {
    setExpandedModel(expandedModel === modelId ? null : modelId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'up_to_date':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'overdue':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'up_to_date':
        return 'Al día';
      case 'pending':
        return 'Pendiente';
      case 'overdue':
        return 'Vencido';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-3">
      {MOCK_STUDIOS.map((studio) => (
        <div
          key={studio.id}
          className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden"
        >
          <div
            onClick={() => toggleStudio(studio.id)}
            className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center gap-2">
                  {expandedStudio === studio.id ? (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  )}
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{studio.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {studio.models_count} modelos • Comisión promedio: {studio.avg_commission}%
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  ${studio.total_paid.toLocaleString()}
                </div>
                <div className="text-sm text-yellow-600 dark:text-yellow-400">
                  Pendiente: ${studio.pending_amount.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {expandedStudio === studio.id && (
            <div className="border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-750">
              {studio.models.map((model) => (
                <div key={model.id} className="border-b border-gray-200 dark:border-slate-700 last:border-b-0">
                  <div
                    onClick={() => toggleModel(model.id)}
                    className="p-4 pl-16 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex items-center gap-2">
                          {expandedModel === model.id ? (
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          )}
                          <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 dark:text-white">{model.stage_name}</span>
                            {getStatusIcon(model.payment_status)}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {model.name} • Comisión: {model.commission_rate}%
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-semibold text-gray-900 dark:text-white">
                          ${model.total_paid.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Último pago: {new Date(model.last_payment_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {expandedModel === model.id && (
                    <div className="bg-white dark:bg-slate-800 p-4 pl-24">
                      <div className="mb-4 grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                          <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">Total Pagado</div>
                          <div className="text-lg font-bold text-blue-900 dark:text-blue-300">
                            ${model.total_paid.toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
                          <div className="text-xs text-yellow-600 dark:text-yellow-400 mb-1">Pendiente</div>
                          <div className="text-lg font-bold text-yellow-900 dark:text-yellow-300">
                            ${model.pending_amount.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="mb-2 flex items-center justify-between">
                        <h5 className="text-sm font-semibold text-gray-900 dark:text-white">Historial de Pagos</h5>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          model.payment_status === 'up_to_date'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : model.payment_status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {getStatusText(model.payment_status)}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {model.payment_history.map((payment) => (
                          <div
                            key={payment.id}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg text-sm"
                          >
                            <div className="flex items-center gap-3">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <div>
                                <div className="text-gray-900 dark:text-white font-medium">
                                  {new Date(payment.date).toLocaleDateString()}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {payment.method}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-gray-900 dark:text-white">
                                ${payment.amount.toLocaleString()}
                              </div>
                              <div className="text-xs text-emerald-600 dark:text-emerald-400">
                                Comisión: ${payment.commission.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
