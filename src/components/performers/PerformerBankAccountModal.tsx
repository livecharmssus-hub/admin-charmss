import React, { useEffect, useState } from 'react';
import {
  X,
  DollarSign,
  Building2,
  CreditCard,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Star,
} from 'lucide-react';
import { Performer } from '../../app/types/performers.types';
import {
  FinancialAccountType,
  PerformerFinancialAccount,
  PerformerFinancialAccountInput,
} from '../../app/types/financialAccounts.types';
import FinancialAccountsService from '../../app/services/financialAccounts.service';

interface PerformerBankAccountModalProps {
  performer: Performer | null;
  onClose: () => void;
  onSaved?: () => void;
}

const EMPTY_FORM: PerformerFinancialAccountInput = {
  accountName: '',
  email: '',
  accountNumber: '',
  financialEntity: '',
  accountType: 'Ahorros',
  country: 'Colombia',
  currency: 'USD',
  isDefault: false,
};

const BANKS = [
  'Bancolombia',
  'Davivienda',
  'BBVA Colombia',
  'Banco de Bogotá',
  'Banco Popular',
  'Banco AV Villas',
  'Banco Caja Social',
  'Banco Pichincha',
  'Scotiabank Colpatria',
  'Citibank',
  'Otro',
];

const CURRENCIES = ['USD', 'COP', 'EUR', 'MXN'];

const maskAccountNumber = (value: string) => {
  const digits = value.replace(/\s/g, '');
  if (digits.length <= 4) return digits;
  return `**** **** **** ${digits.slice(-4)}`;
};

export default function PerformerBankAccountModal({
  performer,
  onClose,
  onSaved,
}: PerformerBankAccountModalProps) {
  const [accounts, setAccounts] = useState<PerformerFinancialAccount[]>([]);
  const [form, setForm] = useState<PerformerFinancialAccountInput>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetFormForNew = (existingCount: number) => {
    if (!performer) return;
    setEditingId(null);
    setForm({
      ...EMPTY_FORM,
      accountName: performer.full_name,
      email: performer.email,
      country: performer.country ?? performer.performerProfile?.countryCode ?? 'Colombia',
      isDefault: existingCount === 0,
    });
  };

  const loadAccounts = async () => {
    if (!performer) return;
    setLoading(true);
    setError(null);
    try {
      const list = await FinancialAccountsService.getFinancialAccounts(
        performer.id,
        performer.financialAccounts
      );
      setAccounts(list);
      if (list.length === 0) {
        resetFormForNew(0);
        setShowForm(true);
      } else {
        setShowForm(false);
        setEditingId(null);
      }
    } catch {
      setError('No se pudieron cargar las cuentas bancarias');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!performer) return;
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await FinancialAccountsService.getFinancialAccounts(
          performer.id,
          performer.financialAccounts
        );
        if (!mounted) return;
        setAccounts(list);
        if (list.length === 0) {
          setEditingId(null);
          setForm({
            ...EMPTY_FORM,
            accountName: performer.full_name,
            email: performer.email,
            country: performer.country ?? performer.performerProfile?.countryCode ?? 'Colombia',
            isDefault: true,
          });
          setShowForm(true);
        } else {
          setShowForm(false);
          setEditingId(null);
        }
      } catch {
        if (mounted) setError('No se pudieron cargar las cuentas bancarias');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [performer]);

  if (!performer) return null;

  const updateField = <K extends keyof PerformerFinancialAccountInput>(
    key: K,
    value: PerformerFinancialAccountInput[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddNew = () => {
    resetFormForNew(accounts.length);
    setShowForm(true);
    setError(null);
  };

  const handleEdit = (account: PerformerFinancialAccount) => {
    setEditingId(account.id);
    setForm({
      accountName: account.accountName,
      email: account.email,
      accountNumber: account.accountNumber,
      financialEntity: account.financialEntity,
      accountType: account.accountType,
      country: account.country,
      currency: account.currency,
      isDefault: account.isDefault,
    });
    setShowForm(true);
    setError(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setError(null);
    if (accounts.length === 0) {
      onClose();
    }
  };

  const handleSetDefault = async (accountId: string) => {
    if (!performer || settingDefaultId) return;
    setError(null);
    setSettingDefaultId(accountId);
    try {
      await FinancialAccountsService.setDefaultFinancialAccount(performer.id, accountId);
      const list = await FinancialAccountsService.getFinancialAccounts(performer.id);
      setAccounts(list);
      onSaved?.();
    } catch {
      setError('No se pudo marcar la cuenta como predeterminada');
    } finally {
      setSettingDefaultId(null);
    }
  };

  const handleDelete = async (accountId: string) => {
    if (!performer || deletingId) return;
    setError(null);
    setDeletingId(accountId);
    try {
      await FinancialAccountsService.deleteFinancialAccount(performer.id, accountId);
      const list = await FinancialAccountsService.getFinancialAccounts(performer.id);
      setAccounts(list);
      if (editingId === accountId) {
        setShowForm(false);
        setEditingId(null);
      }
      if (list.length === 0) {
        resetFormForNew(0);
        setShowForm(true);
      }
      onSaved?.();
    } catch {
      setError('No se pudo eliminar la cuenta');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!performer || saving) return;
    setError(null);

    if (
      !form.accountName.trim() ||
      !form.email.trim() ||
      !form.accountNumber.trim() ||
      !form.financialEntity.trim()
    ) {
      setError('Completa titular, correo, banco y número de cuenta');
      return;
    }

    setSaving(true);
    try {
      await FinancialAccountsService.saveFinancialAccount(
        performer.id,
        {
          ...form,
          accountName: form.accountName.trim(),
          email: form.email.trim(),
          accountNumber: form.accountNumber.trim(),
          financialEntity: form.financialEntity.trim(),
          country: form.country.trim(),
        },
        editingId ?? undefined
      );
      const list = await FinancialAccountsService.getFinancialAccounts(performer.id);
      setAccounts(list);
      setShowForm(false);
      setEditingId(null);
      onSaved?.();
    } catch {
      setError(
        editingId
          ? 'No se pudo actualizar la cuenta bancaria'
          : 'Error al guardar la cuenta bancaria'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop-adaptive">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-5 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 bg-linear-to-r from-emerald-600 to-teal-600 rounded-lg shrink-0">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                  Cuenta Bancaria
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {performer.stage_name} · {performer.email}
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

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Cargando datos...</p>
          </div>
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <CreditCard className="h-4 w-4 text-gray-400" />
                  <span>
                    {showForm
                      ? editingId
                        ? 'Editar cuenta bancaria'
                        : 'Nueva cuenta bancaria'
                      : `Cuentas registradas (${accounts.length})`}
                  </span>
                </div>
                {!showForm && (
                  <button
                    type="button"
                    onClick={handleAddNew}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    Agregar cuenta
                  </button>
                )}
              </div>

              {!showForm && accounts.length > 0 && (
                <div className="space-y-3">
                  {accounts.map((account) => (
                    <div
                      key={account.id}
                      className="rounded-lg border border-gray-200 dark:border-slate-600 p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <Building2 className="h-4 w-4 text-gray-400 shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white truncate">
                              {account.financialEntity}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {account.accountName}
                            </p>
                          </div>
                        </div>
                        {account.isDefault && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 shrink-0">
                            Predeterminada
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Correo</p>
                          <p className="text-gray-900 dark:text-white truncate">{account.email}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Número</p>
                          <p className="text-gray-900 dark:text-white font-mono">
                            {maskAccountNumber(account.accountNumber)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Tipo</p>
                          <p className="text-gray-900 dark:text-white">{account.accountType}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">País / Moneda</p>
                          <p className="text-gray-900 dark:text-white">
                            {account.country} · {account.currency}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleEdit(account)}
                          disabled={saving || settingDefaultId !== null || deletingId !== null}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Editar
                        </button>
                        {!account.isDefault && (
                          <button
                            type="button"
                            onClick={() => handleSetDefault(account.id)}
                            disabled={settingDefaultId !== null || deletingId !== null}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 rounded-lg transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                          >
                            {settingDefaultId === account.id ? (
                              <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                Actualizando…
                              </>
                            ) : (
                              <>
                                <Star className="h-3.5 w-3.5" />
                                Predeterminada
                              </>
                            )}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(account.id)}
                          disabled={deletingId !== null || settingDefaultId !== null}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                        >
                          {deletingId === account.id ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              Eliminando…
                            </>
                          ) : (
                            <>
                              <Trash2 className="h-3.5 w-3.5" />
                              Eliminar
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!showForm && accounts.length === 0 && (
                <div className="rounded-lg border border-dashed border-gray-300 dark:border-slate-600 p-6 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Este modelo aún no tiene cuentas bancarias registradas
                  </p>
                </div>
              )}

              {showForm && (
                <form id="bank-account-form" onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {editingId ? 'Actualizar datos de la cuenta' : 'Datos de la nueva cuenta'}
                    </h3>
                    {accounts.length > 0 && (
                      <button
                        type="button"
                        onClick={handleCancelForm}
                        className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
                      >
                        Volver a la lista
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="sm:col-span-2 text-sm">
                      <span className="text-gray-700 dark:text-gray-300">Titular de la cuenta</span>
                      <input
                        type="text"
                        value={form.accountName}
                        onChange={(e) => updateField('accountName', e.target.value)}
                        placeholder="Nombre del titular"
                        className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        required
                      />
                    </label>

                    <label className="sm:col-span-2 text-sm">
                      <span className="text-gray-700 dark:text-gray-300">Correo electrónico</span>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        placeholder="correo@ejemplo.com"
                        className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        required
                      />
                    </label>

                    <label className="text-sm">
                      <span className="text-gray-700 dark:text-gray-300">Entidad financiera</span>
                      <div className="relative mt-1">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <select
                          value={
                            BANKS.includes(form.financialEntity) ? form.financialEntity : 'Otro'
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            updateField('financialEntity', value === 'Otro' ? '' : value);
                          }}
                          className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        >
                          <option value="">Seleccionar banco</option>
                          {BANKS.map((bank) => (
                            <option key={bank} value={bank}>
                              {bank}
                            </option>
                          ))}
                        </select>
                      </div>
                    </label>

                    {(!form.financialEntity || !BANKS.includes(form.financialEntity)) && (
                      <label className="text-sm">
                        <span className="text-gray-700 dark:text-gray-300">Nombre del banco</span>
                        <input
                          type="text"
                          value={form.financialEntity}
                          onChange={(e) => updateField('financialEntity', e.target.value)}
                          placeholder="Ej: Banco Internacional"
                          className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          required
                        />
                      </label>
                    )}

                    <label className="text-sm">
                      <span className="text-gray-700 dark:text-gray-300">Número de cuenta</span>
                      <input
                        type="text"
                        value={form.accountNumber}
                        onChange={(e) => updateField('accountNumber', e.target.value)}
                        placeholder="Número de cuenta o IBAN"
                        className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg font-mono focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        required
                      />
                    </label>

                    <label className="text-sm">
                      <span className="text-gray-700 dark:text-gray-300">Tipo de cuenta</span>
                      <select
                        value={form.accountType}
                        onChange={(e) =>
                          updateField('accountType', e.target.value as FinancialAccountType)
                        }
                        className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        <option value="Ahorros">Ahorros</option>
                        <option value="Corriente">Corriente</option>
                      </select>
                    </label>

                    <label className="text-sm">
                      <span className="text-gray-700 dark:text-gray-300">País</span>
                      <input
                        type="text"
                        value={form.country}
                        onChange={(e) => updateField('country', e.target.value)}
                        placeholder="País"
                        className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        required
                      />
                    </label>

                    <label className="text-sm">
                      <span className="text-gray-700 dark:text-gray-300">Moneda</span>
                      <select
                        value={form.currency}
                        onChange={(e) => updateField('currency', e.target.value)}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        {CURRENCIES.map((currency) => (
                          <option key={currency} value={currency}>
                            {currency}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={form.isDefault}
                      onChange={(e) => updateField('isDefault', e.target.checked)}
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    Marcar como cuenta predeterminada para pagos
                  </label>
                </form>
              )}

              {error && (
                <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}
            </div>

            <div className="p-5 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-750">
              <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
                <button
                  type="button"
                  onClick={showForm && accounts.length > 0 ? handleCancelForm : onClose}
                  disabled={saving}
                  className="px-5 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                >
                  {showForm && accounts.length > 0 ? 'Cancelar' : 'Cerrar'}
                </button>
                {showForm ? (
                  <button
                    type="submit"
                    form="bank-account-form"
                    disabled={saving}
                    className="flex items-center justify-center gap-2 px-5 py-2 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-wait"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {editingId ? 'Actualizando…' : 'Guardando…'}
                      </>
                    ) : (
                      <>
                        <DollarSign className="h-4 w-4" />
                        {editingId ? 'Actualizar cuenta' : 'Guardar cuenta'}
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleAddNew}
                    className="flex items-center justify-center gap-2 px-5 py-2 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Agregar cuenta
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
