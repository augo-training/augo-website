declare global {
    interface Window {
        /**
         * Set by scripts/prerender.ts before the page loads. Signals that the app is
         * being snapshotted by Puppeteer at build time, so anything non-deterministic
         * — notably the IP-based geo lookup — must be skipped.
         */
        __PRERENDER__?: boolean
    }
}

export {}
