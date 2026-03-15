import React, { useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Wifi, WifiOff, Zap, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Dashboard() {
  const { data: devices, isLoading, refetch } = trpc.devices.list.useQuery();
  const testConnectivity = trpc.devices.testConnectivity.useMutation();

  // Auto-refresh a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);
    return () => clearInterval(interval);
  }, [refetch]);

  const onlineCount = devices?.filter((d) => d.status === "online").length || 0;
  const offlineCount = devices?.filter((d) => d.status === "offline").length || 0;
  const errorCount = devices?.filter((d) => d.status === "error").length || 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800";
      case "offline":
        return "bg-red-100 text-red-800";
      case "error":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <Wifi className="w-4 h-4" />;
      case "offline":
        return <WifiOff className="w-4 h-4" />;
      case "error":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Monitoramento em tempo real de catracas</p>
        </div>
        <Button onClick={() => refetch()} variant="outline">
          Atualizar
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total de Dispositivos</p>
              <p className="text-3xl font-bold text-slate-900">{devices?.length || 0}</p>
            </div>
            <Zap className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6 border-green-200 bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Online</p>
              <p className="text-3xl font-bold text-green-600">{onlineCount}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6 border-red-200 bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Offline</p>
              <p className="text-3xl font-bold text-red-600">{offlineCount}</p>
            </div>
            <WifiOff className="w-8 h-8 text-red-500" />
          </div>
        </Card>

        <Card className="p-6 border-yellow-200 bg-yellow-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Erro</p>
              <p className="text-3xl font-bold text-yellow-600">{errorCount}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
      </div>

      {/* Devices List */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Dispositivos Conectados</h2>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Carregando dispositivos...</p>
          </div>
        ) : devices && devices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Nome</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Localização</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">IP</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">
                    Última Comunicação
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((device) => (
                  <tr key={device.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-900">{device.name}</td>
                    <td className="py-3 px-4 text-slate-600">{device.location || "-"}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {device.ipAddress}:{device.port}
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={`${getStatusColor(device.status)} flex items-center gap-1 w-fit`}>
                        {getStatusIcon(device.status)}
                        {device.status === "online" && "Online"}
                        {device.status === "offline" && "Offline"}
                        {device.status === "error" && "Erro"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {device.lastCommunication ? (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {format(new Date(device.lastCommunication), "dd/MM HH:mm", {
                            locale: ptBR,
                          })}
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        onClick={() => testConnectivity.mutate({ id: device.id })}
                        size="sm"
                        variant="outline"
                        disabled={testConnectivity.isPending}
                      >
                        Testar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600">Nenhum dispositivo cadastrado</p>
          </div>
        )}
      </Card>
    </div>
  );
}
