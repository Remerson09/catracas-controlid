CREATE TABLE `accessEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`deviceId` int NOT NULL,
	`eventType` enum('entrada','saida','negado','erro') NOT NULL,
	`status` enum('sucesso','falha','pendente') NOT NULL DEFAULT 'sucesso',
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	`details` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `accessEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `accessPermissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`deviceId` int NOT NULL,
	`accessType` enum('entrada','saida','bidirecional') NOT NULL DEFAULT 'bidirecional',
	`startDate` timestamp,
	`endDate` timestamp,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `accessPermissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `accessUsers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320),
	`phone` varchar(20),
	`documentId` varchar(64),
	`photoUrl` text,
	`facialDataId` varchar(255),
	`status` enum('ativo','inativo','bloqueado') NOT NULL DEFAULT 'ativo',
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `accessUsers_id` PRIMARY KEY(`id`),
	CONSTRAINT `accessUsers_documentId_unique` UNIQUE(`documentId`)
);
--> statement-breakpoint
CREATE TABLE `commandHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`deviceId` int NOT NULL,
	`commandType` varchar(64) NOT NULL,
	`commandHex` text,
	`requestData` text,
	`responseData` text,
	`status` enum('enviado','sucesso','erro','timeout') NOT NULL DEFAULT 'enviado',
	`errorMessage` text,
	`executedBy` int,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `commandHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `deviceConfigs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`deviceId` int NOT NULL,
	`relayDuration` int DEFAULT 1000,
	`unlockDirection` varchar(64) DEFAULT 'clockwise',
	`communicationTimeout` int DEFAULT 5000,
	`retryAttempts` int DEFAULT 3,
	`healthCheckInterval` int DEFAULT 30000,
	`customConfig` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `deviceConfigs_id` PRIMARY KEY(`id`),
	CONSTRAINT `deviceConfigs_deviceId_unique` UNIQUE(`deviceId`)
);
--> statement-breakpoint
CREATE TABLE `devices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`location` varchar(255),
	`ipAddress` varchar(45) NOT NULL,
	`port` int NOT NULL DEFAULT 80,
	`deviceType` varchar(64) NOT NULL DEFAULT 'catraca',
	`status` enum('online','offline','error') NOT NULL DEFAULT 'offline',
	`lastCommunication` timestamp,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `devices_id` PRIMARY KEY(`id`),
	CONSTRAINT `devices_ipAddress_unique` UNIQUE(`ipAddress`)
);
