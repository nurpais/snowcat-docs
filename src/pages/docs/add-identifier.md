---
title: Adding an Identifier
description: 'Adding an Identifier to your device'
---

To build your identity graph, you should take every opportunity where the user identifies itself to create a link between the device and the identifier.

This will make identity stitching and aggregating behavioral event data for a given user significantly easier.

The identifier id property is unique per Identifier node and defined by the fields listed below:

- FingerprintJS `visitorId`
- Cookies if Available: (`_gaexp`, `cart`, `ajs_user_id`, `ajs_anonymous_id`)
- Snowplow Cookies: `domain_user`, `network_userid`,
- Snowplow `user_id`

But you can also **add your own, by sending a self describing event** to your Snowplow collector.

For example, a user on a website is prompted to input an e-mail or phone number; these are strong identifiers you can later use to join with backend data. As the user inputs the e-mail or phone, you can trigger an event that will associate that information with the device they are currently using.

<div class="w-full text-center">
<img class="w-5/6 m-auto" src="/integrations/identifier.svg" />
</div>

![Images](/images/identifier.svg)

```html
<form>
  <input type="text" id="email" name="email" onblur="addIdentifier()" />
</form>

<script>
  // Function to trigger a Snowplow event with the identifier
  function addIdentifier() {
    // Consider hashing the identifier
    var email = document.getElementById('email').value
    // Snowplow JS Tracker V3.x
    // Fire a self describing event adding an identifier
    snowplow('trackSelfDescribingEvent', {
      event: {
        schema: 'iglu:com.snowcatcloud.iceberg/identifier/jsonschema/1-0-0',
        data: {
          id: email, // IDENTIFIER
          name: 'email', // NAME
          source: 'contact.form', // SOURCE
        },
      },
    })
  }
</script>
```

**WHERE**

- IDENTIFIER is a string with the actual identifier (e.g. hashed email, phone number, etc.)
- NAME is a string with the name of the identifier (e.g. email, phone, etc.)
- SOURCE is a string with identifying the source of the identifier (e.g. salesforce, website)
