import net from "net";

/**
 * Módulo de comunicação com dispositivos Control iD
 * Implementa protocolo TCP/IP para envio de comandos hexadecimais
 */

export interface DeviceConnectionConfig {
  host: string;
  port: number;
  timeout?: number;
  retries?: number;
}

export interface CommandResponse {
  success: boolean;
  data?: Buffer;
  error?: string;
  responseTime?: number;
}

/**
 * Envia um comando hexadecimal para um dispositivo Control iD
 * @param config Configuração de conexão do dispositivo
 * @param hexCommand Comando em formato hexadecimal (ex: "A1B2C3D4")
 * @returns Resposta do dispositivo
 */
export async function sendCommandToDevice(
  config: DeviceConnectionConfig,
  hexCommand: string
): Promise<CommandResponse> {
  const timeout = config.timeout || 5000;
  const retries = config.retries || 3;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await executeCommand(config, hexCommand, timeout);
      return response;
    } catch (error) {
      lastError = error as Error;
      if (attempt < retries - 1) {
        // Aguarda um pouco antes de tentar novamente
        await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
      }
    }
  }

  return {
    success: false,
    error: lastError?.message || "Falha ao conectar ao dispositivo após múltiplas tentativas",
  };
}

/**
 * Executa um comando único com timeout
 */
async function executeCommand(
  config: DeviceConnectionConfig,
  hexCommand: string,
  timeout: number
): Promise<CommandResponse> {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection(
      {
        host: config.host,
        port: config.port,
      },
      () => {
        // Conexão estabelecida
        const startTime = Date.now();

        // Converte comando hex para Buffer
        const commandBuffer = Buffer.from(hexCommand, "hex");

        // Envia o comando
        socket.write(commandBuffer);

        // Aguarda resposta
        socket.once("data", (data) => {
          const responseTime = Date.now() - startTime;
          socket.destroy();
          resolve({
            success: true,
            data,
            responseTime,
          });
        });
      }
    );

    // Tratamento de erros
    socket.on("error", (error) => {
      socket.destroy();
      reject(error);
    });

    // Timeout
    socket.setTimeout(timeout, () => {
      socket.destroy();
      reject(new Error(`Timeout na comunicação com ${config.host}:${config.port}`));
    });
  });
}

/**
 * Testa conectividade com um dispositivo
 */
export async function testDeviceConnectivity(
  config: DeviceConnectionConfig
): Promise<{ success: boolean; message: string; responseTime?: number }> {
  const startTime = Date.now();

  return new Promise((resolve) => {
    const socket = net.createConnection(
      {
        host: config.host,
        port: config.port,
      },
      () => {
        const responseTime = Date.now() - startTime;
        socket.destroy();
        resolve({
          success: true,
          message: `Conectado com sucesso em ${responseTime}ms`,
          responseTime,
        });
      }
    );

    socket.on("error", (error) => {
      socket.destroy();
      resolve({
        success: false,
        message: `Erro ao conectar: ${error.message}`,
      });
    });

    socket.setTimeout(config.timeout || 5000, () => {
      socket.destroy();
      resolve({
        success: false,
        message: "Timeout na conexão",
      });
    });
  });
}

/**
 * Comandos padrão para catracas Control iD
 */
export const CONTROL_ID_COMMANDS = {
  // Libera acesso (abre a catraca)
  UNLOCK: "A1B2C3D4", // Exemplo - verificar documentação específica do modelo
  // Bloqueia acesso (fecha a catraca)
  LOCK: "D4C3B2A1", // Exemplo
  // Solicita status do dispositivo
  STATUS: "00000000", // Exemplo
  // Reset do dispositivo
  RESET: "FFFFFFFF", // Exemplo
};

/**
 * Gera comando de liberação com duração específica
 * @param durationMs Duração em milissegundos
 */
export function generateUnlockCommand(durationMs: number): string {
  // Converte duração para hex (exemplo simplificado)
  const durationHex = durationMs.toString(16).padStart(4, "0");
  return `A1B2${durationHex}`;
}

/**
 * Valida formato de comando hexadecimal
 */
export function isValidHexCommand(command: string): boolean {
  return /^[0-9A-Fa-f]*$/.test(command) && command.length > 0 && command.length % 2 === 0;
}
