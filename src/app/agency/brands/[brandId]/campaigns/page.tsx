import { CampaignPlanner } from '@/components/planner/CampaignPlanner'

export default function CampaignsPage() {
  const todayStr = new Date().toISOString().split('T')[0]

  const mockBriefs = [
    { id: '1', topic: 'Summer Launch Gold Gyms', scheduled_date: todayStr, channel: 'instagram_feed', status: 'brief_draft' },
    { id: '2', topic: 'Weekend Challenge Announcement', scheduled_date: todayStr, channel: 'facebook_post', status: 'brief_reviewed' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Campaign Planner</h1>
        <p className="text-sm text-gray-500">Manage campaign content calendars and execution schedules</p>
      </div>
      <CampaignPlanner initialBriefs={mockBriefs} />
    </div>
  )
}
