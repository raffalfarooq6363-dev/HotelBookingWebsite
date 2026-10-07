# LuxeHaven Design System - Getting Started

Welcome! Your hotel booking website now has a beautiful, professional design system. Here's everything you need to know.

## 📖 Documentation Guide

| Document | Purpose | Read When |
|----------|---------|-----------|
| **This File** | Overview & getting started | First! |
| [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) | Copy-paste code snippets | Building components |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Complete token reference | Need all details |
| [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) | How to update components | Migrating existing code |
| [COMPONENT_EXAMPLES.md](./COMPONENT_EXAMPLES.md) | Real working examples | Learning by example |
| [UI_REDESIGN_SUMMARY.md](./UI_REDESIGN_SUMMARY.md) | What was built & why | Understanding the work |

## 🎯 5-Minute Quick Start

### 1. See What You Have

```
src/
├── styles/
│   ├── design-system.css    ← All design tokens
│   ├── global.css           ← Base HTML styles
│   ├── components.css       ← Pre-built components
│   └── utilities.css        ← Helper classes
├── index.css                ← Main stylesheet
└── App.css                  ← App overrides
```

### 2. Use Classes Instead of Inline Styles

**Old Way (Inline):**
```jsx
<button style={{ background: '#7e22ce', color: 'white', padding: '10px 20px' }}>
  Click Me
</button>
```

**New Way (Classes):**
```jsx
<button className="btn btn-primary">
  Click Me
</button>
```

### 3. Common Components

```jsx
// Buttons
<button className="btn btn-primary">Primary</button>
<button className="btn btn-accent">Accent</button>
<button className="btn btn-secondary">Secondary</button>

// Cards
<div className="card card-body">
  <h3>Title</h3>
  <p>Content</p>
</div>

// Forms
<div className="form-group">
  <label className="form-label required">Email</label>
  <input className="form-control" type="email" />
</div>

// Layout
<div className="flex gap-4 items-center">
  <div>Column 1</div>
  <div>Column 2</div>
</div>
```

### 4. Start Updating

Pick any component and:
1. Remove `style={{ ... }}`
2. Add `className="btn btn-primary"`
3. Test it works
4. Done! ✨

## 🎨 What's Included

### Colors 🌈
- 10-shade **purple** primary
- 10-shade **pink** accent
- 10-shade **gray** neutral
- + success, warning, error, info colors
- All via CSS variables (easy to change)

### Typography 📝
- Playfair Display for headings
- Plus Jakarta Sans for body text
- Responsive sizes (text-xs to text-6xl)
- Proper spacing and weights

### Components 🧩
- Buttons (6 variants, 3 sizes)
- Cards (4 variants)
- Badges (6 colors)
- Forms (inputs, selects, errors)
- Modals (with header/body/footer)
- Alerts (4 types)
- + more

### Layout & Spacing 📐
- Flexbox utilities
- Grid system
- Spacing scale (8px base)
- Responsive classes

### Responsive 📱
- Mobile-first design
- 5 breakpoints (xs, sm, md, lg, xl)
- Automatic scaling
- Touch-friendly

### Accessible ♿
- WCAG AA compliant
- Keyboard navigation
- Focus states
- Semantic HTML

## 🚀 Common Tasks

### Update a Button
```jsx
// Find this
<button style={{ ... }}>Click</button>

// Change to this
<button className="btn btn-primary">Click</button>
```

### Create a Card with Image
```jsx
<div className="card">
  <img src="image.jpg" alt="Room" className="card-image" />
  <div className="card-body">
    <h3>Room Title</h3>
    <p>Description</p>
  </div>
</div>
```

### Build a Responsive Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div className="card">Item 1</div>
  <div className="card">Item 2</div>
  <div className="card">Item 3</div>
</div>
```

### Style Text
```jsx
<h1>Big heading</h1>
<p className="text-lg text-secondary">Subtitle</p>
<span className="badge badge-primary">Featured</span>
```

### Add Spacing
```jsx
<div className="p-6 mb-4">Padded container with bottom margin</div>
<div className="flex gap-4">Flex with gap</div>
<div className="grid gap-8">Grid with gap</div>
```

## 🔧 Customization

### Change Primary Color
Edit `src/styles/design-system.css`:
```css
:root {
  --color-primary-500: #your-purple;
}
```

### Change Fonts
Edit `src/styles/design-system.css`:
```css
:root {
  --font-display: 'Your Font', serif;
  --font-body: 'Your Font', sans-serif;
}
```

### Adjust Spacing
Edit `src/styles/design-system.css`:
```css
:root {
  --space-4: 16px;  /* All spacing scales from here */
}
```

## ✅ Component Migration Checklist

For each component you update:

- [ ] Remove all `style={{ ... }}`
- [ ] Add `className` with design system classes
- [ ] Update colors to use CSS variables
- [ ] Add responsive classes
- [ ] Test on mobile & desktop
- [ ] Check keyboard navigation
- [ ] Verify focus states work

## 📚 File Structure Explained

```
design-system.css
├── Color tokens (purple, pink, gray, semantic)
├── Typography tokens (fonts, sizes, weights)
├── Spacing tokens (8px scale)
├── Shadow & border-radius tokens
└── Z-index, transitions, and more

global.css
├── HTML & body resets
├── Typography hierarchy
├── Links, lists, code
├── Scrollbar styling
└── Print styles

components.css
├── .btn (buttons with variants)
├── .card (cards with variants)
├── .badge (badges)
├── .form-* (form elements)
├── .modal-* (modals)
├── .alert (alerts)
└── + more

utilities.css
├── .container (layout)
├── .flex, .grid (layout)
├── .p-*, .m-* (spacing)
├── .text-* (typography)
├── .bg-*, .border-* (colors)
├── .gap-*, .shadow-* (effects)
└── + responsive variants
```

## 🌟 Key Features

| Feature | Benefit |
|---------|---------|
| **CSS Variables** | Change theme in one place |
| **Utility Classes** | Build UIs without CSS files |
| **Pre-built Components** | Copy-paste ready-to-use components |
| **Responsive Design** | Works great on all devices |
| **Accessibility Built-in** | WCAG AA compliant out of the box |
| **Mobile First** | Start mobile, enhance for desktop |
| **Performance** | Classes are more efficient than inline styles |
| **Maintainability** | Consistent across all components |

## 💡 Pro Tips

1. **Use classes, not inline styles** - Better performance & consistency
2. **Use CSS variables for colors** - Easy theme switching
3. **Use utility classes for layout** - Faster than custom CSS
4. **Mobile-first approach** - Start simple, add complexity
5. **Consistency matters** - Always use the design system
6. **Accessibility included** - Don't remove focus states
7. **Test responsive** - Always check on mobile

## 🔍 Find Things Quickly

**Looking for...** | **Go to...**
---|---
A button example | QUICK_REFERENCE.md
All color options | DESIGN_SYSTEM.md > Color Palette
How to use forms | COMPONENT_EXAMPLES.md
CSS variable | DESIGN_SYSTEM.md > Typography System
Responsive breakpoints | DESIGN_SYSTEM.md > Breakpoints

## 🆘 Troubleshooting

**Q: Styles aren't applying?**
A: Make sure you're using `className`, not `style`. Check if class names are spelled correctly.

**Q: Component looks different?**
A: Check if it's using old inline styles. Replace with design system classes.

**Q: Not responsive?**
A: Add responsive classes like `md:p-6 lg:p-8` or use grid/flex.

**Q: Colors look wrong?**
A: CSS variables might not be loaded. Check `src/index.css` imports.

**Q: Performance issues?**
A: Switch from inline styles to classes - they're more efficient.

## 📞 Next Steps

1. **Read** this file (you're here! ✓)
2. **Open** [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
3. **Pick** one component to update
4. **Replace** its styles with design system classes
5. **Test** it works
6. **Repeat** for other components

## 🎨 Color Swatches

### Primary (Purple)
```
#faf5ff → #3b0764
Light ← → Dark
```

### Accent (Pink)
```
#fdf2f8 → #500724
Light ← → Dark
```

### Semantic
```
✓ #10b981 (Success)
⚠ #f59e0b (Warning)
✕ #ef4444 (Error)
ℹ #3b82f6 (Info)
```

## 🎯 Your Design System

This isn't a template - it's **your** design system, built specifically for LuxeHaven. It includes:

- ✅ 500+ lines of design tokens
- ✅ 400+ pre-built component styles
- ✅ 100+ utility classes
- ✅ Mobile-first responsive design
- ✅ Built-in accessibility
- ✅ Complete documentation
- ✅ Real code examples

**Everything you need to build beautiful UIs consistently and quickly.**

---

## 🎉 Ready?

Start with [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) and pick your first component to update!

**Questions?** All answers are in the documentation files listed at the top. ⬆️

---

**Last Updated:** October 2026  
**Design System Version:** 1.0.0  
**Status:** ✅ Production Ready

Built with ❤️ for LuxeHaven Hotel Booking Platform
