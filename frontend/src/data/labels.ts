import type { AdvanceStatus, ExpenseCategory, TripStatus } from '../types'

type Color = 'default' | 'warning' | 'success' | 'error' | 'info'

export const tripStatusLabel: Record<TripStatus, { text: string; color: Color }> = {
  draft: { text: 'Черновик', color: 'default' },
  pending: { text: 'На согласовании', color: 'warning' },
  approved: { text: 'Согласована', color: 'success' },
  rejected: { text: 'Отклонена', color: 'error' },
  completed: { text: 'Завершена', color: 'info' },
}

export const advanceStatusLabel: Record<AdvanceStatus, { text: string; color: Color }> = {
  requested: { text: 'Запрошен', color: 'warning' },
  issued: { text: 'Выдан', color: 'success' },
  settled: { text: 'Закрыт отчётом', color: 'info' },
}

export const categoryLabel: Record<ExpenseCategory, string> = {
  transport: 'Транспорт',
  lodging: 'Проживание',
  meals: 'Питание',
  other: 'Прочее',
}

export const formatMoney = (n: number) =>
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(n)

export const formatDate = (iso: string) => new Date(iso).toLocaleDateString('ru-RU')
