import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rules = fs.readFileSync(path.resolve(__dirname, '../../firestore.rules'), 'utf8');

describe('firestore.rules - multi-avatar e amigos', () => {
  it('permite documentos de slot 2 e 3 para saves e perfis publicos', () => {
    expect(rules).toContain("docId == request.auth.uid + '_s2'");
    expect(rules).toContain("docId == request.auth.uid + '_s3'");
    expect(rules).toContain('match /saves/{uid}');
    expect(rules).toContain('match /users/{uid}');
  });

  it('permite aceitar amizade criando o espelho enquanto a request existir', () => {
    expect(rules).toContain('exists(/databases/$(database)/documents/friends/$(friendUid)/requests/$(uid))');
    expect(rules).toContain('request.auth.uid == friendUid');
  });

  it('expoe regras para avatarMeta e nicknames usados pelo multi-avatar', () => {
    expect(rules).toContain('match /avatarMeta/{uid}');
    expect(rules).toContain('match /nicknames/{nick}');
  });
});
