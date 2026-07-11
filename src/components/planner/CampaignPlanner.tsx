'use client'
import { useState } from 'react'
import { PlannerCalendarTab } from './PlannerCalendarTab'
import { PlannerTableTab } from './PlannerTableTab'

interface Brief {
  id: string
  topic: string
  scheduled_date: string
  channel: string
  status: string
}

interface Props {
  initialBriefs: Brief[]
}

export function CampaignPlanner({ initialBriefs }: Props) {
  const [tab, setTab] = useState<'calendar' | 'table'>('calendar')

  return (
    <div className="space-y-6">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setTab('calendar')}
          className={`px-4 py-2 text-sm font-semibold border-b-2 ${
            tab === 'calendar' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Calendar View
        </button>
        <button
          onClick={() => setTab('table')}
          className={`px-4 py-2 text-sm font-semibold border-b-2 ${
            tab === 'table' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Table View
        </button>
      </div>

      {tab === 'calendar' ? (
        <PlannerCalendarTab briefs={initialBriefs} />
      ) : (
        <PlannerTableTab briefs={initialBriefs} />
      )}
    </div>
  )
}
