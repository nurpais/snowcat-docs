---
title: FingerprintJS
description: 'Fingerprint JS Integration with Snowplow'
---

## Why use Snowplow with FingerprintJS

FingerprintJS can augment the context surrounding Snowplow events by adding device fingerprint information to the event. This can effectively help identify a device even when cookies have been deleted.

Augmenting Snowplow data with an additional unique identifier can be especially useful in fraud detection such as account sharing, paywall avoidance, and more (see customer knowledge graph with [Snowplow+Neo4j](https://www.snowcatcloud.com/customer-graph/)).

## Integration Options

### Option 1: Using FingerprintJS with Snowplow

Using this option you can use [open source Fingerprint JS](https://github.com/fingerprintjs/fingerprintjs) with a custom schema. We recommend that you download the file `https://openfpcdn.io/fingerprintjs/v3` and host it in your website domain.

```js
// Added so Snowplow waits for FingerprintJS
;(async () => {
  ;(function (p, l, o, w, i, n, g) {
    if (!p[i]) {
      p.GlobalSnowplowNamespace = p.GlobalSnowplowNamespace || []
      p.GlobalSnowplowNamespace.push(i)
      p[i] = function () {
        ;(p[i].q = p[i].q || []).push(arguments)
      }
      p[i].q = p[i].q || []
      n = l.createElement(o)
      g = l.getElementsByTagName(o)[0]
      n.async = 1
      n.src = w
      g.parentNode.insertBefore(n, g)
    }
  })(
    window,
    document,
    'script',
    '//cdn.jsdelivr.net/npm/@snowplow/javascript-tracker@3.4.0/dist/sp.js',
    'snowplow'
  )

  // Tracker Initialization
  snowplow('newTracker', 'sp', 'sp.yourcollector.com', {
    appId: 'your-app-id',
    discoverRootDomain: true,
    cookieSameSite: 'Lax',
  })

  // Replace with your FingerprintJS Open Source or Pro URL.
  const fp = await import('https://openfpcdn.io/fingerprintjs/v3')
  const fpJs = await fp.load()
  const result = await fpJs.get()
  console.log(
    'Fingerprint:' + result.visitorId + '  score:' + result.confidence.score
  )

  //////////////////
  // Inline Snowplow Plugin
  //////////////////

  const fingerprintJS = {
    FingerprintContext: function () {
      return {
        contexts: () => {
          return [
            {
              schema: 'com.fingerprintjs/fingerprint/jsonschema/1-0-0',
              data: {
                visitorId: result.visitorId,
                confidence: {
                  score: result.confidence.score,
                },
              },
            },
          ]
        },
      }
    },
  }

  window.snowplow('addPlugin:sp', fingerprintJS, 'FingerprintContext')
  window.snowplow('trackPageView')
})()
```

### Option 2: Using FingerprintJS Pro visitorId in Snowplow user_id

The most straightforward integration is to pass the FingerprintJS Pro visitorId to Snowplow in the user_id field. Please note that using this method, we do not capture information like confidence score and requestId in Snowplow.

Snowplow JS Tracker V3

```js
var initSnowplow = function (fpjsVisitorId) {
  // Loading tracker with the Snowplow tag
  ;(function (p, l, o, w, i, n, g) {
    if (!p[i]) {
      p.GlobalSnowplowNamespace = p.GlobalSnowplowNamespace || []
      p.GlobalSnowplowNamespace.push(i)
      p[i] = function () {
        ;(p[i].q = p[i].q || []).push(arguments)
      }
      p[i].q = p[i].q || []
      n = l.createElement(o)
      g = l.getElementsByTagName(o)[0]
      n.async = 1
      n.src = w
      g.parentNode.insertBefore(n, g)
    }
  })(
    window,
    document,
    'script',
    '//cdn.jsdelivr.net/npm/@snowplow/javascript-tracker@3.4.0/dist/sp.js',
    'snowplow'
  )

  // Tracker Initialization
  snowplow('newTracker', 'sp', 'sp.yourcollector.com', {
    appId: 'your-app-id',
    discoverRootDomain: true,
    cookieSameSite: 'Lax',
  })

  // Set the user ID
  snowplow('setUserId', fpjsVisitorId)
  snowplow('trackPageView')
}

// Replace with your FingerprintJS Open Source or Pro URL.
import('https://fpcdn.io/v3/<< YOUR KEY >>')
  .then((FingerprintJS) => FingerprintJS.load())
  .then((fp) => fp.get())
  .then((result) => initSnowplow(result.visitorId))
  .catch((error) => {
    // use your favorite error reporting tool
    reportError(err)
  })
  .finally(function () {
    // optional
    // do some guaranteed post-processing here
  })
```

### Option 3: Use FingerprintJS Pro with Snowplow self-describing event

Snowplow uses schemas to provide additional metadata to each event. SnowcatCloud created two Snowplow schemas, one for the visitor id and the other for webhooks. To use FingerprintJS Pro with Snowplow using this method (and webhooks), please [download the FingerprintJS schemas](https://github.com/SnowcatCloud/com.fingerprintjs-schema-registry) and install them in your Snowplow Pipeline.

```js
var initSnowplow = function (fpjs) {
  ;(function (p, l, o, w, i, n, g) {
    if (!p[i]) {
      p.GlobalSnowplowNamespace = p.GlobalSnowplowNamespace || []
      p.GlobalSnowplowNamespace.push(i)
      p[i] = function () {
        ;(p[i].q = p[i].q || []).push(arguments)
      }
      p[i].q = p[i].q || []
      n = l.createElement(o)
      g = l.getElementsByTagName(o)[0]
      n.async = 1
      n.src = w
      g.parentNode.insertBefore(n, g)
    }
  })(
    window,
    document,
    'script',
    '//cdn.jsdelivr.net/npm/@snowplow/javascript-tracker@3.4.0/dist/sp.js',
    'snowplow'
  )

  // Tracker Initialization
  snowplow('newTracker', 'sp', 'sp.yourcollector.com', {
    appId: 'your-app-id',
    discoverRootDomain: true,
    cookieSameSite: 'Lax',
  })

  // Set the user ID
  snowplow('setUserId', fpjs.visitorId)
  snowplow('trackSelfDescribingEvent', {
    event: {
      schema: 'iglu:com.fingerprintjs/fingerprint/jsonschema/1-0-0',
      data: {
        visitorId: fpjs.visitorId,
        visitorFound: fpjs.visitorFound,
        requestId: fpjs.requestId,
        confidence: {
          score: fpjs.confidence.score,
        },
      },
    },
  })

  console.log('====' + fpjs.visitorId + '====')
}

// Replace with your FingerprintJS Open Source or Pro URL.
import('https://fpcdn.io/v3/<< YOUR KEY >>')
  .then((FingerprintJS) => FingerprintJS.load())
  .then((fp) => fp.get())
  .then((result) => initSnowplow(result))
  .catch((error) => {
    // use your favorite error reporting tool
    reportError(err)
  })
  .finally(function () {
    // optional
    // do some guaranteed post-processing here
  })
```

### Use the Snowplow Collector to receive FingerprintJS webhooks

Snowplow collectors can also receive and process FingerprintJS webhook events (requires instalation of [FingerprintJS schemas](https://github.com/SnowcatCloud/com.fingerprintjs-schema-registry) in your Snowplow pipeline).

The FingerprintJS Pro webhook events will be processed and stored with your Snowplow event data, which you can easily query by looking for app_id=fp-webhook.

Add a webhook with the following URL (Copy paste exactly, only change the hostname to your Snowplow collector).

```html
https://collector/com.snowplowanalytics.iglu/v1?aid=fp-webhook&p=app&schema=iglu%3Acom.fingerprintjs%2Fwebhook%2Fjsonschema%2F1-0-0
```
