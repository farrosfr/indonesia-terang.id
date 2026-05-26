# Design Guidelines - Indonesia Terang

## Technology Stack
- **Astro:** Framework for high-performance content-driven websites.
- **UnoCSS:** Next-generation atomic CSS engine, providing high-performance styling with Tailwind compatibility.
- **Shadcn UI:** Accessible and customizable UI components built with React and Radix UI.
- **React:** Used for interactive components and Shadcn UI integration.

## Visual Identity
The design of Indonesia Terang is focused on **Cleanliness, Sustainability, and Accessibility**.

### Color Palette
- **Primary Green:** `#08713f` (Used for branding and key CTAs)
- **Dark Background:** `#071611` (Used for header and footer)
- **Light Background:** `#f8fcfb` (Main content area)
- **Accent Yellow:** `#f7b500` (Used for highlights and icons)

### Shadcn UI Themes
We use the **Slate** base color for Shadcn components, customized to align with our branding. CSS variables are defined in `src/styles/global.css`.

### Typography
- **Headings:** Sans-serif, bold, tight tracking.
- **Body:** Sans-serif, legible line-height (1.6), readable on all devices.

### Components
- **Shadcn UI:** Use for complex components like Modals, Tooltips, and Forms.
- **UnoCSS:** Use for layout, spacing, and simple utility-based styling.
- **Buttons:** Rounded corners (8px), clear hover states.
- **Cards:** Subtle borders, emphasis on imagery and clear titles.
- **Footer:** Structured into top content (navigation, search) and bottom metadata (copyright, credits).

## Mobile First Strategy
- Navigation collapses into a hamburger menu.
- Multi-column grids stack into a single column.
- Padding and font sizes are adjusted using `clamp()` for fluid responsiveness.

## Proposed Visual Improvements
1. **Interactive Hover States:** Add subtle scale or color shifts to post cards and service icons.
2. **Skeleton Loading:** Implement for dynamic content sections using Shadcn's Skeleton component.
3. **Micro-interactions:** Add small animations for the "Konsultasi" button and navigation transitions.
4. **Enhanced Imagery:** Use high-quality, relevant images for EBT projects to build trust.
