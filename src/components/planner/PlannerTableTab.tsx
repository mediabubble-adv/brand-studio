'use client'

interface Brief {
  id: string
  topic: string
  scheduled_date: string
  channel: string
  status: string
}

interface Props {
  briefs: Brief[]
}

export function PlannerTableTab({ briefs }: Props) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase">
          <tr>
            <th className="px-6 py-3">Scheduled Date</th>
            <th className="px-6 py-3">Channel</th>
            <th className="px-6 py-3">Topic / Theme</th>
            <th className="px-6 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
          {briefs.map(b => (
            <tr key={b.id}>
              <td className="px-6 py-4 font-mono">{b.scheduled_date}</td>
              <td className="px-6 py-4 truncate max-w-xs">{b.channel.replace('_', ' ')}</td>
              <td className="px-6 py-4 font-semibold">{b.topic}</td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800">
                  {b.status.replace('_', ' ')}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
