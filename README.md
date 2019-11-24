# TFS Local Alerts

A Cloudflare worker script to filter the Tasmanian Fire Service alerts RSS
feed by GPS coordinates.

It's actually filtering by the `<georss:point>` tags so you can apply this
code to any [GeoRSS](https://en.wikipedia.org/wiki/GeoRSS) RSS feed.

The script is formatted to [Standard JS](https://standardjs.com) convention.

## Why Regex?!?

Because
[HTMLRewriter](https://developers.cloudflare.com/workers/reference/apis/html-rewriter/)
is being difficult, I'll update when I get that to work :)
