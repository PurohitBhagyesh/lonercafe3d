# ☕ lonercafe3d • A 3D Sanctuary for Solitary Souls

[![Status](https://img.shields.io/badge/Status-Live%20in%20Production-2ea44f?style=for-the-badge&logo=checkmarx)](https://github.com/PurohitBhagyesh/lonercafe3d)
[![Production Build](https://img.shields.io/badge/Production%20Build-Passing-brightgreen?style=for-the-badge&logo=github-actions)](https://github.com/PurohitBhagyesh/lonercafe3d)
[![React](https://img.shields.io/badge/React-19.0-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.182-black?logo=three.js)](https://threejs.org/)
[![React Three Fiber](https://img.shields.io/badge/R3F-9.1-darkred)](https://r3f.docs.pmnd.rs/)
[![PeerJS](https://img.shields.io/badge/PeerJS-WebRTC%20P2P-ff0055)](https://peerjs.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)

> *"Sometimes you just need a corner in the world where nobody asks anything of you. The rain outside is tapping gently against the glass, steam is rising from the coffee, and it's nice to just breathe."*

**lonercafe3d is now LIVE IN PRODUCTION.** It is an immersive, first-person 3D atmospheric web game designed as a serene sanctuary for introverts, solitary thinkers, and quiet friends. Built entirely with modern web graphics and WebRTC peer-to-peer technology, it pairs physical café interactions (brewing espresso, playing an upright piano, tending houseplants, writing in a personal diary) with dynamic weather systems and synchronized multiplayer co-op.

---

## 🌐 Live in Production

`lonercafe3d` is compiled, hardened, and ready for production deployment across Vercel, Netlify, Cloudflare Pages, or custom CDN infrastructure:

- **Production Grade Performance:** Zero runtime lag with real-time directional occlusion culling—rendering only what is in the camera's field of view and culling opposite quadrants.
- **Serverless P2P Architecture:** Multiplayer co-op and real voice audio run completely peer-to-peer via WebRTC DataChannels and MediaStreams, eliminating costly backend servers.
- **Local Privacy Guaranteed:** Private diary thoughts and personal photo polaroids persist securely in local browser IndexedDB storage and never leave the user's machine.
- **Universal Cross-Platform:** Seamlessly adapts to Safari, Chrome, Edge, Firefox on macOS, Windows, Linux, iOS, and Android.

---

## 🌟 Key Features

### 1. 👥 Full Co-Op Multiplayer Sanctuary & Real WebRTC Voice Talk
- **Real-Time Voice Microphone Talk:** Real microphone audio capture streamed directly peer-to-peer via WebRTC with live voice activity detection and audio level indicators.
- **1-Click Sound & Mic Mechanisms:** Instant on/off switches for master audio sound (`[V]`) and microphone.
- **Context-Aware Clutter Elimination:** In solo mode, multiplayer chat drawers and microphone controls are completely hidden for pure solitary immersion. They only reveal themselves when playing with a friend or companion.
- **Instant Room Connection:** Create or join a sanctuary using a simple **6-digit numeric PIN**, direct shareable URL (`?room=123456`), or a scannable **mobile QR code**.
- **Smooth Real-Time Synchronization:**
  - Silky interpolation (lerp) for avatar position, rotation, and walking momentum.
  - Synced player postures: walking, sitting by the window, sitting in the reading armchair, or playing at the piano stool.
  - Synchronized item holding: steaming ceramic mugs, vintage copper watering cans, and antique books.
  - **Shared World Events:** When either player waters a houseplant or changes the weather, both see and hear the effect simultaneously.
  - **Shared Acoustic Piano:** When either player presses piano keys, the notes ring out acoustically on both machines in real time!
- **3D Floating Speech Bubbles & Whisper Chat:** Messages typed into the quiet chat drawer appear as 3D speech bubbles floating above your avatar’s head in the cafe.

---

### 2. 🌿 Unslopped Zen Minimalist HUD & Directional Zone Culling
- **Zero-Clutter Cinematic View:** No rows of 15+ weather/time buttons plastered across your screen. The in-game HUD is stripped down to an artisanal watermark, 1-click audio toggle, contextual stand-up action, and `Menu [ESC]`.
- **Atmosphere & Sky Sanctuary Menu (`[ESC]`):** Weather presets, time-of-day sunlight, background ambient soundscapes, and audio sliders are hosted inside the pause menu for calm, thoughtful configuration.
- **Strict Directional Occlusion Culling:**
  - *"Render only when the user sees that side; hide the other."*
  - Camera forward-direction calculations cull opposing quadrants (North window/weather vs. South fireplace/piano/desk/cat, and East espresso bar vs. West library), drastically cutting draw calls, vertex transformations, and particle loads.
- **Desktop & Safari Mouse Optimization:** Virtual touch joystick is strictly gated to handheld mobile touchscreens; desktop users on macOS, Safari, Chrome, and Windows experience clean, responsive keyboard (`WASD`) and pointer-lock navigation without mobile UI bleeding.

---

### 3. 🤖 AI Sanctuary Companion (Maya)
- **Solo Doesn't Mean Lonely:** Toggle **Maya**, an intelligent autonomous resident companion and barista, whenever you want company in your solitary sanctuary.
- **3D Autonomous Routine:**
  - Walks to the barista bar to grind beans and brew espresso with rising steam.
  - Moves to the upright piano to play delicate Erik Satie motifs.
  - Sits by the panoramic glass window to watch the falling sakura blossoms and rain.
  - Tends to the *Monstera Deliciosa* with the copper watering can.
  - Relaxes in the reading armchair with classic literature.
- **Poetic Dialogue Engine:** Speak to Maya in the whisper drawer—she generates thoughtful, cozy, weather-aware reflections tailored to the café atmosphere.

---

### 4. 🎹 Interactive Upright Piano & Satie Sheet Music
- **Physical 3D Walnut Piano:** Modeled after an 1890s Érard upright piano with 21 ivory white keys, 15 ebony black keys, 3 brass pedals, and an upholstered velvet bench.
- **Playable On-Screen Keyboard:** Walk up to the piano, press **`[E]`** to sit down, and play real notes using your computer keyboard (`A S D F G H J K` & `W E T Y U`) or mouse clicks.
- **Synthesized Piano Acoustics:** Physically-modeled hammer strike transient and string soundboard resonance harmonics.
- **Auto-Play Satie Melody:** Click the sheet music button to listen to a soothing rendition of Erik Satie’s *Gymnopédie No. 1*.

---

### 5. 🕰️ Regulator Pendulum Clock & Artisanal 3D Decor
- **1Hz Swinging Pendulum Clock:** Features a swinging brass pendulum with moving hour, minute, and second hands synchronized to your local real-world system clock.
- **Peaceful Sleeping Café Cat:** A calico cat curled up on a hand-knitted oatmeal cushion beside the warm hearth, breathing with gentle rhythmic motion.
- **Vintage Hand-Crank Coffee Grinder:** Detailed walnut dovetailed box, slide-out drawer, spun brass bean hopper, and cast-iron crank handle.
- **Victorian Fluted Gramophone:** Revolving shellac record platter, tonearm reproducer, and flared 8-petal morning-glory brass horn.
- **Antiquarian Leather Folios Stack:** Three weathered folios bound in oxblood, forest green, and navy calfskin with gold leaf spine ribs and silk bookmarks.
- **Warm Brass Pendant Lamps:** Hanging brass bell lamps with glowing warm Edison filament bulbs, casting soft radiance across the café.
- **Glass Apothecary Jars:** Filled with whole-bean Ethiopian Yirgacheffe, Colombia Supremo, and Sumatra Mandheling dark roasts.
- **Flickering Scented Soy Candle:** Amber glass candle casting warm light onto the desk.

---

### 6. 🌧️ Dynamic Weather & Horizon Engine
Switch seamlessly between 5 atmospheric weather states and 5 times of day:
- **Weather Types:**
  - 🌧️ **Rain & Storm:** Tapping raindrops against glass, rumble of soft thunder, and interactive condensation that you can wipe with your mouse or finger!
  - ❄️ **Snowfall:** Softly falling white flakes, frosted glass, and cold blizzard winds outside.
  - 🌸 **Sakura Cherry Blossom Grove:** 420 fluttering pink petals blowing across the panoramic window with pentatonic wind chimes.
  - 🌇 **Golden Hour Sunset:** Warm amber sunlight slanting across the hardwood plank floor.
  - 🌙 **Midnight Sky:** Deep navy horizon with sparkling distant stars and nighttime crickets.
- **Time of Day:** Dawn 🌅, High Noon ☀️, Sunset 🌇, Twilight 🌆, Midnight 🌙.

---

### 7. 📻 Retro iPod Classic & Ambient Soundscape
- **Diegetic iPod Classic:** Authentic click-wheel controls, animated equalizer spectrum bars, progress scrubber, and 5 skins (*Classic White*, *Stealth Black*, *Bondi Blue*, *Sakura Pink*, *Vintage Amber*).
- **Custom MP3 File Upload:** Drop your own `.mp3` or `.wav` files into the iPod for private, zero-server offline playback.
- **7 Selectable Ambient Soundscapes:** Rain & thunder, cozy café steam, crackling hearth fireplace, sakura wind chimes, blizzard wind, midnight crickets, or auto-match weather.

---

### 8. ☕ Barista Craft: Coffee Brewing & Steaming Mugs
- **Physical Pour-Over & Espresso Workflow:**
  1. Grind fresh whole beans at the commercial grinder.
  2. Pull a double espresso shot at the mirror-chrome machine with pressurized extraction audio.
  3. Steam milk to microfoam with high-pressure steam hissing sound effects.
- **Carry & Drink Mugs:** Take your hot mug anywhere in the café. Hold it in your hands, place it on the counter or writing desk, and sip hot coffee with gentle steam swirls.

---

### 9. 🪴 Houseplant Care & Copper Watering Can
- **Living Flora:** Fiddle-leaf fig, snake plant (*Sansevieria*), hanging English ivy, and giant split-leaf *Monstera Deliciosa*.
- **Moisture Depletion & Growth:** Plant soil dries out over time; pick up the vintage copper watering can to pour fresh water with splashing audio and particle droplets, keeping the foliage lush and vibrant.

---

### 10. 📖 Private Leatherbound Journal
- **Reflective Diary:** Write private entries with markdown formatting, mood tags (*Melancholy*, *Peaceful*, *Nostalgic*, *Inspired*), and time stamps.
- **Local IndexedDB Persistence:** All your thoughts stay securely in your own browser storage.
- **Markdown Export:** Export your entire journal collection as `.md` files at any time.

---

## 🎮 Controls

| Action | Keyboard / Mouse | Mobile Touchscreen |
| :--- | :--- | :--- |
| **Move** | `W`, `A`, `S`, `D` or Arrow Keys | Left Virtual Joystick (Handheld only) |
| **Look Around** | Mouse Drag / Pointer Lock | Right Touch Area Drag |
| **Interact / Sit** | `E` Key / Click Item Prompt | Contextual Interaction Pill |
| **Stand Up** | `Space` Key | "Stand Up" Button |
| **Toggle Audio** | `V` Key / Top Bar Audio Pill | Top Bar Audio Pill |
| **iPod Player** | `M` Key | Top Bar / In-Game iPod |
| **Open Diary** | `J` Key / Desk Notebook | Desk Notebook Prompt |
| **Take Polaroid** | `P` Key | Pause Menu Polaroid Button |
| **Sanctuary Menu** | `Esc` Key | Top Bar `Menu [ESC]` Pill |

---

## 🛠️ Technology Architecture

- **Rendering Engine:** React 19 + React Three Fiber (`@react-three/fiber`) + Three.js (`three`)
- **P2P Multiplayer:** PeerJS WebRTC DataChannels + BroadcastChannel Mesh + Audio MediaStream WebRTC
- **Audio Synthesis:** Web Audio API procedural synthesizers (piano harmonics, rain noise, steam hiss, wind pink noise) + AudioContext AnalyserNode for mic voice activity
- **Styling & HUD:** Tailwind CSS + Lucide React icons
- **State Management:** Zustand with custom localStorage / IndexedDB persistence

---

## 🚀 Production Deployment & Getting Started

### Production Build
```bash
npm run build
```
The optimized bundle will be created in the `dist/` directory, ready to deploy to any static host or edge CDN (Vercel, Cloudflare, Netlify, GitHub Pages).

### Running Production Preview
```bash
npm run preview
```

### Running Locally for Development
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## 📜 License
MIT License • Created with ❤️ for solitary dreamers everywhere.
