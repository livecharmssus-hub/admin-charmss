import React, { useEffect, useMemo, useState } from 'react';
import { X, DollarSign, Search, CheckSquare, Square } from 'lucide-react';
import { PerformerPayment } from '../../app/types/payments.types';

interface BulkPayModalProps {
  payments: PerformerPayment[];
  weekofYear: number;
  open: boolean;
  onClose: () => void;
  onConfirm: (selectedPayments: PerformerPayment[]) => void;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const isPayable = (payment: PerformerPayment) =>
  payment.payment_status === 'GENERATED' || payment.payment_status === 'PENDING';

export default function BulkPayModal({
  payments,
  weekofYear,
  open,
  onClose,
  onConfirm,
}: BulkPayModalProps) {
  const payablePayments = useMemo(() => payments.filter(isPayable), [payments]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!open) return;
    setSelectedIds(new Set(payablePayments.map((p) => p.id)));
    setSearchTerm('');
  }, [open, payablePayments]);

  if (!open) return null;

  const filteredPayments = payablePayments.filter((payment) => {
    const term = searchTerm.toLowerCase();
    return (
      payment.nickname.toLowerCase().includes(term) ||
      payment.fullname.toLowerCase().includes(term) ||
      payment.email.toLowerCase().includes(term)
    );
  });

  const filteredIds = filteredPayments.map((p) => p.id);
  const allFilteredSelected =
    filteredIds.length > 0 && filteredIds.every((id) => selectedIds.has(id));

  const togglePayment = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAllFiltered = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allFilteredSelected) {
        filteredIds.forEach((id) => next.delete(id));
      } else {
        filteredIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const selectedPayments = payablePayments.filter((p) => selectedIds.has(p.id));
  const totalSelected = selectedPayments.reduce((sum, p) => sum + p.total_payment, 0);

  return (
    <div className="modal-backdrop-adaptive">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-5 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 bg-linear-to-r from-pink-600 to-purple-600 rounded-lg shrink-0">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                  Pago Masivo
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Semana {weekofYear} · Selecciona las modelos a pagar
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col p-5 gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar modelo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <button
              type="button"
              onClick={toggleAllFiltered}
              disabled={filteredPayments.length === 0}
              className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {allFilteredSelected ? (
                <CheckSquare className="h-4 w-4" />
              ) : (
                <Square className="h-4 w-4" />
              )}
              {allFilteredSelected ? 'Desmarcar todas' : 'Marcar todas'}
            </button>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto rounded-lg border border-gray-200 dark:border-slate-600 divide-y divide-gray-100 dark:divide-slate-700">
            {payablePayments.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-sm text-gray-500 dark:text-gray-400">
                No hay pagos pendientes para esta semana
              </div>
            ) : filteredPayments.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-sm text-gray-500 dark:text-gray-400">
                No se encontraron modelos
              </div>
            ) : (
              filteredPayments.map((payment) => {
                const checked = selectedIds.has(payment.id);
                return (
                  <label
                    key={payment.id}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/40 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => togglePayment(payment.id)}
                      className="h-4 w-4 rounded border-gray-300 dark:border-slate-500 text-pink-600 focus:ring-pink-500"
                    />
                    <div
                      className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-white text-[10px] font-semibold ${payment.avatar_color}`}
                    >
                      {payment.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-gray-900 dark:text-white truncate">
                        {payment.nickname}
                      </span>
                      <span className="block text-xs text-gray-500 dark:text-gray-400 truncate">
                        {payment.fullname}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                      {formatCurrency(payment.total_payment)}
                    </span>
                  </label>
                );
              })
            )}
          </div>

          <div className="flex items-center justify-between gap-3 rounded-lg bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 px-4 py-3">
            <div>
              <p className="text-xs text-pink-600 dark:text-pink-300">
                {selectedPayments.length} modelo{selectedPayments.length !== 1 ? 's' : ''} seleccionada
                {selectedPayments.length !== 1 ? 's' : ''}
              </p>
              <p className="text-lg font-bold text-pink-700 dark:text-pink-300">
                {formatCurrency(totalSelected)}
              </p>
            </div>
            <p className="text-xs text-pink-600/80 dark:text-pink-300/80 text-right max-w-[40%]">
              Total a procesar en este pago masivo
            </p>
          </div>
        </div>

        <div className="p-5 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-750">
          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => onConfirm(selectedPayments)}
              disabled={selectedPayments.length === 0}
              className="flex items-center justify-center gap-2 px-5 py-2 bg-linear-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <DollarSign className="h-4 w-4" />
              Confirmar Pago ({selectedPayments.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
