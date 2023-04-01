---
title: Google Analytics
description: 'Google Analytics Integration with Snowplow'
---

With the Snowplow Google Analytics integration, you can visualize your Snowplow data in Google Analytics/Data Studio.

Your product/marketing team can self-serve using the easy and familiar Google Analytics user interface to build funnels, explore audiences, marketing attribution, and user behavior.

![images](/images/google-analytics-funnel.png)

## How it works

As the Snowplow events pass through your SnowcatCloud account, we send a copy to Google Analytics with the Measurement protocol., in real-time.

The following event types are supported:

- Pageviews
- Events
- E-commerce Transactions

## Setup

The setup is straightforward. Please follow the steps:

1. Create a Universal Google Analytics Property (not Google Analytics 4)
2. Share with our team the Tracking Id (e.g. UA-XXXXXXXX-X)
3. Create custom dimensions to receive additional data
4. Its done, explore your data in Google Analytics UI, even in real-time reports

| Custom Dimension | Description                        | Example Data             |
| ---------------- | ---------------------------------- | ------------------------ |
| cd1              | ISP Autonomous System Organization | Amazon.com, Inc.         |
| cd2              | Connection Type                    | Corporate                |
| cd3              | ISP                                | Amazon.com, Inc.         |
| cd4              | ISP Organization                   | Amazon Technologies Inc. |
| cd5              | City GeoName ID                    | 5342353                  |
| cd6              | City Name                          | Del Mar                  |
| cd7              | Country Name                       | United States            |
| cd8              | Latitude                           | 32.9595                  |
| cd9              | Longitude                          | -117.265                 |
| cd10             | Timezone                           | America/Los_Angeles      |
| cd11             | Weather Code                       | USCA0982                 |
| cd12             | Postal Code                        | 92014                    |
| cd13             | Device Brand                       | Apple                    |
| cd14             | Device Name                        | Apple Macintosh          |
| cd15             | Device Class                       | Desktop                  |
| cd16             | Device CPU                         | Intel                    |
| cd17             | Operative System Name              | Mac OS X                 |
| cd18             | Operative System Version           | 10.15.7                  |
| cd19             | Browser Agent Name                 | Chrome                   |
| cd20             | Browser Agent Version              | 93.0.4577.82             |
