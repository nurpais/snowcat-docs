---
title: Collecting Data
description: 'Collecting data with Snowplow'
---

## More than 20 SDKs available

Snowplow has [20 SDKs](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/) available for different programming languages. You can collect events client-side and/or server-side.

---

## Google Tag Manager Custom Templates

Snowplow created two GTM templates to facilitate the implementation of Snowplow within Google Tag Manager. Please see their [documentation](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/google-tag-manager-custom-template/) for complete reference.

- [Snowplow Analytics Settings](https://tagmanager.google.com/gallery/#/owners/snowplow/templates/snowplow-gtm-custom-template-settings)
- [Snowplow Analytics](https://tagmanager.google.com/gallery/#/owners/snowplow/templates/snowplow-gtm-custom-template)

---

## Javascript Tracker

Please read the complete documentation on [Snowplow v2 JS Tracker](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v2/) and [Snowplow v3 JS Tracker](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/).

Tracking events is simple, first load the sp.js tracker, then initialize it, and it is ready to track events.

{% callout type="warning" %}
Snowplow recommends renaming sp.js as this file name is commonly blocked by adblockers. Renaming to a random string will help ensure the JavaScript Tracker is loaded as expected. It is also recommended to host the Javascript tracker under your domain.
{% /callout %}

Tracker setup and initialization with basic options.

{% tabs %}

{% tab label="Javascript v2" %}

```html
<script type="text/javascript" async="1">
  // Load the Tracker V2
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
    '//cdn.jsdelivr.net/gh/snowplow/sp-js-assets@2.18.0/sp.min.js',
    'snowplow'
  )

  // Initialization
  window.snowplow('newTracker', 'cf', 'sp.yourcollector.com', {
    appId: 'yourappid',
    discoverRootDomain: true,
    cookieSameSite: 'Lax', // Recommended
    contexts: {
      webPage: true,
    },
  })
</script>
```

{% /tab %}

{% tab label="Javascript v3" %}

```html
<script type="text/javascript" async="1">
  // Load the Tracker V3
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
    '//cdn.jsdelivr.net/npm/@snowplow/javascript-tracker@3.4.0/dist/sp.min.js',
    'snowplow'
  )

  // Initialization
  window.snowplow('newTracker', 'sp', 'sp.yourcollector.com', {
    appId: 'yourappid',
    discoverRootDomain: true,
    cookieSameSite: 'Lax', // Recommended
    contexts: {
      webPage: true, // default, can be omitted
    },
  })
</script>
```

{% /tab %}

{% /tabs %}

Tracking a page view, and a page view with schema.

{% tabs %}

{% tab label="Pageview" %}

```html
<script>
  window.snowplow('trackPageView')
</script>
```

{% /tab %}

{% tab label="Pageview v2 w/ Schema" %}

```html
<script>
  var context = [
    {
      schema: 'iglu:com.vendor/schema_name/jsonschema/1-0-0',
      data: {
        datapoint: 'Value',
        second_datapoint: 'Other value',
      },
    },
  ]

  window.snowplow('trackPageView', null, context)
</script>
```

{% /tab %}

{% tab label="Pageview v3 w/ Schema" %}

```html
<script>
  var context = [
    {
      schema: 'iglu:com.vendor/schema_name/jsonschema/1-0-0',
      data: {
        datapoint: 'Value',
        second_datapoint: 'Other value',
      },
    },
  ]

  window.snowplow('trackPageView', { context })
</script>
```

{% /tab %}

{% /tabs %}
