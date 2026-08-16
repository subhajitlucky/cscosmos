/* global document */
import { useEffect } from 'react';

const DEFAULT_TITLE = 'MathML Cosmos - Visual Math for Machine Learning';
const DEFAULT_DESCRIPTION = 'Learn math for machine learning through interactive visualizations. Master linear algebra, probability, and statistics with intuitive animations.';

export function useSEO({ 
  title, 
  description = DEFAULT_DESCRIPTION,
  image = '/og-image.png',
  url,
}) {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    // Update document title
    document.title = title ? `${title} | MathML Cosmos` : DEFAULT_TITLE;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');

    if (ogTitle) ogTitle.setAttribute('content', title || DEFAULT_TITLE);
    if (ogDescription) ogDescription.setAttribute('content', description);
    if (ogImage) ogImage.setAttribute('content', image);
    if (ogUrl && url) ogUrl.setAttribute('content', url);

    // Update Twitter cards
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    
    if (twitterTitle) twitterTitle.setAttribute('content', title || DEFAULT_TITLE);
    if (twitterDescription) twitterDescription.setAttribute('content', description);

    // Cleanup - restore defaults when unmounting
    return () => {
      if (typeof document !== 'undefined') {
        document.title = DEFAULT_TITLE;
      }
    };
  }, [title, description, image, url]);
}

export default useSEO;
