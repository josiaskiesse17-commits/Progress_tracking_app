# Learning Progress App — Requirements

This document defines the minimum requirements for the MVP and acts as the acceptance checklist for the app. The app is considered complete only when all required items below are met.

## 1. Product Goal
The application is a single-user learning progress tracker and planner for personal study management.

It should help the user:
- track learning items
- monitor progress over time
- schedule study sessions
- manage deadlines and reminders
- review a weekly overview of planned learning activity

## 2. User Scope
- Single-user application
- Local-first usage
- No authentication required for the MVP
- No multi-user or team features

## 3. Core Functional Requirements

### 3.1 Learning Items
The app must allow the user to create, view, edit, and delete learning items.

Each learning item must include:
- title
- type
- status
- optional description
- optional target date
- created date
- updated date

Supported item types:
- Course
- Book
- Tutorial
- Certification
- Webinar/Event
- Practice
- Other

Supported item statuses:
- Not started
- In progress
- Completed
- Paused
- Archived

### 3.2 Study Sessions
The app must allow the user to create study sessions for a learning item.

Each study session must include:
- associated learning item
- scheduled date
- duration in minutes
- completion status
- optional notes

The system must distinguish between:
- the learning item itself
- the planned study time related to it

### 3.3 Deadlines
The app must allow a target date for each learning item.

The user must be able to see which items are due soon or overdue based on their target date.

### 3.4 Reminders / Events
The app must allow the user to create lightweight reminders for learning items.

Each reminder must include:
- title
- reminder date
- optional link
- optional notes

### 3.5 Weekly Planner / Home View
The app must have a home or planner view that shows, for the current week:
- upcoming study sessions
- deadlines
- reminders/events
- quick-add actions
- a visual indication of completed or missed sessions

### 3.6 Quick Add
The app must provide a simple path to add a new learning item or session quickly from the home/planner screen.

## 4. Non-Functional Requirements
- The app must run locally without requiring external auth or cloud services for the MVP
- The interface must be simple and readable
- The app must be usable without advanced setup steps
- The app must be maintainable and easy to extend

## 5. Out of Scope for MVP
The following are intentionally excluded from the MVP and should not be implemented before the core requirements are satisfied:
- multi-user accounts
- advanced collaboration features
- cloud sync
- external calendar integration
- AI-generated study planning
- complex nested hierarchy beyond the basic simple structure
- mobile app packaging
- advanced analytics dashboards

## 6. Definition of Done
The MVP is complete when all required features above are implemented and working, and the app supports the primary use case of tracking personal learning progress and planning study activity in a simple local tool.

## 7. Success Criteria
The app is considered successful if the user can:
- add a learning item
- change its status
- schedule a study session
- view sessions/deadlines/reminders in a planner view
- understand the current progress state without confusion

This checklist is the baseline for what counts as working and complete for this project.
