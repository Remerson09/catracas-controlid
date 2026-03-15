import { eq, and, desc, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  devices,
  Device,
  InsertDevice,
  accessUsers,
  AccessUser,
  InsertAccessUser,
  accessPermissions,
  AccessPermission,
  InsertAccessPermission,
  accessEvents,
  AccessEvent,
  InsertAccessEvent,
  commandHistory,
  CommandHistory,
  InsertCommandHistory,
  deviceConfigs,
  DeviceConfig,
  InsertDeviceConfig,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ USERS ============
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ DEVICES ============
export async function createDevice(device: InsertDevice): Promise<Device> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(devices).values(device);
  const deviceId = result[0].insertId;

  // Cria configuração padrão para o dispositivo
  await db.insert(deviceConfigs).values({
    deviceId: Number(deviceId),
  } as InsertDeviceConfig);

  const created = await db
    .select()
    .from(devices)
    .where(eq(devices.id, Number(deviceId)))
    .limit(1);

  return created[0];
}

export async function getDeviceById(id: number): Promise<Device | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(devices).where(eq(devices.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getDeviceByIp(ipAddress: string): Promise<Device | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(devices)
    .where(eq(devices.ipAddress, ipAddress))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function listDevices(): Promise<Device[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(devices).orderBy(desc(devices.createdAt));
}

export async function updateDeviceStatus(
  id: number,
  status: "online" | "offline" | "error"
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(devices)
    .set({
      status,
      lastCommunication: new Date(),
    })
    .where(eq(devices.id, id));
}

export async function updateDevice(id: number, updates: Partial<InsertDevice>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(devices).set(updates).where(eq(devices.id, id));
}

// ============ ACCESS USERS ============
export async function createAccessUser(user: InsertAccessUser): Promise<AccessUser> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(accessUsers).values(user);
  const userId = result[0].insertId;

  const created = await db
    .select()
    .from(accessUsers)
    .where(eq(accessUsers.id, Number(userId)))
    .limit(1);

  return created[0];
}

export async function getAccessUserById(id: number): Promise<AccessUser | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(accessUsers)
    .where(eq(accessUsers.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function listAccessUsers(): Promise<AccessUser[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(accessUsers).orderBy(desc(accessUsers.createdAt));
}

export async function updateAccessUser(
  id: number,
  updates: Partial<InsertAccessUser>
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(accessUsers).set(updates).where(eq(accessUsers.id, id));
}

// ============ ACCESS PERMISSIONS ============
export async function createAccessPermission(
  permission: InsertAccessPermission
): Promise<AccessPermission> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(accessPermissions).values(permission);
  const permissionId = result[0].insertId;

  const created = await db
    .select()
    .from(accessPermissions)
    .where(eq(accessPermissions.id, Number(permissionId)))
    .limit(1);

  return created[0];
}

export async function getPermissionsByUser(userId: number): Promise<AccessPermission[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(accessPermissions)
    .where(and(eq(accessPermissions.userId, userId), eq(accessPermissions.isActive, 1)))
    .orderBy(desc(accessPermissions.createdAt));
}

export async function getPermissionsByDevice(deviceId: number): Promise<AccessPermission[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(accessPermissions)
    .where(and(eq(accessPermissions.deviceId, deviceId), eq(accessPermissions.isActive, 1)))
    .orderBy(desc(accessPermissions.createdAt));
}

// ============ ACCESS EVENTS ============
export async function createAccessEvent(event: InsertAccessEvent): Promise<AccessEvent> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(accessEvents).values(event);
  const eventId = result[0].insertId;

  const created = await db
    .select()
    .from(accessEvents)
    .where(eq(accessEvents.id, Number(eventId)))
    .limit(1);

  return created[0];
}

export async function getAccessEventsByDevice(
  deviceId: number,
  limit: number = 100
): Promise<AccessEvent[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(accessEvents)
    .where(eq(accessEvents.deviceId, deviceId))
    .orderBy(desc(accessEvents.timestamp))
    .limit(limit);
}

export async function getAccessEventsByUser(
  userId: number,
  limit: number = 100
): Promise<AccessEvent[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(accessEvents)
    .where(eq(accessEvents.userId, userId))
    .orderBy(desc(accessEvents.timestamp))
    .limit(limit);
}

export async function getAccessEventsInRange(
  startDate: Date,
  endDate: Date,
  limit: number = 1000
): Promise<AccessEvent[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(accessEvents)
    .where(and(gte(accessEvents.timestamp, startDate), lte(accessEvents.timestamp, endDate)))
    .orderBy(desc(accessEvents.timestamp))
    .limit(limit);
}

// ============ COMMAND HISTORY ============
export async function createCommandHistory(
  command: InsertCommandHistory
): Promise<CommandHistory> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(commandHistory).values(command);
  const commandId = result[0].insertId;

  const created = await db
    .select()
    .from(commandHistory)
    .where(eq(commandHistory.id, Number(commandId)))
    .limit(1);

  return created[0];
}

export async function getCommandHistoryByDevice(
  deviceId: number,
  limit: number = 100
): Promise<CommandHistory[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(commandHistory)
    .where(eq(commandHistory.deviceId, deviceId))
    .orderBy(desc(commandHistory.timestamp))
    .limit(limit);
}

export async function updateCommandStatus(
  id: number,
  status: "enviado" | "sucesso" | "erro" | "timeout",
  responseData?: string,
  errorMessage?: string
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updates: Record<string, unknown> = { status };
  if (responseData) updates.responseData = responseData;
  if (errorMessage) updates.errorMessage = errorMessage;

  await db.update(commandHistory).set(updates).where(eq(commandHistory.id, id));
}

// ============ DEVICE CONFIG ============
export async function getDeviceConfig(deviceId: number): Promise<DeviceConfig | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(deviceConfigs)
    .where(eq(deviceConfigs.deviceId, deviceId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function updateDeviceConfig(
  deviceId: number,
  updates: Partial<InsertDeviceConfig>
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(deviceConfigs)
    .set(updates)
    .where(eq(deviceConfigs.deviceId, deviceId));
}
