# 🚀 Design System Quick Reference

Copy-paste snippets for the most common components and patterns.

## Buttons

```jsx
// Primary
<button className="btn btn-primary">Book Now</button>

// Accent
<button className="btn btn-accent">Explore</button>

// Secondary
<button className="btn btn-secondary">Learn More</button>

// Sizes
<button className="btn btn-primary btn-sm">Small</button>
<button className="btn btn-primary btn-lg">Large</button>

// Icon button
<button className="btn btn-icon"><Heart size={20} /></button>

// Loading
<button className="btn btn-primary btn-loading">Processing...</button>
```

## Cards

```jsx
// Basic card
<div className="card card-body">
  <h3>Title</h3>
  <p>Content</p>
</div>

// Card with image
<div className="card">
  <img src="image.jpg" alt="Image" className="card-image" />
  <div className="card-body">
    <h3>Title</h3>
  </div>
  <div className="card-footer">
    <button className="btn btn-primary">Action</button>
  </div>
</div>

// Outlined card
<div className="card card-outlined">Content</div>

// Glass effect
<div className="card card-glass">Content</div>
```

## Badges

```jsx
<span className="badge badge-primary">Featured</span>
<span className="badge badge-accent">Popular</span>
<span className="badge badge-success">Available</span>
<span className="badge badge-warning">Limited</span>
<span className="badge badge-error">Sold Out</span>
<span className="badge badge-info">New</span>
```

## Forms

```jsx
// Text input
<div className="form-group">
  <label className="form-label required">Email</label>
  <input type="email" className="form-control" placeholder="you@example.com" />
  <p className="form-hint">We'll never share your email</p>
</div>

// Select dropdown
<select className="form-control">
  <option>Choose...</option>
</select>

// Textarea
<textarea className="form-control" rows="4"></textarea>

// With error
<div className="form-group">
  <label className="form-label">Password</label>
  <input type="password" className="form-control border-error" />
  <p className="form-error">❌ Password is too weak</p>
</div>
```

## Layout

```jsx
// Flex container
<div className="flex gap-4 items-center justify-between">
  <div>Content 1</div>
  <div>Content 2</div>
</div>

// Grid layout
<div className="grid grid-cols-3 gap-6">
  <div className="card">Item 1</div>
  <div className="card">Item 2</div>
  <div className="card">Item 3</div>
</div>

// Container
<div className="container">
  <h1>Page title</h1>
</div>

// Section with padding
<section className="section">
  <div className="container">
    <h2>Section title</h2>
  </div>
</section>
```

## Typography

```jsx
// Headings
<h1>Heading 1 (auto-sized)</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>

// Text sizes
<p className="text-xs">Extra small</p>
<p className="text-sm">Small</p>
<p>Default (base)</p>
<p className="text-lg">Large</p>
<p className="text-2xl">2XL</p>

// Text styles
<p className="font-bold">Bold text</p>
<p className="italic">Italic text</p>
<p className="underline">Underlined text</p>
<p className="text-center">Centered text</p>
<p className="truncate">This text will be truncated with ellipsis...</p>

// Colors
<p className="text-primary">Primary color</p>
<p className="text-secondary">Secondary color</p>
<p className="text-muted">Muted color</p>
```

## Spacing

```jsx
// Padding
<div className="p-4">Padding all sides</div>
<div className="px-4">Padding left & right</div>
<div className="py-4">Padding top & bottom</div>

// Margin
<div className="m-4">Margin all sides</div>
<div className="mx-auto">Centered with margin</div>
<div className="mt-2">Margin top</div>
<div className="mb-4">Margin bottom</div>

// Gap (between flex/grid items)
<div className="flex gap-2">Item 1</div>
<div className="grid gap-6">Item 1</div>
```

## Modals & Overlays

```jsx
// Modal
<div className="modal-backdrop">
  <div className="modal">
    <div className="modal-header">
      <h2 className="modal-title">Modal Title</h2>
      <button className="btn btn-icon">✕</button>
    </div>
    <div className="modal-body">
      Modal content
    </div>
    <div className="modal-footer">
      <button className="btn btn-secondary">Cancel</button>
      <button className="btn btn-primary">Confirm</button>
    </div>
  </div>
</div>
```

## Alerts

```jsx
// Success
<div className="alert alert-success">
  <div className="alert-content">
    <p className="alert-title">Success!</p>
    <p className="alert-message">Your booking is confirmed</p>
  </div>
</div>

// Error
<div className="alert alert-error">
  <div className="alert-content">
    <p className="alert-title">Error</p>
    <p className="alert-message">Please fill all required fields</p>
  </div>
</div>

// Warning
<div className="alert alert-warning">
  <div className="alert-content">
    <p className="alert-title">Warning</p>
    <p className="alert-message">Your booking expires in 1 hour</p>
  </div>
</div>

// Info
<div className="alert alert-info">
  <div className="alert-content">
    <p className="alert-title">Info</p>
    <p className="alert-message">You can cancel free within 48 hours</p>
  </div>
</div>
```

## Responsive

```jsx
// Hide on mobile, show on tablet+
<div className="hidden-md">Desktop only</div>

// Responsive grid
<div className="grid grid-cols-1 gap-4">
  {/* On mobile: 1 column */}
  {/* Automatically responsive */}
</div>

// Responsive text size
<h1 className="text-3xl md:text-4xl lg:text-5xl">
  Responsive heading
</h1>

// Responsive padding
<div className="p-4 md:p-6 lg:p-8">
  Content with responsive padding
</div>

// Show/hide by breakpoint
<div className="hidden md:block">Visible on tablet+</div>
<div className="md:hidden">Visible on mobile only</div>
```

## Common Patterns

### Hero Section
```jsx
<section className="relative h-screen bg-gradient-primary flex items-center">
  <div className="container relative z-10 text-center text-white">
    <h1 className="text-5xl font-bold mb-4">Welcome</h1>
    <p className="text-xl mb-8">Discover luxury like never before</p>
    <button className="btn btn-primary btn-lg">Get Started</button>
  </div>
</section>
```

### Feature Grid
```jsx
<section className="section">
  <div className="container">
    <div className="section-header">
      <span className="section-subtitle">Features</span>
      <h2 className="section-title">Why Choose Us</h2>
    </div>
    <div className="grid grid-cols-3 gap-8">
      <div className="card card-body text-center">
        <h3 className="text-2xl mb-2">🏆</h3>
        <h4 className="font-semibold mb-2">Best Rate</h4>
        <p className="text-sm text-secondary">Guaranteed lowest prices</p>
      </div>
      {/* More cards... */}
    </div>
  </div>
</section>
```

### Product Card Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {items.map(item => (
    <div key={item.id} className="card">
      <img src={item.image} alt={item.name} className="card-image" />
      <div className="card-body">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold flex-1">{item.name}</h3>
          <span className="badge badge-accent">New</span>
        </div>
        <p className="text-sm text-secondary mb-4">{item.description}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">${item.price}</span>
          <button className="btn btn-primary btn-sm">Add</button>
        </div>
      </div>
    </div>
  ))}
</div>
```

### Form Layout
```jsx
<form className="max-w-lg">
  <div className="space-y-6">
    <div className="form-group">
      <label className="form-label required">Full Name</label>
      <input type="text" className="form-control" />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="form-group">
        <label className="form-label required">Email</label>
        <input type="email" className="form-control" />
      </div>
      <div className="form-group">
        <label className="form-label required">Phone</label>
        <input type="tel" className="form-control" />
      </div>
    </div>

    <div className="form-group">
      <label className="form-label">Message</label>
      <textarea className="form-control" rows="4"></textarea>
    </div>

    <div className="flex gap-4">
      <button type="button" className="btn btn-secondary flex-1">Cancel</button>
      <button type="submit" className="btn btn-primary flex-1">Submit</button>
    </div>
  </div>
</form>
```

### Navigation Bar
```jsx
<nav className="sticky top-0 bg-white border-b border-light">
  <div className="container flex items-center justify-between h-20">
    <div className="text-2xl font-bold text-primary">Logo</div>
    <div className="hidden md:flex gap-8">
      <a href="#" className="text-secondary hover:text-primary">Link 1</a>
      <a href="#" className="text-secondary hover:text-primary">Link 2</a>
    </div>
    <div className="flex gap-4">
      <button className="btn btn-secondary">Login</button>
      <button className="btn btn-primary">Sign Up</button>
    </div>
  </div>
</nav>
```

## Colors Reference

```jsx
// Primary (Purple)
className="text-primary"        // Dark purple
className="bg-primary-light"    // Light purple
className="text-primary-500"    // Main purple

// Accent (Pink)
className="text-accent"         // Pink
className="bg-accent-light"     // Light pink
className="border-accent"       // Pink border

// Neutral
className="text-secondary"      // Gray text
className="bg-tertiary"         // Light gray bg
className="border-light"        // Light gray border

// Semantic
className="text-success"        // Green
className="text-warning"        // Orange
className="text-error"          // Red
className="text-info"           // Blue
```

## CSS Variables

```css
/* Colors */
var(--color-primary-500)
var(--color-accent-500)
var(--text-primary)
var(--bg-primary)
var(--border-default)

/* Typography */
var(--font-display)    /* Serif */
var(--font-body)       /* Sans */
var(--text-lg)
var(--font-bold)

/* Spacing */
var(--space-4)    /* 16px */
var(--space-6)    /* 24px */
var(--space-8)    /* 32px */

/* Effects */
var(--shadow-lg)
var(--radius-lg)
var(--transition-base)
```

---

**Need more?** Check the full docs:
- `DESIGN_SYSTEM.md` - Complete reference
- `IMPLEMENTATION_GUIDE.md` - How to use
- `COMPONENT_EXAMPLES.md` - Real examples
