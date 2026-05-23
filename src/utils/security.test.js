import { describe, it, expect } from 'vitest';
import {
  sha256,
  hmacSha256,
  obfuscate,
  deobfuscate,
  secureSave,
  readSecureSave
} from './security';

describe('Módulo de Segurança e Anti-Cheat', () => {
  describe('SHA-256 e HMAC-SHA256', () => {
    it('deve gerar hashes SHA-256 corretos', () => {
      // Testes com valores de referência conhecidos
      expect(sha256('')).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
      expect(sha256('hello')).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
      expect(sha256('pokecraft')).toBe('9dea46f3bd8ad91803c583641d175772ada36827b2ddb9222865ebaeba575929');
    });

    it('deve gerar assinaturas HMAC-SHA256 corretas', () => {
      const message = '{"score":1000}';
      const key = 'secret_key';
      const signature = hmacSha256(message, key);
      expect(signature).toHaveLength(64);
      // Garantir determinismo
      expect(hmacSha256(message, key)).toBe(signature);
      // Alterar mensagem altera assinatura
      expect(hmacSha256(message + '1', key)).not.toBe(signature);
    });
  });

  describe('Cifra de Ofuscação XOR', () => {
    it('deve codificar e decodificar preservando o texto original (simetria)', () => {
      const originalText = 'SaveGameData_with_weird_chars_12345!@#$';
      const obfuscated = obfuscate(originalText);
      expect(obfuscated).not.toBe(originalText);
      
      const deobfuscated = deobfuscate(obfuscated);
      expect(deobfuscated).toBe(originalText);
    });
  });

  describe('Salvar e Carregar Envelopes de Save com Segurança', () => {
    const envelope = {
      uid: 'user123',
      email: 'user@test.com',
      savedAt: Date.now(),
      gameState: { trainer: { name: 'Red', level: 50 }, badges: ['kanto_1'] }
    };

    it('deve gerar um save seguro válido e conseguir carregá-lo com sucesso', () => {
      const secureStr = secureSave(envelope);
      expect(secureStr.startsWith('pksv1:')).toBe(true);

      const result = readSecureSave(secureStr);
      expect(result.isValid).toBe(true);
      expect(result.envelope.uid).toBe('user123');
      expect(result.envelope.gameState.trainer.name).toBe('Red');
    });

    it('deve detectar adulteração de dados e sinalizar isValid: false', () => {
      const secureStr = secureSave(envelope);
      
      // Decodifica a parte ofuscada manualmente para adulterar
      const obfuscatedPart = secureStr.substring(6);
      const secureStrDecoded = deobfuscate(obfuscatedPart);
      const signedEnvelope = JSON.parse(secureStrDecoded);
      
      // Adulteração: modifica o estado interno sem alterar a assinatura
      const modifiedPayload = JSON.parse(signedEnvelope.payload);
      modifiedPayload.gameState.trainer.level = 999; // cheats!
      signedEnvelope.payload = JSON.stringify(modifiedPayload);
      
      // Re-ofusca o envelope adulterado
      const tamperedObfuscated = obfuscate(JSON.stringify(signedEnvelope));
      const tamperedSecureStr = 'pksv1:' + tamperedObfuscated;
      
      // Tenta carregar o save adulterado
      const result = readSecureSave(tamperedSecureStr);
      expect(result.isValid).toBe(false); // A assinatura não bate com o payload modificado!
      expect(result.envelope.gameState.trainer.level).toBe(999); // O save carrega o valor adulterado, mas é marcado como inválido!
    });
  });
});
