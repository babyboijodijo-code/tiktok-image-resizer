import { useBilling } from '../context/BillingContext'

export default function Paywall({ onClose }) {
    const { initiatePurchase, restorePurchases, debugTogglePro, isNative, presentCustomerCenter } = useBilling()

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="glass-panel w-full max-w-md p-8 relative overflow-hidden bg-gray-900 border border-gray-700">
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-tiktok-blue/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-tiktok-pink/20 rounded-full blur-3xl pointer-events-none"></div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="text-center space-y-6 relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-tiktok-blue to-tiktok-pink rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-tiktok-pink/20">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-tiktok-blue via-white to-tiktok-pink">
                        Unlock Pro Features
                    </h2>

                    <ul className="text-left space-y-3 text-gray-300 mx-auto max-w-xs">
                        <li className="flex items-center gap-3">
                            <span className="text-tiktok-blue">✓</span> Unlimited High-Res Exports
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="text-tiktok-blue">✓</span> Remove Watermarks
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="text-tiktok-blue">✓</span> Priority Support
                        </li>
                    </ul>

                    <div className="space-y-3 pt-4">
                        <button
                            onClick={initiatePurchase}
                            className="btn-primary w-full py-4 text-lg animate-pulse hover:animate-none"
                        >
                            {isNative ? 'View Subscription Options' : 'Get Pro Access'}
                        </button>
                        <p className="text-xs text-gray-500">
                            {isNative ? 'Choose Monthly, Yearly, or Lifetime.' : 'One-time payment via Stripe.'}
                        </p>

                        {isNative && (
                            <button
                                onClick={presentCustomerCenter}
                                className="w-full py-2 text-sm text-gray-400 hover:text-white transition-colors border border-gray-700 rounded-lg hover:border-gray-500"
                            >
                                Manage Subscription
                            </button>
                        )}
                    </div>

                    <div className="pt-4 border-t border-gray-800">
                        <button onClick={() => { debugTogglePro(); onClose(); }} className="text-[10px] text-gray-700 hover:text-gray-500 uppercase tracking-widest">
                            [Dev: Toggle Pro Mode]
                        </button>
                    </div>

                    <div className="flex justify-between items-center text-xs text-gray-500 pt-2 px-2">
                        <button onClick={restorePurchases} className="hover:text-white transition-colors">Restore Purchases</button>
                        <div className="space-x-4">
                            <a href="#" className="hover:text-white transition-colors">Privacy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
