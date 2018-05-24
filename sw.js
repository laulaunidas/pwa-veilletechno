
const cacheName = "veille-techno-1.2";

self.addEventListener("install",e =>{
    console.log("install",e);
    const cachePromise = caches.open(cacheName).then(cache =>{
        return cache.addAll([
            'index.html',
            'main.js',
            'style.css',
            'vendors/bootstrap4.min.css',
            'add_techno.html',
            'add_techno.js',
            'contact.html',
            'contact.js',
        ])
    });
    e.waitUntil(cachePromise);
});

self.addEventListener("activate",e =>{
    console.log("activate",e);
    // on nettoie le cache
   let cacheCleanPromise = caches.keys().then(keys => {
        keys.forEach(key => {
            if(key !== cacheName){
               return caches.delete(key);
            }
        })
    
    });
    e.waitUntil(cacheCleanPromise);
});


self.addEventListener("fetch",e =>{
    if(!navigator.onLine){
        const headers = {headers:{"Content-Type" : "text/html;charset=utf-8"}};
        e.respondWith(new Response("<h1>Pas de connexion Internet</h1> <div>Application en mode degradé. Veuillez vous connecter</div>",headers))
    }
    console.log("fetch event sur url ",e.request.url);


    // stratégie de cache only with network fallback
    // e.respondWith(
    //     caches.match(e.request).then(res => {
           
    //         if(res){
    //             console.log(`url fetchee depuis le cache ${e.request.url}`,res);
    //             return res;
    //         }
    //         return fetch(e.request)
    //         .then(newResponse => {
    //             console.log(`url recuperee sur reseau puis mis en cache ${e.request.url}`,newResponse);
    //             caches.open(cacheName)
    //             //on fait un put pour le mettre dns le cache
    //             .then(cache => cache.put(e.request,newResponse));
    //             return newResponse.clone();
    //         })
    //     })
    // );

   //strategie de network first with cache fallback
    e.respondWith(
       fetch(e.request)
       .then(res => {
        console.log(`${e.request.url}fetchee depuis le reseau`)
           caches.open(cacheName)
           .then(cache => cache.put(e.request,res))
           return res.clone();
       }).catch(err => { 
            console.log(`${e.request.url}fetchee depuis le cache`);
            return caches.match(e.request);
         })
    );
});

// self.registration.showNotification("notif depuis le SW",{
//      body : "je suis une notif persistante",
//      actions: [
//          {action:"accept", title: 'Accepter'},
//          {action:"refuse", title: 'Refuser'}
//      ]
//     });

// self.addEventListener("notificationclose",e => {
//     console.log("notif ferme",e);
// });

// self.addEventListener("notificationclick", e => {
//     if(e.action==="accept"){
//         console.log("vous avez accepté");
//     }
//     if(e.action==="refuse"){
//         console.log("vous avez refusé");
//     }else {
//         console.log("vous avez cliqué sur la notif, pas sur un bouton");
//     }
//     e.notification.close();
// })

// self.addEventListener('push', e => {
//     console.log("push event", e);
//     console.log("data envoyé par le push de devtools", e.data.text())
//     const title = e.data.text();
//     e.waitUntil(self.registration.showNotification(title,{body : "ça marche",image : "images/icons/icon-152x152.png"}));
// });


