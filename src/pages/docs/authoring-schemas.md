---
title: Authoring Schemas
description: 'How to create Snowplow schemas'
---

## What are Schemas

Snowplow schemas are self-describing JSONs used to add additional context to events. Think of Google Analytics custom dimensions or Adobe Traffic Variables but nicely grouped under a logical name.

The grouping is essential as it provides a layer of governance, unlike sending Adhoc JSON payloads like other vendors.

Snowplow also enforces that the payload matches the schema specifications; otherwise, the event will be considered invalid.

There are several advantages:

- You will never run out of space for context
- Schemas are versioned and can expand/contract with business needs
- Schemas are reusable
- Schema variables are easy to read and understand
- Easier data modeling

{% callout type="warning" %}
Schemas are immutable. Once schemas are in production, they can't be edited or deleted. To alter a schema, you need to increment its version. This ensures compatibility with existing properties that might be sending events with existing schemas.
{% /callout %}

## Authoring Schemas

1. Download the [template schema boilerplate](https://docs.snowcatcloud.com/schemas/iglu-example-schema-registry.zip) and rename it to iglu-yourcompany-schema-registry.
2. Version your Iglu schema registry with git
3. Install [igluctl](https://github.com/snowplow-incubator/igluctl)
4. Use a code editor to author schema (e.g. VSCode)
5. Validate schemas with igluctl and [Snowplow Micro](https://github.com/snowplow-incubator/snowplow-micro)

## Best Practices

- Always validate your schemas with igluctl
- If your schema has a verb name you're doing it wrong (e.g. feature\_**click**)
