import * as THREE from 'three'

// Generates procedural high-resolution canvas textures without any external asset dependencies

export function createWoodFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1024
  const ctx = canvas.getContext('2d')!

  // Warm base wood color
  ctx.fillStyle = '#2c1a11'
  ctx.fillRect(0, 0, 1024, 1024)

  const plankHeight = 64
  const numPlanks = 1024 / plankHeight

  for (let i = 0; i < numPlanks; i++) {
    const y = i * plankHeight
    // Subtle variation per plank
    const tone = (i % 3 === 0 ? 15 : i % 2 === 0 ? -10 : 0) + (Math.random() - 0.5) * 8
    const r = Math.min(255, Math.max(0, 48 + tone))
    const g = Math.min(255, Math.max(0, 30 + tone * 0.7))
    const b = Math.min(255, Math.max(0, 20 + tone * 0.5))
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
    ctx.fillRect(0, y, 1024, plankHeight - 2)

    // Wood grain lines
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'
    for (let g = 0; g < 14; g++) {
      const lineY = y + Math.random() * (plankHeight - 4)
      ctx.fillRect(0, lineY, 1024, 1 + Math.random() * 2)
    }

    // Seams and nail heads
    ctx.fillStyle = '#140b07'
    ctx.fillRect(0, y + plankHeight - 2, 1024, 2) // horizontal gap

    // Staggered vertical plank gaps
    const offset = (i % 2) * 512 + (i % 4) * 128
    ctx.fillRect(offset % 1024, y, 2, plankHeight)
    ctx.fillRect((offset + 512) % 1024, y, 2, plankHeight)

    // Nail impressions
    ctx.fillStyle = '#0f0805'
    ctx.beginPath()
    ctx.arc((offset + 25) % 1024, y + 12, 2, 0, Math.PI * 2)
    ctx.arc((offset + 512 - 25) % 1024, y + 12, 2, 0, Math.PI * 2)
    ctx.fill()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(4, 4)
  return texture
}

export function createBrickWallTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1024
  const ctx = canvas.getContext('2d')!

  // Mortar base
  ctx.fillStyle = '#3a271d'
  ctx.fillRect(0, 0, 1024, 1024)

  const brickH = 40
  const brickW = 90
  const mortar = 4

  for (let y = 0; y < 1024; y += brickH + mortar) {
    const isOdd = Math.floor(y / (brickH + mortar)) % 2 === 1
    const xOffset = isOdd ? brickW / 2 : 0

    for (let x = -brickW; x < 1024 + brickW; x += brickW + mortar) {
      // Warm weathered brick tones
      const variation = (Math.random() - 0.5) * 22
      const r = Math.min(255, Math.max(0, 78 + variation))
      const g = Math.min(255, Math.max(0, 42 + variation * 0.7))
      const b = Math.min(255, Math.max(0, 32 + variation * 0.6))
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
      ctx.fillRect(x + xOffset, y, brickW, brickH)

      // Weathering speckles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)'
      ctx.fillRect(x + xOffset + Math.random() * 20, y + Math.random() * 10, 20, 6)
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(3, 2)
  return texture
}

export function createMarbleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')!

  // Polished dark espresso granite
  ctx.fillStyle = '#1c1815'
  ctx.fillRect(0, 0, 512, 512)

  // Veins
  ctx.strokeStyle = 'rgba(180, 150, 120, 0.15)'
  ctx.lineWidth = 3
  for (let i = 0; i < 8; i++) {
    ctx.beginPath()
    let curX = Math.random() * 512
    let curY = 0
    ctx.moveTo(curX, curY)
    while (curY < 512) {
      curX += (Math.random() - 0.5) * 45
      curY += Math.random() * 50 + 20
      ctx.lineTo(curX, curY)
    }
    ctx.stroke()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2, 2)
  return texture
}

export function createChalkboardTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 768
  const ctx = canvas.getContext('2d')!

  // Slate blackboard
  ctx.fillStyle = '#161917'
  ctx.fillRect(0, 0, 1024, 768)

  // Chalk smudges
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)'
  for (let i = 0; i < 40; i++) {
    ctx.beginPath()
    ctx.arc(Math.random() * 1024, Math.random() * 768, 50 + Math.random() * 150, 0, Math.PI * 2)
    ctx.fill()
  }

  // Wooden frame border line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
  ctx.lineWidth = 4
  ctx.strokeRect(20, 20, 984, 728)

  // Chalkboard Header
  ctx.font = 'bold 42px "Playfair Display", Georgia, serif'
  ctx.fillStyle = '#f8f4eb'
  ctx.textAlign = 'center'
  ctx.fillText('☕ THE LONER CAFÉ MENU ☕', 512, 85)

  ctx.font = 'italic 20px "Playfair Display", Georgia, serif'
  ctx.fillStyle = '#dcd3c4'
  ctx.fillText('"No hurry. No noise. Take all the time you need."', 512, 125)

  // Chalk divider
  ctx.strokeStyle = 'rgba(240, 230, 215, 0.4)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(120, 145)
  ctx.lineTo(904, 145)
  ctx.stroke()

  // Menu items list
  ctx.font = '24px "Caveat", cursive, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillStyle = '#fff9f0'

  const items = [
    { name: 'Honey Lavender Oat Latte', desc: 'Wild dried lavender, steamed oat milk & raw wildflower honey', price: '4.75' },
    { name: 'Ceremonial Matcha Latte', desc: 'First-harvest Uji matcha whisked with warm cream', price: '5.20' },
    { name: 'Salted Caramel Macchiato', desc: 'Double pulled espresso, caramel drizzle, pinch of sea salt', price: '4.95' },
    { name: 'Slow French Press Immersion', desc: 'Single-origin Ethiopian Yirgacheffe (notes of bergamot & jasmine)', price: '4.50' },
    { name: 'Vanilla Sweet Cream Cold Brew', desc: 'Steeped for 20 hours, poured over hand-cut crystal ice', price: '5.00' },
    { name: 'Midnight Hot Cinnamon Cocoa', desc: '72% Belgian dark cocoa, Madagascar vanilla, scorched marshmallow', price: '4.60' },
  ]

  items.forEach((item, idx) => {
    const y = 210 + idx * 75
    ctx.font = 'bold 26px "Playfair Display", serif'
    ctx.fillStyle = '#f5eedc'
    ctx.fillText(item.name, 80, y)

    ctx.font = '24px monospace'
    ctx.fillStyle = '#e8c170'
    ctx.fillText(`$${item.price}`, 870, y)

    ctx.font = 'italic 18px "Inter", sans-serif'
    ctx.fillStyle = '#a89d91'
    ctx.fillText(item.desc, 80, y + 25)
  })

  // Bottom note
  ctx.font = 'italic 20px "Playfair Display", serif'
  ctx.fillStyle = '#e8c170'
  ctx.textAlign = 'center'
  ctx.fillText('🌿 All plants tended daily • Books are free to borrow • Enjoy the rain', 512, 700)

  const texture = new THREE.CanvasTexture(canvas)
  return texture
}

export function createLatteArtTexture(artType: string = 'heart'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')!

  // Dark rich espresso crema background
  ctx.fillStyle = '#3c2415'
  ctx.beginPath()
  ctx.arc(128, 128, 128, 0, Math.PI * 2)
  ctx.fill()

  // Crema marble swirl
  ctx.fillStyle = '#5c3a21'
  ctx.beginPath()
  ctx.arc(128, 128, 110, 0, Math.PI * 2)
  ctx.fill()

  // Foam art
  ctx.fillStyle = '#fbf5eb'

  if (artType === 'matcha') {
    // Green matcha base
    ctx.fillStyle = '#3a5a40'
    ctx.beginPath()
    ctx.arc(128, 128, 128, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#fbf5eb'
  }

  // Draw Heart
  ctx.beginPath()
  ctx.moveTo(128, 175)
  ctx.bezierCurveTo(70, 120, 60, 70, 128, 90)
  ctx.bezierCurveTo(196, 70, 186, 120, 128, 175)
  ctx.fill()

  const texture = new THREE.CanvasTexture(canvas)
  return texture
}
