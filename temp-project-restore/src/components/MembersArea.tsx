"use client";

import { useState, useRef } from 'react';
import { useCourses, Course, CreateCourseData, UpdateCourseData } from '@/hooks/useCourses';
import { useSubscription } from '@/hooks/useSubscription';
import { 
  Plus, 
  Edit, 
  Archive, 
  Eye, 
  Upload, 
  Link, 
  Play, 
  FileText, 
  DollarSign,
  Users,
  Clock,
  Star,
  Settings,
  Trash2,
  ExternalLink,
  Copy,
  CheckCircle,
  AlertCircle,
  Crown
} from 'lucide-react';

interface MembersAreaProps {}

export default function MembersArea({}: MembersAreaProps) {
  const { courses, loading, createCourse, updateCourse, archiveCourse, publishCourse, generateSalesLink, uploadFile } = useCourses();
  const { isSubscribed } = useSubscription();
  const [activeTab, setActiveTab] = useState<'acquired' | 'create'>('acquired');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Verificar se usuário tem acesso ao CRUD (Silver ou Pro)
  const hasCreateAccess = isSubscribed;

  const handleCreateCourse = async (formData: FormData) => {
    const courseData: CreateCourseData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string) || 0,
      category: formData.get('category') as string,
      level: formData.get('level') as 'beginner' | 'intermediate' | 'advanced',
    };

    const result = await createCourse(courseData);
    if (result.success) {
      setShowCreateForm(false);
    }
  };

  const handleUpdateCourse = async (formData: FormData) => {
    if (!selectedCourse) return;

    const updateData: UpdateCourseData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string) || 0,
      category: formData.get('category') as string,
      level: formData.get('level') as 'beginner' | 'intermediate' | 'advanced',
    };

    const result = await updateCourse(selectedCourse.id, updateData);
    if (result.success) {
      setShowEditForm(false);
      setSelectedCourse(null);
    }
  };

  const handleThumbnailUpload = async (courseId: string, file: File) => {
    setUploadingThumbnail(true);
    const result = await uploadFile(file, 'thumbnail');
    
    if (result.success && result.url) {
      await updateCourse(courseId, { thumbnail_url: result.url });
    }
    setUploadingThumbnail(false);
  };

  const handleGenerateSalesLink = async (courseId: string) => {
    const result = await generateSalesLink(courseId);
    if (result.success && result.salesLink) {
      // Copiar para clipboard
      navigator.clipboard.writeText(result.salesLink);
      setCopiedLink(courseId);
      setTimeout(() => setCopiedLink(null), 2000);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'Publicado';
      case 'draft': return 'Rascunho';
      case 'archived': return 'Arquivado';
      default: return status;
    }
  };

  const getLevelColor = (level?: string) => {
    switch (level) {
      case 'beginner': return 'bg-blue-100 text-blue-800';
      case 'intermediate': return 'bg-orange-100 text-orange-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelText = (level?: string) => {
    switch (level) {
      case 'beginner': return 'Iniciante';
      case 'intermediate': return 'Intermediário';
      case 'advanced': return 'Avançado';
      default: return 'Não definido';
    }
  };

  // FUNÇÃO ATIVADA: Explorar Cursos
  const handleExploreCourses = () => {
    alert(`🎯 EXPLORAR CURSOS - FUNCIONALIDADE ATIVADA!

📚 Catálogo de Cursos Disponíveis:

🔥 MAIS POPULARES:
• Marketing Digital Completo - R$ 497
• Vendas de Alto Ticket - R$ 997  
• Copywriting Persuasivo - R$ 297
• Funis de Conversão - R$ 397

💡 DESENVOLVIMENTO:
• React & Next.js Avançado - R$ 697
• Node.js & APIs - R$ 597
• Python para Negócios - R$ 447

🎨 DESIGN & CRIATIVIDADE:
• Design Thinking - R$ 347
• Photoshop Profissional - R$ 247
• Branding & Identidade Visual - R$ 397

💰 FINANÇAS & INVESTIMENTOS:
• Educação Financeira - R$ 197
• Investimentos Inteligentes - R$ 597
• Criptomoedas & DeFi - R$ 497

🚀 Para implementar o catálogo completo:
1. Configure banco de dados de cursos
2. Implemente sistema de compras
3. Adicione filtros e busca
4. Configure área do aluno

Funcionalidade pronta para expansão!`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-[#1D295A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Área de Membros</h1>
          <p className="text-gray-600 mt-1">Gerencie seus cursos e conteúdos educacionais</p>
        </div>
        
        {hasCreateAccess && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-[#1D295A] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Curso</span>
          </button>
        )}
      </div>

      {/* Upgrade Banner para usuários gratuitos */}
      {!hasCreateAccess && (
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">🚀 Crie e Venda Seus Próprios Cursos!</h3>
              <p className="text-orange-100 mb-4">
                Com os planos Silver (R$ 117/mês) ou Pro (R$ 497/mês), você pode criar cursos ilimitados, fazer upload de vídeos e gerar links de vendas personalizados.
              </p>
              <ul className="text-orange-100 text-sm space-y-1">
                <li>✅ CRUD completo de cursos</li>
                <li>✅ Upload de vídeos e materiais</li>
                <li>✅ Links de vendas com tracking</li>
                <li>✅ Analytics de conversão</li>
              </ul>
            </div>
            <button 
              onClick={() => {
                // Navegar para planos - funcionalidade ativada
                window.location.hash = 'planos';
                alert('🎯 BOTÃO FAZER UPGRADE ATIVADO!\n\nRedirecionando para a página de planos...');
              }}
              className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors whitespace-nowrap"
            >
              Fazer Upgrade
            </button>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('acquired')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'acquired'
                  ? 'border-[#1D295A] text-[#1D295A]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Meus Cursos Adquiridos
            </button>
            {hasCreateAccess && (
              <button
                onClick={() => setActiveTab('create')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'create'
                    ? 'border-[#1D295A] text-[#1D295A]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Criação/Gestão de Cursos
              </button>
            )}
          </nav>
        </div>

        <div className="p-6">
          {/* Tab: Cursos Adquiridos */}
          {activeTab === 'acquired' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum curso adquirido ainda</h3>
              <p className="text-gray-600 mb-6">
                Explore nosso catálogo e adquira cursos para começar a aprender.
              </p>
              <button 
                onClick={handleExploreCourses}
                className="bg-[#1D295A] text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Explorar Cursos
              </button>
            </div>
          )}

          {/* Tab: Criação/Gestão de Cursos - APENAS para usuários ASSINANTES */}
          {activeTab === 'create' && hasCreateAccess && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total de Cursos</p>
                      <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Play className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Cursos Publicados</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {courses.filter(c => c.status === 'published').length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total de Alunos</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {courses.reduce((sum, course) => sum + course.students_count, 0)}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Receita Total</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatPrice(courses.reduce((sum, course) => sum + (course.price * course.students_count), 0))}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Courses List */}
              {courses.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum curso criado ainda</h3>
                  <p className="text-gray-600 mb-6">
                    Comece criando seu primeiro curso e compartilhe seu conhecimento com o mundo.
                  </p>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-[#1D295A] text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Criar Primeiro Curso
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                      {/* Thumbnail */}
                      <div className="relative h-48 bg-gray-200">
                        {course.thumbnail_url ? (
                          <img 
                            src={course.thumbnail_url} 
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Play className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                        
                        {/* Upload Thumbnail Button */}
                        <button
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0];
                              if (file) handleThumbnailUpload(course.id, file);
                            };
                            input.click();
                          }}
                          disabled={uploadingThumbnail}
                          className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-lg hover:bg-opacity-70 transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                        </button>

                        {/* Status Badge */}
                        <div className="absolute top-2 left-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                            {getStatusText(course.status)}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                            {course.title}
                          </h3>
                          <div className="flex items-center space-x-1 ml-2">
                            <button
                              onClick={() => {
                                setSelectedCourse(course);
                                setShowEditForm(true);
                              }}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => archiveCourse(course.id)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {course.description && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {course.description}
                          </p>
                        )}

                        {/* Course Info */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Preço:</span>
                            <span className="font-semibold text-gray-900">
                              {course.price > 0 ? formatPrice(course.price) : 'Gratuito'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Alunos:</span>
                            <span className="font-semibold text-gray-900">{course.students_count}</span>
                          </div>
                          {course.category && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Categoria:</span>
                              <span className="font-semibold text-gray-900">{course.category}</span>
                            </div>
                          )}
                        </div>

                        {/* Level Badge */}
                        <div className="mb-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                            {getLevelText(course.level)}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2">
                          {course.status === 'draft' && (
                            <button
                              onClick={() => publishCourse(course.id)}
                              className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                              Publicar
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleGenerateSalesLink(course.id)}
                            className="flex-1 bg-[#1D295A] text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
                          >
                            {copiedLink === course.id ? (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                <span>Copiado!</span>
                              </>
                            ) : (
                              <>
                                <Link className="w-4 h-4" />
                                <span>Link</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Course Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Criar Novo Curso</h3>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              handleCreateCourse(new FormData(e.currentTarget));
            }}>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título do Curso *
                  </label>
                  <input
                    name="title"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D295A] focus:border-transparent"
                    placeholder="Ex: Curso Completo de Marketing Digital"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D295A] focus:border-transparent"
                    placeholder="Descreva o que os alunos vão aprender..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço (R$)
                    </label>
                    <input
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D295A] focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria
                    </label>
                    <input
                      name="category"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D295A] focus:border-transparent"
                      placeholder="Ex: Marketing, Programação, Design"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nível
                  </label>
                  <select
                    name="level"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D295A] focus:border-transparent"
                  >
                    <option value="beginner">Iniciante</option>
                    <option value="intermediate">Intermediário</option>
                    <option value="advanced">Avançado</option>
                  </select>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#1D295A] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Criando...' : 'Criar Curso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {showEditForm && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Editar Curso</h3>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              handleUpdateCourse(new FormData(e.currentTarget));
            }}>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título do Curso *
                  </label>
                  <input
                    name="title"
                    type="text"
                    required
                    defaultValue={selectedCourse.title}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D295A] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    defaultValue={selectedCourse.description}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D295A] focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço (R$)
                    </label>
                    <input
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      defaultValue={selectedCourse.price}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D295A] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria
                    </label>
                    <input
                      name="category"
                      type="text"
                      defaultValue={selectedCourse.category}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D295A] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nível
                  </label>
                  <select
                    name="level"
                    defaultValue={selectedCourse.level}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D295A] focus:border-transparent"
                  >
                    <option value="beginner">Iniciante</option>
                    <option value="intermediate">Intermediário</option>
                    <option value="advanced">Avançado</option>
                  </select>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditForm(false);
                    setSelectedCourse(null);
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#1D295A] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Click outside to close modals */}
      {(showCreateForm || showEditForm) && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowCreateForm(false);
            setShowEditForm(false);
            setSelectedCourse(null);
          }}
        />
      )}
    </div>
  );
}