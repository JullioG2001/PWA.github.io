var staticCacheName = "pwa";

var contentToCache = ["/",
"splash.html",
"offline.html",
"icon512.png"];

self.addEventListener("install", function(e){
    e.waitUntil(
        caches.open(staticCacheName).then(function(cache){
            return cache.addAll(contentToCache);
        })
    );
});


self.addEventListener("fetch", function(event){
    console.log("Conexion: " + navigator.onLine);

    if(!navigator.onLine){
        event.respondWith(
            caches.match("splash.html").then(function (response){
                return caches.match("offline.html");
            })
        );

    }else{
        event.respondWith(
            caches.match(event.request).then( function (response){
                return response || fetch(event.request).then( function (respuesta){
                    return caches.open(staticCacheName).then( function(cache){
                        cache.put(event.request,respuesta.clone());
                        return respuesta;
                    });
                });
            })
        );
    }

    

});