type Gtag = (...args: unknown[]) => void

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: Gtag
  }
}

const GA_MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]+$/

export function initializeGoogleAnalytics(measurementId: string | undefined) {
  if (!measurementId || !GA_MEASUREMENT_ID_PATTERN.test(measurementId)) {
    return
  }

  if (document.querySelector(`script[data-ga-id="${measurementId}"]`)) {
    return
  }

  window.dataLayer = window.dataLayer || []
  window.gtag = (...args: unknown[]) => {
    window.dataLayer.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', measurementId)

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`
  script.dataset.gaId = measurementId
  document.head.appendChild(script)
}
