-- 0002_seed_notes_list.sql
-- Seed the prefabricated Notes list

INSERT INTO lists (id, name, description, list_type, is_prefabricated, created_at, updated_at)
VALUES (
  'prefab-notes-list',
  'Notas',
  'Lista de notas pré-fabricada',
  'notes',
  1,
  strftime('%s', 'now') * 1000,
  strftime('%s', 'now') * 1000
);
