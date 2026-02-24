import { useState } from 'react'
import ImageUploader from './components/ImageUploader'
import ImageEditor from './components/ImageEditor'
import Paywall from './components/Paywall'
import { BillingProvider, useBilling } from './context/BillingContext'

function AppContent() {
  const [image, setImage] = useState(null)
  const { isPro } = useBilling()
  const [showPaywall, setShowPaywall] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white selection:bg-tiktok-pink selection:text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl relative">
        <header className="text-center mb-12 relative">
          {!isPro && (
            <div className="absolute top-0 right-0">
              <button
                onClick={() => setShowPaywall(true)}
                className="bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold py-2 px-4 rounded-full border border-gray-700 transition-colors"
              >
                Get Pro
              </button>
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 animate-fade-in pt-8 md:pt-0">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-tiktok-blue via-white to-tiktok-pink">
              TikTok Image Resizer
            </span>
          </h1>
          <p className="text-gray-400 text-lg animate-slide-up">
            Resize your images to the perfect 9:16 aspect ratio in seconds.
          </p>
        </header>

        <main className="glass-panel p-6 md:p-8 animate-slide-up backdrop-blur-xl bg-gray-900/40 border-gray-800">
          {!image ? (
            <ImageUploader onUpload={setImage} />
          ) : (
            <ImageEditor image={image} onReset={() => setImage(null)} />
          )}
        </main>

        <footer className="text-center mt-12 text-gray-600 text-sm">
          <p>&copy; {new Date().getFullYear()} TikTok Image Resizer. content not affiliated with TikTok.</p>
        </footer>

        {showPaywall && <Paywall onClose={() => setShowPaywall(false)} />}
      </div>
    </div>
  )
}

function App() {
  return (
    <BillingProvider>
      <AppContent />
    </BillingProvider>
  )
}

export default App
