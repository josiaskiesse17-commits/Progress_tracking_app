# Learning Progress App — Project Scope

## Core Concept
A personal learning management system combining:
- Tracking (progress on learning items)
- Planning (calendar sessions + deadlines)
- Resources (links, webinars, reminders)

## Learning Item Types
Course · Book · Tutorial · Certification · Webinar/Event · Practice · Other
(Small, extensible type system; hierarchy is flexible regardless of type)

## Structure
Flexible + hierarchy: any learning item can contain sub-items
(e.g., Course → Module → Lesson)

## Item Status
Not started → In progress → Completed → Paused → Archived

## Planning
- Deadlines: target dates for finishing items
- Sessions: scheduled study time on the calendar
- These are kept as separate concepts

## Reminders & Links
- Lightweight reminders with a link (e.g., "webinar Sept 15")
- Important events can be promoted to calendar items
- Dates can be auto-detected from pasted links/titles (power feature)

## Home / Planner
Opens on the current week, showing:
- Calendar sessions
- Deadlines
- Events/reminders
- Quick-add button
- Visual indication of completed/missed sessions
