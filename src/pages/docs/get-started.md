---
title: Get Started
description: Welcome to SnowcatCloud! Your pipeline is now ready to run; congratulations!
---

Welcome to SnowcatCloud! Your pipeline is now ready to run; congratulations! {% .lead %}

Let's start by getting familiar with the data that will soon be getting to your data warehouse.

---

## Getting Familiar with the data

Before you start tracking events, please spend some time getting familiar with what the data will look like. Please visit [Snowplow Canonical Event Model](https://docs.snowplow.io/docs/understanding-your-pipeline/canonical-event/) to get familiarized with the data in the events table.

{% callout %}
Notice the events table will have some empty fields depending on the SDK you are using. Most of the information will be available through additional tables or columns, depending on your data warehouse.
{% /callout %}

In SnowcatCloud, beyond the default Snowplow events table, you will also see other tables (or columns depending on your data warehouse) that provide additional information about the events.

The information in these tables is produced by SnowcatCloud enrichments.

---

## Enrichments

- [YAUAA (User-Agent Parser)](#yauaa)
- [DBIP ISP and Location](#db-ip-isp-and-location)
- [Campaign attribution](#campaign-attribution)
- [Cookie extractor](#cookie-extractor)
- [HTTP header extractor](#http-header-extractor)
- [Referrer Parser](#referrer-parse)

### YAUAA

[YAUAA](https://yauaa.basjes.nl/) is a user agent parser that extracts the most information from any given user-agent string. Please visit this [website](https://try.yauaa.basjes.nl/) for a demo.

**How to query**

{% tabs %}

{% tab label="Snowflake" %}

```sql
SELECT
  contexts_nl_basjes_yauaa_context_1[0].deviceBrand::varchar
FROM schema.events
LIMIT 10
```

{% /tab %}

{% tab label="BigQuery" %}

```sql
SELECT
  yauaa.*
FROM `projectId.dataset.table`,
UNNEST (contexts_nl_basjes_yauaa_context_1_0_2) AS yauaa
LIMIT 10
```

{% /tab %}

{% tab label="Redshift" %}

```sql
SELECT
    n.device_brand
FROM schema.table e
LEFT JOIN nl_basjes_yauaa_context_1 n
ON e.collector_tstamp = n.root_tstamp AND e.event_id = n.root_id
LIMIT 10
```

{% /tab %}

{% /tabs %}

---

### DB-IP ISP and Location

SnowcatCloud uses DB-IP.com, a premium geolocation database, to enrich every event with detailed information about location and ISP.

Context: **contexts_com_dbip_isp_1_0_0** and **contexts_com_dbip_location_1_0_0**

- Internet Service Provider
- Country
- City
- ZIP
- Latitude and Longitude
- ...

**How to query**

{% tabs %}

{% tab label="Snowflake" %}

```sql
SELECT
   CONTEXTS_COM_DBIP_LOCATION_1[0].city.names.en::varchar AS city
  ,CONTEXTS_COM_DBIP_ISP_1
FROM schema.events
LIMIT 10
```

{% /tab %}

{% tab label="BigQuery" %}

```sql
SELECT
location.*
,isp.*
FROM `projectId.dataset.table`,
UNNEST (contexts_com_dbip_location_1_0_0) AS location,
UNNEST (contexts_com_dbip_isp_1_0_0) AS isp
LIMIT 10
```

{% /tab %}

{% tab label="Redshift" %}

```sql
SELECT
loc."city.names.en"
,isp."traits.isp"
FROM schema.events e
LEFT JOIN schema.com_dbip_location_1 loc
ON e.collector_tstamp = loc.root_tstamp
AND e.event_id = loc.root_id
LEFT JOIN schema.com_dbip_isp_1 isp
ON e.collector_tstamp = isp.root_tstamp
AND e.event_id = isp.root_id
LIMIT 10
```

{% /tab %}

{% /tabs %}

---

### Campaign Attribution

Campaign attribution automatically extracts UTM parameters from the URL. It also records gclid, msclkid, and dclid.

| Field            | Description                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------- |
| **mkt_campaign** | utm_campaign, the advertising campaign                                                      |
| **mkt_medium**   | utm_medium, the marketing medium                                                            |
| **mkt_source**   | Identifies the advertiser, site, publication, etc. that is sending traffic to your property |
| **mkt_term**     | utm_term, identifies keywords (terms)                                                       |
| **mkt_content**  | utm_content, Used to differentiate similar content (ad groups)                              |
| **mkt_clickid**  | The individual click ID                                                                     |
| **mkt_network**  | The advertising network name                                                                |

Please read more about the campaign attribution enrichment in the Snowplow documentation website: [Campaign attribution enrichment](https://docs.snowplowanalytics.com/docs/enriching-your-data/available-enrichments/campaign-attribution-enrichment/).

---

### Cookie Extractor

We extract the following cookies. You can find them in the context: **contexts_org_ietf_http_cookie_1_0_0**

- \_gaexp
- cart
- ajs_user_id
- ajs_anonymous_id"

**How to query**

{% tabs %}

{% tab label="Snowflake" %}

```sql
SELECT
CONTEXTS_ORG_IETF_HTTP_COOKIE_1[0].name::varchar AS name
,CONTEXTS_ORG_IETF_HTTP_COOKIE_1[0].value::varchar AS value
FROM schema.events
WHERE CONTEXTS_ORG_IETF_HTTP_COOKIE_1[0].name = '_gaexp'
LIMIT 10
```

{% /tab %}

{% tab label="BigQuery" %}

```sql
SELECT
h.name
,h.value
FROM `projectId.dataset.table`
,UNNEST (contexts_org_ietf_http_cookie_1_0_0) AS h
WHERE h.name = '_gaexp'
LIMIT 10
```

{% /tab %}

{% tab label="Redshift" %}

```sql
SELECT
h.name
,h.value
FROM schema.events e
LEFT JOIN schema.contexts_org_ietf_http_cookie_1_0_0 h
ON e.collector_tstamp = h.root_tstamp AND e.event_id = h.root_id
WHERE h.name = '_gaexp'
LIMIT 10
```

{% /tab %}

{% /tabs %}

---

### HTTP header extractor

We extract the following headers. You can find them in the context: **contexts_org_ietf_http_header_1_0_0**

- Host
- Origin
- Referer
- User-Agent
- X-Forwarded-For
- X-Shopify-Topic

**How to query**

{% tabs %}

{% tab label="Snowflake" %}

```sql
SELECT
CONTEXTS_ORG_IETF_HTTP_HEADER_1[0].name::varchar AS name
,CONTEXTS_ORG_IETF_HTTP_HEADER_1[0].value::varchar AS value
FROM schema.events
WHERE CONTEXTS_ORG_IETF_HTTP_HEADER_1[0].name = 'X-Forwarded-For'
LIMIT 10
```

{% /tab %}

{% tab label="BigQuery" %}

```sql
SELECT
h.name
,h.value
FROM `projectId.dataset.table`
,UNNEST (contexts_org_ietf_http_header_1_0_0) AS h
WHERE h.name = 'X-Forwarded-For'
LIMIT 10
```

{% /tab %}

{% tab label="Redshift" %}

```sql
SELECT
h.name
,h.value
FROM schema.events e
LEFT JOIN schema.org_ietf_http_header_1 h
ON e.collector_tstamp = h.root_tstamp AND e.event_id = h.root_id
WHERE h.name = 'X-Forwarded-For'
LIMIT 10
```

{% /tab %}

{% /tabs %}

### Referrer Parser

This enrichment uses Snowplow [referer-parser library](https://github.com/snowplow-referer-parser/referer-parser) to extract attribution data from referer URLs.

| Field           | Description                                                          |
| --------------- | -------------------------------------------------------------------- |
| **refr_medium** | Type of referer. Examples : Search, Internal, Unknown, Social, Email |
| **refr_source** | Name of referer if recognised. Examples: Google, Facebook            |
| **refr_term**   | Keywords if source is a search engine                                |

Please read more about the referrer parser on Snowplow documentation website. [Referer parser enrichment](https://docs.snowplowanalytics.com/docs/enriching-your-data/available-enrichments/referrer-parser-enrichment/)
