export interface ApiKeyRecord {
  id: string
  user_id: string
  name: string
  created_at: string
  last_used_at: string | null
  enabled: boolean
}

export interface CreateApiKeyInput {
  name: string
}

export interface CreateApiKeyResponse {
  id: string
  key: string
  name: string
  created_at: string
}
