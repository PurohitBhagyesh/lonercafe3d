import React, { useState } from 'react'
import { X, BookOpen, Trash2, Plus, Sparkles, Heart } from 'lucide-react'
import confetti from 'canvas-confetti'
import { useGameStore, DiaryEntry } from '../../store/gameStore'
import { soundEngine } from '../../audio/soundEngine'

const MOODS: Array<{ id: DiaryEntry['mood']; label: string; icon: string }> = [
  { id: 'peaceful', label: 'Peaceful', icon: '🕊️' },
  { id: 'cozy', label: 'Cozy', icon: '☕' },
  { id: 'reflective', label: 'Reflective', icon: '🌧️' },
  { id: 'hopeful', label: 'Hopeful', icon: '🌱' },
  { id: 'melancholy', label: 'Quiet Melancholy', icon: '🌙' },
]

export function DiaryModal() {
  const { mode, setMode, diaryEntries, addDiaryEntry, deleteDiaryEntry, standUp } = useGameStore()

  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(diaryEntries[0] || null)
  const [isWritingNew, setIsWritingNew] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newMood, setNewMood] = useState<DiaryEntry['mood']>('peaceful')

  if (mode !== 'writing') return null

  const handleSave = () => {
    if (!newContent.trim()) return

    soundEngine.playPageFlip()
    addDiaryEntry({
      title: newTitle.trim() || 'Untitled Musings',
      content: newContent.trim(),
      mood: newMood
    })

    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#e69a4e', '#d4a373', '#faedcd']
    })

    setNewTitle('')
    setNewContent('')
    setIsWritingNew(false)
    setSelectedEntry(useGameStore.getState().diaryEntries[0])
  }

  const handleClose = () => {
    soundEngine.playPageFlip()
    standUp()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md">
      {/* Leather Bound Journal Container */}
      <div className="relative w-full max-w-4xl h-[85vh] max-h-[680px] bg-[#3a2214] rounded-2xl p-4 sm:p-6 shadow-2xl border-4 border-[#24150c] flex flex-col overflow-hidden">
        
        {/* Header Ribbon */}
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#5c3a24] text-[#f4ede4]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h2 className="font-serif text-lg sm:text-xl tracking-wide font-medium">
              The Loner's Diary • Solitary Sanctuary
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-stone-300 transition"
            title="Close Diary (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Two-Pane Book Layout */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 overflow-hidden bg-[#faf6ee] rounded-xl p-4 sm:p-6 text-[#2b1e16] shadow-inner border border-[#d3c2af]">
          
          {/* Left Index Column (Saved Entries List) */}
          <div className="md:col-span-4 border-r border-[#e0d3c3] pr-3 flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#e0d3c3]">
              <span className="text-xs font-mono tracking-wider uppercase text-stone-600 font-semibold">
                Journal Entries ({diaryEntries.length})
              </span>
              <button
                onClick={() => {
                  soundEngine.playPageFlip()
                  setIsWritingNew(true)
                  setSelectedEntry(null)
                }}
                className="flex items-center gap-1 text-xs bg-[#e8dbcc] hover:bg-[#d8c7b3] text-[#3a2214] px-2.5 py-1 rounded-full font-medium transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Write New</span>
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {diaryEntries.map((entry) => {
                const isSelected = selectedEntry?.id === entry.id && !isWritingNew
                return (
                  <div
                    key={entry.id}
                    onClick={() => {
                      soundEngine.playPageFlip()
                      setSelectedEntry(entry)
                      setIsWritingNew(false)
                    }}
                    className={`p-2.5 rounded-lg cursor-pointer transition text-left relative group ${
                      isSelected ? 'bg-[#ebd8c1] shadow-sm font-medium' : 'hover:bg-[#f0e4d3]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold truncate pr-2 text-[#2d1c13]">
                        {entry.title}
                      </span>
                      <span className="text-sm">
                        {MOODS.find(m => m.id === entry.mood)?.icon || '☕'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-stone-500 mt-1">
                      <span>{entry.date}</span>
                      <span>{entry.time}</span>
                    </div>
                    {/* Delete button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteDiaryEntry(entry.id)
                      }}
                      className="absolute right-2 top-2 hidden group-hover:block p-1 text-red-700/60 hover:text-red-700 transition"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Paper Column (Reader or Writer) */}
          <div className="md:col-span-8 flex flex-col h-full pl-0 md:pl-3 overflow-hidden">
            {isWritingNew ? (
              /* Writing Mode */
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#e5d8c8]">
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Entry title (e.g. Thoughts by the rainy window...)"
                    className="w-full bg-transparent font-serif text-lg font-bold text-[#2d1c13] placeholder-stone-400 focus:outline-none"
                    autoFocus
                  />
                </div>

                {/* Mood Selector */}
                <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 text-xs">
                  <span className="font-mono text-[11px] text-stone-500">Mood:</span>
                  {MOODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setNewMood(m.id)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition ${
                        newMood === m.id ? 'bg-[#3a2214] text-[#f4ede4]' : 'bg-[#eadecc] hover:bg-[#ded0be] text-[#3a2214]'
                      }`}
                    >
                      <span>{m.icon}</span>
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>

                {/* Textarea */}
                <textarea
                  value={newContent}
                  onChange={(e) => {
                    setNewContent(e.target.value)
                  }}
                  placeholder="Pour your heart out. Nobody is judging you here..."
                  className="flex-1 w-full bg-transparent font-serif text-base sm:text-lg leading-relaxed text-[#2d1c13] placeholder-stone-400 resize-none focus:outline-none border-t border-[#f0e4d5] pt-2"
                />

                {/* Bottom Bar */}
                <div className="flex justify-between items-center pt-3 border-t border-[#e5d8c8] mt-2">
                  <span className="text-[11px] font-mono text-stone-500">
                    Auto-saved locally in your browser
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsWritingNew(false)}
                      className="px-3 py-1.5 text-xs rounded-full hover:bg-stone-200 text-stone-700 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-1.5 bg-[#402819] hover:bg-[#2b1a10] text-[#f4ede4] px-4 py-1.5 rounded-full text-xs font-semibold shadow transition"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Save to Diary</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : selectedEntry ? (
              /* Reading Mode */
              <div className="flex flex-col h-full overflow-y-auto pr-1">
                <div className="pb-3 border-b border-[#e5d8c8] mb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-2xl font-bold text-[#2d1c13]">
                      {selectedEntry.title}
                    </h3>
                    <span className="text-xl">
                      {MOODS.find(m => m.id === selectedEntry.mood)?.icon || '☕'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-stone-500 mt-1">
                    <span>📅 {selectedEntry.date}</span>
                    <span>•</span>
                    <span>⏰ {selectedEntry.time}</span>
                    <span>•</span>
                    <span className="capitalize">{selectedEntry.mood}</span>
                  </div>
                </div>

                <div className="font-serif text-base sm:text-lg leading-relaxed text-[#352419] whitespace-pre-wrap flex-1">
                  {selectedEntry.content}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-stone-400">
                <BookOpen className="w-10 h-10 mb-2 opacity-50" />
                <p className="font-serif">No entry selected</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] font-mono text-stone-400 mt-2">
          Press [Esc] or click X to stand up from the writing desk
        </p>
      </div>
    </div>
  )
}
