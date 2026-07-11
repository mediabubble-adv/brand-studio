import { GridPlanner } from '@/components/planner/GridPlanner'

export default function PlannerPage() {
  const mockSlots = Array.from({ length: 9 }).map((_, i) => ({
    id: `slot-${i}`,
    imageUrl: `https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=150&auto=format&fit=crop&q=80&rand=${i}`,
    caption: `Sample post ${i + 1}`,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Grid Planner</h1>
        <p className="text-sm text-gray-500">Plan and coordinate visual feed aesthetics</p>
      </div>
      <GridPlanner initialSlots={mockSlots} />
    </div>
  )
}
