# Frontend Components

## Overview

The Dorm Chores Scheduler frontend uses a reusable component-based structure built with React Native and Expo. The shared components in the `components/` folder are used to keep the user interface consistent, reduce duplication, and make future development easier.

In the current project structure, the main reusable components are:

- `Button.tsx`
- `CurvedBanner.tsx`
- `HeaderBackButton.tsx`
- `InlineButton.tsx`
- `InlineNotification.tsx`
- `Input.tsx`
- `InputCode.tsx`
- `ListItem.tsx`
- `Selector.tsx`
- `Spacer.tsx`

---

## Button

**File:** `components/Button.tsx`

### Purpose

Provides a reusable button for primary and secondary actions across the app.

### Props

- `title: string` — text shown on the button
- `onPress: () => void` — function called when the button is pressed
- `variant?: 'standard' | 'secondary' | 'tertiary' | 'danger'` — visual style
- `style?: ViewStyle` — optional wrapper styling
- `textStyle?: TextStyle` — optional text styling
- `disabled?: boolean` — disables interaction when true

### Behaviour

- Uses four visual variants: standard, secondary, tertiary, and danger
- Supports a disabled state
- Shows a pressed border highlight using internal `isPressed` state
- Uses shared colours from `constants/colours`

### Usage Notes

This component should be used instead of creating one-off buttons in pages, so button styling remains consistent across the app.

---

## CurvedBanner

**File:** `components/CurvedBanner.tsx`

### Purpose

Provides the decorative curved banner used at the top of screens, especially authentication screens.

### Props

- `variant?: 'large' | 'medium' | 'small'`
- `height?: number`
- `style?: ViewStyle`

### Behaviour

- Renders a curved ellipse-like shape using a styled `View`
- Supports predefined size variants
- Supports optional height override
- Used for visual branding and layout hierarchy

### Usage Notes

This component is primarily decorative and should be reused anywhere the app needs the same branded header style.

---

## HeaderBackButton

**File:** `components/HeaderBackButton.tsx`

### Purpose

Provides a reusable back-navigation button for page headers.

### Props

- `onPress?: () => void`
- `style?: object`
- `iconColor?: string`
- `backgroundColor?: string`
- `iconName?: keyof FontAwesome5.glyphMap`

### Behaviour

- Uses Expo Router navigation by default
- Falls back to `router.back()` when no custom `onPress` is supplied
- Supports icon and colour customisation

### Usage Notes

Use this component in screens that need a consistent back button rather than creating custom navigation controls in each page.

---

## InlineButton

**File:** `components/InlineButton.tsx`

### Purpose

Provides a lightweight button that can be placed inline with normal text.

### Behaviour

- Intended for smaller actions embedded in sentences or helper text
- Suitable for links such as “Reset password” or “Sign up”

### Usage Notes

This component is best used inside text blocks where a full-sized button would be visually too heavy.

---

## InlineNotification

**File:** `components/InlineNotification.tsx`

### Purpose

Displays short inline feedback messages such as success, warning, or error messages.

### Behaviour

- Designed for contextual messaging inside forms and page content
- Can be used with validation results or status feedback

### Usage Notes

This component should be used to surface validation or action feedback close to the relevant UI element.

---

## Input

**File:** `components/Input.tsx`

### Purpose

Provides a reusable text input field for forms.

### Common Usage

- Email input
- Password input
- General text entry

### Behaviour

- Accepts user text input
- Supports secure text entry for password fields
- Used in authentication forms such as sign-in

### Usage Notes

This component should be the default input used in forms so that spacing, colours, and text behaviour remain consistent.

---

## InputCode

**File:** `components/InputCode.tsx`

### Purpose

Provides an input field designed for code entry, such as verification or reset codes.

### Behaviour

- Intended for short structured values
- Likely to be used in password reset or account verification flows

### Usage Notes

Use this component when the user is entering a short code rather than free-form text.

---

## ListItem

**File:** `components/ListItem.tsx`

### Purpose

Provides a reusable list row for displaying structured content such as chores, repair items, or other records.

### Behaviour

- Supports repeated list-based page layouts
- Helps standardise item presentation across the app

### Usage Notes

This component should be used in pages that render collections of records so that lists have a consistent visual pattern.

---

## Selector

**File:** `components/Selector.tsx`

### Purpose

Provides a reusable option selector using card-style items.

### Props

- `options` — array of selectable options
- `selectedId` — currently selected option id
- `onSelect` — callback when an option is selected

### Behaviour

- Renders selectable option cards
- Highlights the selected card with a thicker border and focus colour
- Uses icon, title, and subtitle content for each option

### Usage Notes

This component is useful when the user must choose one option from a small predefined set.

---

## Spacer

**File:** `components/Spacer.tsx`

### Purpose

Provides consistent vertical spacing between UI elements.

### Props

- `size?: 'large' | 'medium' | 'small'`
- `height?: number`
- `style?: ViewStyle`

### Behaviour

- Supports predefined spacing sizes
- Allows a custom height override
- Helps keep layout spacing consistent across screens

### Usage Notes

Use `Spacer` instead of hardcoding random margins between components.

---

## Component Design Summary

The current component system improves the project in four main ways:

1. **Reusability** — shared UI patterns only need to be implemented once
2. **Consistency** — pages use the same interaction and styling rules
3. **Maintainability** — UI updates can be made in one place
4. **Scalability** — future pages can reuse the same building blocks
