---
title: Neo4j Snowplow Integration
description: 'Neo4j Snowplow Integration'
---

Neo4j is the world's leading open-source graph database.
Graph databases are widely used in enterprise fraud detection, real-time recommendations, social networking, marketing attribution, identity resolution, etc.
Neo4j is democratizing access to graph databases with [AuraDB](https://neo4j.com/cloud/platform/aura-graph-database/?utm_campaign=snowcatcloud&utm_source=snowcatcloud.com&utm_medium=link), an affordable cloud-hosted Neo4j.

At SnowcatCloud, we believe in the rise of graph databases, as they provide insights into the relationships between entities in a way that relational databases can't do.

We created a [Snowplow Neo4j integration](https://www.snowcatcloud.com/integrations/neo4j/) that streams Snowplow behavioral event data into your instance of Neo4j, allowing our customers to create and maintain a graph database with their behavioral event data in minutes.

## How does it work?

Events tracked in your Snowplow data stream are transformed and replicated into **your** Neo4j in real-time, which you can query using [Bloom](https://neo4j.com/product/bloom/?utm_campaign=snowcatcloud&utm_source=snowcatcloud.com&utm_medium=link) or CYPHER.

## Supported event types

| Event            | Event Name       | Vendor                         |
| :--------------- | :--------------- | :----------------------------- |
| page_view        | page_view        | com.snowplowanalytics.snowplow |
| transaction      | transaction      | com.snowplowanalytics.snowplow |
| transaction_item | transaction_item | com.snowplowanalytics.snowplow |
| identifier       | unstruct         | com.snowcatcloud.iceberg       |
