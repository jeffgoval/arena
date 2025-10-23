'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Users, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

interface ConvitesStatsProps {
  stats: {
    total: number;
    ativos: number;
    completos: number;
    expirados: number;
    taxaAceite: number;
    totalAceites: number;
  };
}

export function ConvitesStats({ stats }: ConvitesStatsProps) {
  const statCards = [
    {
      label: 'Total de Convites',
      value: stats.total,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Convites Ativos',
      value: stats.ativos,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Total de Aceites',
      value: stats.totalAceites,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      label: 'Taxa de Aceite',
      value: `${stats.taxaAceite.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-full`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
