'use client'
import { useState } from 'react'

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

export function PlannerCalendarTab({ briefs }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const days = Array.from({ length: daysInMonth }).map((_, i) => i + 1)
  const emptySlots = Array.from({ length: firstDayOfMonth }).map((_, i) => i)

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-900">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
            className="px-3 py-1 border rounded hover:bg-gray-50 text-black text-sm"
          >
            Prev
          </button>
          <button
            onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
            className="px-3 py-1 border rounded hover:bg-gray-50 text-black text-sm"
          >
            Next
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center font-semibold text-gray-600 text-xs mb-2">
        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {emptySlots.map(i => (
          <div key={`empty-${i}`} className="h-24 bg-gray-50 border border-gray-100 rounded" />
        ))}
        {days.map(day => {
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const dayBriefs = briefs.filter(b => b.scheduled_date === dateStr)

          return (
            <div key={day} className="h-24 bg-white border border-gray-200 rounded p-1 overflow-y-auto">
              <span className="text-xs font-bold text-gray-400">{day}</span>
              <div className="space-y-1 mt-1">
                {dayBriefs.map(b => (
                  <div key={b.id} className="text-[10px] bg-indigo-50 text-indigo-700 px-1 rounded truncate font-medium">
                    {b.topic}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
