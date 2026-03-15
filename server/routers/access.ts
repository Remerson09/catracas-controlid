/*import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  createAccessUser,
  getAccessUserById,
  listAccessUsers,
  updateAccessUser,
  createAccessPermission,
  getPermissionsByUser,
  getPermissionsByDevice,
  createAccessEvent,
  getAccessEventsByDevice,
  getAccessEventsByUser,
  getAccessEventsInRange,
} from "../db";

export const accessRouter = router({
  // ============ USUÁRIOS DE ACESSO ============

  /**
   * Lista todos os usuários de acesso
   */
/*  listUsers: protectedProcedure.query(async () => {
    return listAccessUsers();
  }),

  /**
   * Obtém detalhes de um usuário de acesso
   */
/*  getUserById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const user = await getAccessUserById(input.id);
      if (!user) {
        throw new Error("Usuário não encontrado");
      }
      return user;
    }),

  /**
   * Cria um novo usuário de acesso
   */
 /* createUser: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Nome é obrigatório"),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        documentId: z.string().optional(),
        photoUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await createAccessUser({
        ...input,
        createdBy: ctx.user.id,
      });
      return user;
    }),

  /**
   * Atualiza informações de um usuário de acesso
   */
/*  updateUser: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        documentId: z.string().optional(),
        photoUrl: z.string().optional(),
        status: z.enum(["ativo", "inativo", "bloqueado"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;
      await updateAccessUser(id, updates);
      return getAccessUserById(id);
    }),

  // ============ PERMISSÕES DE ACESSO ============

  /**
   * Cria uma permissão de acesso para um usuário em um dispositivo
   */
/*  createPermission: protectedProcedure
    .input(
      z.object({
        userId: z.number(),
        deviceId: z.number(),
        accessType: z.enum(["entrada", "saida", "bidirecional"]).default("bidirecional"),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const permission = await createAccessPermission({
        userId: input.userId,
        deviceId: input.deviceId,
        accessType: input.accessType,
        startDate: input.startDate || null,
        endDate: input.endDate || null,
        isActive: 1,
      });
      return permission;
    }),

  /**
   * Obtém permissões de um usuário
   */
/*  getPermissionsByUser: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      return getPermissionsByUser(input.userId);
    }),

  /**
   * Obtém permissões de um dispositivo
   */
/*  getPermissionsByDevice: protectedProcedure
    .input(z.object({ deviceId: z.number() }))
    .query(async ({ input }) => {
      return getPermissionsByDevice(input.deviceId);
    }),

  // ============ EVENTOS DE ACESSO ============

  /**
   * Registra um evento de acesso
   */
/*  createEvent: protectedProcedure
    .input(
      z.object({
        userId: z.number().optional(),
        deviceId: z.number(),
        eventType: z.enum(["entrada", "saida", "negado", "erro"]),
        status: z.enum(["sucesso", "falha", "pendente"]).default("sucesso"),
        details: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const event = await createAccessEvent({
        userId: input.userId || null,
        deviceId: input.deviceId,
        eventType: input.eventType,
        status: input.status,
        details: input.details || null,
      });
      return event;
    }),

  /**
   * Obtém eventos de um dispositivo
   */
/*  getEventsByDevice: protectedProcedure
/*    .input(z.object({ deviceId: z.number(), limit: z.number().default(100) }))
    .query(async ({ input }) => {
      return getAccessEventsByDevice(input.deviceId, input.limit);
    }),

  /**
   * Obtém eventos de um usuário
   */
 /* getEventsByUser: protectedProcedure
    .input(z.object({ userId: z.number(), limit: z.number().default(100) }))
    .query(async ({ input }) => {
      return getAccessEventsByUser(input.userId, input.limit);
    }),

  /**
   * Obtém eventos em um intervalo de datas
   */
 /* getEventsByDateRange: protectedProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
        limit: z.number().default(1000),
      })
    )
    .query(async ({ input }) => {
      return getAccessEventsInRange(input.startDate, input.endDate, input.limit);
    }),
});
*/

import { z } from "zod";
// 1. Mudamos para publicProcedure aqui
import { publicProcedure, router } from "../_core/trpc";
import {
  createAccessUser,
  getAccessUserById,
  listAccessUsers,
  updateAccessUser,
  createAccessPermission,
  getPermissionsByUser,
  getPermissionsByDevice,
  createAccessEvent,
  getAccessEventsByDevice,
  getAccessEventsByUser,
  getAccessEventsInRange,
} from "../db";

export const accessRouter = router({
  // ============ USUÁRIOS DE ACESSO ============

  /**
   * Lista todos os usuários de acesso - AGORA PÚBLICO
   */
  listUsers: publicProcedure.query(async () => {
    return listAccessUsers();
  }),

  /**
   * Obtém detalhes de um usuário de acesso - AGORA PÚBLICO
   */
  getUserById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const user = await getAccessUserById(input.id);
      if (!user) {
        throw new Error("Usuário não encontrado");
      }
      return user;
    }),

  /**
   * Cria um novo usuário de acesso - AGORA PÚBLICO
   */
  createUser: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Nome é obrigatório"),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        documentId: z.string().optional(),
        photoUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const user = await createAccessUser({
        ...input,
        createdBy: 1, // ID fixo do admin que criamos no SQL
      });
      return user;
    }),

  /**
   * Atualiza informações - AGORA PÚBLICO
   */
  updateUser: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        documentId: z.string().optional(),
        photoUrl: z.string().optional(),
        status: z.enum(["ativo", "inativo", "bloqueado"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;
      await updateAccessUser(id, updates);
      return getAccessUserById(id);
    }),

  // ============ PERMISSÕES DE ACESSO ============

  /**
   * Cria uma permissão - AGORA PÚBLICO
   */
  createPermission: publicProcedure
    .input(
      z.object({
        userId: z.number(),
        deviceId: z.number(),
        accessType: z.enum(["entrada", "saida", "bidirecional"]).default("bidirecional"),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const permission = await createAccessPermission({
        userId: input.userId,
        deviceId: input.deviceId,
        accessType: input.accessType,
        startDate: input.startDate || null,
        endDate: input.endDate || null,
        isActive: 1,
      });
      return permission;
    }),

  /**
   * Obtém permissões de um usuário - AGORA PÚBLICO
   */
  getPermissionsByUser: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      return getPermissionsByUser(input.userId);
    }),

  // ============ EVENTOS DE ACESSO ============

  /**
   * Registra um evento - AGORA PÚBLICO
   */
  createEvent: publicProcedure
    .input(
      z.object({
        userId: z.number().optional(),
        deviceId: z.number(),
        eventType: z.enum(["entrada", "saida", "negado", "erro"]),
        status: z.enum(["sucesso", "falha", "pendente"]).default("sucesso"),
        details: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const event = await createAccessEvent({
        userId: input.userId || null,
        deviceId: input.deviceId,
        eventType: input.eventType,
        status: input.status,
        details: input.details || null,
      });
      return event;
    }),

  /**
   * Obtém eventos de um dispositivo - AGORA PÚBLICO
   */
  getEventsByDevice: publicProcedure
    .input(z.object({ deviceId: z.number(), limit: z.number().default(100) }))
    .query(async ({ input }) => {
      return getAccessEventsByDevice(input.deviceId, input.limit);
    }),
});