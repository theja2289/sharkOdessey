// Offline support for the web (GitHub Pages) version.
// Pages: network first so updates show up right away; everything else: cache, refreshed in the background.
var CACHE = "shark-odyssey-v1";
var CORE = ["./", "index.html", "manifest.json", "icon-192.png", "icon-512.png"];
// three.js and the Google fonts are safe to keep offline; Wikipedia photos are not cached
var CACHEABLE_HOSTS = ["cdnjs.cloudflare.com", "fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(CORE); }).then(function(){ return self.skipWaiting(); }));
});

self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});

self.addEventListener("fetch", function(e){
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  var sameOrigin = url.origin === self.location.origin;
  if (!sameOrigin && CACHEABLE_HOSTS.indexOf(url.hostname) === -1) return;

  if (req.mode === "navigate"){
    e.respondWith(fetch(req).then(function(res){
      var copy = res.clone();
      caches.open(CACHE).then(function(c){ c.put(req, copy); });
      return res;
    }).catch(function(){
      return caches.match(req).then(function(hit){ return hit || caches.match("index.html"); });
    }));
    return;
  }

  e.respondWith(caches.match(req).then(function(hit){
    var refresh = fetch(req).then(function(res){
      if (res.ok || res.type === "opaque"){
        var copy = res.clone();
        caches.open(CACHE).then(function(c){ c.put(req, copy); });
      }
      return res;
    });
    if (hit){ refresh.catch(function(){}); return hit; }
    return refresh;
  }));
});
