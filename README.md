# Портал командировок и расходов

Учебный full-stack проект по курсу «Fullstack» (1 семестр). Приложение помогает сотрудникам оформлять командировки, запрашивать авансы и сдавать отчёты о расходах, а руководителям и бухгалтерии контролировать бюджеты. Отдельный сценарий: загрузка фото чека и предзаполнение формы расхода суммой и датой.

Статус: выполнены **лабораторная №1** (интерфейс и каркас frontend, тег `lab-1`) и **лабораторная №2** (backend, API и БД, тег `lab-2`). Frontend пока работает на демонстрационных данных и с API не связан. Это тема лабораторной №5.

Структура репозитория: `frontend/` (React), `backend/` (FastAPI), `docs/screenshots/`, `docker-compose.yml` (PostgreSQL).

## Пользовательские сценарии

1. Сотрудник оформляет заявку на командировку (направление, цель, даты, плановая сумма, бюджет).
2. Сотрудник запрашивает аванс под командировку и видит его статус.
3. Сотрудник добавляет расход по командировке. Он загружает фото чека, и сумма с датой подставляются автоматически, после чего их нужно проверить.
4. Руководитель просматривает заявки и фильтрует их по статусу.
5. Руководитель или бухгалтер контролирует расход бюджетов отделов.

## Экраны

| Экран | Маршрут | Назначение |
|---|---|---|
| Обзор | `/` | Сводные показатели, ближайшие поездки, использование бюджетов |
| Командировки | `/trips` | Список заявок с фильтром по статусу |
| Карточка командировки | `/trips/:id` | Сводка, авансы и расходы по поездке |
| Новая заявка | `/trips/new` | Форма заявки |
| Расходы | `/expenses` | Список расходов с признаком наличия чека |
| Новый расход | `/expenses/new` | Форма с загрузкой чека и предзаполнением |
| Авансы | `/advances` | Запросы и выдача авансов |
| Бюджеты | `/budgets` | Лимит, резерв и остаток по отделам |
| 404 | `*` | Несуществующая страница |

Скриншоты для desktop (1366 px) и mobile (390 px) лежат в [docs/screenshots](docs/screenshots). Например: ![Обзор](docs/screenshots/dashboard-desktop.png)

## Стек

- Frontend: React 19, TypeScript, Vite, React Router, **MUI (Material UI)**.
- Backend: Python, FastAPI, PostgreSQL, SQLAlchemy (лабораторная №2).

**Почему MUI.** В нём есть готовые таблицы, формы, навигационный drawer и система тем, поэтому оформление получается единым без ручной вёрстки. Адаптивность обеспечивают breakpoints и Grid. Библиотека хорошо типизирована под TypeScript и популярна, так что документации много.

## Запуск frontend

Нужен Node.js 20+.

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

Проверки: `npm run build` (включает `tsc -b`), `npm run lint`.

Скриншоты (при запущенном `npm run dev` и установленном Chrome):

```bash
BASE_URL=http://127.0.0.1:5173 node scripts/screenshots.mjs
# при нестандартном пути к браузеру: CHROME_PATH=<путь к chrome>
```

## Структура frontend

```
frontend/src
├── components/   Layout (шапка + адаптивное меню), PageHeader, StatusChip
├── pages/        по одному файлу на экран
├── data/         демонстрационные данные (mock.ts) и подписи статусов (labels.ts)
├── types/        TypeScript-интерфейсы сущностей
└── theme/        тема MUI
```

## Ограничения лабораторной №1

- Данные демонстрационные (`src/data/mock.ts`), с backend интеграции пока нет.
- Формы только сверстаны: сохранения и валидации нет.
- Распознавание чека **имитируется**: после выбора файла подставляются фиксированные значения. Реального OCR нет.

---

# Backend (лабораторная №2)

Стек: Python, FastAPI, SQLAlchemy 2, PostgreSQL 16 (драйвер psycopg 3), Pydantic v2, pydantic-settings, pytest.

## Структура backend

```
backend/
├── app/
│   ├── main.py        создание приложения, CORS, обработчики ошибок, создание таблиц при старте
│   ├── config.py      настройки из переменных окружения / .env (pydantic-settings)
│   ├── db.py          engine, сессии, Base, зависимость get_db
│   ├── models.py      модели SQLAlchemy
│   ├── schemas.py     Pydantic-схемы запросов и ответов
│   ├── crud.py        операции с данными и бизнес-правила
│   └── routers/       маршруты API: users, budgets, trips, advances, expenses
├── tests/             pytest + TestClient (на реальном PostgreSQL)
├── .env.example       пример настроек без секретов
└── requirements.txt
```

## Модель данных

```mermaid
erDiagram
    USERS ||--o{ TRIPS : "оформляет"
    BUDGETS ||--o{ TRIPS : "финансирует"
    TRIPS ||--o{ ADVANCES : "авансы"
    TRIPS ||--o{ EXPENSES : "расходы"

    USERS { int id PK
            string full_name
            string email UK
            string department }
    BUDGETS { int id PK
              string department
              string period
              numeric limit_amount }
    TRIPS { int id PK
            string destination
            text purpose
            date start_date
            date end_date
            string status
            numeric planned_amount
            int user_id FK
            int budget_id FK
            timestamptz created_at }
    ADVANCES { int id PK
               int trip_id FK
               numeric amount
               string status
               date requested_at }
    EXPENSES { int id PK
               int trip_id FK
               string category
               string description
               numeric amount
               date expense_date
               string receipt_url }
```

Правила целостности:

- Удаление командировки каскадно удаляет её авансы и расходы (`ON DELETE CASCADE`).
- Пользователя и бюджет, у которых есть командировки, удалить нельзя: `ON DELETE RESTRICT` в БД и ответ 409 в API.
- `users.email` уникален (409 при дубле). Email сохраняется в нижнем регистре.
- CHECK-ограничения в БД: суммы положительные, `end_date >= start_date`.
- Статусы (`trips.status`, `advances.status`, `expenses.category`) хранятся строкой с CHECK-ограничением.

Бизнес-правила (`crud.py`):

- Сумма авансов по командировке не должна превышать её плановую сумму (400). Плановую сумму нельзя снизить ниже уже запрошенных авансов (400).
- Бюджет учитывает как резерв плановые суммы поездок, кроме черновиков и отклонённых: `GET /budgets/{id}/summary`.

## API

Интерактивная документация: <http://localhost:8000/docs>. Для каждой сущности есть `GET /<res>` (список с `skip` и `limit`), `POST`, `GET /<res>/{id}`, `PATCH /<res>/{id}` (частичное изменение), `DELETE /<res>/{id}`.

| Ресурс | Особенности |
|---|---|
| `/users` | уникальный email |
| `/budgets` | `/budgets/{id}/summary` возвращает резерв и остаток |
| `/trips` | фильтры `status`, `user_id`, `budget_id`; `GET /trips/{id}` включает авансы и расходы |
| `/advances` | фильтр `trip_id` |
| `/expenses` | фильтр `trip_id` |
| `/health` | проверка работоспособности |

Коды ответов: 201 (создано), 204 (удалено), **400** (нарушено бизнес-правило), **404** (запись не найдена, в том числе несуществующий `user_id`, `budget_id` или `trip_id` при создании), **409** (дубль email, удаление связанной записи), **422** (некорректные данные). Тело ошибки: `{"detail": "понятное сообщение"}`, для 422 это список ошибок полей.

## Настройка и запуск backend

Нужны Python 3.11+ и Docker (либо свой PostgreSQL).

```bash
# 1. База данных (PostgreSQL в Docker, порт 5433 на хосте)
cp .env.example .env                 # задайте POSTGRES_PASSWORD
docker compose up -d

# 2. Backend
cd backend
python -m venv venv
venv/Scripts/activate                # Linux/macOS: source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env                 # DATABASE_URL: тот же пароль и порт, что в корневом .env
uvicorn app.main:app --reload        # http://localhost:8000/docs
```

Порт 5433 выбран, чтобы не конфликтовать с локально установленным PostgreSQL на 5432. Изменить его можно через `POSTGRES_PORT` (и в `DATABASE_URL`).

**Создание таблиц.** Миграций (Alembic) нет: при старте приложение вызывает `Base.metadata.create_all()`, который создаёт недостающие таблицы и не изменяет существующие. Чтобы пересоздать схему после изменения моделей, выполните `docker compose down -v` и поднимите БД заново. В проекте с реальными данными нужно перейти на Alembic.

**Переменные окружения** (`backend/.env`):

| Переменная | Назначение |
|---|---|
| `DATABASE_URL` | строка подключения SQLAlchemy, например `postgresql+psycopg://user:pass@localhost:5433/travel_expenses` |
| `CORS_ORIGINS` | разрешённые origin для frontend, через запятую (необязательно) |

Файлы `.env` в git не попадают, в репозитории лежат только `.env.example`.

## Тесты

```bash
cd backend
pytest
```

Тесты используют настоящий PostgreSQL. Они автоматически создают отдельную БД `<имя_из_DATABASE_URL>_test` и пересоздают в ней таблицы перед каждым тестом. Рабочая БД не затрагивается. Проверяются CRUD всех сущностей, валидация (422), 404, 409, бизнес-правила (400), каскадное удаление и ограничения внешних ключей.
