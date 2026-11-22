import React, { useState } from 'react'
import { X, Coffee, Sparkles, Check } from 'lucide-react'
import confetti from 'canvas-confetti'
import { useGameStore } from '../../store/gameStore'
import { soundEngine } from '../../audio/soundEngine'

const ROASTS = [
  { id: 'dark', name: 'Dark Roast', notes: 'Smoky, dark chocolate & cedar' },
  { id: 'medium', name: 'Velvet Medium', notes: 'Caramel, toasted hazelnut' },
  { id: 'blonde', name: 'Golden Blonde', notes: 'Floral, sweet honey citrus' }
]

const DRINKS = [
  { id: 'latte', name: 'Honey Lavender Oat Latte', icon: '☕', desc: 'Heart latte art with floral wild lavender & oat foam', art: 'Heart 🤍' },
  { id: 'matcha', name: 'Ceremonial Matcha Latte', icon: '🍵', desc: 'Rosetta leaf art with stone-ground Uji matcha', art: 'Rosetta 🌿' },
  { id: 'caramel', name: 'Salted Caramel Macchiato', icon: '🍮', desc: 'Crosshatch caramel drizzle over vanilla-infused foam', art: 'Swirl 🤎' },
  { id: 'french', name: 'French Press Dark Roast', icon: '🫘', desc: 'Rich, full-bodied dark immersion brew with thick golden crema', art: 'Crema ✨' },
  { id: 'coldbrew', name: 'Vanilla Sweet Cream Cold Brew', icon: '🧊', desc: 'Slow-steeped for 20 hours over crystal ice cubes', art: 'Ice Float ❄️' },
  { id: 'cocoa', name: 'Midnight Hot Cinnamon Cocoa', icon: '🍫', desc: 'Belgian melted dark cocoa with toasted marshmallow', art: 'Cloud ☁️' }
]

export function CoffeeBrewModal() {
  const { mode, setMode, setHeldItem } = useGameStore()
  const [selectedRoast, setSelectedRoast] = useState(ROASTS[1].id)
  const [selectedDrink, setSelectedDrink] = useState(DRINKS[0].id)
  const [isBrewing, setIsBrewing] = useState(false)

  if (mode !== 'brewing') return null

  const handleBrew = () => {
    setIsBrewing(true)
    soundEngine.playCoffeeClink()

    setTimeout(() => {
      setIsBrewing(false)
      const drinkObj = DRINKS.find(d => d.id === selectedDrink) || DRINKS[0]
      const roastObj = ROASTS.find(r => r.id === selectedRoast) || ROASTS[0]
      
      setHeldItem({
        id: `coffee-${Date.now()}`,
        name: `${roastObj.name} ${drinkObj.name}`,
        type: 'coffee',
        drinkType: selectedDrink
      })

      confetti({
        particleCount: 20,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#e69a4e', '#8c6b53', '#f4ede4']
      })

      setMode('walking')
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#2a1b12] rounded-2xl p-5 sm:p-6 shadow-2xl border-4 border-[#1c110b] flex flex-col text-[#f4ede4]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#432b1d]">
          <div className="flex items-center gap-2">
            <Coffee className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif text-lg font-medium">Barista Brew Bar</h3>
          </div>
          <button
            onClick={() => setMode('walking')}
            className="p-1.5 rounded-full hover:bg-white/10 text-stone-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Roast selection */}
        <div className="mb-4">
          <label className="text-xs font-mono uppercase text-amber-300/80 tracking-wider block mb-2 font-semibold">
            1. Select Coffee Bean Roast:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {ROASTS.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRoast(r.id)}
                className={`p-2.5 rounded-xl border text-left transition ${
                  selectedRoast === r.id
                    ? 'bg-[#4e3220] border-amber-400 text-white shadow-md'
                    : 'bg-[#1e130d] border-[#3d2719] text-stone-400 hover:bg-[#2e1d13]'
                }`}
              >
                <div className="font-serif text-xs font-bold">{r.name}</div>
                <div className="text-[10px] opacity-75 mt-0.5 line-clamp-1">{r.notes}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Drink selection */}
        <div className="mb-5">
          <label className="text-xs font-mono uppercase text-amber-300/80 tracking-wider block mb-2 font-semibold">
            2. Choose Beverage:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {DRINKS.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDrink(d.id)}
                className={`p-3 rounded-xl border text-left transition flex items-start gap-2.5 ${
                  selectedDrink === d.id
                    ? 'bg-[#4e3220] border-amber-400 text-white shadow-md'
                    : 'bg-[#1e130d] border-[#3d2719] text-stone-400 hover:bg-[#2e1d13]'
                }`}
              >
                <span className="text-xl">{d.icon}</span>
                <div>
                  <div className="font-serif text-xs font-bold">{d.name}</div>
                  <div className="text-[10px] opacity-75 mt-0.5 line-clamp-1">{d.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleBrew}
          disabled={isBrewing}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 active:scale-[0.98] text-white font-serif font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition"
        >
          {isBrewing ? (
            <span className="animate-pulse">Grinding & Steaming... ☕</span>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Brew & Pour into Hands</span>
            </>
          )}
        </button>

        <p className="text-center text-[11px] font-mono text-stone-400 mt-3">
          Once brewed, you can carry your cup and place it down on any table or counter.
        </p>
      </div>
    </div>
  )
}
