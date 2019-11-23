# TFS Local Alerts

A Cloudflare worker script to filter the Tasmanian Fire Service alerts RSS
feed by GPS coordinates.

It's actually filtering by the `<georss:point>` tags so you can apply this
code to any [GeoRSS](https://en.wikipedia.org/wiki/GeoRSS) RSS feed.
