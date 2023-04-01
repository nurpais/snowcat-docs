---
title: How to use
description: ''
---

## Overview

On a page running Snowplow right click and select Inspect, select the Snowplow Debugger (sometimes it is hidden depending on the width of your browser), refresh to capture the hits on that page.

If you are looking for TLDR see the 1 minute video below:

{% iframe width="663" height="372" src="https://www.youtube.com/embed/qmD3R3ofwxE?version=3&vq=hd1080&modestbranding=1&rel=0" /%}

## The Feature Bar

The feature bar includes the main extension functionality.

![Chrome Extension First Use](/images/bar.svg)

When you first open the extension on a live website with Snowplow, you'll have to hit refresh; the extension only captures hits if it is open.

## Hit Overview & Details

Use the main hit overview pane to observe events as they are recorded. Click on a hit to inspect it. Hits with invalid or not found schemas are highlighted in red.

Example of an event without a valid schema available for validation.

![Schema not found example](/images/not-found-detail.svg)

Example of an invalid event, with details about why it is invalid.

![Invalid event details](/images/not-valid.svg)

## Collector Override

Collector Override allows you to override the default collector and redirect the events to a new collector.

To use, click the collector override icon, add the collector to intercept hits from (original collector) and the new collector (override collector), select Enabled, and click "Apply Changes."

![Snowplow Collector Override](/images/collector-override.svg)

## Iglu Repository

When developing schemas, you can add your Iglu schemas or a custom Iglu server. The extension will use all available Iglu servers to validate hits.

![Iglu repository](/images/iglu-repository.svg)

### Adding a public accessible Iglu repository

Click the Iglu repositories icon, Add Iglu Repository, and add the URL without a trailing slash. Schemas should be accessible from that URL in URL/schemas.

You can also add an Iglu server URL https://your-iglu-server/api (don't forget to add /api to your Iglu server URL.

### Using schemas from your local drive

Did you know you can also test your schemas locally? Type `chrome://extensions/` in your Chrome URL, click Detail under the Snowplow Debugger, and enable `Allow access to file URLs`.

![Allow access to file URLs](/images/enable-file-access.png)

Click the Iglu repositories icon In your Iglu repository add the path to your local Iglu repository.

**Example:** `file:///Users/joaocorreia/Git/iglu-central/`
Try copy-pasting `file:///` into your Chrome URL bar to find your exact path
