import React, { useState } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  DollarSign,
} from 'lucide-react';
import { ApiPaymentStatus, PerformerPayment } from '../../app/types/payments.types';

interface PaymentListProps {
  payments: PerformerPayment[];
  loading?: boolean;
  error?: string | null;
  onBulkPay: () => void;
}

const GRID_COLS =
  'grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.7fr)_minmax(0,0.8fr)_minmax(0,0.9fr)]';

const ITEMS_PER_PAGE = 10;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const getPaymentStatusLabel = (status: ApiPaymentStatus) => {
  switch (status) {
    case 'GENERATED':
      return 'Generado';
    case 'PENDING':
      return 'Pendiente';
    case 'PAID':
      return 'Pagado';
    case 'FAILED':
      return 'Fallido';
    default:
      return status;
  }
};

const getPaymentStatusColor = (status: ApiPaymentStatus) => {
  switch (status) {
    case 'GENERATED':
      return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    case 'PENDING':
      return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
    case 'PAID':
      return 'bg-green-500/20 text-green-400 border border-green-500/30';
    case 'FAILED':
      return 'bg-red-500/20 text-red-400 border border-red-500/30';
    default:
      return 'bg-slate-600/50 text-slate-300 border border-slate-500/30';
  }
};

function PaymentRow({ payment }: { payment: PerformerPayment }) {
  return (
    <div
      className={`shrink-0 ${GRID_COLS} gap-2 items-center px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/40 transition-colors`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-white text-[10px] font-semibold ${payment.avatar_color}`}
        >
          {payment.initials}
        </div>
        <div className="min-w-0">
          <span className="block text-sm font-medium text-gray-900 dark:text-white truncate">
            {payment.nickname}
          </span>
        </div>
      </div>
      <span className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
        {formatCurrency(payment.total_sales)}
      </span>
      <span className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
        {formatCurrency(payment.total_payment)}
      </span>
      <span className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
        {payment.commission_percent}%
      </span>
      <span className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
        ${payment.price_token.toFixed(2)}
      </span>
      <div>
        <span
          className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${getPaymentStatusColor(
            payment.payment_status
          )}`}
        >
          {getPaymentStatusLabel(payment.payment_status)}
        </span>
      </div>
    </div>
  );
}

export default function PaymentList({ payments, loading, error, onBulkPay }: PaymentListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const pendingCount = payments.filter(
    (p) => p.payment_status === 'GENERATED' || p.payment_status === 'PENDING'
  ).length;

  const filteredPayments = payments.filter((payment) => {
    const term = searchTerm.toLowerCase();
    return (
      payment.nickname.toLowerCase().includes(term) ||
      payment.fullname.toLowerCase().includes(term) ||
      payment.email.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedPayments = filteredPayments.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-2.5">
      <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white">
            Listado General de Pagos
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 hidden lg:block">
            Gestión de pagos y estado de performers
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-56 flex-shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar modelo..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-1.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          <button
            type="button"
            onClick={onBulkPay}
            disabled={loading || pendingCount === 0}
            className="flex items-center justify-center gap-2 px-4 py-1.5 bg-linear-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <DollarSign className="h-4 w-4" />
            Pagar
            {pendingCount > 0 && (
              <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded">
                {pendingCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex-shrink-0 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="hidden md:flex flex-1 min-h-0 flex-col overflow-hidden">
        <div
          className={`flex-shrink-0 ${GRID_COLS} gap-2 px-3 py-1.5 border-b border-gray-200 dark:border-slate-700`}
        >
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Modelo
          </span>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Ventas
          </span>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Pago
          </span>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Comisión
          </span>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Precio Token
          </span>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Estado
          </span>
        </div>

        <div
          className={`flex-1 min-h-0 overflow-hidden pt-1 pb-2 ${
            paginatedPayments.length === ITEMS_PER_PAGE
              ? 'grid gap-1'
              : 'flex flex-col justify-start gap-1'
          }`}
          style={
            paginatedPayments.length === ITEMS_PER_PAGE
              ? { gridTemplateRows: `repeat(${ITEMS_PER_PAGE}, minmax(0, 1fr))` }
              : undefined
          }
        >
          {loading ? (
            <div className="flex items-center justify-center py-12 text-sm text-gray-500 dark:text-gray-400 gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Cargando pagos...
            </div>
          ) : paginatedPayments.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-sm text-gray-500 dark:text-gray-400">
              No se encontraron performers
            </div>
          ) : (
            paginatedPayments.map((payment) => (
              <PaymentRow key={payment.id} payment={payment} />
            ))
          )}
        </div>

        {!loading && filteredPayments.length > 0 && (
          <div className="flex-shrink-0 flex flex-col sm:flex-row items-center justify-between gap-2 pt-3 border-t border-gray-200 dark:border-slate-700">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Mostrando {startIndex + 1}-{Math.min(endIndex, filteredPayments.length)} de{' '}
              {filteredPayments.length}
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Primera página"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Página anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  if (totalPages <= 5) return true;
                  if (page === 1 || page === totalPages) return true;
                  if (page >= currentPage - 1 && page <= currentPage + 1) return true;
                  return false;
                })
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-1 text-gray-400 text-xs">...</span>
                    )}
                    <button
                      onClick={() => goToPage(page)}
                      className={`w-7 h-7 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-pink-600 text-white'
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Página siguiente"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Última página"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="md:hidden flex-1 min-h-0 overflow-y-auto space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-sm text-gray-500 dark:text-gray-400 gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Cargando pagos...
          </div>
        ) : (
          paginatedPayments.map((payment) => (
            <div
              key={payment.id}
              className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-white text-sm font-semibold ${payment.avatar_color}`}
                  >
                    {payment.initials}
                  </div>
                  <div className="min-w-0">
                    <span className="block font-medium text-gray-900 dark:text-white truncate">
                      {payment.nickname}
                    </span>
                    <span className="block text-xs text-gray-500 dark:text-gray-400 truncate">
                      {payment.email}
                    </span>
                  </div>
                </div>
                <span
                  className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full shrink-0 ${getPaymentStatusColor(
                    payment.payment_status
                  )}`}
                >
                  {getPaymentStatusLabel(payment.payment_status)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>Ventas: {formatCurrency(payment.total_sales)}</span>
                <span>Pago: {formatCurrency(payment.total_payment)}</span>
                <span>Comisión: {payment.commission_percent}%</span>
                <span>Token: ${payment.price_token.toFixed(2)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {!loading && filteredPayments.length > 0 && (
        <div className="md:hidden flex-shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-gray-200 dark:border-slate-700">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Mostrando {startIndex + 1}-{Math.min(endIndex, filteredPayments.length)} de{' '}
            {filteredPayments.length}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-7 h-7 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-pink-600 text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
