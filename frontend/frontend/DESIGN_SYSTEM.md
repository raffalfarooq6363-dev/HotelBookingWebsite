# LuxeHaven Design System

A comprehensive, modern design system for the luxury hotel booking website built with React and Vite.

## 📋 Overview

The design system is modular and well-structured, making it easy to maintain, extend, and use across all components.

### Key Features

- **Organized CSS Architecture**: Separated into design tokens, components, utilities, and global styles
- **Comprehensive Color Palette**: 10-shade color system for primary, accent, and neutral colors
- **Typography System**: Semantic font sizes, weights, and line heights
- **Spacing Scale**: 8px base unit for consistent spacing throughout
- **Component Library**: Pre-built button, card, badge, form, and modal styles
- **Accessibility First**: WCAG compliant with proper focus states and semantic HTML
- **Responsive**: Mobile-first approach with built-in breakpoints
- **Dark Mode Ready**: CSS variables support for dark theme

## 🎨 Color Palette

### Primary Colors (Purple)
- `--color-primary-50`: #faf5ff (Lightest)
- `--color-primary-500`: #a855f7 (Main)
- `--color-primary-950`: #3b0764 (Darkest)

### Accent Colors (Rose/Pink)
- `--color-accent-50`: #fdf2f8 (Lightest)
- `--color-accent-500`: #ec4899 (Main)
- `--color-accent-950`: #500724 (Darkest)

### Neutral Colors
- `--color-neutral-0`: #ffffff (White)
- `--color-neutral-500`: #78716b (Mid-gray)
- `--color-neutral-950`: #0f0e0d (Near-black)

### Semantic Colors
- **Success**: #10b981
- **Warning**: #f59e0b
- **Error**: #ef4444
- **Info**: #3b82f6

## 📐 Typography

### Font Families
- **Display**: Playfair Display (serif) - Headlines
- **Body**: Plus Jakarta Sans (sans-serif) - Content

### Font Sizes
```
--text-xs:   0.75rem   (12px)
--text-sm:   0.875rem  (14px)
--text-base: 1rem      (16px)
--text-lg:   1.125rem  (18px)
--text-xl:   1.25rem   (20px)
--text-2xl:  1.5rem    (24px)
--text-3xl:  1.875rem  (30px)
--text-4xl:  2.25rem   (36px)
--text-5xl:  3rem      (48px)
--text-6xl:  3.75rem   (60px)
```

### Font Weights
- Light: 300
- Normal: 400
- Medium: 500
- Semibold: 600
- Bold: 700
- Extrabold: 800

## 🎯 Spacing System

8px base unit for consistent spacing:

```
--space-1:   4px    (0.25rem)
--space-2:   8px    (0.5rem)
--space-4:   16px   (1rem)
--space-6:   24px   (1.5rem)
--space-8:   32px   (2rem)
--space-12:  48px   (3rem)
--space-16:  64px   (4rem)
```

## 🔘 Components

### Buttons

```html
<!-- Primary Button -->
<button class="btn btn-primary">Book Now</button>

<!-- Accent Button -->
<button class="btn btn-accent">Explore</button>

<!-- Secondary Button -->
<button class="btn btn-secondary">Learn More</button>

<!-- Outline Button -->
<button class="btn btn-outline">View Details</button>

<!-- Ghost Button -->
<button class="btn btn-ghost">Skip</button>

<!-- Icon Button -->
<button class="btn btn-icon">♡</button>

<!-- Sizes -->
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary btn-lg">Large</button>
```

### Cards

```html
<!-- Basic Card -->
<div class="card card-body">
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</div>

<!-- Card with Image -->
<div class="card">
  <img src="image.jpg" alt="Card image" class="card-image">
  <div class="card-body">
    <h3>Room Title</h3>
    <p>Room description</p>
  </div>
</div>

<!-- Card Variants -->
<div class="card card-elevated">Elevated</div>
<div class="card card-outlined">Outlined</div>
<div class="card card-glass">Glass Effect</div>
```

### Badges

```html
<!-- Primary Badge -->
<span class="badge badge-primary">Featured</span>

<!-- Accent Badge -->
<span class="badge badge-accent">Popular</span>

<!-- Success Badge -->
<span class="badge badge-success">Available</span>

<!-- Warning Badge -->
<span class="badge badge-warning">Limited</span>

<!-- Error Badge -->
<span class="badge badge-error">Unavailable</span>

<!-- Sizes -->
<span class="badge badge-sm">Small</span>
<span class="badge badge-lg">Large</span>
```

### Forms

```html
<!-- Form Group -->
<div class="form-group">
  <label class="form-label required" for="name">Full Name</label>
  <input type="text" id="name" class="form-control" placeholder="Enter your name">
  <p class="form-hint">We'll use this to confirm your booking</p>
</div>

<!-- Select -->
<select class="form-control">
  <option>Choose an option</option>
  <option>Option 1</option>
  <option>Option 2</option>
</select>

<!-- Textarea -->
<textarea class="form-control" placeholder="Your message"></textarea>
```

### Modals

```html
<!-- Modal -->
<div class="modal-backdrop">
  <div class="modal">
    <div class="modal-header">
      <h2 class="modal-title">Modal Title</h2>
      <button class="btn btn-icon">✕</button>
    </div>
    <div class="modal-body">
      Modal content goes here
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary">Cancel</button>
      <button class="btn btn-primary">Confirm</button>
    </div>
  </div>
</div>
```

### Alerts

```html
<!-- Success Alert -->
<div class="alert alert-success">
  <div class="alert-content">
    <p class="alert-title">Success!</p>
    <p class="alert-message">Your booking has been confirmed</p>
  </div>
</div>

<!-- Error Alert -->
<div class="alert alert-error">
  <div class="alert-content">
    <p class="alert-title">Error</p>
    <p class="alert-message">Please fill in all required fields</p>
  </div>
</div>
```

## 🛠️ Utility Classes

### Layout
```html
<div class="container">Max width container</div>
<div class="flex justify-center items-center gap-4">Flex layout</div>
<div class="grid grid-cols-3 gap-6">Grid layout</div>
```

### Spacing
```html
<div class="p-4">Padding</div>
<div class="m-auto">Margin auto</div>
<div class="mt-2 mb-4">Margin top & bottom</div>
```

### Typography
```html
<h1 class="text-4xl font-bold">Heading</h1>
<p class="text-sm text-gray-600">Small text</p>
<span class="font-semibold">Bold text</span>
```

### Display
```html
<div class="hidden">Hidden on mobile</div>
<div class="hidden-md">Hidden on tablet</div>
<div class="block">Display as block</div>
```

### Colors
```html
<div class="bg-primary">Primary background</div>
<div class="bg-accent-light">Accent light background</div>
<div class="text-secondary">Secondary text</div>
```

## 📱 Responsive Breakpoints

- **xs**: 0px (mobile)
- **sm**: 640px (small tablet)
- **md**: 768px (tablet)
- **lg**: 1024px (desktop)
- **xl**: 1280px (large desktop)
- **2xl**: 1536px (extra large)

## 🎭 Shadow System

```
--shadow-xs:     0 1px 2px (subtle)
--shadow-sm:     0 1px 3px
--shadow-md:     0 4px 6px
--shadow-lg:     0 10px 15px
--shadow-xl:     0 20px 25px
--shadow-2xl:    0 25px 50px (prominent)
```

## 🔄 Transitions

```
--transition-fast:    150ms
--transition-base:    200ms
--transition-slow:    300ms
--transition-slower:  500ms
```

## ♿ Accessibility

### Focus States
All interactive elements have visible focus states:
```css
:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}
```

### Semantic HTML
- Use proper heading hierarchy (h1 → h6)
- Use `<button>` for actions, `<a>` for navigation
- Use `<form>` for form elements with `<label>`
- Use `aria-label` for icon-only buttons

### Color Contrast
- All text meets WCAG AA standards (4.5:1 for normal, 3:1 for large)
- Don't rely on color alone to convey information

### Motion
- Respects `prefers-reduced-motion`
- Smooth transitions without excessive motion

## 🎨 Customization

### Changing Colors
Edit `src/styles/design-system.css`:
```css
:root {
  --color-primary-500: #your-color;
}
```

### Adding Fonts
Update in `design-system.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Your+Font');
```

### Extending Components
Add custom component styles to `src/components/YourComponent.css` or `src/styles/components.css`

## 📚 File Structure

```
src/
├── styles/
│   ├── design-system.css    # Design tokens & variables
│   ├── global.css           # Global HTML/body styles
│   ├── components.css       # Pre-built components
│   └── utilities.css        # Utility classes
├── index.css                # Main stylesheet (imports all)
└── App.css                  # App-specific styles
```

## 🚀 Best Practices

1. **Use Design Tokens**: Prefer CSS variables over hard-coded values
2. **Mobile First**: Start with mobile styles, then enhance for larger screens
3. **Semantic HTML**: Use proper HTML elements and ARIA labels
4. **Component Reuse**: Use existing component classes before creating new ones
5. **Consistent Spacing**: Use the spacing scale for all margins/padding
6. **Accessibility**: Always test with keyboard navigation and screen readers
7. **Performance**: Minimize specificity and avoid inline styles
8. **Naming**: Use BEM or similar methodology for custom classes

## 🔗 Resources

- [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/--*):
- [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [CSS Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 📝 Version

Design System v1.0.0 - Built for LuxeHaven Hotel Booking Platform
