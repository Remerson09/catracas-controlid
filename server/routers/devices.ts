/*import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  createDevice,
  getDeviceById,
  listDevices,
  updateDevice,
  updateDeviceStatus,
  getDeviceConfig,
  updateDeviceConfig,
  createCommandHistory,
  getCommandHistoryByDevice,
  updateCommandStatus,
} from "../db";
import { sendCommandToDevice, testDeviceConnectivity, isValidHexCommand } from "../controlid";

export const devicesRouter = router({
  /**
   * Lista todos os dispositivos
   */
 /* list: protectedProcedure.query(async () => {
    return listDevices();
  }),

  /**
   * Obtém detalhes de um dispositivo específico
   */
/*  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const device = await getDeviceById(input.id);
    if (!device) {
      throw new Error("Dispositivo não encontrado");
    }
    return device;
  }),

  /**
   * Cria um novo dispositivo
   */
 /* create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Nome é obrigatório"),
        location: z.string().optional(),
        ipAddress: z.string().refine((val) => /^(\d{1,3}\.){3}\d{1,3}$/.test(val), "IP inválido"),
        port: z.number().int().min(1).max(65535).default(80),
        deviceType: z.string().default("catraca"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const device = await createDevice({
        name: input.name,
        location: input.location || null,
        ipAddress: input.ipAddress,
        port: input.port,
        deviceType: input.deviceType,
        createdBy: ctx.user.id,
      });
      return device;
    }),

  /**
   * Atualiza informações de um dispositivo
   */
/*  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        location: z.string().optional(),
        port: z.number().int().min(1).max(65535).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;
      await updateDevice(id, updates);
      return getDeviceById(id);
    }),

  /**
   * Testa conectividade com um dispositivo
   */
 /* testConnectivity: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const device = await getDeviceById(input.id);
      if (!device) {
        throw new Error("Dispositivo não encontrado");
      }

      const result = await testDeviceConnectivity({
        host: device.ipAddress,
        port: device.port,
      });

      // Atualiza status do dispositivo
      await updateDeviceStatus(device.id, result.success ? "online" : "offline");

      return result;
    }),

  /**
   * Obtém configurações de um dispositivo
   */
/*  getConfig: protectedProcedure
    .input(z.object({ deviceId: z.number() }))
    .query(async ({ input }) => {
      return getDeviceConfig(input.deviceId);
    }),

  /**
   * Atualiza configurações de um dispositivo
   */
/* updateConfig: protectedProcedure
    .input(
      z.object({
        deviceId: z.number(),
        relayDuration: z.number().optional(),
        unlockDirection: z.enum(["clockwise", "counterclockwise"]).optional(),
        communicationTimeout: z.number().optional(),
        retryAttempts: z.number().optional(),
        healthCheckInterval: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { deviceId, ...updates } = input;
      await updateDeviceConfig(deviceId, updates);
      return getDeviceConfig(deviceId);
    }),

  /**
   * Envia comando hexadecimal para um dispositivo
   */
/*  sendCommand: protectedProcedure
    .input(
      z.object({
        deviceId: z.number(),
        commandType: z.string().min(1),
        commandHex: z.string().min(2),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const device = await getDeviceById(input.deviceId);
      if (!device) {
        throw new Error("Dispositivo não encontrado");
      }

      // Valida comando hexadecimal
      if (!isValidHexCommand(input.commandHex)) {
        throw new Error("Comando hexadecimal inválido");
      }

      const config = await getDeviceConfig(input.deviceId);

      // Registra o comando no histórico
      const commandRecord = await createCommandHistory({
        deviceId: input.deviceId,
        commandType: input.commandType,
        commandHex: input.commandHex,
        requestData: JSON.stringify({ type: input.commandType }),
        status: "enviado",
        executedBy: ctx.user.id,
      });

      // Envia o comando
      const result = await sendCommandToDevice(
        {
          host: device.ipAddress,
          port: device.port,
          timeout: config?.communicationTimeout || 5000,
          retries: config?.retryAttempts || 3,
        },
        input.commandHex
      );

      // Atualiza status do comando
      if (result.success) {
        await updateCommandStatus(
          commandRecord.id,
          "sucesso",
          result.data?.toString("hex") || undefined
        );
        await updateDeviceStatus(device.id, "online");
      } else {
        await updateCommandStatus(commandRecord.id, "erro", undefined, result.error);
        await updateDeviceStatus(device.id, "offline");
      }

      return {
        success: result.success,
        message: result.success ? "Comando enviado com sucesso" : result.error,
        responseTime: result.responseTime,
      };
    }),

  /**
   * Libera acesso (abre a catraca)
   */
/*  unlock: protectedProcedure
    .input(z.object({ deviceId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const device = await getDeviceById(input.deviceId);
      if (!device) {
        throw new Error("Dispositivo não encontrado");
      }

      const config = await getDeviceConfig(input.deviceId);
      const durationMs = config?.relayDuration || 1000;

      // Comando de liberação (exemplo - ajustar conforme modelo específico)
      const unlockCommand = "A1B2C3D4";

      const commandRecord = await createCommandHistory({
        deviceId: input.deviceId,
        commandType: "unlock",
        commandHex: unlockCommand,
        requestData: JSON.stringify({ type: "unlock", duration: durationMs }),
        status: "enviado",
        executedBy: ctx.user.id,
      });

      const result = await sendCommandToDevice(
        {
          host: device.ipAddress,
          port: device.port,
          timeout: config?.communicationTimeout || 5000,
          retries: config?.retryAttempts || 3,
        },
        unlockCommand
      );

      if (result.success) {
        await updateCommandStatus(
          commandRecord.id,
          "sucesso",
          result.data?.toString("hex") || undefined
        );
        await updateDeviceStatus(device.id, "online");
      } else {
        await updateCommandStatus(commandRecord.id, "erro", undefined, result.error);
        await updateDeviceStatus(device.id, "offline");
      }

      return {
        success: result.success,
        message: result.success ? "Catraca aberta com sucesso" : result.error,
        responseTime: result.responseTime,
      };
    }),

  /**
   * Bloqueia acesso (fecha a catraca)
   */
 /* lock: protectedProcedure
    .input(z.object({ deviceId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const device = await getDeviceById(input.deviceId);
      if (!device) {
        throw new Error("Dispositivo não encontrado");
      }

      // Comando de bloqueio (exemplo - ajustar conforme modelo específico)
      const lockCommand = "D4C3B2A1";

      const commandRecord = await createCommandHistory({
        deviceId: input.deviceId,
        commandType: "lock",
        commandHex: lockCommand,
        requestData: JSON.stringify({ type: "lock" }),
        status: "enviado",
        executedBy: ctx.user.id,
      });

      const deviceConfig = await getDeviceConfig(input.deviceId);
      const result = await sendCommandToDevice(
        {
          host: device.ipAddress,
          port: device.port,
          timeout: deviceConfig?.communicationTimeout || 5000,
          retries: deviceConfig?.retryAttempts || 3,
        },
        lockCommand
      );

      if (result.success) {
        await updateCommandStatus(
          commandRecord.id,
          "sucesso",
          result.data?.toString("hex") || undefined
        );
        await updateDeviceStatus(device.id, "online");
      } else {
        await updateCommandStatus(commandRecord.id, "erro", undefined, result.error);
        await updateDeviceStatus(device.id, "offline");
      }

      return {
        success: result.success,
        message: result.success ? "Catraca fechada com sucesso" : result.error,
        responseTime: result.responseTime,
      };
    }),

  /**
   * Obtém histórico de comandos de um dispositivo
   */

/*  getCommandHistory: protectedProcedure
    .input(z.object({ deviceId: z.number(), limit: z.number().default(100) }))
    .query(async ({ input }) => {
      return getCommandHistoryByDevice(input.deviceId, input.limit);
    }),
});

 */

import { z } from "zod";
// Mudamos a importação aqui para incluir o publicProcedure
import { publicProcedure, router } from "../_core/trpc";
import {
  createDevice,
  getDeviceById,
  listDevices,
  updateDevice,
  updateDeviceStatus,
  getDeviceConfig,
  updateDeviceConfig,
  createCommandHistory,
  getCommandHistoryByDevice,
  updateCommandStatus,
} from "../db";
import { sendCommandToDevice, testDeviceConnectivity, isValidHexCommand } from "../controlid";

export const devicesRouter = router({
  /**
   * Lista todos os dispositivos - AGORA PÚBLICO
   */
  list: publicProcedure.query(async () => {
    return listDevices();
  }),

  /**
   * Obtém detalhes de um dispositivo específico - AGORA PÚBLICO
   */
  getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const device = await getDeviceById(input.id);
    if (!device) {
      throw new Error("Dispositivo não encontrado");
    }
    return device;
  }),

  /**
   * Cria um novo dispositivo - AGORA PÚBLICO
   */
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Nome é obrigatório"),
        location: z.string().optional(),
        ipAddress: z.string().refine((val) => /^(\d{1,3}\.){3}\d{1,3}$/.test(val), "IP inválido"),
        port: z.number().int().min(1).max(65535).default(80),
        deviceType: z.string().default("catraca"),
      })
    )
    .mutation(async ({ input }) => {
      const device = await createDevice({
        name: input.name,
        location: input.location || null,
        ipAddress: input.ipAddress,
        port: input.port,
        deviceType: input.deviceType,
        createdBy: 1, // Usando ID 1 fixo (seu usuário admin)
      });
      return device;
    }),

  /**
   * Atualiza informações de um dispositivo - AGORA PÚBLICO
   */
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        location: z.string().optional(),
        port: z.number().int().min(1).max(65535).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;
      await updateDevice(id, updates);
      return getDeviceById(id);
    }),

  /**
   * Testa conectividade - AGORA PÚBLICO
   */
  testConnectivity: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const device = await getDeviceById(input.id);
      if (!device) throw new Error("Dispositivo não encontrado");

      const result = await testDeviceConnectivity({
        host: device.ipAddress,
        port: device.port,
      });

      await updateDeviceStatus(device.id, result.success ? "online" : "offline");
      return result;
    }),

  /**
   * Libera acesso (abre a catraca) - AGORA PÚBLICO
   */
  unlock: publicProcedure
    .input(z.object({ deviceId: z.number() }))
    .mutation(async ({ input }) => {
      const device = await getDeviceById(input.deviceId);
      if (!device) throw new Error("Dispositivo não encontrado");

      const config = await getDeviceConfig(input.deviceId);
      const unlockCommand = "A1B2C3D4";

      const commandRecord = await createCommandHistory({
        deviceId: input.deviceId,
        commandType: "unlock",
        commandHex: unlockCommand,
        requestData: JSON.stringify({ type: "unlock" }),
        status: "enviado",
        executedBy: 1, // Fixado como admin
      });

      const result = await sendCommandToDevice(
        {
          host: device.ipAddress,
          port: device.port,
          timeout: config?.communicationTimeout || 5000,
          retries: config?.retryAttempts || 3,
        },
        unlockCommand
      );

      if (result.success) {
        await updateCommandStatus(commandRecord.id, "sucesso", result.data?.toString("hex"));
        await updateDeviceStatus(device.id, "online");
      } else {
        await updateCommandStatus(commandRecord.id, "erro", undefined, result.error);
        await updateDeviceStatus(device.id, "offline");
      }

      return result;
    }),

  /**
   * Bloqueia acesso (fecha a catraca) - AGORA PÚBLICO
   */
  lock: publicProcedure
    .input(z.object({ deviceId: z.number() }))
    .mutation(async ({ input }) => {
      const device = await getDeviceById(input.deviceId);
      if (!device) throw new Error("Dispositivo não encontrado");

      const lockCommand = "D4C3B2A1";
      const commandRecord = await createCommandHistory({
        deviceId: input.deviceId,
        commandType: "lock",
        commandHex: lockCommand,
        requestData: JSON.stringify({ type: "lock" }),
        status: "enviado",
        executedBy: 1,
      });

      const deviceConfig = await getDeviceConfig(input.deviceId);
      const result = await sendCommandToDevice(
        {
          host: device.ipAddress,
          port: device.port,
          timeout: deviceConfig?.communicationTimeout || 5000,
          retries: deviceConfig?.retryAttempts || 3,
        },
        lockCommand
      );

      if (result.success) {
        await updateCommandStatus(commandRecord.id, "sucesso", result.data?.toString("hex"));
        await updateDeviceStatus(device.id, "online");
      } else {
        await updateCommandStatus(commandRecord.id, "erro", undefined, result.error);
        await updateDeviceStatus(device.id, "offline");
      }

      return result;
    }),

  // Se precisar de outras rotas (getConfig, sendCommand, etc),
  // mude para publicProcedure seguindo a mesma lógica acima.
});