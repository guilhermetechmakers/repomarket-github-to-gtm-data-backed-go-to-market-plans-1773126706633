export type PlanId = 'free' | 'solo' | 'team' | 'agency'
export type PlanStatus = 'active' | 'canceled' | 'past_due'

export interface Plan {
  id: string
  user_id: string
  plan_id: PlanId
  status: PlanStatus
  started_at: string
  expires_at: string | null
  auto_renew: boolean
}
