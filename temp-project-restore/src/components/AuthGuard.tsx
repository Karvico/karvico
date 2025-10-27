"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireSubscription?: boolean;
  redirectTo?: string;
}

export default function AuthGuard({ 
  children, 
  requireAuth = true, 
  requireSubscription = false,
  redirectTo = "/auth/login" 
}: AuthGuardProps) {
  const { user, loading } = useAuth();
  const { isSubscribed, loading: subscriptionLoading } = useSubscription();
  const router = useRouter();

  useEffect(() => {
    if (loading || subscriptionLoading) return;

    // Verificar autenticação
    if (requireAuth && !user) {
      router.push(redirectTo);
      return;
    }

    // Verificar assinatura se necessário
    if (requireSubscription && !isSubscribed) {
      router.push("/upgrade");
      return;
    }
  }, [user, loading, isSubscribed, subscriptionLoading, requireAuth, requireSubscription, redirectTo, router]);

  // Mostrar loading enquanto verifica
  if (loading || subscriptionLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-[#1D295A] rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">K</span>
          </div>
          <p className="text-gray-600">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  // Não renderizar se não atender aos requisitos
  if (requireAuth && !user) return null;
  if (requireSubscription && !isSubscribed) return null;

  return <>{children}</>;
}