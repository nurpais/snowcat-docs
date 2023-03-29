---
title: Adding Identifiers in Bulk
description: 'Neo4j Snowplow Integration'
---

## Add Identifiers in Bulk

You can also enrich your behavioral identity graph with Terabytes of offline data, either yours or from third-party providers (Tapad, Experian, Verizon, etc.), by uploading CSV files into an S3 bucket.

### Identifier

The identifiers bulk graph update enables you to enrich existing identifiers by looking up an existing identifier and adding a new identifier to all the connected devices.

The identifier id property is unique per node and defined by the fields listed below:

- FingerprintJS `visitorId`
- Cookies if Available: (`_gaexp`, `cart`, `ajs_user_id`, `ajs_anonymous_id`)
- Snowplow Cookies: `domain_user`, `network_userid`,
- Snowplow `user_id`

The example below illustrates a user who submits a form, creating a data entry that associates their cookie with personal data. Note this enrichment can happen in real-time OR/AND bulk. The goal is to tie as many identifiers are possible to aggregate customer behavior across devices.

![Images](/images/identifiers.svg)

### File Upload Requirements

SnowcatCloud customers are provided with a dedicated encrypted S3 bucket to upload data files. Data is processed in real-time or in batch mode.

- No headers
- CSV file(s), gzipped
- All columns are mandatory

| Lookup Identifier Id | Source     | Name        | New Identifier Id |
| :------------------- | :--------- | ----------- | ----------------- |
| A                    | salesforce | phonenumber | B                 |

Example:

```csv
52147316-857b-489b-affd-b40dc7aead94,tapad.email.hash,email,2238fe6d9aa0a9de
b0bffd39-c6fc-46ab-9c75-659886f2bb31,tapad.email.hash,email,73f5f793711859cf
...
```
