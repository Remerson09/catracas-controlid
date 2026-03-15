import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Dispositivos Control iD (catracas)
 */
export const devices = mysqlTable("devices", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }),
  ipAddress: varchar("ipAddress", { length: 45 }).notNull().unique(),
  port: int("port").default(80).notNull(),
  deviceType: varchar("deviceType", { length: 64 }).default("catraca").notNull(),
  status: mysqlEnum("status", ["online", "offline", "error"]).default("offline").notNull(),
  lastCommunication: timestamp("lastCommunication"),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Device = typeof devices.$inferSelect;
export type InsertDevice = typeof devices.$inferInsert;

/**
 * Usuários cadastrados no sistema (pessoas com acesso)
 */
export const accessUsers = mysqlTable("accessUsers", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  documentId: varchar("documentId", { length: 64 }).unique(),
  photoUrl: text("photoUrl"),
  facialDataId: varchar("facialDataId", { length: 255 }),
  status: mysqlEnum("status", ["ativo", "inativo", "bloqueado"]).default("ativo").notNull(),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AccessUser = typeof accessUsers.$inferSelect;
export type InsertAccessUser = typeof accessUsers.$inferInsert;

/**
 * Permissões de acesso por usuário e dispositivo
 */
export const accessPermissions = mysqlTable("accessPermissions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  deviceId: int("deviceId").notNull(),
  accessType: mysqlEnum("accessType", ["entrada", "saida", "bidirecional"]).default("bidirecional").notNull(),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AccessPermission = typeof accessPermissions.$inferSelect;
export type InsertAccessPermission = typeof accessPermissions.$inferInsert;

/**
 * Eventos de acesso (logs de entrada/saída)
 */
export const accessEvents = mysqlTable("accessEvents", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  deviceId: int("deviceId").notNull(),
  eventType: mysqlEnum("eventType", ["entrada", "saida", "negado", "erro"]).notNull(),
  status: mysqlEnum("status", ["sucesso", "falha", "pendente"]).default("sucesso").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  details: text("details"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AccessEvent = typeof accessEvents.$inferSelect;
export type InsertAccessEvent = typeof accessEvents.$inferInsert;

/**
 * Histórico de comandos enviados para dispositivos (auditoria)
 */
export const commandHistory = mysqlTable("commandHistory", {
  id: int("id").autoincrement().primaryKey(),
  deviceId: int("deviceId").notNull(),
  commandType: varchar("commandType", { length: 64 }).notNull(),
  commandHex: text("commandHex"),
  requestData: text("requestData"),
  responseData: text("responseData"),
  status: mysqlEnum("status", ["enviado", "sucesso", "erro", "timeout"]).default("enviado").notNull(),
  errorMessage: text("errorMessage"),
  executedBy: int("executedBy"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CommandHistory = typeof commandHistory.$inferSelect;
export type InsertCommandHistory = typeof commandHistory.$inferInsert;

/**
 * Configurações de dispositivos
 */
export const deviceConfigs = mysqlTable("deviceConfigs", {
  id: int("id").autoincrement().primaryKey(),
  deviceId: int("deviceId").notNull().unique(),
  relayDuration: int("relayDuration").default(1000),
  unlockDirection: varchar("unlockDirection", { length: 64 }).default("clockwise"),
  communicationTimeout: int("communicationTimeout").default(5000),
  retryAttempts: int("retryAttempts").default(3),
  healthCheckInterval: int("healthCheckInterval").default(30000),
  customConfig: text("customConfig"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DeviceConfig = typeof deviceConfigs.$inferSelect;
export type InsertDeviceConfig = typeof deviceConfigs.$inferInsert;