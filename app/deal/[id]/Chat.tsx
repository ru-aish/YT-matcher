'use client'

import { useState, useEffect } from 'react'
import { getPusherClient } from '@/lib/pusher'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { sendMessage } from './actions'

type Message = {
  id: number;
  deal_id: number | null;
  sender_id: number | null;
  content: string;
  created_at: Date | null;
}

export default function Chat({ dealId, initialMessages, currentUserId }: { dealId: number, initialMessages: Message[], currentUserId: number }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')

  useEffect(() => {
    const pusher = getPusherClient()
    const channel = pusher.subscribe(`deal-${dealId}`)

    channel.bind('new-message', (message: Message) => {
      setMessages((prev) => {
        // Prevent duplicate appending if we triggered it ourselves
        if (prev.find((m) => m.id === message.id)) return prev
        return [...prev, message]
      })
    })

    return () => {
      pusher.unsubscribe(`deal-${dealId}`)
    }
  }, [dealId])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const tempInput = input
    setInput('') // Optimistic clear

    try {
      await sendMessage(dealId, tempInput, currentUserId)
    } catch (error) {
      console.error("Failed to send message", error)
      setInput(tempInput) // Revert on failure
    }
  }

  return (
    <div className="border rounded-lg p-6 flex flex-col h-[500px]">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2">Chat</h2>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.sender_id === currentUserId
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-lg px-4 py-2 max-w-[70%] ${isMe ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                {msg.content}
              </div>
            </div>
          )
        })}
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  )
}
