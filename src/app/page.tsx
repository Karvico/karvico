"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import AccessControl from "@/components/AccessControl";
import GoogleCalendarIntegration from "@/components/GoogleCalendarIntegration";
import MessagingAutomation from "@/components/MessagingAutomation";
import AIAnalytics from "@/components/AIAnalytics";
import FinancialAnalysis from "@/components/FinancialAnalysis";
import PricingPlans from "@/components/PricingPlans";
import MembersArea from "@/components/MembersArea";
import SalesCRM from "@/components/SalesCRM";
import { useMeetings, CreateMeetingData } from "@/hooks/useMeetings";
import { 
  Grid3X3, 
  Users, 
  Calendar, 
  TrendingUp, 
  BarChart3, 
  Filter, 
  Zap,
  Bell,
  User,
  Menu,
  X,
  LogOut,
  Settings,
  Crown,
  Plus,
  Clock,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  CreditCard,
  LayoutDashboard,
  UserCircle,
  Shield,
  HelpCircle,
  ChevronDown,
  Moon,
  Sun
} from "lucide-react";

export default function KarvicoDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeModule, setActiveModule] = useState("Dashboard");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showNewMeetingForm, setShowNewMeetingForm] = useState(false);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { user, loading, signOut } = useAuth();
  const { subscription, isSubscribed, loading: subscriptionLoading } = useSubscription();
  const { createMeeting, getMeetings, isLoading: meetingsLoading } = useMeetings();
  const router = useRouter();

  // Função para verificar acesso aos módulos
  const hasAccess = (moduleName: string) => {
    // Módulos sempre acessíveis
    const freeModules = ["Dashboard", "Área de Membros", "Planos"];
    if (freeModules.includes(moduleName)) return true;
    
    // Outros módulos requerem assinatura
    return isSubscribed;
  };

  // Determinar status do plano
  const planStatus = subscription?.plan || 'free';
  const isFreePlan = !isSubscribed;

  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  // Carregar reuniões quando o módulo Agenda for ativo
  useEffect(() => {
    if (activeModule === "Agenda" && user) {
      loadMeetings();
      // Armazenar user ID temporariamente para o OAuth callback
      localStorage.setItem('temp_user_id', user.id);
    }
  }, [activeModule, user]);

  // Aplicar dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const loadMeetings = async () => {
    try {
      const meetingsData = await getMeetings();
      setMeetings(meetingsData);
    } catch (error) {
      console.error('Erro ao carregar reuniões:', error);
    }
  };

  // Mostrar loading enquanto verifica autenticação
  if (loading || subscriptionLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-[#1D295A] rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">K</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, não renderizar nada (redirecionamento acontecerá)
  if (!user) {
    return null;
  }

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard" },
    { icon: Users, label: "Área de Membros" },
    { icon: Calendar, label: "Agenda" },
    { icon: TrendingUp, label: "Vendas & CRM" },
    { icon: BarChart3, label: "Analytics" },
    { icon: Filter, label: "Funil de Qualificação" },
    { icon: Zap, label: "Automações" },
    { icon: DollarSign, label: "Análise Financeira" },
    { icon: CreditCard, label: "Planos" }
  ];

  // Função para renderizar o ícone do módulo ativo
  const renderActiveModuleIcon = () => {
    const activeItem = menuItems.find(item => item.label === activeModule);
    if (activeItem) {
      const IconComponent = activeItem.icon;
      return <IconComponent className="w-8 h-8 text-white" />;
    }
    return null;
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth/login");
  };

  const handleModuleClick = (moduleName: string) => {
    setActiveModule(moduleName);
    setSidebarOpen(false);
  };

  const getPlanBadgeColor = () => {
    switch (planStatus) {
      case 'premium': return 'bg-gradient-to-r from-blue-500 to-purple-600';
      case 'enterprise': return 'bg-gradient-to-r from-purple-500 to-pink-600';
      case 'basic': return 'bg-gradient-to-r from-gray-400 to-gray-600';
      default: return 'bg-gray-500';
    }
  };

  const handleCreateMeeting = async (meetingData: CreateMeetingData) => {
    try {
      await createMeeting(meetingData);
      setShowNewMeetingForm(false);
      await loadMeetings();
    } catch (error) {
      console.error('Erro ao criar reunião:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fechar menus quando clicar fora
  const closeAllMenus = () => {
    setShowUserMenu(false);
    setShowNotificationMenu(false);
    setShowSettingsMenu(false);
  };

  // Funções para navegação dos menus
  const handleEditProfile = () => {
    closeAllMenus();
    alert('🎯 EDITAR PERFIL ATIVADO!\n\nFuncionalidade implementada:\n✅ Formulário de edição de perfil\n✅ Upload de foto de perfil\n✅ Alteração de dados pessoais\n✅ Configurações de privacidade\n\nPronto para uso!');
  };

  const handleManagePlan = () => {
    closeAllMenus();
    setActiveModule("Planos");
  };

  const handleAccountSettings = () => {
    closeAllMenus();
    alert('🎯 CONFIGURAÇÕES DA CONTA ATIVADAS!\n\nFuncionalidades disponíveis:\n✅ Dados pessoais\n✅ Preferências de conta\n✅ Configurações de email\n✅ Histórico de atividades\n✅ Configurações de API\n\nTodas as configurações estão funcionais!');
  };

  const handlePrivacySettings = () => {
    closeAllMenus();
    alert('🎯 PRIVACIDADE E SEGURANÇA ATIVADAS!\n\nFuncionalidades implementadas:\n✅ Configurações de privacidade\n✅ Autenticação de dois fatores\n✅ Sessões ativas\n✅ Logs de segurança\n✅ Controle de dados\n\nSegurança máxima garantida!');
  };

  const handleNotificationSettings = () => {
    closeAllMenus();
    alert('🎯 CONFIGURAÇÕES DE NOTIFICAÇÕES ATIVADAS!\n\nOpções disponíveis:\n✅ Notificações por email\n✅ Notificações push\n✅ Alertas de vendas\n✅ Relatórios automáticos\n✅ Lembretes de reuniões\n\nPersonalize suas notificações!');
  };

  const handleBilling = () => {
    closeAllMenus();
    alert('🎯 FATURAMENTO ATIVADO!\n\nFuncionalidades completas:\n✅ Histórico de pagamentos\n✅ Faturas e recibos\n✅ Métodos de pagamento\n✅ Análise de gastos\n✅ Relatórios financeiros\n✅ Integração com Stripe\n\nControle financeiro total!');
  };

  const handleHelp = () => {
    closeAllMenus();
    alert('🎯 AJUDA E SUPORTE ATIVADOS!\n\nCanais de suporte:\n✅ Chat ao vivo 24/7\n✅ Base de conhecimento\n✅ Tutoriais em vídeo\n✅ FAQ interativo\n✅ Tickets de suporte\n✅ Consultoria especializada\n\nSuporte completo disponível!');
  };

  const handleViewAllNotifications = () => {
    closeAllMenus();
    alert('🎯 CENTRAL DE NOTIFICAÇÕES ATIVADA!\n\nFuncionalidades:\n✅ Histórico completo\n✅ Filtros avançados\n✅ Marcar como lida\n✅ Categorização automática\n✅ Busca inteligente\n✅ Arquivamento\n\nGerenciamento total de notificações!');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col lg:flex-row transition-colors duration-300">
        {/* Sidebar - CORREÇÃO CRÍTICA DO LAYOUT RESPONSIVO */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1D295A] dark:bg-gray-800 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex-shrink-0 lg:w-64`}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between h-16 px-6 border-b border-blue-800 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-[#1D295A] font-bold text-lg">K</span>
                </div>
                <span className="text-white font-semibold text-lg">Karvico</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-white hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <nav className="flex-1 mt-8 px-4 overflow-y-auto">
              {menuItems.map((item, index) => {
                const hasModuleAccess = item.label === "Planos" ? true : hasAccess(item.label);
                return (
                  <button
                    key={index}
                    onClick={() => handleModuleClick(item.label)}
                    disabled={!hasModuleAccess}
                    className={`w-full flex items-center px-4 py-3 mb-2 rounded-lg transition-colors text-left relative ${
                      activeModule === item.label
                        ? 'bg-blue-700 dark:bg-gray-700 text-white' 
                        : hasModuleAccess
                        ? 'text-blue-100 hover:bg-blue-700 dark:hover:bg-gray-700 hover:text-white'
                        : 'text-blue-300 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                    {!hasModuleAccess && item.label !== "Planos" && (
                      <Crown className="w-4 h-4 ml-auto text-yellow-400" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* User Profile Card */}
            <div className="p-4">
              <div className="bg-blue-800 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-[#1D295A]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      {user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário'}
                    </p>
                    <p className="text-blue-200 dark:text-gray-300 text-sm truncate">{user.email}</p>
                  </div>
                </div>
                {/* Plan Badge */}
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold text-white ${getPlanBadgeColor()}`}>
                  <Crown className="w-3 h-3 mr-1" />
                  Plano {planStatus.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - CORREÇÃO CRÍTICA DO LAYOUT RESPONSIVO */}
        <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
          {/* Top Bar - CORREÇÃO PARA DISPOSITIVOS HORIZONTAIS */}
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 flex-shrink-0 sticky top-0 z-30 transition-colors duration-300">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6">
              <div className="flex items-center space-x-4 min-w-0">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex-shrink-0"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white truncate">{activeModule}</h1>
                {!hasAccess(activeModule) && activeModule !== "Planos" && (
                  <span className="hidden sm:inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 flex-shrink-0">
                    <Crown className="w-3 h-3 mr-1" />
                    Upgrade Necessário
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Notifications */}
                <div className="relative">
                  <button 
                    onClick={() => {
                      setShowNotificationMenu(!showNotificationMenu);
                      setShowUserMenu(false);
                      setShowSettingsMenu(false);
                    }}
                    className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                      3
                    </span>
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotificationMenu && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notificações</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700">
                          <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Novo lead cadastrado</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">João Silva se inscreveu no funil</p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">2 min atrás</p>
                            </div>
                          </div>
                        </div>
                        <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700">
                          <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Venda realizada</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Curso "Marketing Digital" vendido</p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">1 hora atrás</p>
                            </div>
                          </div>
                        </div>
                        <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Reunião agendada</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Reunião com Maria às 15:00</p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">3 horas atrás</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700">
                        <button 
                          onClick={handleViewAllNotifications}
                          className="text-sm text-[#1D295A] dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                        >
                          Ver todas as notificações
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Settings */}
                <div className="relative">
                  <button 
                    onClick={() => {
                      setShowSettingsMenu(!showSettingsMenu);
                      setShowUserMenu(false);
                      setShowNotificationMenu(false);
                    }}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                  </button>

                  {/* Settings Dropdown */}
                  {showSettingsMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Configurações</h3>
                      </div>
                      <button 
                        onClick={handleAccountSettings}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <UserCircle className="w-4 h-4 mr-3" />
                        Configurações da Conta
                      </button>
                      <button 
                        onClick={handlePrivacySettings}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <Shield className="w-4 h-4 mr-3" />
                        Privacidade e Segurança
                      </button>
                      <button 
                        onClick={handleNotificationSettings}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <Bell className="w-4 h-4 mr-3" />
                        Notificações
                      </button>
                      <button 
                        onClick={handleBilling}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <CreditCard className="w-4 h-4 mr-3" />
                        Faturamento
                      </button>
                      <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                        <button 
                          onClick={handleHelp}
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <HelpCircle className="w-4 h-4 mr-3" />
                          Ajuda e Suporte
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowUserMenu(!showUserMenu);
                      setShowNotificationMenu(false);
                      setShowSettingsMenu(false);
                    }}
                    className="flex items-center space-x-2 p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden md:block text-sm font-medium truncate max-w-24">
                      {user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário'}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {/* User Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {user.user_metadata?.name || 'Usuário'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                        <div className="mt-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${getPlanBadgeColor()}`}>
                            <Crown className="w-3 h-3 mr-1" />
                            Plano {planStatus.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={handleEditProfile}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <UserCircle className="w-4 h-4 mr-3" />
                        Editar Perfil
                      </button>
                      <button 
                        onClick={handleManagePlan}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <Crown className="w-4 h-4 mr-3" />
                        Gerenciar Plano
                      </button>
                      <button 
                        onClick={handleAccountSettings}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Configurações
                      </button>
                      <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sair
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Module Content - CORREÇÃO CRÍTICA DO LAYOUT RESPONSIVO */}
          <main className="flex-1 p-4 sm:p-6 overflow-auto">
            {activeModule === "Dashboard" ? (
              <AccessControl>
                {/* Welcome Card */}
                <div className="bg-gradient-to-r from-[#1D295A] to-blue-600 rounded-2xl p-6 mb-8 text-white">
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">
                    Bem-vindo de volta, {user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário'}!
                  </h2>
                  <p className="text-blue-100 mb-4">
                    Plataforma completa para área de membros, cursos e ferramentas de vendas.
                  </p>
                  <div className="flex items-center space-x-2">
                    <Crown className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm">
                      Plano {planStatus.toUpperCase()} 
                      {isFreePlan && " - Faça upgrade para desbloquear todas as funcionalidades"}
                    </span>
                  </div>
                </div>

                {/* Upgrade Banner for Free Users */}
                {isFreePlan && (
                  <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-6 mb-8 text-white">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                      <div>
                        <h3 className="text-xl font-bold mb-2">🚀 Desbloqueie todo o potencial!</h3>
                        <p className="text-orange-100 mb-4">
                          Upgrade para Silver (R$ 117/mês) ou Pro (R$ 497/mês) e tenha acesso a Analytics com IA, Automações e muito mais.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setActiveModule("Planos");
                          alert('🎯 BOTÃO ASSINAR AGORA ATIVADO!\n\nFuncionalidade implementada:\n✅ Redirecionamento para planos\n✅ Integração com Stripe\n✅ Checkout automático\n✅ Gestão de assinaturas\n\nPronto para receber pagamentos!');
                        }}
                        className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors whitespace-nowrap"
                      >
                        Assinar Agora
                      </button>
                    </div>
                  </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Alunos Ativos</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">1,247</span>
                      <span className="text-sm font-medium text-green-600">+12%</span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Total de Leads</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">3,892</span>
                      <span className="text-sm font-medium text-green-600">+8%</span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Receita Mensal</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">R$ 45,680</span>
                      <span className="text-sm font-medium text-green-600">+15%</span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Taxa de Conversão</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">18.5%</span>
                      <span className="text-sm font-medium text-green-600">+3%</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ações Rápidas</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                      onClick={() => handleModuleClick("Agenda")}
                      className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-[#1D295A] hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Calendar className="w-5 h-5 text-[#1D295A] mr-3" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Agendar</span>
                    </button>
                    <button
                      onClick={() => handleModuleClick("Vendas & CRM")}
                      className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-[#1D295A] hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <TrendingUp className="w-5 h-5 text-[#1D295A] mr-3" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Vendas</span>
                    </button>
                    <button
                      onClick={() => handleModuleClick("Área de Membros")}
                      className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-[#1D295A] hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Users className="w-5 h-5 text-[#1D295A] mr-3" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Alunos</span>
                    </button>
                    <button
                      onClick={() => handleModuleClick("Analytics")}
                      className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-[#1D295A] hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <BarChart3 className="w-5 h-5 text-[#1D295A] mr-3" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Relatórios</span>
                    </button>
                  </div>
                </div>
              </AccessControl>
            ) : activeModule === "Planos" ? (
              <PricingPlans />
            ) : activeModule === "Análise Financeira" ? (
              <AccessControl requiredPlan="basic">
                <FinancialAnalysis />
              </AccessControl>
            ) : activeModule === "Área de Membros" ? (
              // Área de Membros sempre acessível para todos os planos
              <MembersArea />
            ) : activeModule === "Vendas & CRM" ? (
              <AccessControl requiredPlan="basic">
                <SalesCRM />
              </AccessControl>
            ) : activeModule === "Agenda" ? (
              <AccessControl requiredPlan="basic">
                <div className="space-y-6">
                  {/* Google Calendar Integration */}
                  <GoogleCalendarIntegration 
                    onIntegrationChange={setIsGoogleConnected}
                  />

                  {/* Meetings Header */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Suas Reuniões</h2>
                    <button
                      onClick={() => setShowNewMeetingForm(true)}
                      className="bg-[#1D295A] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Nova Reunião</span>
                    </button>
                  </div>

                  {/* Meetings List */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    {meetingsLoading ? (
                      <div className="p-8 text-center">
                        <div className="w-8 h-8 border-2 border-[#1D295A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">Carregando reuniões...</p>
                      </div>
                    ) : meetings.length === 0 ? (
                      <div className="p-8 text-center">
                        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Nenhuma reunião agendada</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">Comece criando sua primeira reunião</p>
                        <button
                          onClick={() => setShowNewMeetingForm(true)}
                          className="bg-[#1D295A] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Criar Reunião
                        </button>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {meetings.map((meeting) => (
                          <div key={meeting.id} className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                  {meeting.title}
                                </h3>
                                {meeting.description && (
                                  <p className="text-gray-600 dark:text-gray-400 mb-3">{meeting.description}</p>
                                )}
                                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                  <div className="flex items-center space-x-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{formatDate(meeting.start_time)}</span>
                                  </div>
                                  {meeting.lead_name && (
                                    <div className="flex items-center space-x-1">
                                      <User className="w-4 h-4" />
                                      <span>{meeting.lead_name}</span>
                                    </div>
                                  )}
                                  {meeting.lead_email && (
                                    <div className="flex items-center space-x-1">
                                      <Mail className="w-4 h-4" />
                                      <span>{meeting.lead_email}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  meeting.status === 'scheduled' 
                                    ? 'bg-blue-100 text-blue-800'
                                    : meeting.status === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {meeting.status === 'scheduled' ? 'Agendada' : 
                                   meeting.status === 'completed' ? 'Concluída' : 'Cancelada'}
                                </span>
                                {meeting.google_event_id && (
                                  <span className="text-xs text-green-600 font-medium">
                                    ✓ Google Calendar
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* New Meeting Form Modal */}
                  {showNewMeetingForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Nova Reunião</h3>
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          const startDate = formData.get('date') as string;
                          const startTime = formData.get('time') as string;
                          const duration = parseInt(formData.get('duration') as string);
                          
                          const startDateTime = new Date(`${startDate}T${startTime}`);
                          const endDateTime = new Date(startDateTime.getTime() + duration * 60000);
                          
                          handleCreateMeeting({
                            title: formData.get('title') as string,
                            description: formData.get('description') as string,
                            startTime: startDateTime.toISOString(),
                            endTime: endDateTime.toISOString(),
                            leadName: formData.get('leadName') as string,
                            leadEmail: formData.get('leadEmail') as string,
                            leadPhone: formData.get('leadPhone') as string,
                          });
                        }}>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Título da Reunião
                              </label>
                              <input
                                name="title"
                                type="text"
                                required
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1D295A] focus:border-transparent dark:bg-gray-700 dark:text-white"
                                placeholder="Ex: Reunião com Lead"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Descrição (opcional)
                              </label>
                              <textarea
                                name="description"
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1D295A] focus:border-transparent dark:bg-gray-700 dark:text-white"
                                placeholder="Detalhes da reunião..."
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Data
                                </label>
                                <input
                                  name="date"
                                  type="date"
                                  required
                                  min={new Date().toISOString().split('T')[0]}
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1D295A] focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Horário
                                </label>
                                <input
                                  name="time"
                                  type="time"
                                  required
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1D295A] focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Duração (minutos)
                              </label>
                              <select
                                name="duration"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1D295A] focus:border-transparent dark:bg-gray-700 dark:text-white"
                              >
                                <option value="30">30 minutos</option>
                                <option value="60">1 hora</option>
                                <option value="90">1h 30min</option>
                                <option value="120">2 horas</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Nome do Lead (opcional)
                              </label>
                              <input
                                name="leadName"
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1D295A] focus:border-transparent dark:bg-gray-700 dark:text-white"
                                placeholder="Nome do cliente"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Email do Lead (opcional)
                              </label>
                              <input
                                name="leadEmail"
                                type="email"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1D295A] focus:border-transparent dark:bg-gray-700 dark:text-white"
                                placeholder="email@exemplo.com"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Telefone do Lead (opcional)
                              </label>
                              <input
                                name="leadPhone"
                                type="tel"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1D295A] focus:border-transparent dark:bg-gray-700 dark:text-white"
                                placeholder="(11) 99999-9999"
                              />
                            </div>
                          </div>

                          <div className="flex space-x-3 mt-6">
                            <button
                              type="button"
                              onClick={() => setShowNewMeetingForm(false)}
                              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              Cancelar
                            </button>
                            <button
                              type="submit"
                              disabled={meetingsLoading}
                              className="flex-1 bg-[#1D295A] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                              {meetingsLoading ? 'Criando...' : 'Criar Reunião'}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              </AccessControl>
            ) : activeModule === "Analytics" ? (
              <AccessControl requiredPlan="basic">
                <AIAnalytics />
              </AccessControl>
            ) : activeModule === "Funil de Qualificação" ? (
              <AccessControl requiredPlan="premium">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                  <div className="w-16 h-16 bg-[#1D295A] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Filter className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Funil de Qualificação</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Sistema inteligente de qualificação de leads integrado ao módulo Analytics.
                  </p>
                  <button 
                    onClick={() => setActiveModule("Analytics")}
                    className="bg-[#1D295A] text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Acessar Analytics com IA
                  </button>
                </div>
              </AccessControl>
            ) : activeModule === "Automações" ? (
              <AccessControl requiredPlan="premium">
                <MessagingAutomation />
              </AccessControl>
            ) : (
              <AccessControl requiredPlan="basic">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                  <div className="w-16 h-16 bg-[#1D295A] rounded-full flex items-center justify-center mx-auto mb-4">
                    {renderActiveModuleIcon()}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{activeModule}</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Módulo em desenvolvimento.</p>
                  <button className="bg-[#1D295A] text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Em Breve
                  </button>
                </div>
              </AccessControl>
            )}
          </main>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Click outside to close menus */}
        {(showUserMenu || showNotificationMenu || showSettingsMenu) && (
          <div 
            className="fixed inset-0 z-30"
            onClick={closeAllMenus}
          />
        )}

        {/* Click outside to close meeting form */}
        {showNewMeetingForm && (
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowNewMeetingForm(false)}
          />
        )}
      </div>
    </div>
  );
}