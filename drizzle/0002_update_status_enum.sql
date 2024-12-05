-- Создаем временные таблицы
CREATE TABLE task_categories_temp AS SELECT * FROM task_categories;
CREATE TABLE tasks_temp AS SELECT * FROM tasks;

-- Удаляем существующие таблицы
DROP TABLE task_categories;
DROP TABLE tasks CASCADE;

-- Удаляем существующий enum тип с CASCADE
DROP TYPE status CASCADE;

-- Создаем новый enum тип с обновленными значениями
CREATE TYPE status AS ENUM ('backlog', 'todo', 'in_progress', 'done', 'archived');

-- Воссоздаем таблицу tasks с новым enum типом
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description VARCHAR(255) DEFAULT '',
  user_id INTEGER REFERENCES users(id),
  status status DEFAULT 'backlog',
  priority priority DEFAULT 'low',
  start_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  finish_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Копируем данные обратно в tasks с явным приведением типов
INSERT INTO tasks (
  id, title, description, user_id, 
  status,
  priority, start_at, finish_at, created_at, updated_at
)
SELECT 
  t.id, t.title, t.description, t.user_id,
  'backlog'::status,  -- устанавливаем значение по умолчанию для всех записей
  t.priority, t.start_at, t.finish_at, t.created_at, t.updated_at
FROM tasks_temp t;

-- Воссоздаем таблицу task_categories
CREATE TABLE task_categories (
  task_id INTEGER REFERENCES tasks(id),
  category_id INTEGER REFERENCES categories(id)
);

-- Восстанавливаем данные task_categories, только для существующих task_id
INSERT INTO task_categories 
SELECT tc.task_id, tc.category_id 
FROM task_categories_temp tc
WHERE EXISTS (SELECT 1 FROM tasks t WHERE t.id = tc.task_id);

-- Удаляем временные таблицы
DROP TABLE tasks_temp;
DROP TABLE task_categories_temp;
