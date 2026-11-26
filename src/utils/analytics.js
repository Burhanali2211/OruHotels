// OruPos Real-time Visitor, QR Scan & Table Analytics Tracker

export function getSlug() {
  if (typeof window === 'undefined') return 'diamondcafe';
  if (window.__ORUPOS_SLUG__) return window.__ORUPOS_SLUG__;

  const hostname = window.location.hostname;
  if (hostname.endsWith('.orupos.in')) {
    const part = hostname.split('.')[0];
    if (part && part !== 'www') return part;
  }
  return 'diamondcafe';
}

export function getTable() {
  if (typeof window === 'undefined') return undefined;
  const params = new URLSearchParams(window.location.search);
  const table = params.get('table') || params.get('t');
  if (table) return table.trim();

  if (window.location.hash) {
    const hashMatch = window.location.hash.match(/(?:table|t)=([^&]+)/i);
    if (hashMatch) return decodeURIComponent(hashMatch[1]).trim();
  }
  return undefined;
}

export function trackEvent({
  eventType,
  table,
  slug,
  source,
  dishId,
  dishName,
  category,
  query,
  orderTotal,
  itemsCount
} = {}) {
  try {
    if (typeof window === 'undefined') return;

    const finalSlug = slug || getSlug();
    const finalTable = table !== undefined ? table : getTable();
    const finalSource = source || (finalTable ? 'qr' : 'link');
    const finalEventType = eventType || (finalTable ? 'scan' : 'visit');

    const payload = JSON.stringify({
      slug: finalSlug,
      table: finalTable || undefined,
      path: window.location.pathname || '/',
      eventType: finalEventType,
      source: finalSource,
      referrer: document.referrer || 'direct',
      dishId,
      dishName,
      category,
      query,
      orderTotal,
      itemsCount,
      timestamp: Date.now()
    });

    const isBeacon = typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function';

    const isLocalOrOrupos =
      window.location.hostname.endsWith('orupos.in') ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';
    const primaryUrl = isLocalOrOrupos
      ? '/api/analytics/track'
      : 'https://orupos.in/api/analytics/track';

    if (isBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      if (navigator.sendBeacon(primaryUrl, blob)) {
        return;
      }
    }

    fetch(primaryUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
      mode: 'cors'
    }).catch(() => {
      if (primaryUrl !== 'https://orupos.in/api/analytics/track') {
        fetch('https://orupos.in/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
          mode: 'cors'
        }).catch(() => {});
      }
    });
  } catch (err) {
    // Silent fail
  }
}

export function trackDishClick(dish) {
  if (!dish) return;
  trackEvent({
    eventType: 'dish_click',
    dishId: dish.id,
    dishName: dish.name,
    category: dish.category
  });
}

export function trackCartAdd(dish) {
  if (!dish) return;
  trackEvent({
    eventType: 'cart_add',
    dishId: dish.id,
    dishName: dish.name,
    category: dish.category
  });
}

export function trackSearch(query) {
  if (!query || !query.trim()) return;
  trackEvent({
    eventType: 'search',
    query: query.trim()
  });
}
