'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const dynamic = 'force-dynamic';

export default function GestorDashboard() {
  const router = useRouter();

  useEffect(() => {
    // Redirecionar para quadras por padrão
    router.push('/gestor/quadras');
  }, [router]);

  return (
    <div className="p-8">
      <p>Redirecionando...</p>
    </div>
  );
}
