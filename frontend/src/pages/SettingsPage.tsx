import React, { useState } from 'react';
import {
  User,
  CreditCard,
  Bell,
  ShieldCheck,
  Building2,
  Check,
  Save,
  Users,
  Lock,
  Download,
  Plus,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { DashboardLayout } from '../features/dashboard/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';

export interface SettingsPageProps {
  onLogout?: () => void;
  onNavigateTab?: (tab: string) => void;
  userName?: string;
}

type SettingsTab = 'perfil' | 'contas' | 'preferencias' | 'seguranca';

interface ConnectedAccount {
  id: string;
  name: string;
  type: string;
  status: 'Conectada' | 'Sincronizando' | 'Manual';
  lastSync: string;
  balance: number;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  onLogout,
  onNavigateTab,
  userName = 'Davi',
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('perfil');
  const [isSavedToast, setIsSavedToast] = useState(false);

  // Form states
  const [name, setName] = useState('Davi Siqueira');
  const [email, setEmail] = useState('davi@biana.finance');
  const [phone, setPhone] = useState('(11) 98765-4321');
  const [role, setRole] = useState('Administrador Familiar');

  // Preferences
  const [currency, setCurrency] = useState('BRL (R$)');
  const [cycleDay, setCycleDay] = useState('01');
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyPush, setNotifyPush] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);

  // Connected accounts
  const [accounts] = useState<ConnectedAccount[]>([
    {
      id: 'acc-1',
      name: 'Nubank',
      type: 'Conta Corrente & Reserva',
      status: 'Conectada',
      lastSync: 'Há 5 minutos',
      balance: 14250.0,
    },
    {
      id: 'acc-2',
      name: 'Banco Inter',
      type: 'Cartão Black Mastercard',
      status: 'Conectada',
      lastSync: 'Hoje, 09:12',
      balance: -1200.0,
    },
    {
      id: 'acc-3',
      name: 'Carteira Física',
      type: 'Dinheiro em Espécie',
      status: 'Manual',
      lastSync: 'Ontem',
      balance: 350.0,
    },
  ]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  return (
    <DashboardLayout
      activeTab="configurações"
      onNavigateTab={onNavigateTab}
      onLogout={onLogout}
      userName={userName}
      periodLabel="Configurações"
    >
      <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[rgba(44,24,16,0.06)]">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                Configurações da Conta
              </h1>
              <p className="text-sm text-on-surface-variant mt-1">
                Preferências do sistema, gestão de perfil, contas conectadas e segurança da família.
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Salvar Alterações
            </Button>
          </div>

          {/* Toast Notification */}
          {isSavedToast && (
            <div className="p-3.5 rounded-xl bg-secondary-container text-secondary text-sm font-semibold flex items-center gap-2 border border-secondary/20 shadow-xs animate-in fade-in duration-200">
              <Check className="w-4 h-4 shrink-0" />
              <span>Configurações atualizadas com sucesso!</span>
            </div>
          )}

          {/* Tab Navigation Pill */}
          <div className="flex items-center gap-1.5 p-1 bg-surface-container rounded-2xl overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('perfil')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'perfil'
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <User className="w-4 h-4" />
              Perfil & Família
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('contas')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'contas'
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Contas & Cartões
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('preferencias')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'preferencias'
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Bell className="w-4 h-4" />
              Preferências & Alertas
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('seguranca')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'seguranca'
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Segurança & Dados
            </button>
          </div>

          {/* Tab 1: Perfil & Família */}
          {activeTab === 'perfil' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <Card className="lg:col-span-8 p-6 space-y-6">
                <div>
                  <h2 className="font-bold text-base text-on-surface">
                    Informações do Gestor Familiar
                  </h2>
                  <p className="text-xs text-outline">
                    Atualize os dados principais de contato e identificação da sua conta
                  </p>
                </div>

                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-2xl shadow-terracotta ring-4 ring-primary/10 shrink-0">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <Button variant="outline" size="sm" type="button">
                      Alterar Foto
                    </Button>
                    <p className="text-xs text-outline mt-1.5">
                      JPG ou PNG de até 2MB recomendado
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Nome Completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <Input
                      label="E-mail Principal"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Telefone / WhatsApp"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <Input
                      label="Papel Familiar"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    />
                  </div>
                </form>
              </Card>

              {/* Family Members Card */}
              <Card className="lg:col-span-4 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base text-on-surface">
                      Membros da Família
                    </h3>
                    <p className="text-xs text-outline">
                      2 pessoas conectadas ao orçamento
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                    <Users className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary text-white font-bold text-xs flex items-center justify-center">
                        M
                      </div>
                      <div>
                        <p className="font-semibold text-xs text-on-surface">Mariana Siqueira</p>
                        <p className="text-[11px] text-outline">Cônjuge • Acesso Completo</p>
                      </div>
                    </div>
                    <Badge variant="forest">Ativo</Badge>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-tertiary text-white font-bold text-xs flex items-center justify-center">
                        S
                      </div>
                      <div>
                        <p className="font-semibold text-xs text-on-surface">Sofia Siqueira</p>
                        <p className="text-[11px] text-outline">Filha • Mesada & Educação</p>
                      </div>
                    </div>
                    <Badge variant="caramel">Visualização</Badge>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={() => alert('Convite para novo membro da família enviado por e-mail!')}
                >
                  Convidar Membro
                </Button>
              </Card>
            </div>
          )}

          {/* Tab 2: Contas Bancárias & Cartões */}
          {activeTab === 'contas' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-base text-on-surface">
                    Instituições & Contas Conectadas
                  </h2>
                  <p className="text-xs text-outline">
                    Sincronização em tempo real via Open Finance regulado pelo Banco Central
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={() => alert('Fluxo Open Finance de conexão bancária iniciado!')}
                >
                  Conectar Nova Conta
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {accounts.map((acc) => (
                  <Card key={acc.id} className="p-5 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary font-bold">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <Badge
                          variant={
                            acc.status === 'Conectada'
                              ? 'forest'
                              : acc.status === 'Sincronizando'
                              ? 'terracotta'
                              : 'surface'
                          }
                        >
                          {acc.status}
                        </Badge>
                      </div>

                      <h3 className="font-bold text-base text-on-surface mt-3">
                        {acc.name}
                      </h3>
                      <p className="text-xs text-outline">{acc.type}</p>
                    </div>

                    <div className="pt-3 border-t border-[rgba(44,24,16,0.06)] flex items-center justify-between">
                      <span className="text-xs text-outline">{acc.lastSync}</span>
                      <button
                        type="button"
                        onClick={() => alert(`Sincronizando ${acc.name}...`)}
                        className="text-xs text-primary font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Sincronizar
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Preferências & Alertas */}
          {activeTab === 'preferencias' && (
            <Card className="p-6 space-y-6 max-w-3xl">
              <div>
                <h2 className="font-bold text-base text-on-surface">
                  Preferências Regionais & Notificações
                </h2>
                <p className="text-xs text-outline">
                  Ajuste a moeda, ciclos contábeis e a frequência de comunicação
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1.5">
                    Moeda Principal
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-surface-container-lowest border border-[rgba(44,24,16,0.12)] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-on-surface"
                  >
                    <option value="BRL (R$)">Real Brasileiro (BRL R$)</option>
                    <option value="USD ($)">Dólar Americano (USD $)</option>
                    <option value="EUR (€)">Euro (EUR €)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1.5">
                    Início do Ciclo Orçamentário
                  </label>
                  <select
                    value={cycleDay}
                    onChange={(e) => setCycleDay(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-surface-container-lowest border border-[rgba(44,24,16,0.12)] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-on-surface"
                  >
                    <option value="01">Todo dia 01 do mês</option>
                    <option value="05">Todo dia 05 do mês (Pós-salário)</option>
                    <option value="10">Todo dia 10 do mês</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-[rgba(44,24,16,0.06)] space-y-4">
                <h3 className="font-bold text-sm text-on-surface">
                  Canais de Alerta
                </h3>

                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyPush}
                      onChange={(e) => setNotifyPush(e.target.checked)}
                      className="mt-1 rounded text-primary focus:ring-primary"
                    />
                    <div>
                      <p className="text-sm font-semibold text-on-surface">
                        Notificações Push no Celular
                      </p>
                      <p className="text-xs text-outline">
                        Avisos instantâneos quando houver débitos elevados ou novos lançamentos
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.checked)}
                      className="mt-1 rounded text-primary focus:ring-primary"
                    />
                    <div>
                      <p className="text-sm font-semibold text-on-surface">
                        Resumo Semanal por E-mail
                      </p>
                      <p className="text-xs text-outline">
                        Relatório consolidado todos os domingos às 20h
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={budgetAlerts}
                      onChange={(e) => setBudgetAlerts(e.target.checked)}
                      className="mt-1 rounded text-primary focus:ring-primary"
                    />
                    <div>
                      <p className="text-sm font-semibold text-on-surface">
                        Alerta de Limite de Categoria (80%)
                      </p>
                      <p className="text-xs text-outline">
                        Receba aviso antes de ultrapassar o teto estipulado para o mês
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </Card>
          )}

          {/* Tab 4: Segurança & Dados */}
          {activeTab === 'seguranca' && (
            <div className="space-y-6 max-w-3xl">
              <Card className="p-6 space-y-4">
                <div>
                  <h2 className="font-bold text-base text-on-surface">
                    Credenciais & Autenticação
                  </h2>
                  <p className="text-xs text-outline">
                    Mantenha sua conta blindada com senha forte e autenticação multifator
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-on-surface">Senha de Acesso</p>
                      <p className="text-xs text-outline">Última alteração há 3 meses</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => alert('Modal de troca de senha aberto!')}>
                    Alterar Senha
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-secondary" />
                    <div>
                      <p className="text-sm font-semibold text-on-surface">Autenticação em 2 Fatores (2FA)</p>
                      <p className="text-xs text-outline">Protegido via aplicativo autenticador</p>
                    </div>
                  </div>
                  <Badge variant="forest">Ativado</Badge>
                </div>
              </Card>

              {/* Danger Zone */}
              <Card className="p-6 border border-red-200 bg-red-50/30 space-y-4">
                <div>
                  <h3 className="font-bold text-base text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    Zona de Segurança & Dados
                  </h3>
                  <p className="text-xs text-outline">
                    Ações irreversíveis que afetam o histórico da conta
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                  <div>
                    <p className="text-sm font-semibold text-on-surface">
                      Baixar Todos os Dados Financeiros
                    </p>
                    <p className="text-xs text-outline">
                      Receba um arquivo ZIP com todas as transações, notas e notas de conciliação
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Download className="w-4 h-4" />}
                    onClick={() => alert('Download do backup completo iniciado!')}
                  >
                    Exportar Backup
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </main>
    </DashboardLayout>
  );
};
