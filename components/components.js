export async function loadComponent(selector, url) {
  const host = document.querySelector(selector);
  if (!host) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${url}`);
    const html = await res.text();
    host.outerHTML = html;
    return true;
  } catch (e) {
    console.error('Component load error:', e);
    return false;
  }
}

export async function loadLayout() {
  // Load components in parallel
  await Promise.all([
    loadComponent('header', 'components/header.html'),
    loadComponent('#consent-banner', 'components/consent-banner.html')
  ]);
}
