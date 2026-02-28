import { createContext, useContext, useEffect, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor'

const BillingContext = createContext(null)

// CONFIGURATION
const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/eVq00j4GG10S1ni6CoeAg00'
const REVENUECAT_KEYS = {
    ios: 'appl_XCRGCmBZPegiAXOGyXhMKLQKchA',
    android: 'goog_YOUR_ANDROID_API_KEY', // Add Android key here when ready
}

export const BillingProvider = ({ children }) => {
    const [isPro, setIsPro] = useState(false)
    const [loading, setLoading] = useState(true)

    const isNative = Capacitor.isNativePlatform()

    useEffect(() => {
        initBilling()
    }, [])

    const initBilling = async () => {
        if (isNative) {
            await initRevenueCat()
        } else {
            initStripeLogic()
        }
    }

    // --- STRIPE LOGIC (WEB) ---
    const initStripeLogic = () => {
        // 1. Check URL for success flag
        const queryParams = new URLSearchParams(window.location.search)
        if (queryParams.get('success') === 'true') {
            setIsPro(true)
            localStorage.setItem('tiktok-resizer-pro', 'true')
            window.history.replaceState({}, document.title, window.location.pathname)
            alert('Web Payment Successful! Pro unlocked.')
        }

        // 2. Check LocalStorage
        const storedPro = localStorage.getItem('tiktok-resizer-pro')
        if (storedPro === 'true') {
            setIsPro(true)
        }
        setLoading(false)
    }

    const handleWebCheckout = () => {
        window.location.href = STRIPE_PAYMENT_LINK
    }

    // --- REVENUECAT LOGIC (NATIVE) ---
    const initRevenueCat = async () => {
        try {
            if (Capacitor.getPlatform() === 'ios') {
                await Purchases.configure({ apiKey: REVENUECAT_KEYS.ios })
            } else if (Capacitor.getPlatform() === 'android') {
                await Purchases.configure({ apiKey: REVENUECAT_KEYS.android })
            }

            await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG })

            const customerInfo = await Purchases.getCustomerInfo()
            checkEntitlements(customerInfo)

        } catch (error) {
            console.error('RevenueCat Init Error:', error)
        } finally {
            setLoading(false)
        }
    }

    const checkEntitlements = (customerInfo) => {
        // Checking for either 'pro' or the user's explicit requested entitlement 'tictok image resized Pro'
        if (customerInfo.entitlements.active['pro'] || customerInfo.entitlements.active['tictok image resized Pro']) {
            setIsPro(true)
        } else {
            setIsPro(false)
        }
    }

    const handleNativePurchase = async () => {
        try {
            const { current } = await Purchases.getOfferings()
            if (!current || current.availablePackages.length === 0) {
                alert('No packages available. Please check your RevenueCat configuration.')
                return
            }
            // Prefer lifetime > annual > monthly > first available
            const pkg = current.lifetime
                || current.annual
                || current.monthly
                || current.availablePackages[0]

            const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg })
            // DEBUG: show active entitlement keys so we can verify the identifier
            const activeKeys = Object.keys(customerInfo.entitlements.active)
            alert('Active entitlements after purchase: ' + JSON.stringify(activeKeys))
            checkEntitlements(customerInfo)
        } catch (error) {
            console.error('Purchase failed:', error)
            const cancelled = error?.code === 'PURCHASE_CANCELLED' || error?.userCancelled
            if (!cancelled) {
                alert('Purchase failed. Please try again.')
            }
        }
    }

    const presentCustomerCenter = async () => {
        if (!isNative) {
            alert('Customer Center is only available on iOS/Android.');
            return;
        }

        try {
            const { PurchasesUI } = await import('@revenuecat/purchases-capacitor-ui');
            await PurchasesUI.presentCustomerCenter();

            // After closing Customer Center, refresh the customer info just in case they cancelled or updated a sub
            const customerInfo = await Purchases.getCustomerInfo();
            checkEntitlements(customerInfo);
        } catch (error) {
            console.error('Failed to present customer center', error);
        }
    }

    const restorePurchases = async () => {
        if (isNative) {
            try {
                const { customerInfo } = await Purchases.restorePurchases()
                checkEntitlements(customerInfo)
                alert('Purchases restored!')
            } catch (error) {
                alert('Restore failed.')
            }
        } else {
            alert('Restore not available on web (localStorage only).')
        }
    }

    // --- UNIFIED INTERFACE ---
    const initiatePurchase = () => {
        if (isNative) {
            handleNativePurchase()
        } else {
            handleWebCheckout()
        }
    }

    const debugTogglePro = () => {
        const newState = !isPro
        setIsPro(newState)
        if (!isNative) {
            if (newState) localStorage.setItem('tiktok-resizer-pro', 'true')
            else localStorage.removeItem('tiktok-resizer-pro')
        }
    }

    return (
        <BillingContext.Provider value={{
            isPro,
            loading,
            isNative,
            initiatePurchase,
            restorePurchases,
            presentCustomerCenter,
            debugTogglePro
        }}>
            {children}
        </BillingContext.Provider>
    )
}

export const useBilling = () => useContext(BillingContext)
