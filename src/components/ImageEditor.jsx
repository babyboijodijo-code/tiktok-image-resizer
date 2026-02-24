import { useRef, useState } from 'react'
import { useBilling } from '../context/BillingContext'
import Paywall from './Paywall'

export default function ImageEditor({ image, onReset }) {
    const { isPro } = useBilling()
    const [showPaywall, setShowPaywall] = useState(false)
    const [scale, setScale] = useState(1)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const containerRef = useRef(null)
    const imgRef = useRef(null)

    // Tik Tok resolution: 1080x1920 (9:16)
    const TARGET_WIDTH = 1080
    const TARGET_HEIGHT = 1920

    const handleMouseDown = (e) => {
        setIsDragging(true)
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }

    const handleMouseMove = (e) => {
        if (!isDragging) return
        e.preventDefault()
        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        })
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    const handleDownload = () => {
        if (!isPro) {
            setShowPaywall(true)
            return
        }

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = TARGET_WIDTH
        canvas.height = TARGET_HEIGHT

        // Fill black background
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const img = new Image()
        img.src = image
        img.onload = () => {
            const container = containerRef.current
            // Calculate scale based on the visual representation
            const renderScale = TARGET_WIDTH / container.clientWidth

            // Apply transformations
            ctx.translate(canvas.width / 2, canvas.height / 2)
            ctx.translate(position.x * renderScale, position.y * renderScale)
            ctx.scale(scale, scale)

            const imgAspect = img.width / img.height

            // Fit to width logic
            const drawWidth = TARGET_WIDTH
            const drawHeight = drawWidth / imgAspect

            ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight)

            // Trigger download
            const link = document.createElement('a')
            link.download = 'tiktok-resized.png'
            link.href = canvas.toDataURL('image/png')
            link.click()
        }
    }

    return (
        <div className="flex flex-col md:flex-row gap-8 items-start justify-center">
            {/* Editor / Preview Area */}
            <div className="relative mx-auto border-4 border-gray-800 rounded-3xl overflow-hidden shadow-2xl bg-black"
                style={{
                    width: '360px',
                    height: '640px', // 9:16 aspect ratio
                    cursor: isDragging ? 'grabbing' : 'grab'
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                ref={containerRef}
            >
                <div className="absolute inset-0 pointer-events-none z-10 grid grid-cols-3 grid-rows-3 opacity-30">
                    <div className="border-r border-gray-500"></div>
                    <div className="border-r border-gray-500"></div>
                    <div></div>
                    <div className="border-t border-gray-500 col-span-3"></div>
                    <div className="border-t border-gray-500 col-span-3"></div>
                </div>

                <div className="w-full h-full flex items-center justify-center pointer-events-none">
                    {/* Wrapper for transformation */}
                    <div style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        transformOrigin: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                    }}>
                        <img
                            ref={imgRef}
                            src={image}
                            alt="Upload"
                            draggable={false}
                            className="max-w-none select-none pointer-events-auto"
                            style={{ width: '100%', display: 'block' }}
                        />
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="w-full md:w-80 flex flex-col gap-6 p-6 glass-panel">
                <div>
                    <h2 className="text-xl font-bold mb-4">Adjust Image</h2>
                    <label className="block text-sm text-gray-400 mb-2">Zoom: {Math.round(scale * 100)}%</label>
                    <input
                        type="range"
                        min="0.5"
                        max="3"
                        step="0.01"
                        value={scale}
                        onChange={(e) => setScale(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-tiktok-pink"
                    />
                </div>

                <div className="text-sm text-gray-500 space-y-1">
                    <p>• Drag image to pan</p>
                    <p>• Use slider to zoom</p>
                    <p>• Output: 1080x1920 (9:16)</p>
                </div>

                <div className="flex flex-col gap-3 mt-auto">
                    <button
                        onClick={handleDownload}
                        className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 9.75l-3 3m0 0l3 3m-3-3h7.5M8.25 12L12 15.75 15.75 12" />
                        </svg>
                        Download Filtered Image
                    </button>

                    <button
                        onClick={onReset}
                        className="btn-secondary w-full"
                    >
                        Upload New Image
                    </button>
                </div>
            </div>

            {/* Paywall Modal */}
            {showPaywall && <Paywall onClose={() => setShowPaywall(false)} />}
        </div>
    )
}
