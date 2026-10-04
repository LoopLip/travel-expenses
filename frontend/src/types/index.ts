export type TripStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'completed'
export type AdvanceStatus = 'requested' | 'issued' | 'settled'
export type ExpenseCategory = 'transport' | 'lodging' | 'meals' | 'other'

export interface Trip {
  id: number
  destination: string
  purpose: string
  startDate: string // ISO yyyy-mm-dd
  endDate: string
  status: TripStatus
  employee: string
  budgetId: number
  plannedAmount: number
}

export interface Advance {
  id: number
  tripId: number
  amount: number
  status: AdvanceStatus
  requestedAt: string
}

export interface Expense {
  id: number
  tripId: number
  category: ExpenseCategory
  description: string
  amount: number
  date: string
  hasReceipt: boolean
}

export interface Budget {
  id: number
  department: string
  period: string
  limit: number
}
