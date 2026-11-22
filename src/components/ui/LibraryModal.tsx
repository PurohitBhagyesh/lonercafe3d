import React, { useState } from 'react'
import { X, Book, Bookmark, Volume2, ArrowLeft, ArrowRight } from 'lucide-react'
import { useGameStore } from '../../store/gameStore'
import { soundEngine } from '../../audio/soundEngine'

interface BookItem {
  id: string
  title: string
  author: string
  coverColor: string
  pages: string[]
}

const BOOKS: BookItem[] = [
  {
    id: 'book-meditations',
    title: 'The Solitary Fortress',
    author: 'Reflections & Meditations',
    coverColor: 'bg-[#3d271d]',
    pages: [
      `Nowhere can man find a quieter or more untroubled retreat than in his own soul. 

Look within. Within is the fountain of good, and it will ever bubble up, if thou wilt ever dig.

Dwell on the beauty of life. Watch the stars, and see yourself running with them. Think constantly on the changes of the elements into each other, for such thoughts wash away the dust of earthly life.`,
      `Very little is needed to make a happy life; it is all within yourself, in your way of thinking.

When you arise in the morning think of what a privilege it is to be alive, to think, to enjoy, to love... and to simply sit in the quiet warmth of your own company.`
    ]
  },
  {
    id: 'book-rainy-verses',
    title: 'Rainy Night Verses',
    author: 'Quiet Poets Ensemble',
    coverColor: 'bg-[#1b3a4b]',
    pages: [
      `The rain falls on the window,
a steady, ancient drum.
The room is warm, the cup is full,
no urgent things to come.

Outside, the puddles gleam with streetlights,
reflecting silver skies;
Inside, a silent breath exhaled,
where honest peace abides.`,
      `Let the rain wash away the hurry of the world.
Let the cold wind outside remind you 
how precious a dry roof and a warm wool blanket truly are.

You do not have to be anywhere else right now.`
    ]
  },
  {
    id: 'book-tea',
    title: 'The Book of Solitude & Tea',
    author: 'Quiet Philosophy',
    coverColor: 'bg-[#283618]',
    pages: [
      `Tea began as a medicine and grew into a beverage. In China, in the eighth century, it entered the realm of poetry as one of the polite amusements.

The Tea-room does not pretend to be other than a simple cottage—a straw hut in the midst of the wilderness. It is an asylum where people can seek refuge from the impetuous impulses of the external world.`,
      `In the delicate vapor of hot water and crushed leaves, we discover that the simplest ritual, performed without spectators, is often the richest moment of the day.`
    ]
  }
]

export function LibraryModal() {
  const { mode, setMode } = useGameStore()
  const [selectedBook, setSelectedBook] = useState<BookItem>(BOOKS[0])
  const [pageIndex, setPageIndex] = useState(0)

  if (mode !== 'reading') return null

  const handleNextPage = () => {
    if (pageIndex < selectedBook.pages.length - 1) {
      soundEngine.playPageFlip()
      setPageIndex(p => p + 1)
    }
  }

  const handlePrevPage = () => {
    if (pageIndex > 0) {
      soundEngine.playPageFlip()
      setPageIndex(p => p - 1)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-[#2a1c14] rounded-2xl p-4 sm:p-6 shadow-2xl border-4 border-[#1f130b] flex flex-col text-[#f4ede4]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#442c1d]">
          <div className="flex items-center gap-2">
            <Book className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif text-lg font-medium">The Café Bookshelf</h3>
          </div>
          <button
            onClick={() => {
              soundEngine.playPageFlip()
              setMode('walking')
            }}
            className="p-1.5 rounded-full hover:bg-white/10 text-stone-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Book Selector Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {BOOKS.map((b) => (
            <button
              key={b.id}
              onClick={() => {
                soundEngine.playPageFlip()
                setSelectedBook(b)
                setPageIndex(0)
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-serif transition ${
                selectedBook.id === b.id ? 'bg-[#5c3a25] text-amber-200 border border-amber-400/40' : 'bg-[#1e130d] hover:bg-[#382316]'
              }`}
            >
              <span>📖</span>
              <span>{b.title}</span>
            </button>
          ))}
        </div>

        {/* Open Book Display */}
        <div className="bg-[#fcf8f2] text-[#2b1b11] rounded-xl p-6 sm:p-8 shadow-inner border border-[#e5d8c8] flex flex-col justify-between min-h-[300px]">
          <div>
            <div className="flex items-center justify-between border-b border-[#e2d4c3] pb-2 mb-4 text-xs font-mono text-stone-500">
              <span className="font-bold text-stone-700">{selectedBook.title}</span>
              <span>By {selectedBook.author}</span>
            </div>

            <div className="font-serif text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
              {selectedBook.pages[pageIndex]}
            </div>
          </div>

          {/* Page Turn Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[#e2d4c3] mt-6 text-xs font-mono text-stone-500">
            <button
              onClick={handlePrevPage}
              disabled={pageIndex === 0}
              className={`flex items-center gap-1 px-3 py-1 rounded transition ${
                pageIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#ebdfce] text-[#2b1b11]'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous Page</span>
            </button>

            <span>Page {pageIndex + 1} of {selectedBook.pages.length}</span>

            <button
              onClick={handleNextPage}
              disabled={pageIndex === selectedBook.pages.length - 1}
              className={`flex items-center gap-1 px-3 py-1 rounded transition ${
                pageIndex === selectedBook.pages.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#ebdfce] text-[#2b1b11]'
              }`}
            >
              <span>Next Page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <p className="text-center text-[11px] font-mono text-stone-400 mt-3">
          Click X or Esc to return to the café
        </p>
      </div>
    </div>
  )
}
