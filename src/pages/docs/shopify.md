---
title: Shopify
description: 'Snowplow Shopify integration'
---

## Snowplow Shopify integration

{% callout%}
Check our one-click Shopify Snowplow Integration: [Snowplow Event Tracker for Shopify ](https://apps.shopify.com/snowplow-by-snowcatcloud)
{% /callout%}

---

Event tracking is separated into two components to increase accuracy. Catalog browsing and Orders. Orders and checkouts are tracked via webhooks (server to server), while catalog browsing is tracked client-side.

The implementation works by initially firing a cart token and a pageview, effectively associating the visitor (and its attributes, including marketing) with a cart id.

Once the visitor initiates the checkout, events are sent via Shopify webhooks (server to server). Because cart is linked to checkout and checkout to order, you can effectively tie catalog browsing with orders.

Download our [Snowplow Chrome Debugger](https://chrome.google.com/webstore/detail/snowplow-analytics-debugg/jbnlcgeengmijcghameodeaenefieedm?hl=en-US) to observe Snowplow events. See [docs](/snowplow-chrome-extension/install).

### Catalog browsing

Catalog browsing events are tracked client-side using Snowplow Javascript SDK.

1. Change sp.yourcollector.com to your SnowcatCloud collector.
2. Change the appId.
3. Host sp.js on your domain under a random name .js to avoid blockers (Optional).

<alert type="warning">
Test before deploying. Install our Chrome Chrome extension for easy debug (see above). Go to the Shopify website and remove the cookie "cart", if it exists. Paste the code below in the console, you should see the cart cookie created, and once you navigate to the Snowplow Debugger tab you should see a pageview with a com.shopify/cart payload. Be sure to use your valid SnowcatCloud collector.
</alert>

## Snowplow Shopify Cart Integration

The script below does two things:

- Records `domain_userid`, `network_userid` and `domain_sessionid` in the cart attributes.
- Adds a Shopify cart schema with the cart token on every pageview, effectively linking cart (and order) with Snowplow behavioral data.

```js
// Parses and returns any cookie
function getCookie(name) {
  let re = new RegExp(name + '=([^;]+)')
  let value = re.exec(document.cookie)
  return value != null ? unescape(value[1]) : null
}

// Gets Snowplow session cookie details
function getSnowplowDuid(cookieName) {
  var cookieName = cookieName || '_sp_'
  var matcher = new RegExp(cookieName + 'id\\.[a-f0-9]+=([^;]+);?')
  var match = document.cookie.match(matcher)
  var split = match[1].split('.')
  if (match && match[1]) {
    return {
      domain_userid: split[0],
      domain_sessionidx: split[2],
      domain_sessionid: split[5],
    }
  } else {
    return false
  }
}

// Initializes Snowplow (once per page load)
async function initSnowplow() {
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
  window.snowplow('newTracker', 'sp', 'sp.yourcollector.com', {
    appId: 'test',
    discoverRootDomain: true,
    cookieSameSite: 'Lax',
    contexts: {
      webPage: true,
      performanceTiming: true,
    },
  })

  // If ?userId query url param exist set it as Snowplow user id.
  // Do not use emails or PII. Hash before sending in the url.
  window.snowplow('setUserIdFromLocation', 'userId')
}

// Update/create a cart with note attributes
// for each of our SnowcatCloud cookie identifiers.
async function setAttributeAndTrackPageView() {
  // Snowplow callback, waiting to get the cookie
  window.snowplow(async function () {
    let sp = this.sp
    let domainUserId = sp.getDomainUserId()

    const result = await fetch('/cart/update.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        attributes: {
          domain_userid: domainUserId,
          network_userid: getCookie('sp') || null,
          domain_sessionid: getSnowplowDuid()['domain_sessionid'] || null,
        },
      }),
    })

    // Wait and set the cartId to the result
    const response = await result.json()
    const cartId = response.token

    let context = [
      {
        schema: 'iglu:com.shopify/cart/jsonschema/1-0-0',
        data: {
          id: cartId,
          token: cartId,
        },
      },
    ]

    window.snowplow('trackPageView', {
      context,
    })
  })
}

// Try to initSnowplow, set the cart attributes
// and track a pageview with cart context.

try {
  initSnowplow().then(setAttributeAndTrackPageView())
} catch (error) {
  console.error("Couldn't fire Snowplow with cart id")
}
```

## Shopify Cart + FingerprintJS Integration

Using Shopify + FingerprintJS will allow you to create a browser fingerprint for every device and send that information to both the cart attributes and Snowplow. This is specially useful to identify customers who delete their cookies (or cookies expire).

```js
;(async function () {
  // Parses and returns any cookie
  function getCookie(name) {
    let re = new RegExp(name + '=([^;]+)')
    let value = re.exec(document.cookie)
    return value != null ? unescape(value[1]) : null
  }

  // Gets Snowplow session cookie details
  function getSnowplowDuid(cookieName) {
    var cookieName = cookieName || '_sp_'
    var matcher = new RegExp(cookieName + 'id\\.[a-f0-9]+=([^;]+);?')
    var match = document.cookie.match(matcher)
    var split = match[1].split('.')
    if (match && match[1]) {
      return {
        domain_userid: split[0],
        domain_sessionidx: split[2],
        domain_sessionid: split[5],
      }
    } else {
      return false
    }
  }

  // Initializes Snowplow (once per page load)
  async function initSnowplow(fingerprintJS) {
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
    window.snowplow('newTracker', 'sp', 'sp.yourcollector.com', {
      appId: 'test',
      discoverRootDomain: true,
      cookieSameSite: 'Lax',
      contexts: {
        webPage: true,
        performanceTiming: true,
      },
    })

    // If ?userId query url param exist set it as Snowplow user id.
    // Do not use emails or PII. Hash before sending in the url.
    window.snowplow('setUserIdFromLocation', 'userId')

    // add FingerPrintJS plugin
    window.snowplow('addPlugin:sp', fingerprintJS, 'FingerprintContext')
  }

  // Update/create a cart with note attributes
  // for each of our SnowcatCloud cookie identifiers.
  async function setAttributeAndTrackPageView(visitor) {
    // Snowplow callback, waiting to get the cookie
    window.snowplow(async function () {
      let sp = this.sp
      let domainUserId = sp.getDomainUserId()

      const result = await fetch('/cart/update.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          attributes: {
            domain_userid: domainUserId,
            network_userid: getCookie('sp') || null,
            domain_sessionid: getSnowplowDuid()['domain_sessionid'] || null,
            'fpjs.visitorId': visitor.visitorId,
            'fpjs.confidence.score': visitor.confidence.score,
          },
        }),
      })

      // Wait and set the cartId to the result
      const response = await result.json()
      const cartId = response.token

      let context = [
        {
          schema: 'iglu:com.shopify/cart/jsonschema/1-0-0',
          data: {
            id: cartId,
            token: cartId,
          },
        },
      ]

      window.snowplow('trackPageView', {
        context,
      })
    })
  }

  try {
    // Replace with your FingerprintJS Open Source or Pro URL.
    const fp = await import('https://openfpcdn.io/fingerprintjs/v3')
    const fpJs = await fp.load()
    const result = await fpJs.get()

    // initialize FingerPrintJS
    const fingerprintJS = {
      FingerprintContext: function () {
        return {
          contexts: () => {
            return [
              {
                schema: 'iglu:com.fingerprintjs/fingerprint/jsonschema/1-0-0',
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

    // Try to initSnowplow, set the cart attributes and FingerprintJS
    // Track a pageview with cart and FingerprintJS context.
    await initSnowplow(fingerprintJS)
    await setAttributeAndTrackPageView(result)
  } catch (error) {
    console.error("Couldn't fire Snowplow!")
  }
})()
```

### Checkout & order creation

Checkout and order creation are senthrough webhooks.
In your Shopify store admin add the following webhooks:

**ORDER create**

```html
https://sp.yourcollector.com/com.snowplowanalytics.iglu/v1?aid=shopify&p=app&schema=iglu%3Acom.shopify%2Forder%2Fjsonschema%2F1-0-0&e=ue
```

## Example SQL Queries

### Behavioral Data with Cart Token

Get all the events with cart token.

```sql
// Snowflake
SELECT
  collector_tstamp
  ,domain_userid
  ,network_userid
  ,domain_sessionid
  ,mkt_campaign
  ,mkt_source
  ,mkt_medium
  ,user_ipaddress
  ,contexts_com_shopify_cart_1[0][ 'token' ] :: string as cart_token
FROM
  snowcatcloud.events
WHERE
  contexts_com_shopify_cart_1 IS NOT NULL
ORDER BY
  collector_tstamp DESC
LIMIT
  500
```

### Shopify Orders via Webhook

The query below lists all the orders that arrived via webhook. You can use the `cart_token` as a key to join with the previous query.

```sql
// Snowflake
SELECT
  collector_tstamp
  ,unstruct_event_com_shopify_order_1[ 'id' ] :: string AS order_id
  ,unstruct_event_com_shopify_order_1[ 'browser_ip' ] :: string AS browser_ip
  ,unstruct_event_com_shopify_order_1[ 'checkout_id' ] :: string AS checkout_id
  ,unstruct_event_com_shopify_order_1[ 'checkout_token' ] :: string AS checkout_token
  ,unstruct_event_com_shopify_order_1[ 'cart_token' ] :: string AS cart_token
  ,unstruct_event_com_shopify_order_1[ 'browser_ip' ] :: string AS user_ipaddress
  ,unstruct_event_com_shopify_order_1 // Inspect the entire webhook payload
FROM
  snowcatcloud.events
WHERE
  unstruct_event_com_shopify_order_1 IS NOT NULL
ORDER BY
  collector_tstamp DESC
LIMIT
  500
```

### Shopify Order Note Attributes

Flatten the Shopify order note attributes for matching with third party systems (another way to join).

```sql
// Snowflake
SELECT
  unstruct_event_com_shopify_order_1[ 'id' ] :: string AS order_id,
  LOWER(value : name):: string AS note_attribute_key,
  LOWER(value : value):: string AS note_attribute_value
FROM
  SNOWCATCLOUD.EVENTS,
  lateral flatten (
    input => unstruct_event_com_shopify_order_1[ 'note_attributes' ]
  )
WHERE
  unstruct_event_com_shopify_order_1 IS NOT NULL
LIMIT
  10
```

| ORDER_ID      | NOTE_ATTRIBUTE_KEY | NOTE_ATTRIBUTE_VALUE                 |
| ------------- | ------------------ | ------------------------------------ |
| 2063584462558 | google-clientid    | 908124534.1669126071                 |
| 2064534462558 | network_userid     | f80ae88e-6805-461c-9daf-64cb886666f9 |
| 2064534462558 | domain_userid      | e8576cd8-b53c-4f1c-bf28-75c8926df83e |
