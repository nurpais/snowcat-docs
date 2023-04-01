---
title: Releases
description: 'Snowplow Analytics Chrome Extension releases'
---

## v1.2.0

### 🐛 Bugfixes

- Migrated to Manifest v3.0
- Disabled caching of schemas to ease schema development
- Fixed inconsistent colors in long event list

## v1.1.0

### 🚀 Features

- Hit detail reveal Iglu repositories schema URL used for validation
- Event validation against available schemas with detailed errors
- Invalid hits are listed with red background in the overview list
- Not found schemas show additional detail on tried Iglu repositories

### 🐛 Bugfixes

- New Iglu repositories are checked without reopening the extension
- Protocol is removed automatically if added to collector hostnames

## v1.0.1

### 🚀 Features

- Added support for custom Iglu repositories

## v1.0.0

We made it! ✨

- Hit inspection, sort and filter
- Custom schema validation
