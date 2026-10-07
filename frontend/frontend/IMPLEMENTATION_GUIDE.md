# UI Implementation Guide

## 🎯 Quick Start

The new design system is now fully integrated and ready to use! Here's how to apply the beautiful new styles to your components.

## 📦 CSS File Structure

```
src/
├── styles/
│   ├── design-system.css    # All CSS variables (colors, fonts, spacing, etc.)
│   ├── global.css           # HTML, body, typography, resets
│   ├── components.css       # Pre-built components (buttons, cards, forms, modals)
│   └── utilities.css        # Helper classes (flexbox, grid, spacing, text, etc.)
├── index.css                # Main import file (brings in all of the above)
└── App.css                  # App-specific responsive overrides
```

## 🎨 Using the Design System

### 1. Buttons

Replace old button styles with new classes:

**Before:**
```jsx
<button style={{ background: '#3b0764', color: 'white', padding: '10px 20px' }}>
  Book Now
</button>
```

**After:**
```jsx
<button className="btn btn-primary">Book Now</button>
<button className="btn btn-accent">Explore</button>
<button className="btn btn-secondary">Learn More</button>
<button className="btn btn-outline">View</button>
<button className="btn btn-sm">Small</button>
<button className="btn btn-lg">Large</button>
```

### 2. Cards

**Before:**
```jsx
<div style={{ 
  background: 'white', 
  border: '1px solid #e0e0e0', 
  borderRadius: '8px',
  padding: '16px'
}}>
  Content
</div>
```

**After:**
```jsx
<div className="card">
  <div className="card-body">
    <h3>Room Title</h3>
    <p>Room description</p>
  </div>
</div>

<!-- With image -->
<div className="card">
  <img src="image.jpg" alt="Room" className="card-image" />
  <div className="card-body">
    <h3>Luxury Suite</h3>
  </div>
  <div className="card-footer">
    <button className="btn btn-primary">Book</button>
  </div>
</div>
```

### 3. Typography

**Before:**
```jsx
<h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#260443' }}>
  Heading
</h1>
```

**After:**
```jsx
<h1>Heading (auto-sized with clamp)</h1>
<h2>Subheading</h2>
<p>Body text with proper line-height</p>
<small>Small text</small>
<strong>Bold text</strong>
```

### 4. Forms

**Before:**
```jsx
<input 
  type="text" 
  style={{ 
    padding: '10px', 
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px'
  }}
/>
```

**After:**
```jsx
<div className="form-group">
  <label className="form-label required" htmlFor="email">
    Email Address
  </label>
  <input
    type="email"
    id="email"
    className="form-control"
    placeholder="you@example.com"
  />
  <p className="form-hint">We'll never share your email</p>
</div>
```

### 5. Badges

**Before:**
```jsx
<span style={{ 
  background: '#f3e8ff', 
  color: '#7e22ce',
  padding: '4px 12px',
  borderRadius: '999px',
  fontSize: '12px',
  fontWeight: 'bold'
}}>
  Featured
</span>
```

**After:**
```jsx
<span className="badge badge-primary">Featured</span>
<span className="badge badge-accent">Popular</span>
<span className="badge badge-success">Available</span>
<span className="badge badge-warning">Limited</span>
<span className="badge badge-error">Sold Out</span>
```

### 6. Layout & Spacing

**Before:**
```jsx
<div style={{ display: 'flex', gap: '16px', maxWidth: '1280px', margin: '0 auto' }}>
  <div style={{ flex: 1 }}>Content</div>
</div>
```

**After:**
```jsx
<!-- Flexbox -->
<div className="flex gap-6 justify-between items-center">
  <div>Content 1</div>
  <div>Content 2</div>
</div>

<!-- Grid -->
<div className="grid grid-cols-3 gap-6">
  <div className="card">Item 1</div>
  <div className="card">Item 2</div>
  <div className="card">Item 3</div>
</div>

<!-- Container -->
<div className="container">
  <h1>Page content with max-width</h1>
</div>
```

### 7. Responsive Classes

```jsx
<!-- Hide on mobile, show on larger screens -->
<div className="hidden-md">Visible on mobile, hidden on tablet+</div>

<!-- Responsive grid -->
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <div className="card">Item</div>
</div>

<!-- Responsive padding -->
<div className="p-4 md:p-6 lg:p-8">Responsive padding</div>
```

## 🔧 Component Migration Examples

### Example 1: RoomCard Component

**Before (Inline Styles):**
```jsx
export default function RoomCard({ room, onBookNow }) {
  return (
    <div style={{ 
      background: '#fff',
      border: '1px solid #e0e0e0',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s, box-shadow 0.3s'
    }}>
      <img 
        src={room.image}
        alt={room.name}
        style={{
          width: '100%',
          height: '240px',
          objectFit: 'cover',
          transition: 'transform 0.3s'
        }}
      />
      <div style={{ padding: '16px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
          {room.name}
        </h3>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
          {room.description}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
            ${room.price}/night
          </span>
          <button
            onClick={() => onBookNow(room)}
            style={{
              background: '#7e22ce',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
```

**After (Design System Classes):**
```jsx
export default function RoomCard({ room, onBookNow }) {
  return (
    <div className="card luxury-card">
      <img 
        src={room.image}
        alt={room.name}
        className="card-image"
      />
      <div className="card-body">
        <h3 className="text-lg font-semibold mb-2">{room.name}</h3>
        <p className="text-sm text-secondary mb-4">{room.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold">${room.price}/night</span>
          <button
            onClick={() => onBookNow(room)}
            className="btn btn-primary btn-sm"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Example 2: Modal Component

**Before:**
```jsx
<div style={{
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
}}>
  <div style={{
    background: 'white',
    borderRadius: '16px',
    maxWidth: '500px',
    width: '90%',
    padding: '24px'
  }}>
    <h2>Modal Title</h2>
    {children}
  </div>
</div>
```

**After:**
```jsx
<div className="modal-backdrop">
  <div className="modal">
    <div className="modal-header">
      <h2 className="modal-title">Modal Title</h2>
      <button className="btn btn-icon" onClick={onClose}>✕</button>
    </div>
    <div className="modal-body">
      {children}
    </div>
    <div className="modal-footer">
      <button className="btn btn-secondary">Cancel</button>
      <button className="btn btn-primary">Confirm</button>
    </div>
  </div>
</div>
```

### Example 3: HeroSection Component

**Before:**
```jsx
<section style={{
  minHeight: '90vh',
  background: `url(${bgImage}) center/cover`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  color: 'white'
}}>
  <div style={{ maxWidth: '600px', padding: '40px' }}>
    <h1 style={{ fontSize: '48px', marginBottom: '16px' }}>Title</h1>
    <p style={{ fontSize: '18px', marginBottom: '32px' }}>Description</p>
    <button className="btn btn-primary">Get Started</button>
  </div>
</section>
```

**After:**
```jsx
<section className="hero-section" style={{
  backgroundImage: `url(${bgImage})`
}}>
  <div className="hero-content">
    <h1>Welcome to Luxury</h1>
    <p className="text-lg leading-relaxed">
      Discover the world's finest hotel experiences
    </p>
    <button className="btn btn-primary btn-lg">Get Started</button>
  </div>
</section>
```

## 📱 Responsive Design Patterns

### Mobile-First Approach

```jsx
// Default (mobile) → Enhanced for larger screens
<div className="grid grid-cols-1 gap-4">
  {/* On mobile: 1 column, gap-4 (16px) */}
  {/* Automatically scales to tablet/desktop with media queries */}
</div>

// Using utility classes
<div className="p-4 md:p-6 lg:p-8 lg:flex lg:gap-8">
  {/* Responsive padding and flex layout */}
</div>

// Hiding/showing content
<div className="desktop-nav hidden-md">
  {/* Hidden on mobile/tablet, visible on desktop */}
</div>
```

## 🎭 Color Usage

Use CSS variables instead of hard-coded colors:

```css
/* ✅ Good */
color: var(--text-primary);
background: var(--bg-primary);
border: 1px solid var(--border-default);

/* ❌ Avoid */
color: #260443;
background: #ffffff;
border: 1px solid #e7e5e4;
```

## 🚀 Performance Tips

1. **Use Classes**: Classes are more efficient than inline styles
2. **Avoid Duplication**: Reuse existing component classes
3. **CSS Variables**: Leverage design system tokens for consistency and maintainability
4. **Component Composition**: Build complex components from simple ones

## ✅ Checklist for Component Updates

When updating a component to use the design system:

- [ ] Remove all inline `style={{ ... }}` properties
- [ ] Replace with appropriate CSS classes
- [ ] Update colors to use CSS variables via classes
- [ ] Update spacing to use utility classes (gap, p, m)
- [ ] Add hover/focus states using button classes
- [ ] Test on mobile (ensure responsive classes work)
- [ ] Test keyboard navigation
- [ ] Verify colors meet WCAG AA contrast requirements
- [ ] Remove unused CSS files/styles

## 🔗 CSS Variables Reference

All available CSS variables are defined in `src/styles/design-system.css`

Common ones you'll use:
- Colors: `var(--color-primary-500)`, `var(--text-primary)`, `var(--bg-primary)`
- Spacing: `var(--space-4)`, `var(--space-8)`, `var(--space-16)`
- Typography: `var(--font-body)`, `var(--text-lg)`, `var(--font-semibold)`
- Shadows: `var(--shadow-sm)`, `var(--shadow-lg)`, `var(--shadow-2xl)`
- Radius: `var(--radius-lg)`, `var(--radius-xl)`, `var(--radius-full)`

## 📚 Additional Resources

- See `DESIGN_SYSTEM.md` for complete design system documentation
- Check `src/styles/` for all available CSS
- Inspect components to see class usage patterns

## 💡 Tips

1. **Consistency**: Use design system classes everywhere
2. **Customization**: Modify CSS variables in `design-system.css` to change entire theme
3. **Accessibility**: All components have built-in accessibility features
4. **Performance**: CSS classes are more efficient than inline styles
5. **Maintainability**: Design system makes updates easier across all components

---

**Happy Styling! 🎨**

For questions or improvements, refer to the design system documentation or add notes here.
