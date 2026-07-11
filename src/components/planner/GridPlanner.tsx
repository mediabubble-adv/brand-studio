'use client'
import { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'

interface PostSlot {
  id: string
  imageUrl: string
  caption: string
}

interface Props {
  initialSlots: PostSlot[]
}

export function GridPlanner({ initialSlots }: Props) {
  const [slots, setSlots] = useState(initialSlots)

  function handleOnDragEnd(result: DropResult) {
    if (!result.destination) return
    const items = Array.from(slots)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    setSlots(items)
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 max-w-md mx-auto">
      <h2 className="text-lg font-bold text-gray-900 mb-4 text-center">Instagram Grid Layout</h2>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="grid">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-3 gap-2 bg-gray-50 p-2 rounded-lg"
            >
              {slots.map((slot, index) => (
                <Draggable key={slot.id} draggableId={slot.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="aspect-square bg-gray-200 border border-gray-300 rounded overflow-hidden relative group"
                    >
                      <img src={slot.imageUrl} alt={slot.caption} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs font-semibold px-2 py-1 bg-black bg-opacity-60 rounded">Drag to Reorder</span>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}
