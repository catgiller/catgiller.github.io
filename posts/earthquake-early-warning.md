---
slug: earthquake-early-warning
title: Sensing the Fault Line: Early Ideas for an Earthquake Hackathon
category: Hackathon
date: September 6, 2026
readTime: 5 min read
excerpt: Two rough concepts I’m pitching for the Greece–Türkiye 2026 hackathon — one about listening to fiber-optic cables, one about catching fires before they spread.
---

I'm aiming to win the Greece–Türkiye 2026 hackathon, and the direction I keep coming back to is earthquake early-warning: whether physical precursor signals from fault zones — heat, micro-vibrations, strain, electromagnetic changes — can be sensed faster or more directly than current seismology manages. These are early, unrefined ideas, not a finished proposal, but writing them down is how I figure out which ones survive contact with a team.

## Idea one: listening to cables we already have

Distributed Acoustic Sensing turns ordinary fiber-optic cable into a continuous line of vibration sensors, using the fiber that's already buried along roads and coastlines. Paired with fault-line geometry, that could mean picking up micro-fracture activity near a fault without installing any new hardware. The second half of the idea is less glamorous but just as useful: a single fast site that unifies the currently scattered earthquake data sources into one place, instead of five agencies each publishing their own feed.

> The question isn't whether an earthquake can be predicted — it's whether the seconds before it are already visible in data we're not looking at yet.

## Idea two: catching fire before it spreads

The second concept is a different kind of disaster response: a laser-based smoke and fire detector that, on triggering, launches an autonomous drone to fly to the source and suppress it with water before it grows large enough for a truck to be useful. It's a further leap from "detection" to "hardware team," so it's realistically the higher-risk of the two ideas for a hackathon timeline.

| | Signal | Response | Main risk |
| - | ------ | -------- | --------- |
| DAS fault monitoring | Fiber vibration data | Unified alert dashboard | Access to real fiber/sensor data |
| Fire-drone trigger | Laser smoke detection | Autonomous drone response | Hardware scope in a hackathon window |

## Where the team goes next

1. Check what DAS or public seismic data is actually reachable before designing around it.
2. Build a small proof-of-concept for the fire-trigger logic, decoupled from the drone hardware.
3. Scope down to whichever idea has a demoable MVP by the deadline, and cut the rest.

Neither idea is proven yet — that's the point of writing this before the hackathon instead of after. If one of them turns out to be naive once the team pressure-tests it, better to find out now.
