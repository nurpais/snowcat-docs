---
title: Adding a Group
description: 'Adding a Group to your device'
---

Devices can be associated with one or more groups. Each group has a unique id and a name.

You can use groups for account-based marketing, where you associate a device to a company name (provided by Clearbit, for example).

Below is an example of how you can add a device to a group.

{% tabs %}

{% tab label="Pageview" %}

```html
<script>
  window.snowplow('trackPageView')
</script>
```

{% /tab %}

{% tab label="JS Tracker v2" %}

```html
<script>
  var context = [
    {
      schema: 'iglu:com.snowcatcloud.iceberg/group/jsonschema/1-0-0',
      data: {
        id: 'unique-group-id',
        name: 'Group Name',
      },
    },
  ]

  window.snowplow('trackPageView', null, context)
</script>
```

{% /tab %}

{% tab label="JS Tracker v3" %}

```html
<script>
  var context = [
    {
      schema: 'iglu:com.snowcatcloud.iceberg/group/jsonschema/1-0-0',
      data: {
        id: 'unique-group-id',
        name: 'Group Name',
      },
    },
  ]

  window.snowplow('trackPageView', { context })
</script>
```

{% /tab %}

{% /tabs %}
