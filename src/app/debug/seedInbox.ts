import { eq, sql } from 'drizzle-orm';

import type { DrizzleDB } from '@app/di/types';
import { extractTags } from '@domain/inbox/use-cases/extractTags';
import { inputTags, tags, userInputs } from '@infra/drizzle/schema';

import type { SeedOptions } from './seedInbox.types';

const SAMPLE_TEXTS = [
  'Comprar leite, pão e ovos #compras #mercado',
  'Lembrar de pagar conta de luz #urgente #casa',
  'Reunião com cliente às 14h #trabalho #importante',
  'Buscar receita médica #farmacia #pessoal',
  'Ideia: organizar churrasco no fim de semana #ideia #familia',
  'Levar carro para revisão #lembrete #pessoal',
  'Comprar presente de aniversário #compras #familia',
  'Fazer lista de supermercado #lista #compras #mercado',
  'Ligar para o dentista #pessoal #urgente',
  'Preparar apresentação para segunda-feira #trabalho #importante',
  'Comprar ração para o cachorro #compras #casa',
  'Estudar novo framework #trabalho #ideia',
  'Organizar armário do quarto #casa #tarefa',
  'Enviar documentos para contador #trabalho #urgente',
  'Comprar frutas e verduras na feira #feira #compras',
  'Lembrar de renovar CNH #lembrete #urgente',
  'Marcar almoço com amigos #pessoal #ideia',
  'Trocar lâmpada da sala #casa #tarefa',
  'Pesquisar receitas novas #ideia #casa',
  'Leite, pão, café, manteiga',
  'Ligar para a mãe',
  'Arrumar gaveta bagunçada',
  'Ver aquele filme recomendado',
  'Comprar presentes de Natal',
  'Lavar carro',
  'Consertar torneira da cozinha',
  'Organizar fotos do celular',
  'Limpar filtro do ar condicionado',
  'Trocar senha do email',
  'Assistir aula sobre TypeScript',
];

function selectSampleText(excludeTags: boolean): string {
  if (excludeTags) {
    const untagged = SAMPLE_TEXTS.filter((t) => !t.includes('#'));
    return untagged[Math.floor(Math.random() * untagged.length)];
  }
  return SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function generateCreatedAt(dayOffset: number): Date {
  const now = new Date();
  const targetDate = new Date(now);
  targetDate.setDate(now.getDate() - dayOffset);
  targetDate.setHours(0, 0, 0, 0);

  const rand = Math.random();
  let hour: number;

  if (rand < 0.3) {
    hour = 6 + Math.floor(Math.random() * 6);
  } else if (rand < 0.7) {
    hour = 12 + Math.floor(Math.random() * 6);
  } else if (rand < 0.9) {
    hour = 18 + Math.floor(Math.random() * 6);
  } else {
    hour = Math.floor(Math.random() * 6);
  }

  const minute = Math.floor(Math.random() * 60);
  const second = Math.floor(Math.random() * 60);

  targetDate.setHours(hour, minute, second);
  return targetDate;
}

async function insertUserInput(db: DrizzleDB, text: string, createdAt: Date): Promise<void> {
  const inputId = generateId();
  const { tagNames } = extractTags({ text });

  await db.transaction(async (tx) => {
    await tx.insert(userInputs).values({
      id: inputId,
      text,
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString(),
    });

    for (const tagName of tagNames) {
      const existingTag = await tx.query.tags.findFirst({
        where: eq(tags.name, tagName),
      });

      let tagId: string;

      if (existingTag) {
        tagId = existingTag.id;
        await tx
          .update(tags)
          .set({ usageCount: existingTag.usageCount + 1 })
          .where(eq(tags.id, existingTag.id));
      } else {
        tagId = generateId();
        await tx.insert(tags).values({
          id: tagId,
          name: tagName,
          usageCount: 1,
          createdAt: createdAt.toISOString(),
        });
      }

      await tx.insert(inputTags).values({ inputId, tagId });
    }
  });
}

async function clearData(db: DrizzleDB): Promise<void> {
  await db.delete(userInputs);
  await db.delete(tags);
}

export async function seedInbox(
  db: DrizzleDB,
  options: SeedOptions,
  onProgress?: (message: string) => void,
): Promise<{ totalRecords: number; uniqueTags: number; timeMs: number }> {
  const startTime = Date.now();
  const days = options.days;
  const excludeTags = !options.tags;

  if (options.clear) {
    onProgress?.('Limpando dados existentes...');
    await clearData(db);
  }

  onProgress?.('Gerando registros...');

  for (let dayOffset = days - 1; dayOffset >= 0; dayOffset--) {
    const count = options.count
      ? options.count
      : Math.floor(Math.random() * (options.max - options.min + 1)) + options.min;

    for (let i = 0; i < count; i++) {
      const text = selectSampleText(excludeTags);
      const createdAt = generateCreatedAt(dayOffset);
      await insertUserInput(db, text, createdAt);
    }

    const date = new Date();
    date.setDate(date.getDate() - dayOffset);
    onProgress?.(`Dia ${days - dayOffset}/${days}: ${count} registros`);
  }

  const totalRecords = await db
    .select({ count: sql<number>`cast(count(*) as integer)` })
    .from(userInputs)
    .then((r) => r[0]?.count ?? 0);

  const uniqueTags = await db
    .select({ count: sql<number>`cast(count(*) as integer)` })
    .from(tags)
    .then((r) => r[0]?.count ?? 0);

  const timeMs = Date.now() - startTime;

  return { totalRecords, uniqueTags, timeMs };
}
