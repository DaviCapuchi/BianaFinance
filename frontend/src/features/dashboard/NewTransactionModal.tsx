import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import type {
  Transaction,
  TransactionType,
  TransactionCategory,
  PaymentMethod,
} from '../../types/finance';
import { cn } from '../../utils/cn';

export interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Transaction, 'id'>) => void;
}

const CATEGORIES: TransactionCategory[] = [
  'Alimentação',
  'Moradia & Contas',
  'Lazer & Bem-estar',
  'Transporte',
  'Saúde & Bem-estar',
  'Salário & Renda',
  'Investimentos',
  'Outros',
];

const PAYMENT_METHODS: PaymentMethod[] = [
  'Conta Corrente',
  'Cartão Black',
  'Cartão de Crédito',
  'Débito',
  'Pix',
  'Corretora',
  'Dinheiro',
];

export const NewTransactionModal: React.FC<NewTransactionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState<TransactionCategory>('Alimentação');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cartão Black');
  const [date, setDate] = useState('Hoje, 10:00');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numericAmount = parseFloat(amount.replace(',', '.'));
    if (!title.trim()) {
      setError('A descrição é obrigatória');
      return;
    }
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Informe um valor válido maior que zero');
      return;
    }

    onSubmit({
      title: title.trim(),
      amount: numericAmount,
      type,
      category,
      paymentMethod,
      date: date.trim() || 'Hoje',
      status: type === 'income' ? 'Recebido' : 'Confirmado',
    });

    // Reset form & close
    setTitle('');
    setAmount('');
    setType('expense');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Transação">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle */}
        <div className="flex rounded-xl bg-surface-container p-1 gap-1">
          <button
            type="button"
            onClick={() => {
              setType('expense');
              setCategory('Alimentação');
            }}
            className={cn(
              'flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-150 cursor-pointer',
              type === 'expense'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-outline hover:text-on-surface'
            )}
          >
            Despesa (Saída)
          </button>
          <button
            type="button"
            onClick={() => {
              setType('income');
              setCategory('Salário & Renda');
            }}
            className={cn(
              'flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-150 cursor-pointer',
              type === 'income'
                ? 'bg-surface-container-lowest text-secondary shadow-xs'
                : 'text-outline hover:text-on-surface'
            )}
          >
            Receita (Entrada)
          </button>
        </div>

        {/* Title */}
        <Input
          id="tx-title"
          label="Descrição"
          placeholder="Ex: Supermercado, Salário, Farmácia..."
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError('');
          }}
          required
        />

        {/* Amount */}
        <Input
          id="tx-amount"
          label="Valor (R$)"
          placeholder="0,00"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            if (error) setError('');
          }}
          type="number"
          step="0.01"
          required
        />

        {/* Category & Payment Method Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1.5 text-left">
            <label
              htmlFor="tx-category"
              className="text-xs font-semibold text-on-surface tracking-wide"
            >
              Categoria
            </label>
            <select
              id="tx-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as TransactionCategory)}
              className="w-full h-11 px-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col space-y-1.5 text-left">
            <label
              htmlFor="tx-payment"
              className="text-xs font-semibold text-on-surface tracking-wide"
            >
              Forma de Pagamento
            </label>
            <select
              id="tx-payment"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full h-11 px-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all cursor-pointer"
            >
              {PAYMENT_METHODS.map((pm) => (
                <option key={pm} value={pm}>
                  {pm}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date / Timestamp */}
        <Input
          id="tx-date"
          label="Data / Horário"
          placeholder="Ex: 14:20, 24 Out"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[rgba(44,24,16,0.06)]">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            Salvar Transação
          </Button>
        </div>
      </form>
    </Modal>
  );
};
