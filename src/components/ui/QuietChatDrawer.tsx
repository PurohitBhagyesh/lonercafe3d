import React, { useState, useRef, useEffect } from 'react'
import { MessageSquare, Send, Mic, MicOff, X, Sparkles, ShieldAlert } from 'lucide-react'
import { useGameStore } from '../../store/gameStore'
import { soundEngine } from '../../audio/soundEngine'

export function QuietChatDrawer() {
  const { 
    chatMessages, 
    sendChatMessage, 
    isMicActive, 
    toggleMic, 
    connectedFriend,
    mode,
    setMode 
  } = useGameStore()

  const [isOpen, setIsOpen] = useState(false)
  const [inputText, setInputText] = useState('')
  const [rateLimitWarning, setRateLimitWarning] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatMessages, isOpen])

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!inputText.trim()) return

    const success = sendChatMessage(inputText)
    if (!success) {
      setRateLimitWarning(true)
      setTimeout(() => setRateLimitWarning(false), 1500)
      return
    }

    soundEngine.playIpodClick()
    setInputText('')
  }

  const sendQuickReaction = (reaction: string) => {
    const success = sendChatMessage(reaction)
    if (!success) {
      setRateLimitWarning(true)
      setTimeout(() => setRateLimitWarning(false), 1500)
    } else {
      soundEngine.playIpodClick()
    }
  }

  return (
    <>
      {/* Floating Chat & Mic Pill (Bottom Left) */}
      <div className="fixed bottom-6 left-6 z-30 flex items-center gap-2">
        {/* Toggle Chat button */}
        <button
          onClick={() => {
            soundEngine.playIpodClick()
            setIsOpen(prev => !prev)
          }}
          className="flex items-center gap-2 bg-[#251710]/90 hover:bg-[#382318] text-[#f4ede4] px-3.5 py-2 rounded-full border border-amber-400/30 shadow-xl backdrop-blur-md transition active:scale-95"
        >
          <MessageSquare className="w-4 h-4 text-amber-300" />
          <span className="text-xs font-mono hidden sm:inline">
            {connectedFriend ? `Chat (${connectedFriend.name.slice(0, 10)})` : 'Quiet Thoughts'}
          </span>
          {chatMessages.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          )}
        </button>

        {/* Mic / Sound presence toggle */}
        <button
          onClick={() => {
            soundEngine.playIpodClick()
            toggleMic()
          }}
          className={`p-2 rounded-full border shadow-xl backdrop-blur-md transition active:scale-95 ${
            isMicActive
              ? 'bg-emerald-800/90 text-white border-emerald-400'
              : 'bg-[#251710]/90 text-stone-400 border-amber-400/30 hover:text-stone-200'
          }`}
          title={isMicActive ? 'Microphone Active (Voice presence on)' : 'Microphone Muted'}
        >
          {isMicActive ? <Mic className="w-4 h-4 text-emerald-200 animate-pulse" /> : <MicOff className="w-4 h-4" />}
        </button>
      </div>

      {/* Slide-in Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-20 left-6 z-50 w-[320px] sm:w-[360px] h-[400px] bg-[#241710]/95 backdrop-blur-md rounded-2xl border-2 border-[#4a3022] shadow-2xl flex flex-col overflow-hidden text-[#f4ede4]">
          
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-3 border-b border-[#3d271b] bg-[#1a100a]/80">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span className="font-serif text-sm font-semibold text-amber-200">
                Quiet Sanctuary Chat
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs font-sans">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[10px] font-mono text-stone-400 mb-0.5 px-1">
                  {msg.sender} • {msg.time}
                </span>
                <div
                  className={`px-3 py-2 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.isSelf
                      ? 'bg-amber-600/90 text-white rounded-br-none shadow'
                      : 'bg-[#382317] text-stone-200 rounded-bl-none border border-[#4d3221]'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reaction Buttons */}
          <div className="flex gap-1.5 px-3 py-1.5 overflow-x-auto border-t border-[#382317] bg-[#1d120a]/60">
            {[
              '☕ Sipping coffee...',
              '🌧️ Love this rain',
              '🕊️ Such peace',
              '💛 Sending warmth',
              '📖 Reading quietly'
            ].map((reaction, i) => (
              <button
                key={i}
                onClick={() => sendQuickReaction(reaction)}
                className="whitespace-nowrap bg-[#301d12] hover:bg-[#452b1b] text-stone-300 text-[10px] px-2 py-1 rounded-full transition"
              >
                {reaction}
              </button>
            ))}
          </div>

          {/* Rate limit warning toast */}
          {rateLimitWarning && (
            <div className="bg-amber-900/90 text-amber-200 text-[11px] px-3 py-1 text-center font-mono flex items-center justify-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Please pause for a breath between messages (Rate Limit)</span>
            </div>
          )}

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-2 border-t border-[#3d271b] bg-[#1a100a] flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Whisper a quiet thought..."
              className="flex-1 bg-[#281911] border border-[#432b1e] rounded-xl px-3 py-2 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="p-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl transition active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
