// SW Version
const version = '1.0'

// Static Cache - App Shell
const appAssets = [
  'index.html',  
  'css/all.css',
  'images/baseline_arrow_drop_down_black_18dp.png',
  'images/baseline_keyboard_arrow_left_white_24dp.png',
  'images/favicon.ico',
  'images/search-24px.svg',
  'js/all.js',
  'https://unpkg.com/leaflet@1.6.0/dist/leaflet.css',
  'https://cdn.jsdelivr.net/npm/leaflet.locatecontrol@0.70.0/dist/L.Control.Locate.min.css',
  'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.4.1/MarkerCluster.Default.css', 
  'https://kit.fontawesome.com/a8db6722b2.js',
  'https://unpkg.com/leaflet@1.6.0/dist/leaflet.js',
  'https://cdn.jsdelivr.net/npm/leaflet.locatecontrol@0.70.0/dist/L.Control.Locate.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.4.1/leaflet.markercluster.js'
]

// SW Install
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(`static-${version}`)
      .then(cache => cache.addAll(appAssets))
  )
})

// SW Activate
self.addEventListener('activate', e => {
  // Clean static cache
  let cleaned = caches.keys().then(keys => {
    keys.forEach(key => {
      if (key !== `static-${version}` && key.match('static-')) {
        return caches.delete(key)
      }
    })
  })
  e.waitUntil(cleaned)
})

// SW Fetch
self.addEventListener('fetch', e => {
  // App shell
  if (e.request.url.match(location.origin)) {
    e.respondWith(staticCache(e.request))
  }
})

// Static cache strategy - Cache First / Cache with Network Fallback
const staticCache = req => {
  return caches.match(req).then(cacheRes => {
    
    // Return cached response if found
    if(cacheRes) return cacheRes

    // Fall back to network
    return fetch(req).then(networkRes => {

      // Update cache with new response
      caches.open(`static-${version}`)
      .then(cache => cache.put(req, networkRes))

      // Return Clone of Network Response
      return networkRes.clone()
    })

  })
}