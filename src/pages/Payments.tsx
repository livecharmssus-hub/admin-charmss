import React, { useState } from 'react';
import { Calendar, DollarSign, TrendingUp, Download, Filter } from 'lucide-react';
import PaymentMethodsDrillDown from '../components/payments/PaymentMethodsDrillDown';
import ModelPayments from '../components/payments/ModelPayments';
import PaymentConfirmationDialog from '../components/payments/PaymentConfirmationDialog';

interface PaymentsProps {
  earnings: number;
}

const Payments: React.FC<PaymentsProps> = ({ earnings }) => {
  const [selectedWeek, setSelectedWeek] = useState('Semana 33, 2025');
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const weeklyData = [
    { week: 12, amount: 0.09, status: 'GENERATED' },
    { week: 11, amount: 0.09, status: 'GENERATED' },
    { week: 10, amount: 1.98, status: 'GENERATED' },
    { week: 3, amount: 0.09, status: 'GENERATED' },
    { week: 17, amount: 0.09, status: 'GENERATED' },
  ];

  const recentTransactions = [
    { date: '2025-01-15', type: 'Private Show', amount: 45.5, status: 'Completed' },
    { date: '2025-01-14', type: 'Tips', amount: 23.75, status: 'Completed' },
    { date: '2025-01-14', type: 'Video Call', amount: 67.2, status: 'Completed' },
    { date: '2025-01-13', type: 'Gifts', amount: 12.3, status: 'Pending' },
  ];

  const handleModelPayment = (model: any) => {
    setSelectedPayment({
      id: model.id,
      recipient_name: model.stage_name,
      recipient_type: 'model',
      amount: model.pending_amount,
      commission_amount: model.commission_amount,
      net_amount: model.net_amount,
      commission_rate: model.commission_rate,
    });
    setShowConfirmation(true);
  };

  const handleConfirmPayment = (paymentMethod: string, notes: string) => {
    console.log('Payment confirmed:', { ...selectedPayment, paymentMethod, notes });
    setShowConfirmation(false);
    setSelectedPayment(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Payments & Earnings
        </h1>
        <div className="flex items-center space-x-2 md:space-x-3">
          <button className="bg-green-600 hover:bg-green-700 text-white px-3 md:px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors text-sm">
            <Download className="w-4 h-4" />
            <span className="hidden md:inline">Export Report</span>
          </button>
          <button className="bg-slate-700 dark:bg-slate-600 hover:bg-slate-600 dark:hover:bg-slate-500 text-white px-3 md:px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors text-sm">
            <Filter className="w-4 h-4" />
            <span className="hidden md:inline">Filter</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-3 md:p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">Total Earnings</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                ${earnings.toFixed(2)}
              </p>
            </div>
            <div className="p-2 md:p-3 rounded-lg bg-green-600">
              <DollarSign className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-3 md:p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">This Week</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">$234.50</p>
            </div>
            <div className="p-2 md:p-3 rounded-lg bg-blue-600">
              <Calendar className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-3 md:p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">Pending</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">$45.30</p>
            </div>
            <div className="p-2 md:p-3 rounded-lg bg-yellow-600">
              <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-3 md:p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">Available</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">$189.20</p>
            </div>
            <div className="p-2 md:p-3 rounded-lg bg-purple-600">
              <DollarSign className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-3 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
              Weekly Payments
            </h3>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="bg-white dark:bg-slate-700 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-600 px-2 md:px-3 py-1 rounded text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Semana 33, 2025">Semana 33, 2025</option>
                <option value="Semana 32, 2025">Semana 32, 2025</option>
                <option value="Semana 31, 2025">Semana 31, 2025</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-slate-700 p-3 md:p-4 rounded-lg">
              <div className="grid grid-cols-4 gap-2 md:gap-4 text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                <div>Week</div>
                <div>Amount US$</div>
                <div className="hidden md:block">Payment method</div>
                <div className="md:hidden">Method</div>
                <div>Status</div>
              </div>

              {weeklyData.map((payment, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 gap-2 md:gap-4 text-xs md:text-sm py-2 border-t border-gray-200 dark:border-slate-600"
                >
                  <div className="text-gray-900 dark:text-white">{payment.week}</div>
                  <div className="text-gray-900 dark:text-white">{payment.amount.toFixed(2)}</div>
                  <div className="text-gray-500 dark:text-gray-400">-</div>
                  <div className="text-green-500 text-xs">{payment.status}</div>
                </div>
              ))}

              <div className="border-t border-gray-200 dark:border-slate-600 pt-3 mt-3">
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-gray-500 dark:text-gray-400">TOTAL</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {weeklyData.reduce((sum, payment) => sum + payment.amount, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center text-gray-500 dark:text-gray-400 text-xs md:text-sm">
              for this cut of payments there is no sales information
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-3 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Payment Methods - Models
          </h3>
          <PaymentMethodsDrillDown />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-3 md:p-6">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Transactions
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 text-xs md:text-sm border-b border-gray-200 dark:border-slate-700">
                <th className="pb-3">Date</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 hidden md:table-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((transaction, index) => (
                <tr key={index} className="border-b border-gray-200 dark:border-slate-700">
                  <td className="py-3 text-gray-900 dark:text-white text-xs md:text-sm">
                    {transaction.date}
                  </td>
                  <td className="py-3 text-gray-600 dark:text-gray-300 text-xs md:text-sm">
                    {transaction.type}
                  </td>
                  <td className="py-3 text-green-600 dark:text-green-400 font-medium text-xs md:text-sm">
                    ${transaction.amount.toFixed(2)}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        transaction.status === 'Completed'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-3 hidden md:table-cell">
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs md:text-sm transition-colors">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-3 md:p-6">
        <ModelPayments onTransferPayment={handleModelPayment} />
      </div>

      {showConfirmation && selectedPayment && (
        <PaymentConfirmationDialog
          payment={selectedPayment}
          onConfirm={handleConfirmPayment}
          onCancel={() => {
            setShowConfirmation(false);
            setSelectedPayment(null);
          }}
        />
      )}
    </div>
  );
};

export default Payments;
