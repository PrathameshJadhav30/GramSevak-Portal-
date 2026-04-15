import { useEffect, useState } from "react";
import { FileText, MessageSquareText, Bell, Users } from "lucide-react";

import Card from "../components/Card";
import Skeleton from "../components/Skeleton";
import { applicationApi, complaintApi, noticeApi, committeeApi } from "../services/api";
import { useAuth } from "../hooks/useAuth";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const calls = user?.role === "admin"
          ? [applicationApi.getAll({ limit: 1 }), complaintApi.getAll({ limit: 1 }), noticeApi.getAll({ limit: 1 }), committeeApi.getAll({ limit: 1 })]
          : [applicationApi.getMine({ limit: 1 }), complaintApi.getMine({ limit: 1 }), noticeApi.getAll({ limit: 1 }), committeeApi.getAll({ limit: 1 })];

        const [apps, complaints, notices, committee] = await Promise.all(calls);

        setStats({
          applications: apps.data.meta?.total || 0,
          complaints: complaints.data.meta?.total || 0,
          notices: notices.data.meta?.total || 0,
          committee: committee.data.meta?.total || 0,
        });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user?.role]);

  const cards = [
    { title: "Total Applications", value: stats?.applications ?? 0, icon: FileText },
    { title: "Total Complaints", value: stats?.complaints ?? 0, icon: MessageSquareText },
    { title: "Total Notices", value: stats?.notices ?? 0, icon: Bell },
    { title: "Committee Members", value: stats?.committee ?? 0, icon: Users },
  ];

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{item.title}</p>
                    <p className="mt-1 text-2xl font-bold text-slate-800">{item.value}</p>
                  </div>
                  <div className="rounded-full bg-emerald-100 p-2 text-emerald-700">
                    <Icon size={20} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
