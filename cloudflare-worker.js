addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {

  const parsedUrl = new URL(request.url)
  if (!parsedUrl.searchParams.has('lat')) {
    return new Response('Missing "lat" latitude parameter - eg "-42.131"', { status: 403 })
  }
  const centreLat = Number(parsedUrl.searchParams.get('lat'))
  if (isNaN(centreLat)) {
    return new Response('Invalid "lat" latitude parameter - eg "-42.131"', { status: 403 })
  }

  if (!parsedUrl.searchParams.has('lon')) {
    return new Response('Missing "lon" longitude parameter - eg "143.23"', { status: 403 })
  }
  const centreLon = Number(parsedUrl.searchParams.get('lon'))
  if (isNaN(centreLon)) {
    return new Response('Invalid "lat" longitude parameter - eg "143.23"', { status: 403 })
  }

  if (!parsedUrl.searchParams.has('radius')) {
    return new Response('Missing "radius" (kilometers) parameter - eg "20"', { status: 403 })
  }
  const radius = Number(parsedUrl.searchParams.get('radius'))
  if (isNaN(radius)) {
    return new Response('Invalid "radius" (kilometers) parameter - eg "20"', { status: 403 })
  }

  const source = 'http://fire.tas.gov.au/Show?pageId=colBushfireSummariesRss'

  return fetch(source)
    .then(function (response) {
      if (response.ok) {
        return response.text()
      }
    })
    .then(function(xml) {
      const headerRegex = /(\<rss.*?)\<item\>/s
      const itemRegex = /\<item\>.*?\<\/item\>/sg

      const header = xml.match(headerRegex)[1]
      const sourceItems = xml.match(itemRegex)

      const filteredItems = sourceItems.filter((item) => {
        const itemLatLon = latLon(item)
        const itemDistance = distance(centreLat, centreLon, itemLatLon.lat, itemLatLon.lon, 'K')
        return itemDistance <= radius
      })

      const filteredFeed = header + filteredItems.join('') + '</channel></rss>'

      var response = new Response(filteredFeed, {status: 200})
      response.headers.set('Content-Type', 'text/xml;charset=UTF-8')
      return response
    })
}

function latLon(rssItem) {
  const latLonRegex = /\<georss:point\>([0-9.-]+) ([0-9.-]+)\<\/georss:point\>/
  const data = rssItem.match(latLonRegex)
  return {
    lat: Number(data[1]),
    lon: Number(data[2])
  }
}

function distance(lat1, lon1, lat2, lon2, unit) {
  if ((lat1 == lat2) && (lon1 == lon2)) {
    return 0;
  }
  else {
    var radlat1 = Math.PI * lat1/180;
    var radlat2 = Math.PI * lat2/180;
    var theta = lon1-lon2;
    var radtheta = Math.PI * theta/180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist;
  }
}