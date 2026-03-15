import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, Edit2, Lock, Unlock } from "lucide-react";
import { toast } from "sonner";

export default function Devices() {
  const { data: devices, isLoading, refetch } = trpc.devices.list.useQuery();
  const createDevice = trpc.devices.create.useMutation();
  const updateDevice = trpc.devices.update.useMutation();
  const unlock = trpc.devices.unlock.useMutation();
  const lock = trpc.devices.lock.useMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    ipAddress: "",
    port: 80,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateDevice.mutateAsync({
          id: editingId,
          name: formData.name,
          location: formData.location,
          port: formData.port,
        });
        toast.success("Dispositivo atualizado com sucesso");
      } else {
        await createDevice.mutateAsync(formData);
        toast.success("Dispositivo criado com sucesso");
      }

      setFormData({ name: "", location: "", ipAddress: "", port: 80 });
      setEditingId(null);
      setIsDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar dispositivo");
    }
  };

  const handleUnlock = async (deviceId: number) => {
    try {
      await unlock.mutateAsync({ deviceId });
      toast.success("Catraca aberta com sucesso");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Erro ao abrir catraca");
    }
  };

  const handleLock = async (deviceId: number) => {
    try {
      await lock.mutateAsync({ deviceId });
      toast.success("Catraca fechada com sucesso");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Erro ao fechar catraca");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dispositivos</h1>
          <p className="text-slate-600 mt-1">Gerenciamento de catracas e controle de acesso</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingId(null);
                setFormData({ name: "", location: "", ipAddress: "", port: 80 });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Dispositivo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Editar Dispositivo" : "Novo Dispositivo"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Catraca Entrada Principal"
                  required
                />
              </div>
              <div>
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Ex: Andar 1 - Entrada"
                />
              </div>
              <div>
                <Label htmlFor="ipAddress">Endereço IP</Label>
                <Input
                  id="ipAddress"
                  value={formData.ipAddress}
                  onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                  placeholder="Ex: 192.168.1.100"
                  required
                  disabled={!!editingId}
                />
              </div>
              <div>
                <Label htmlFor="port">Porta</Label>
                <Input
                  id="port"
                  type="number"
                  value={formData.port}
                  onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) })}
                  placeholder="80"
                  min="1"
                  max="65535"
                />
              </div>
              <Button type="submit" className="w-full">
                {editingId ? "Atualizar" : "Criar"} Dispositivo
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Devices Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-slate-600">Carregando dispositivos...</p>
        </div>
      ) : devices && devices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.map((device) => (
            <Card key={device.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{device.name}</h3>
                  <p className="text-sm text-slate-600">{device.location || "Sem localização"}</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">IP:</span>
                    <span className="font-mono text-slate-900">
                      {device.ipAddress}:{device.port}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Status:</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        device.status === "online"
                          ? "bg-green-100 text-green-800"
                          : device.status === "offline"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {device.status === "online" && "Online"}
                      {device.status === "offline" && "Offline"}
                      {device.status === "error" && "Erro"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-slate-200">
                  <Button
                    onClick={() => handleUnlock(device.id)}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    disabled={unlock.isPending}
                  >
                    <Unlock className="w-4 h-4 mr-1" />
                    Abrir
                  </Button>
                  <Button
                    onClick={() => handleLock(device.id)}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    disabled={lock.isPending}
                  >
                    <Lock className="w-4 h-4 mr-1" />
                    Fechar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-slate-600 mb-4">Nenhum dispositivo cadastrado</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Cadastrar Primeiro Dispositivo
          </Button>
        </Card>
      )}
    </div>
  );
}
