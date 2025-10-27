"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase, isConfigured } from '@/lib/supabase';

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  thumbnail_url?: string;
  status: 'draft' | 'published' | 'archived';
  students_count: number;
  created_at: string;
  updated_at: string;
  instructor_id: string;
}

export interface CreateCourseData {
  title: string;
  description: string;
  price: number;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface UpdateCourseData {
  title?: string;
  description?: string;
  price?: number;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  thumbnail_url?: string;
}

interface UseCoursesReturn {
  courses: Course[];
  loading: boolean;
  createCourse: (data: CreateCourseData) => Promise<{ success: boolean; error?: string }>;
  updateCourse: (id: string, data: UpdateCourseData) => Promise<{ success: boolean; error?: string }>;
  archiveCourse: (id: string) => Promise<{ success: boolean; error?: string }>;
  publishCourse: (id: string) => Promise<{ success: boolean; error?: string }>;
  generateSalesLink: (id: string) => Promise<{ success: boolean; salesLink?: string; error?: string }>;
  uploadFile: (file: File, type: 'thumbnail' | 'video' | 'document') => Promise<{ success: boolean; url?: string; error?: string }>;
}

export const useCourses = (): UseCoursesReturn => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Carregar cursos do usuário
  const loadCourses = async () => {
    if (!user || !isConfigured) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('instructor_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar cursos:', error);
        return;
      }

      setCourses(data || []);
    } catch (error) {
      console.error('Erro inesperado ao carregar cursos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadCourses();
    }
  }, [user]);

  const createCourse = async (data: CreateCourseData) => {
    if (!user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    if (!isConfigured) {
      // Simular criação para demonstração
      const mockCourse: Course = {
        id: `mock-${Date.now()}`,
        ...data,
        thumbnail_url: undefined,
        status: 'draft',
        students_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        instructor_id: user.id,
      };
      
      setCourses(prev => [mockCourse, ...prev]);
      return { success: true };
    }

    setLoading(true);
    try {
      const { data: courseData, error } = await supabase
        .from('courses')
        .insert([
          {
            ...data,
            instructor_id: user.id,
            status: 'draft',
            students_count: 0,
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar curso:', error);
        return { success: false, error: error.message };
      }

      setCourses(prev => [courseData, ...prev]);
      return { success: true };
    } catch (error: any) {
      console.error('Erro inesperado ao criar curso:', error);
      return { success: false, error: 'Erro inesperado ao criar curso' };
    } finally {
      setLoading(false);
    }
  };

  const updateCourse = async (id: string, data: UpdateCourseData) => {
    if (!user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    if (!isConfigured) {
      // Simular atualização para demonstração
      setCourses(prev => prev.map(course => 
        course.id === id 
          ? { ...course, ...data, updated_at: new Date().toISOString() }
          : course
      ));
      return { success: true };
    }

    setLoading(true);
    try {
      const { data: courseData, error } = await supabase
        .from('courses')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('instructor_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar curso:', error);
        return { success: false, error: error.message };
      }

      setCourses(prev => prev.map(course => 
        course.id === id ? courseData : course
      ));
      return { success: true };
    } catch (error: any) {
      console.error('Erro inesperado ao atualizar curso:', error);
      return { success: false, error: 'Erro inesperado ao atualizar curso' };
    } finally {
      setLoading(false);
    }
  };

  const archiveCourse = async (id: string) => {
    return await updateCourse(id, { status: 'archived' });
  };

  const publishCourse = async (id: string) => {
    return await updateCourse(id, { status: 'published' });
  };

  const generateSalesLink = async (id: string) => {
    if (!user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    // Gerar link de vendas (simulado)
    const baseUrl = window.location.origin;
    const salesLink = `${baseUrl}/course/${id}?ref=${user.id}`;
    
    return { 
      success: true, 
      salesLink,
    };
  };

  const uploadFile = async (file: File, type: 'thumbnail' | 'video' | 'document') => {
    if (!user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    if (!isConfigured) {
      // Simular upload para demonstração
      const mockUrl = `https://example.com/${type}/${file.name}`;
      return { success: true, url: mockUrl };
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${type}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('course-assets')
        .upload(fileName, file);

      if (error) {
        console.error('Erro ao fazer upload:', error);
        return { success: false, error: error.message };
      }

      const { data: { publicUrl } } = supabase.storage
        .from('course-assets')
        .getPublicUrl(fileName);

      return { success: true, url: publicUrl };
    } catch (error: any) {
      console.error('Erro inesperado no upload:', error);
      return { success: false, error: 'Erro inesperado no upload' };
    }
  };

  return {
    courses,
    loading,
    createCourse,
    updateCourse,
    archiveCourse,
    publishCourse,
    generateSalesLink,
    uploadFile,
  };
};