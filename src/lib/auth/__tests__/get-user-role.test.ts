import { describe, it, expect, vi } from 'vitest'
import { getUserBrandRole, isMbTeam } from '../get-user-role'

// Mock the server client creator
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue({
    rpc: vi.fn().mockImplementation((fnName, args) => {
      if (fnName === 'user_brand_role') {
        if (args.p_brand_id === 'brand-123') {
          return { data: 'mb_pm', error: null }
        }
        return { data: null, error: null }
      }
      if (fnName === 'is_mb_team') {
        return { data: true, error: null }
      }
      return { data: null, error: new Error('Unknown function') }
    }),
  }),
}))

describe('getUserBrandRole', () => {
  it('returns the role when membership exists', async () => {
    const role = await getUserBrandRole('brand-123')
    expect(role).toBe('mb_pm')
  })

  it('returns null when membership does not exist', async () => {
    const role = await getUserBrandRole('non-existent')
    expect(role).toBeNull()
  })
})

describe('isMbTeam', () => {
  it('returns true when user belongs to agency team', async () => {
    const isTeam = await isMbTeam()
    expect(isTeam).toBe(true)
  })
})
