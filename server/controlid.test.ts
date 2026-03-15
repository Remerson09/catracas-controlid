import { describe, it, expect } from "vitest";
import { isValidHexCommand, generateUnlockCommand } from "./controlid";

describe("Control iD Communication Module", () => {
  describe("isValidHexCommand", () => {
    it("deve aceitar comando hexadecimal válido", () => {
      expect(isValidHexCommand("A1B2C3D4")).toBe(true);
      expect(isValidHexCommand("FF00FF00")).toBe(true);
      expect(isValidHexCommand("00")).toBe(true);
    });

    it("deve rejeitar comando com caracteres inválidos", () => {
      expect(isValidHexCommand("GGHHIIJJ")).toBe(false);
      expect(isValidHexCommand("A1B2C3D")).toBe(false); // Número ímpar de caracteres
      expect(isValidHexCommand("")).toBe(false); // Vazio
    });

    it("deve aceitar comando em minúsculas", () => {
      expect(isValidHexCommand("a1b2c3d4")).toBe(true);
      expect(isValidHexCommand("ff00ff00")).toBe(true);
    });

    it("deve aceitar comando misto maiúsculas e minúsculas", () => {
      expect(isValidHexCommand("A1b2C3d4")).toBe(true);
    });
  });

  describe("generateUnlockCommand", () => {
    it("deve gerar comando com duração em hex", () => {
      const command = generateUnlockCommand(1000);
      expect(command).toMatch(/^A1B2[0-9A-Fa-f]{4}$/);
      expect(command.length).toBe(8);
    });

    it("deve converter duração corretamente para hex", () => {
      const command1000 = generateUnlockCommand(1000);
      expect(command1000.toUpperCase()).toBe("A1B203E8"); // 1000 em hex é 03E8

      const command2000 = generateUnlockCommand(2000);
      expect(command2000.toUpperCase()).toBe("A1B207D0"); // 2000 em hex é 07D0
    });

    it("deve gerar comando válido", () => {
      const command = generateUnlockCommand(5000);
      expect(isValidHexCommand(command)).toBe(true);
    });
  });
});
