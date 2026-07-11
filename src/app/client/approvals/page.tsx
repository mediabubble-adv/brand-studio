import { BriefApprovalPanel } from '@/components/planner/BriefApprovalPanel'

export default function ClientApprovalsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
        <p className="text-sm text-gray-500">Sign off designs and campaign drafts before scheduling</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 flex-1 space-y-4">
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center font-bold text-gray-400">
            [Visual Asset Frame]
          </div>
          <h3 className="text-lg font-bold text-gray-900">Gold's Gym Eid Mubarak Card</h3>
          <p className="text-sm text-gray-600">
            Arabic: متجهز للعيد؟ 💪 جيم جولدز فاتح طول الشهر...
          </p>
        </div>

        <BriefApprovalPanel briefId="sample-brief-1" currentStatus="brief_draft" />
      </div>
    </div>
  )
}
