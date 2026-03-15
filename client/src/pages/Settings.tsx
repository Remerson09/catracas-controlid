import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, Bell, Lock, Database } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const [generalSettings, setGeneralSettings] = useState({
    systemName: "Sistema de Catracas Control iD",
    email: "admin@example.com",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    offlineAlerts: true,
    commandAlerts: true,
  });

  const [advancedSettings, setAdvancedSettings] = useState({
    defaultTimeout: 5000,
    retryAttempts: 3,
    healthCheckInterval: 30000,
  });

  const handleSaveGeneral = () => {
    toast.success("Configurações gerais salvas");
  };

  const handleSaveNotifications = () => {
    toast.success("Configurações de notificações salvas");
  };

  const handleSaveAdvanced = () => {
    toast.success("Configurações avançadas salvas");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Configurações</h1>
        <p className="text-slate-600 mt-1">Gerencie as configurações do sistema</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">
            <SettingsIcon className="w-4 h-4 mr-2" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="advanced">
            <Lock className="w-4 h-4 mr-2" />
            Avançado
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Configurações Gerais</h2>
            </div>

            <div>
              <Label htmlFor="systemName">Nome do Sistema</Label>
              <Input
                id="systemName"
                value={generalSettings.systemName}
                onChange={(e) =>
                  setGeneralSettings({ ...generalSettings, systemName: e.target.value })
                }
                placeholder="Nome do sistema"
              />
            </div>

            <div>
              <Label htmlFor="email">Email de Administrador</Label>
              <Input
                id="email"
                type="email"
                value={generalSettings.email}
                onChange={(e) => setGeneralSettings({ ...generalSettings, email: e.target.value })}
                placeholder="admin@example.com"
              />
            </div>

            <Button onClick={handleSaveGeneral}>Salvar Configurações</Button>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Notificações</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <p className="font-semibold text-slate-900">Alertas por Email</p>
                  <p className="text-sm text-slate-600">Receber notificações por email</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.emailAlerts}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      emailAlerts: e.target.checked,
                    })
                  }
                  className="w-5 h-5"
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <p className="font-semibold text-slate-900">Alertas de Offline</p>
                  <p className="text-sm text-slate-600">Notificar quando dispositivo ficar offline</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.offlineAlerts}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      offlineAlerts: e.target.checked,
                    })
                  }
                  className="w-5 h-5"
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <p className="font-semibold text-slate-900">Alertas de Comandos</p>
                  <p className="text-sm text-slate-600">Notificar sobre comandos enviados</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.commandAlerts}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      commandAlerts: e.target.checked,
                    })
                  }
                  className="w-5 h-5"
                />
              </div>
            </div>

            <Button onClick={handleSaveNotifications}>Salvar Notificações</Button>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced">
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Configurações Avançadas</h2>
              <p className="text-sm text-slate-600 mb-6">
                Ajuste os parâmetros de comunicação com dispositivos
              </p>
            </div>

            <div>
              <Label htmlFor="defaultTimeout">Timeout Padrão (ms)</Label>
              <Input
                id="defaultTimeout"
                type="number"
                value={advancedSettings.defaultTimeout}
                onChange={(e) =>
                  setAdvancedSettings({
                    ...advancedSettings,
                    defaultTimeout: parseInt(e.target.value),
                  })
                }
                placeholder="5000"
              />
              <p className="text-xs text-slate-500 mt-1">
                Tempo máximo para aguardar resposta do dispositivo
              </p>
            </div>

            <div>
              <Label htmlFor="retryAttempts">Tentativas de Reconexão</Label>
              <Input
                id="retryAttempts"
                type="number"
                value={advancedSettings.retryAttempts}
                onChange={(e) =>
                  setAdvancedSettings({
                    ...advancedSettings,
                    retryAttempts: parseInt(e.target.value),
                  })
                }
                placeholder="3"
              />
              <p className="text-xs text-slate-500 mt-1">
                Número de tentativas antes de falhar
              </p>
            </div>

            <div>
              <Label htmlFor="healthCheckInterval">Intervalo de Verificação (ms)</Label>
              <Input
                id="healthCheckInterval"
                type="number"
                value={advancedSettings.healthCheckInterval}
                onChange={(e) =>
                  setAdvancedSettings({
                    ...advancedSettings,
                    healthCheckInterval: parseInt(e.target.value),
                  })
                }
                placeholder="30000"
              />
              <p className="text-xs text-slate-500 mt-1">
                Frequência de verificação de status dos dispositivos
              </p>
            </div>

            <Button onClick={handleSaveAdvanced}>Salvar Configurações Avançadas</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
