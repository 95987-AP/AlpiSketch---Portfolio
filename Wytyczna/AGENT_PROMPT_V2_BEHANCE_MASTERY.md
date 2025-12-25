# 🎨 AGENT AI PROMPT v2 - BRAND MASTERY SYSTEM (BEHANCE-INSPIRED)

## KONTEKST PROJEKTU
- **Projekt:** AlpiSketch Architectural Minimalist Portfolio
- **Stack:** React 19 + TypeScript + Vite 6 + Framer Motion 12 + Tailwind CSS
- **URL:** GitHub Pages, deploy: `npm run deploy`
- **Design System:** stone-* colors, easing [0.16,1,0.3,1], responsive md/lg breakpoints
- **Status:** Previous version (BrandGridShowcase.tsx with basic tabs) exists - THIS IS V2 UPGRADE

---

## 🎯 ZADANIE - IMPLEMENTATION GOAL V2

**UPGRADE z LINEAR TABS → BEHANCE-INSPIRED BRAND MASTERY SECTIONS**

Obecna implementacja wyglądała jak "file manager". Teraz transformujemy do profesjonalnego **Behance-level presentation system**.

**Key Shift:**
- ❌ REMOVE: Tab filtering system (feels technical/explorer-like)
- ✅ ADD: Section-based organization (feels curated/professional)
- ✅ ADD: Varied grid layout (hero sections, varied cell sizes)
- ✅ ADD: Context cards with descriptive metadata
- ✅ ADD: Visual hierarchy & breathing room
- ✅ ADD: CTA buttons per section

---

## 📋 REQUIREMENTS - SZCZEGÓŁOWE

### A. ARCHITEKTURA KOMPONENTY

**Istniejący komponent:** `BrandGridShowcase.tsx` (do refactoringu)
- **Lokalizacja:** `src/components/BrandGridShowcase.tsx`
- **Zmiana:** Rewrite logiki z tabs-based → sections-based
- **Zachowaj:** Istniejące data flow, modals, animations (reutilizuj co się da)

---

### B. NOWA STRUKTURA - SECTIONS NOT TABS

#### **1️⃣ AUTO-DETECTED SECTIONS** (From image filenames)

Agent powinien **automatycznie grupować** slajdy w sekcje na podstawie nazwy pliku:

```typescript
SECTIONS_MAPPING = {
  "IDENTITY": ["logo", "icon"],
  "COLORS": ["color", "palette", "swatch"],
  "TYPOGRAPHY": ["typography", "type", "font", "typeface"],
  "PATTERNS": ["pattern", "texture", "background"],
  "APPLICATIONS": ["app", "application", "web", "social", "mockup", "victory", "defeat", "matchday"],
  "LIFESTYLE": ["lifestyle", "real-world", "usage", "presentation", "busstopp"],
}
```

**Logika:**
- Loop through all slides
- Match filename (case-insensitive) against SECTIONS_MAPPING keys
- Group into sections
- If no match → "OTHER" section
- Preserve order

**Output:**
```typescript
interface Section {
  id: string;                 // "identity", "colors", etc.
  title: string;              // "Logotype & Icon System", "Color Palette", etc.
  description: string;        // Auto-generated or custom
  emoji: string;              // 🎨, 🎭, 📝, etc.
  images: string[];           // Grouped images for this section
  gridLayout?: "hero-2x2" | "secondary-1x1" | "tertiary-2x1"; // Varies per section
}
```

---

#### **2️⃣ GRID LAYOUT STRATEGY - VARIED SIZES**

**Desktop (lg+):**
```
┌────────────────┬──────┬──────┐
│                │      │      │
│  HERO SECTION  │ Sec2 │ Sec3 │  ← First section: 2x2 grid cells
│  (Primary)     │ 1x1  │ 1x1  │
│                ├──────┴──────┤
├────────────────┤              │
│ Sec4           │   Sec5       │  ← Others: 1x1 or 2x1
│ 1x1            │   2x1        │
└────────────────┴──────────────┘
```

**CSS Grid:**
```css
display: grid;
grid-template-columns: repeat(4, 1fr);
grid-auto-rows: auto;
gap: 24px;

/* First section (HERO) */
.section:first-child .image-wrapper {
  grid-column: span 2;
  grid-row: span 2;
}

/* Secondary sections (varies) */
.section:nth-child(2) .image-wrapper {
  grid-column: span 1;
  grid-row: span 1;
}

.section:nth-child(5) .image-wrapper {
  grid-column: span 2;  /* Wide secondary */
  grid-row: span 1;
}
```

**Responsive:**
- **Mobile (<640px):** All 1 column (stack sections)
- **Tablet (md):** 2 columns max
- **Desktop (lg+):** 4 columns with varied spans

---

#### **3️⃣ SECTION CARD STRUCTURE**

**Visual Structure:**

```
┌────────────────────────────────────────┐
│ 🎨 LOGOTYPE & ICON SYSTEM             │ ← Section header (emoji + title)
├────────────────────────────────────────┤
│                                        │
│  ┌──────────────────────────────┐     │
│  │                              │     │
│  │    Primary Logo Showcase     │     │ ← Image (varied size)
│  │    Size: 2x2 grid cells      │     │
│  │                              │     │
│  └──────────────────────────────┘     │
│                                        │
│  Logo Design System for AlpineX       │ ← Descriptive subtitle
│  Esports Brand                         │
│                                        │
│  ⚫ Main Logo                          │ ← Key features (bullets)
│  🟡 Icon Variations (12 icons)        │
│  📋 Full Icon Library with Specs      │
│                                        │
│  [EXPLORE LOGOTYPES →]                │ ← CTA Button
│                                        │
└────────────────────────────────────────┘
```

**Components (per section):**

a) **Section Header**
   - Emoji (auto-assigned per category)
   - Title (human-readable: "Logotype & Icon System")
   - Divider line (subtle border-top)
   - Padding: `py-8` above section

b) **Image Container**
   - Responsive image with `object-contain`
   - Grayscale on desktop, color on mobile
   - Aspect ratio: preserve original
   - max-height: vary by grid size
     - Hero 2x2: `max-h-[500px]`
     - Secondary 1x1: `max-h-[350px]`
     - Wide 2x1: `max-h-[400px]`

c) **Metadata Card**
   - Subtitle: descriptive (auto-generated or custom)
   - Features: 3-5 bullet points (auto-extracted or hardcoded)
   - Stats: count (e.g., "12 icons", "5 colors", "3 fonts")

d) **CTA Button**
   - Text: "[EXPLORE {SECTION} →]" or "[LEARN MORE →]"
   - Style: `border-2 border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white`
   - On click: Open modal with full section detail
   - Transition: 300ms ease

---

#### **4️⃣ SECTION METADATA (Auto-Generated)**

Agent powinien **auto-generować sensowne descriptions** na podstawie sekcji:

```typescript
const SECTION_TEMPLATES = {
  "IDENTITY": {
    title: "Logotype & Icon System",
    description: "Primary logo, variations, and icon set for {BrandName}",
    features: ["Main Logo", "Logo Variations", "Icon Library", "Usage Guidelines"],
    emoji: "🎭"
  },
  "COLORS": {
    title: "Color Palette & Swatches",
    description: "Complete color system with primary, accent, and utility colors",
    features: ["Primary Colors", "Accent Shades", "Hex Codes", "Color Guidelines"],
    emoji: "🎨"
  },
  "TYPOGRAPHY": {
    title: "Typography System",
    description: "Font families, scales, and typographic hierarchy",
    features: ["Font Families", "Scale System", "Line Heights", "Usage Rules"],
    emoji: "📝"
  },
  "PATTERNS": {
    title: "Pattern & Texture Library",
    description: "Geometric patterns and background textures for brand applications",
    features: ["Primary Patterns", "Texture Sets", "Scale Variations", "Usage Examples"],
    emoji: "✨"
  },
  "APPLICATIONS": {
    title: "Brand Applications",
    description: "Real-world brand usage across digital and print mediums",
    features: ["Web Mockups", "Social Media", "Print Materials", "Merchandise"],
    emoji: "🚀"
  },
  "OTHER": {
    title: "Additional Assets",
    description: "Supplementary brand materials and guidelines",
    features: [],
    emoji: "📦"
  }
}
```

---

### C. INTERAKCJE & ANIMATIONS

#### **1️⃣ HOVER EFFECTS**

**On Card Hover:**
```
┌──────────────────────────┐
│ Image Container          │
├──────────────────────────┤
│ ┌────────────────────┐   │ ← Gradient overlay slides in (left to right)
│ │ Gradient Overlay   │   │   Black/transparent gradient
│ │ + Icon (eye/expand)│   │   Easing: 300ms [0.16,1,0.3,1]
│ │ + "VIEW FULL" CTA  │   │
│ └────────────────────┘   │
│                          │
│ Metadata (white text)    │ ← Text becomes inverted
│ [EXPLORE →]              │ ← Button highlight
└──────────────────────────┘
└─ shadow-xl pojawia się
```

**Tech:**
- Overlay: `linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.6) 100%)`
- Icon: Lucide-react (Eye, Expand, or ArrowRight)
- Scale: subtle `scale-105` (1.05x)
- Shadow: `shadow-xl` on hover
- Transition: `transition-all duration-300 ease-[0.16,1,0.3,1]`

**Mobile:**
- No grayscale (always color)
- No overlay on hover (touch not hover)
- Only border highlight on tap

---

#### **2️⃣ SECTION ENTRANCE ANIMATIONS**

**On Page Load or Tab Change:**
```
Section 1: appear at delay 0ms
Section 2: appear at delay 150ms
Section 3: appear at delay 300ms
Section 4: appear at delay 450ms
... (each +150ms)
```

**Animation per section:**
- Opacity: 0 → 1 (duration: 600ms)
- Y: +30px → 0px (duration: 600ms)
- Easing: [0.16,1,0.3,1]

**Framer Motion:**
```typescript
const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  show: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: index * 0.15,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};
```

---

#### **3️⃣ MODAL / SECTION DETAIL VIEW**

**On Section CTA Click → Modal opens:**

```
┌─────────────────────────────────────────┐
│  × (top-right close button)             │
├─────────────────────────────────────────┤
│                                         │
│  🎨 LOGOTYPE & ICON SYSTEM             │ ← Section title
│                                         │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │  Grid of all images in section  │   │ ← 2-3 column grid
│  │  (masonry layout)                │   │   high-res images
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Description & metadata below           │
│                                         │
└─────────────────────────────────────────┘
```

**Modal Properties:**
- `createPortal` to root
- Backdrop: `bg-black/80 backdrop-blur-sm`
- Animation: scale 0.95 → 1.0, opacity 0 → 1 (400ms)
- Close: ×, ESC key, click-outside
- Content: high-res images + metadata

---

### D. DATA STRUCTURE UPDATES

**Optional: Add to constants.ts (for custom sections):**

```typescript
interface Project {
  // ... existing fields
  
  // NEW - for Behance-style sections
  slides?: string[];
  
  // OPTIONAL custom sections config
  customSections?: {
    id: string;
    title: string;
    description?: string;
    emoji?: string;
    imageIndices: number[]; // Which slides belong to this section
  }[];
  
  // If not provided → auto-detect from filenames
}
```

**Recommended:** Auto-detect only, no manual config (easier to maintain)

---

## 🎨 STYLING GUIDELINES

**Section Layout:**
```css
.section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 48px;
  padding: 32px 0;
  border-top: 1px solid var(--color-border);
}

.section:first-child {
  border-top: none;
}

.section-header {
  grid-column: 1 / -1; /* Span all columns */
  font-size: 24px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.section-header-emoji {
  font-size: 32px;
}
```

**Card Styling:**
```css
.section-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  padding: 24px;
  position: relative;
  overflow: hidden;
  transition: all 300ms ease-[0.16,1,0.3,1];
}

.section-card:hover {
  border-color: var(--color-stone-900);
  box-shadow: var(--shadow-xl);
}

.section-card-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: grayscale(100%);
  transition: filter 400ms ease-out;
}

.section-card:hover .section-card-image {
  filter: grayscale(0%);
}

.section-card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.6) 100%);
  opacity: 0;
  transition: opacity 300ms ease;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 20px;
}

.section-card:hover .section-card-overlay {
  opacity: 1;
}
```

**Color Palette:**
- Background: `bg-stone-50` lub `bg-white`
- Cards: `bg-stone-100`
- Border: `border-stone-300` hover `border-stone-900`
- Text: `text-stone-900`
- Metadata: `text-stone-600`

**Typography:**
- Section titles: `text-2xl font-bold tracking-tight`
- Card titles: `text-lg font-semibold`
- Metadata: `text-sm text-stone-600`
- CTA buttons: `text-xs font-mono uppercase tracking-widest`

**Spacing:**
- Section gap: `gap-24` (desktop), `gap-16` (mobile)
- Card padding: `p-6` (mobile), `p-8` (desktop)
- Section padding: `py-12` between sections

---

## 🔧 IMPLEMENTATION CHECKLIST

### Phase 1: Core Structure (6-8h)
- [ ] Refactor `BrandGridShowcase.tsx` - remove tabs, add sections
- [ ] Implement auto-detection logic (group images by category)
- [ ] Create `Section` component (header + cards)
- [ ] Build CSS Grid with varied cell spans
- [ ] Implement section-level data structure
- [ ] Add metadata cards (subtitle + features + CTA)
- [ ] Basic styling (colors, typography, spacing)
- [ ] Integration z `App.tsx` (keep existing API)
- [ ] Test: AlpineX + Minlime render correctly

### Phase 2: Interactions & Polish (6-8h)
- [ ] Hover effects (overlay, scale, shadow)
- [ ] Grayscale → color transitions
- [ ] Section entrance animations (stagger)
- [ ] Modal deep-view per section
- [ ] CTA button click → modal open
- [ ] Modal close (×, ESC, click-outside)
- [ ] Mobile responsiveness (1 column stack)
- [ ] Accessibility (aria-labels, keyboard nav)

### Phase 3: Advanced Polish (4-6h)
- [ ] Image lazy-loading optimization
- [ ] Framer Motion fine-tuning (easing curves)
- [ ] Performance: Lighthouse >90
- [ ] Mobile touch interactions
- [ ] Subtle micro-animations (button hover, transition states)

---

## 📱 RESPONSIVE STRATEGY

**Mobile (<640px):**
```
🎨 IDENTITY SECTION
┌────────────┐
│  Image 1   │
└────────────┘
Title & metadata

🎨 COLORS SECTION
┌────────────┐
│  Image 1   │
└────────────┘
Title & metadata

...
```
- All sections: 1 column
- Images: color (no grayscale)
- Modal: full-screen
- Buttons: tap-friendly (larger padding)

**Tablet (md: 768px):**
```
┌─────────┬─────────┐
│ Section │ Section │
│    1    │    2    │
├─────────┴─────────┤
│    Section 3      │
└───────────────────┘
```
- 2 columns max
- Sections can be side-by-side
- Modal: `max-w-2xl` centered

**Desktop (lg: 1024px+):**
```
┌──────────┬──────┬──────┐
│ Hero Sec │  S2  │  S3  │
├──────────┼──────┴──────┤
│   Sec4   │    Sec5     │
└──────────┴─────────────┘
```
- 4 columns with varied spans
- Full hover effects
- Modals: `max-w-4xl`

---

## 🎭 USER JOURNEY

1. **User clicks "AlpineX" project header**
   - ProjectRow expands
   - BrandGridShowcase v2 (Behance-style) mounts
   - Sections auto-detect and render
   - Section entrance animations trigger (stagger)

2. **User scrolls through sections**
   - Sees: Identity → Colors → Typography → Patterns → Applications
   - Each section clearly labeled with emoji + title
   - Understands brand as cohesive SYSTEM (not individual files)

3. **User hovers over card** (Desktop)
   - Image: grayscale → color
   - Overlay: gradient appears from right
   - Shadow: deepens
   - CTA: "[EXPLORE SECTION →]" visible

4. **User clicks CTA button or image**
   - Modal opens (center screen)
   - All images from that section in masonry grid
   - High-res view
   - Close: ×, ESC, click-outside

5. **User closes modal**
   - Fade-out animation
   - Returns to section view
   - Scroll position preserved

---

## 🛠️ TECHNICAL NOTES

**Performance:**
- Images lazy-loaded (native `loading="lazy"`)
- Sections render as Motion.div (Framer Motion)
- `will-change: transform` on hover elements
- Modal: `createPortal` for efficient DOM

**Accessibility:**
- All sections: semantic `<section>` tags
- Buttons: `aria-label` descriptive
- Modal: `role="dialog"`, focus trap
- Images: `alt="[Section] - [Item]"`
- Color contrast: WCAG AAA (black text on white: 21:1)
- Keyboard navigation: Tab through sections, modals
- Screen reader: Section titles announced, content readable

**Browser Support:**
- CSS Grid with `grid-column span`: all modern browsers ✅
- CSS Grid `auto-fit`: all modern ✅
- Framer Motion: no IE support needed ✅
- Linear gradients: universal ✅

---

## 📚 REFERENCE IMPLEMENTATIONS

**Behance-inspired patterns (for code reference):**
- Behance.net - section-based grid layouts
- Design systems on Behance - varied grid cell sizes
- Premium design portfolios - CTA integration
- Studio portfolios (Resn, Locomotive) - section headers with emoji/icons

---

## 🚀 DEPLOYMENT NOTES

```bash
# Before deploying:
npm run build    # Verify no build errors
npm run dev      # Test locally
  # Check:
  # - Sections render correctly
  # - Hover effects smooth
  # - Modals work (desktop + mobile)
  # - Animations don't stutter
  # - Images load properly
  
npm run deploy   # Push to GitHub Pages
```

**Pre-Deploy Checklist:**
- [ ] All sections detected and rendered
- [ ] Metadata cards show correct info
- [ ] Hover animations smooth (60fps)
- [ ] Modal opens/closes without lag
- [ ] Mobile responsive (no horizontal scroll)
- [ ] Images load without CORS issues
- [ ] Lighthouse performance >90
- [ ] Lighthouse accessibility >95
- [ ] No console errors or warnings
- [ ] ESC key closes modal
- [ ] Click-outside closes modal
- [ ] Sections entrance animations work

---

## ❓ QUESTIONS FOR AGENT

1. **Should we keep modal ability for individual images too?**
   - **Answer:** YES - click image OR CTA button both open modals
   - Modal can be "single image detail" or "section grid view" (smart detect)

2. **Auto-generate metadata or manual per project?**
   - **Answer:** AUTO-GENERATE using SECTION_TEMPLATES
   - Can be overridden manually in constants.ts if needed

3. **Section order - should it follow filename order or fixed order?**
   - **Answer:** FIXED ORDER (Identity → Colors → Typography → Patterns → Applications → Other)
   - More logical narrative for user

4. **Should we keep old ProjectRow.tsx intact?**
   - **Answer:** YES - only refactor BrandGridShowcase.tsx
   - Other project types keep original slideshow behavior

5. **Custom section titles - how to handle?**
   - **Answer:** Use defaults from SECTION_TEMPLATES
   - Optional override via `constants.ts` if needed

---

## 📝 IMPLEMENTATION PHILOSOPHY

**Key Principles:**
- **Behance-level presentation** - not file explorer vibes
- **Semantic grouping** - brand as SYSTEM, not collection
- **Visual hierarchy** - hero sections, varied sizes, breathing room
- **Professional context** - descriptive labels, metadata, CTAs
- **Smooth interactions** - hover effects, animations, modals
- **AlpiSketch aesthetic** - minimalist, architectural, clean
- **Mobile-first** - responsive, touch-friendly, accessible

**Result:**
Portfolio transforms from "Here are my design files" → "Here's a complete brand identity SYSTEM"

---

## 🎯 SUCCESS METRICS

After implementation:
- ✅ Sections are clearly organized (not scattered files)
- ✅ User understands brand as cohesive whole
- ✅ Hover effects feel premium (smooth, responsive)
- ✅ Modals provide deep-dive capability
- ✅ Mobile experience equals desktop
- ✅ Animations don't distract (subtle, purposeful)
- ✅ Lighthouse score >90
- ✅ Ready for Awwwards submission

---

**Start point:** Refactor existing `BrandGridShowcase.tsx` with new section-based architecture.

Good luck! 🚀🎨