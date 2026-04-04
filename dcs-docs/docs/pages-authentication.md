# Pages and Authentication Flow

## Overview

This document explains the current page structure and authentication-related navigation in the Dorm Chores Scheduler app.

The project uses **Expo Router**, which provides file-based routing. Pages are organised inside the `app/` folder.

---

## Current Confirmed Pages in This Project Copy

Based on the current project structure, the confirmed pages include:

- `app/index.tsx`
- `app/auth/signin.tsx`
- `app/ui-tests/index.tsx`
- `app/ui-tests/button-test.tsx`
- `app/ui-tests/input-test.tsx`
- `app/ui-tests/list-item-test.tsx`
- `app/ui-tests/selector-test.tsx`
- `app/ui-tests/curved-banner-test.tsx`
- `app/ui-tests/inline-notification-test.tsx`

---

## Root Layout

**File:** `app/_layout.tsx`

### Purpose

Defines the root navigation layout for the application.

### Behaviour

- Loads Inter font families using `@expo-google-fonts/inter`
- Prevents the splash screen from hiding until fonts finish loading
- Returns the root `Stack` for navigation

### Importance

This file is the entry point for shared layout behaviour across all routes.

---

## Landing Page

**File:** `app/index.tsx`

### Purpose

Provides the initial landing page for the project.

### Behaviour

- Displays the app title
- Includes a link to the sign-in page
- Includes a link to the UI test page

### Navigation

From this page, users can move to:

- `/auth/signin`
- `/ui-tests`

---

## Sign-In Page

**File:** `app/auth/signin.tsx`

### Purpose

Provides the current authentication screen for users to sign in.

### Components Used

- `CurvedBanner`
- `Spacer`
- `Input`
- `InlineButton`
- `Button`

### Behaviour

- Stores `email` and `password` in local state
- Hides the default stack header
- Dismisses the keyboard when the user taps outside input fields
- Displays inline actions for:
  - reset password
  - sign up
- Currently logs actions using `handleAction`

### Authentication Flow

This is the main implemented authentication page in the current codebase.

---

## UI Test Pages

**Folder:** `app/ui-tests/`

### Purpose

These pages appear to exist for visual or manual component testing.

### Confirmed test pages

- `index.tsx`
- `button-test.tsx`
- `input-test.tsx`
- `list-item-test.tsx`
- `selector-test.tsx`
- `curved-banner-test.tsx`
- `inline-notification-test.tsx`

### Importance

These pages help contributors check how shared components behave in isolation.

---

## Expected Authentication Flow from Task Description

The project task states that authentication documentation should include:

- sign-in
- sign-up
- reset password

### Current implementation note

In the current project copy inspected for documentation, the fully confirmed authentication page is:

- `sign-in`

The sign-in page includes inline actions for:

- reset password
- sign up

If separate `sign-up` and `reset password` files exist in the GitHub branch being documented, they should also be described here using the same structure.

---

## Expected Main App Pages from Task Description

The task description also mentions these main pages:

- Home
- Chores
- Repairs
- Dorms
- Profile / Settings

### Current implementation note

These page names are part of the project documentation scope, but they were not all confirmed in the current local project copy that was inspected.

If those pages exist in the GitHub branch you are documenting, add a short section for each page including:

- page purpose
- key components used
- user actions supported
- related navigation links

---

## Navigation Relationships

### Confirmed current navigation

- `app/index.tsx` links to `/auth/signin`
- `app/index.tsx` links to `/ui-tests`

### Root navigation

All routes are wrapped by the root stack defined in `app/_layout.tsx`.

---

## Suggested Page Documentation Structure for Future Pages

When documenting additional pages, use this format:

### Page Name

**File:** `app/example.tsx`

**Purpose**  
Explain what the page is for.

**Components Used**  
List the main shared components used on the page.

**Behaviour**  
Explain what the user can do on the page.

**Navigation**  
Explain where the page links to and how users reach it.

---

## Summary

The current page structure shows that the app already has:

- a shared root layout
- a landing page
- a sign-in page
- a set of UI component test pages

The task description also defines additional pages and flows that should be documented in the GitHub version of the project if they are present there.
