import type { Advance, Budget, Expense, Trip } from '../types'

export const budgets: Budget[] = [
  { id: 1, department: 'Отдел продаж', period: '2026, Q4', limit: 600000 },
  { id: 2, department: 'Разработка', period: '2026, Q4', limit: 350000 },
  { id: 3, department: 'Маркетинг', period: '2026, Q4', limit: 200000 },
]

export const trips: Trip[] = [
  { id: 1, destination: 'Санкт-Петербург', purpose: 'Встреча с клиентом', startDate: '2026-10-12', endDate: '2026-10-15', status: 'approved', employee: 'Иванов И.', budgetId: 1, plannedAmount: 85000 },
  { id: 2, destination: 'Казань', purpose: 'Конференция разработчиков', startDate: '2026-11-03', endDate: '2026-11-06', status: 'pending', employee: 'Петрова А.', budgetId: 2, plannedAmount: 72000 },
  { id: 3, destination: 'Новосибирск', purpose: 'Открытие филиала', startDate: '2026-09-01', endDate: '2026-09-05', status: 'completed', employee: 'Сидоров П.', budgetId: 1, plannedAmount: 140000 },
  { id: 4, destination: 'Екатеринбург', purpose: 'Выставка', startDate: '2026-11-20', endDate: '2026-11-22', status: 'draft', employee: 'Козлова Е.', budgetId: 3, plannedAmount: 64000 },
  { id: 5, destination: 'Сочи', purpose: 'Корпоративное обучение', startDate: '2026-10-25', endDate: '2026-10-28', status: 'rejected', employee: 'Иванов И.', budgetId: 1, plannedAmount: 95000 },
]

export const advances: Advance[] = [
  { id: 1, tripId: 1, amount: 50000, status: 'issued', requestedAt: '2026-10-05' },
  { id: 2, tripId: 2, amount: 40000, status: 'requested', requestedAt: '2026-10-02' },
  { id: 3, tripId: 3, amount: 100000, status: 'settled', requestedAt: '2026-08-25' },
]

export const expenses: Expense[] = [
  { id: 1, tripId: 3, category: 'transport', description: 'Авиабилеты Москва — Новосибирск', amount: 48200, date: '2026-09-01', hasReceipt: true },
  { id: 2, tripId: 3, category: 'lodging', description: 'Гостиница, 4 ночи', amount: 36000, date: '2026-09-05', hasReceipt: true },
  { id: 3, tripId: 3, category: 'meals', description: 'Питание', amount: 11400, date: '2026-09-03', hasReceipt: false },
  { id: 4, tripId: 1, category: 'transport', description: 'Сапсан, туда-обратно', amount: 9800, date: '2026-10-12', hasReceipt: true },
  { id: 5, tripId: 1, category: 'lodging', description: 'Бронь отеля', amount: 24000, date: '2026-10-12', hasReceipt: true },
]
