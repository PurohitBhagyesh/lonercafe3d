# ☕ lonercafe3d • A 3D Sanctuary for Solitary Souls

[![React](https://img.shields.io/badge/React-19.0-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.182-black?logo=three.js)](https://threejs.org/)
[![React Three Fiber](https://img.shields.io/badge/R3F-9.1-darkred)](https://r3f.docs.pmnd.rs/)
[![PeerJS](https://img.shields.io/badge/PeerJS-WebRTC%20P2P-ff0055)](https://peerjs.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)

> *"Sometimes you just need a corner in the world where nobody asks anything of you. The rain outside is tapping gently against the glass, steam is rising from the coffee, and it's nice to just breathe."*

**lonercafe3d** is an immersive, first-person 3D atmospheric web game designed as a serene sanctuary for introverts, solitary thinkers, and quiet friends. Built entirely with modern web graphics and WebRTC peer-to-peer technology, it pairs physical café interactions (brewing espresso, playing an upright piano, tending houseplants, writing in a personal diary) with dynamic weather systems and synchronized multiplayer co-op.

---

## 🌟 Key Features

### 1. 👥 Full Co-Op Multiplayer Sanctuary (WebRTC P2P + Broadcast Mesh)
- **Instant Room Connection:** Create or join a sanctuary using a simple **6-digit numeric PIN**, direct shareable URL (`?room=123456`), or a scannable **mobile QR code**.
- **Zero-Config P2P Networking:** Powered by **PeerJS WebRTC DataChannels** for internet co-op and a local **BroadcastChannel mesh** for zero-latency multi-tab sync.
- **Smooth Real-Time Synchronization:**
  - Silky interpolation (lerp) for avatar position, rotation, and walking momentum.
  - Synced player postures: walking, sitting by the window, sitting in the reading armchair, or playing at the piano stool.
  - Synchronized item holding: steaming ceramic mugs, vintage copper watering cans, and antique books.
  - **Shared World Events:** When either player waters a houseplant or changes the weather, both see and hear the effect simultaneously.
  - **Shared Acoustic Piano:** When either player presses piano keys, the notes ring out acoustically on both machines in real time!
- **3D Floating Speech Bubbles & Whisper Chat:** Messages typed into the quiet chat drawer appear as 3D speech bubbles floating above your avatar’s head in the cafe.
- **Voice Presence Halo:** An ethereal animated sound-wave halo pulses above avatars when voice mic presence is active.

---

### 2. 🤖 AI Sanctuary Companion (Maya)
- **Solo Doesn't Mean Lonely:** Toggle **Maya**, an intelligent autonomous resident companion and barista, whenever you want company in your solitary sanctuary.
- **3D Autonomous Routine:**
  - Walks to the barista bar to grind beans and brew espresso with rising steam.
  - Moves to the upright piano to play delicate Erik Satie motifs.
  - Sits by the panoramic glass window to watch the falling sakura blossoms and rain.
  - Tends to the *Monstera Deliciosa* with the copper watering can.
  - Relaxes in the reading armchair with classic literature.
- **Poetic Dialogue Engine:** Speak to Maya in the whisper drawer—she generates thoughtful, cozy, weather-aware reflections tailored to the café atmosphere.

---

### 3. 🎹 Interactive Upright Piano & Satie Sheet Music
- **Physical 3D Walnut Piano:** Modeled after an 1890s Érard upright piano with 21 ivory white keys, 15 ebony black keys, 3 brass pedals, and an upholstered velvet bench.
- **Playable On-Screen Keyboard:** Walk up to the piano, press **`[E]`** to sit down, and play real notes using your computer keyboard (`A S D F G H J K` & `W E T Y U`) or mouse clicks.
- **Synthesized Piano Acoustics:** Physically-modeled hammer strike transient and string soundboard resonance harmonics.
- **Auto-Play Satie Melody:** Click the sheet music button to listen to a soothing rendition of Erik Satie’s *Gymnopédie No. 1*.

---

### 4. 🕰️ Regulator Pendulum Clock & Artisanal 3D Decor
- **1Hz Swinging Pendulum Clock:** Features a swinging brass pendulum with moving hour, minute, and second hands synchronized to your local real-world system clock.
- **Peaceful Sleeping Café Cat:** A calico cat curled up on a hand-knitted oatmeal cushion beside the warm hearth, breathing with gentle rhythmic motion.
- **Vintage Hand-Crank Coffee Grinder:** Detailed walnut dovetailed box, slide-out drawer, spun brass bean hopper, and cast-iron crank handle.
- **Victorian Fluted Gramophone:** Revolving shellac record platter, tonearm reproducer, and flared 8-petal morning-glory brass horn.
- **Antiquarian Leather Folios Stack:** Three weathered folios bound in oxblood, forest green, and navy calfskin with gold leaf spine ribs and silk bookmarks.
- **Warm Brass Pendant Lamps:** Hanging brass bell lamps with glowing warm Edison filament bulbs, casting soft radiance across the café.
- **Glass Apothecary Jars:** Filled with whole-bean Ethiopian Yirgacheffe, Colombia Supremo, and Sumatra Mandheling dark roasts.
- **Flickering Scented Soy Candle:** Amber glass candle casting warm light onto the desk.

---

### 5. 🌧️ Dynamic Weather & Horizon Engine
Switch seamlessly between 5 atmospheric weather states and 5 times of day:
- **Weather Types:**
  - 🌧️ **Rain & Storm:** Tapping raindrops against glass, rumble of soft thunder, and interactive condensation that you can wipe with your mouse or finger!
  - ❄️ **Snowfall:** Softly falling white flakes, frosted glass, and cold blizzard winds outside.
  - 🌸 **Sakura Cherry Blossom Grove:** 420 fluttering pink petals blowing across the panoramic window with pentatonic wind chimes.
  - 🌇 **Golden Hour Sunset:** Warm amber sunlight slanting across the hardwood plank floor.
  - 🌙 **Midnight Sky:** Deep navy horizon with sparkling distant stars and nighttime crickets.
- **Time of Day:** Dawn 🌅, High Noon ☀️, Sunset 🌇, Twilight 🌆, Midnight 🌙.

---

### 6. 📻 Retro iPod Classic & Ambient Soundscape
- **Diegetic iPod Classic:** Authentic click-wheel controls, animated equalizer spectrum bars, progress scrubber, and 5 skins (*Classic White*, *Stealth Black*, *Bondi Blue*, *Sakura Pink*, *Vintage Amber*).
- **Custom MP3 File Upload:** Drop your own `.mp3` or `.wav` files into the iPod for private, zero-server offline playback.
- **7 Selectable Ambient Soundscapes:** Rain & thunder, cozy café steam, crackling hearth fireplace, sakura wind chimes, blizzard wind, midnight crickets, or auto-match weather.

---

### 7. 📖 The Loner’s Private Diary & Bookshelf
- **Leather-Bound Desk Journal:** Sit at the loner’s writing desk under the vintage green banker’s lamp to record your thoughts.
- **Markdown Export:** Export your complete journal history to clean `.md` format at any time.
- **The Library Bookshelf:** Read excerpts from Marcus Aurelius (*Meditations*), Bashō (*Rainy Night Verses*), and Kakuzo Okakura (*The Book of Solitude & Tea*).

---

### 8. ☕ Artisan Coffee Bar & Plant Care
- **Espresso Machine:** Dual-boiler machine with pressure gauges, steam wands, portafilters, and rising steam.
- **6 Brew Selections:** Honey Lavender Oat Latte, Ceremonial Matcha Latte, Salted Caramel Macchiato, French Press Dark Roast, Vanilla Sweet Cream Cold Brew, and Midnight Hot Cinnamon Cocoa.
- **Houseplant Hydration:** Pick up the vintage copper watering can and water the *Monstera Deliciosa*, *Fiddle Leaf Fig*, *Desk Bonsai*, and *Hanging Pothos*.

---

## 🎮 Controls Reference

| Action | Desktop Keyboard & Mouse / Trackpad | Mobile Touchscreen |
| :--- | :--- | :--- |
| **Walk Forward / Back** | `W` / `S` or `↑` / `↓` | Left Virtual Joystick |
| **Strafe Left / Right** | `A` / `D` or `←` / `→` | Left Virtual Joystick |
| **Look Around** | **Click & Drag** or **Two-Finger Trackpad Swipe** | Swipe on right half of screen |
| **Lock / Unlock Mouse (FPS)**| `[L]` (or click "Lock Mouse" in Top Bar) | N/A |
| **Interact / Pick Up / Sit** | `[E]` key (when prompt appears) | Contextual `[Interact]` button |
| **Stand Up from Seat** | `[Space]` or `[E]` | `[Stand Up]` button |
| **Open Private Diary** | `[J]` key (Journal) or click desk diary | Contextual prompt |
| **Open Retro iPod** | `[M]` key (Music) or click iPod on counter | iPod button in Top Bar |
| **Toggle Mute Sound** | `[V]` key | Top Bar Sound Toggle |
| **Wipe Steamy Window** | Click "Wipe Window" in Top Bar when raining | Direct touch draw |
| **Pause & Settings** | `[ESC]` key | Menu `[ESC]` in Top Bar |

> [!TIP]
> **Trackpad Friendly:** Desktop Safari and Mac trackpad users can freely pan with two fingers or click-and-drag without being trapped by browser pointer lock warnings!

---

## 🛠️ Tech Stack & Architecture

- **Engine:** [Three.js](https://threejs.org/) + [React Three Fiber](https://r3f.docs.pmnd.rs/) (`@react-three/fiber`) + [Drei](https://github.com/pmndrs/drei) (`@react-three/drei`)
- **UI Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [TailwindCSS](https://tailwindcss.com/)
- **Multiplayer P2P Networking:** [PeerJS](https://peerjs.com/) (WebRTC DataChannels) + BroadcastChannel API
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) with localStorage persistence
- **Audio Synthesizer:** Web Audio API (procedural brownian noise, biquad resonant filtering, harmonic overtone oscillators)
- **Tooling & Bundler:** [Vite 6](https://vitejs.dev/)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm or pnpm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/PurohitBhagyesh/lonercafe3d.git

# Enter project directory
cd lonercafe3d

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit **`http://localhost:3000`** in your browser.

### Production Build

```bash
# Type check and build optimized bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🤝 Multiplayer Testing (Side-by-Side)

1. Open `http://localhost:3000` in **Window A**.
2. Note your 6-digit room PIN in the top bar (e.g. `849201`).
3. Open `http://localhost:3000/?room=849201` in **Window B** (or in a Private window / another device on your network).
4. You will immediately see both 3D avatars standing and walking together in real time!

---

## 📜 License

Created with warmth for introverts and solitary souls everywhere. Licensed under the [MIT License](LICENSE).
