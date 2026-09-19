const CACHE = "void-tide-pets-v160";
const ASSETS = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/data.js",
  "./js/tutorial.js",
  "./js/engine.js",
  "./js/pet-sprites.js",
  "./js/pet-icons.js",
  "./js/train-roam.js",
  "./js/ui.js",
  "./manifest.webmanifest",
  "./icons/icon.svg",
  "./assets/pets/water-idle-map.json",
  "./assets/bg/scenes/bg_idle_home_reef_1080x1920.webp",
  "./assets/bg/roam/bg_roam_base_floor_9x16.png",
  "./assets/bg/roam/bg_roam_base_floor_tile_16x9.png",
  "./assets/bg/roam/deco_roam_mid_weed_rock.png",
  "./assets/bg/roam/deco_roam_near_weed_rock.png",
  "./assets/allies/ally_jelly_idle.png",
  "./assets/enemies/enemy_foamblob_idle.png",
  "./assets/enemies/enemy_reefcrab_idle.png",
];

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      if (list.length) return list[0].focus();
      return self.clients.openWindow("./");
    })
  );
});

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((hit) => hit || fetch(e.request).catch(() => caches.match("./index.html")))
  );
});

self.addEventListener("message", (e) => {
  if (e.data && e.data.type === "SKIP_WAITING") self.skipWaiting();
});
