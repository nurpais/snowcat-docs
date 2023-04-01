---
title: Cloudflare
description: 'Snowplow integration with Cloudflare worker'
---

## Snowplow Cloudflare Integration

{% callout type="warning" %}
Please reach out to SnowcatCloud support and inform you plan to use Cloudflare workers before performing this setup. We need configure your pipeline to respond to the new CNAME collector.
{% /callout %}

![images](/images/cloudflare-snowplow-integration.svg) {% .bg-white .p-4 %}

Integrating Snowplow with a Cloudflare worker allows you to create a Snowplow collector firing on the same domain as your website, on a random path, thus bypassing the Safari ITP IP address limitation. See [Safari ITP](https://github.com/WebKit/WebKit/commit/b0305b173106ba984cbc0475b3681daea137390c).

Download [Safari Technology Preview](https://developer.apple.com/safari/resources/) to observe Intelligent Tracking Prevention (ITP) in action.

**WITHOUT** Cloudflare Worker (below) even though the domain is the same as the website (sp.snowcatcloud.com) the cookie is set to expire in 7 days (March 27th 2023).

![images](/images/without-cloudflare-worker.png)

**WITH** Cloudflare worker (below) the cookie is set to expire in 1 year (March 19th 2024).

![images](/images/with-cloudflare-worker.png)

{% callout type="warning" %}
Setup is straightforward but requires your website to be served through Cloudflare. Consult Workers Plans; workers is a paid service, although it has a free tier.
{% /callout %}

### Step 1: Create a CNAME for your Snowplow collector

Cloudflare worker needs a CNAME configured to your Snowplow collector; if you reference your collector hostname directly, it won't work; you'll get an HTTP error 530.

Configure a CNAME with a name like `worker-prod-collector` and content to your Snowplow collector e.g., `sp.yourdomain.com`.

### Step 2: Create a Cloudflare worker

1. Log into your Cloudflare account
2. Click Workers
3. Create a Service
4. Name the service `snowplow-collector`, select HTTP router, click Create service
5. Click Quick edit
6. Add the code below to the code editor
7. Edit COLLECTORPATH and YOURSITE.COM, where collector path is the path that will receive the Snowplow events, and NEWCNAME is a CNAME record for your collector.

Cloudflare Worker JS code

```js
// Cloudflare HTTP Router, Replace forward URL with your CNAME collector.
// And adjust pathname so a path that doesn't currently exist (this will be your Snowplow collector)
addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const { pathname } = url

  // Change the path to what you want your collector to be.
  if (pathname.startsWith('/COLLECTORPATH')) {
    const forwardUrl =
      'https://worker-prod-collector.YOURSITE.COM/com.snowplowanalytics.snowplow/tp2'
    const headers = new Headers(request.headers)

    // Remove Cloudflare specific headers that should not be forwarded
    headers.delete('CF-Connecting-IP')
    headers.delete('CF-IPCountry')
    headers.delete('CF-Ray')
    headers.delete('CF-Visitor')
    headers.delete('CF-Request-ID')

    const forwardRequest = new Request(forwardUrl, {
      method: request.method,
      headers: headers,
      body: request.body,
      redirect: 'manual',
    })

    const forwardResponse = await fetch(forwardRequest)

    // Copy the response headers from the forwarded response
    const responseHeaders = new Headers(forwardResponse.headers)
    responseHeaders.delete('content-security-policy-report-only')
    responseHeaders.delete('content-security-policy')

    // Modify the Cache-Control header to add max-age=0
    responseHeaders.set(
      'Cache-Control',
      'max-age=0, ' + headers.get('Cache-Control')
    )

    // Return the forwarded response with its original headers
    return new Response(forwardResponse.body, {
      status: forwardResponse.status,
      statusText: forwardResponse.statusText,
      headers: responseHeaders,
    })
  } else {
    const response = await fetch(request)
    return response
  }
}
```

### Step 3: Add a Worker Route

Now we'll go to the domain in Cloudflare and configure a path that will receive the Snowplow requests from the tracker, thus embedding the Snowplow collector into our website path.

1. Go to the domain in Cloudflare account (YOURSITE.COM)
2. Click **Workers Routes**
3. Click **Add route** and configure it with the following parameters:

   1. Route: `YOURSITE.COM/COLLECTORPATH*` (not the asterisk)
   2. Service: (The service you just created in the previous step)
   3. Environment: production

{% callout  type="warning" %}
As of March 2023 the free plan includes 100,000 requests per day.
{% /callout %}

### Step 4: Configure your JS Tracker

In your Snowplow initialization script, configure the `collector` and `postPath` to reflect the new collector URL and path.

```js
// Note how it points to www.yoursite.com
snowplow('newTracker', 'spc', 'www.YOURSITE.COM', {
  appId: 'aid',
  discoverRootDomain: true,
  postPath: '/COLLECTORPATH', // Collector must be configured
  cookieSameSite: 'Lax', // Recommended
  eventMethod: 'post',
  bufferSize: 1,
  cookieLifetime: 63072000,
  stateStorageStrategy: 'cookieAndLocalStorage',
  contexts: {
    webPage: true,
    performanceTiming: true,
  },
})
```

Go to www.YOURSITE.COM, while using the [Snowplow Chrome Debugger](https://chrome.google.com/webstore/detail/snowplow-analytics-debugg/jbnlcgeengmijcghameodeaenefieedm?hl=en-US) and observe the Snowplow hit, it should return 200 and you should see the cookies set with one year expiration date, even when using [Safari Technology Preview](https://developer.apple.com/safari/resources/).

If you would like to see a working example, go to [SnowcatCloud](https://www.snowcatcloud.com) and look for `polarbear` in the Network tab.
