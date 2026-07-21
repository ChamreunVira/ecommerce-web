# Design System

## Brand identity

The product should feel clear, dependable, modern, and practical: a confident commerce interface with warm orange actions balanced by neutral slate content. Prioritize clarity over decoration, especially in checkout and admin operations.

## Theme

- **Light theme is the MVP default.** Interfaces use white surfaces on a soft neutral background.
- Orange communicates primary action and focus; it is not used as the only way to convey status.
- Semantic state colors are reserved for outcomes: green for success, amber for warning/pending, rose for destructive/error, and sky/indigo for informative states.

## Color tokens

| Token | Value | Use |
| --- | --- | --- |
| Primary | `#fe8100` | Primary buttons, active pagination, focus accents |
| Primary light | `#fe972e` | Hover/accent variation |
| Primary soft | `#f3e1cc` | Subtle selected/illustrative surface |
| Background | `#f8f8f8` | Page canvas |
| Card | `#ffffff` | Cards, tables, dialogs |
| Text primary | `#242321` | Headings and essential text |
| Text secondary | `#8a8a8a` | Supporting text |
| Success | `#2bb673` | Positive states |
| Danger | `#ff4d5a` | Destructive/error states |
| Border | `#eaeaea` | Subtle boundaries |

Use Tailwind semantic utilities consistently: slate for neutral UI, orange for primary controls, emerald for success, amber for warnings, and rose for destructive outcomes.

## Typography

- Use the project sans-serif token for all UI copy; Poppins may be used only where it is intentionally configured as the display font.
- Body text: 14–16 px, normal weight, comfortable line height.
- Labels/table headings: 11–12 px, medium/semibold, legible tracking where uppercase.
- Page heading: 24 px minimum, semibold.
- Do not use font size alone to create hierarchy; combine weight, spacing, and semantic heading elements.

## Spacing and layout

- Base spacing unit: 4 px. Prefer the existing Tailwind scale (`2`, `3`, `4`, `5`, `6`, `8`).
- Standard page rhythm: 24 px between major page sections.
- Card/table padding: 16 px on small screens, 24 px at larger widths.
- Content should reflow instead of clipping. Wide data tables scroll horizontally inside their container.
- Use rounded-lg for controls and rounded-xl for prominent cards/tables. Keep borders subtle and shadows light.

## Components

### Buttons

- Primary: orange solid; used for the page’s main action.
- Secondary: white surface with a slate border.
- Destructive: rose treatment and explicit confirmation before irreversible actions.
- Every icon-only button needs an accessible `aria-label` and a visible focus state.

### Forms

- Labels are always present; placeholder text does not replace a label.
- Show validation near the affected field and explain how to fix it.
- Use orange focus border/ring with sufficient contrast.
- Disable submit controls only while a request is in progress or inputs are invalid; show request feedback.

### Tables

- Use the shared `components/Table.tsx` primitives for all application data tables.
- Tables use a white rounded card, slate header, subtle row separation, responsive overflow, and warm hover feedback.
- Include useful empty states and a record count. Server lists use the shared pagination component.
- Make status/action values compact badges; do not use color without readable text.

### Feedback

- Toasts are for transient success and non-blocking notices.
- Inline alert panels are for errors that prevent a section from loading or submitting.
- Loading state should preserve layout when possible and avoid flashing empty content.

## Motion

- Use short, purposeful transitions: 150–250 ms for hover, focus, and panel appearance.
- Do not animate layout continuously or use motion that blocks interaction.
- Respect `prefers-reduced-motion`; users who opt out should receive minimal/no nonessential animation.

## Accessibility

- Meet WCAG 2.1 AA contrast requirements for text, controls, and focus indicators.
- Use semantic HTML first: headings, buttons, labels, tables, navigation, and alerts.
- All functionality must be keyboard-accessible, including dialogs, menus, pagination, and table actions.
- Visible focus must never be removed without a replacement.
- Images require meaningful `alt` text; decorative images use empty alt text.
- Announce important asynchronous errors with `role="alert"`; provide text labels for icon-only controls.
