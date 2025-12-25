# 🎨 AGENT AI PROMPT v3.1 - UNIFIED MASONRY GRID WITH SMART GROUPING

## KONTEKST PROJEKTU
- **Projekt:** AlpiSketch Architectural Minimalist Portfolio
- **Stack:** React 19 + TypeScript + Vite 6 + Framer Motion 12 + Tailwind CSS
- **URL:** GitHub Pages, deploy: `npm run deploy`
- **Design System:** stone-* colors, easing [0.16,1,0.3,1], responsive md/lg breakpoints
- **Status:** V3.1 - UNIFIED MASONRY WITH SMART SLIDE GROUPING

---

## 🎯 ZADANIE - IMPLEMENTATION GOAL V3.1

**UNIFIED MASONRY GRID WITH SMART SLIDE GROUPING**

User zaktualizował ALL filenames na format: `NameSlideX` (gdzie X = slide number 1-12).

**Key Feature: SMART GROUPING**
- Files with SAME SLIDE NUMBER = grupuj razem, wyświetl obok siebie
- Files with UNIQUE SLIDE NUMBER = wyświetl samodzielnie
- Grouped items = lekko mniejsze (aby ładnie wchodziły w grid)
- Visual result = chaotycznie ale organizacyjnie sensownie ułożone (jak reference photo)

**Example:**
```
Slide 8 ma 2 pliki (Pattern1Slide8 + Pattern2Slide8):
┌─────────┬─────────┐
│ Pattern │ Pattern │ ← Razem w tym samym grid area, 2 małe obok siebie
│    1    │    2    │
└─────────┴─────────┘

Slide 4 ma 1 plik (ColorPaletteSlide4):
┌──────────────────────┐
│  Color Palette       │ ← Samodzielnie, pełny rozmiar
│                      │
└──────────────────────┘
```

**Key Requirements:**
- ❌ NO sections dividing content
- ❌ NO filters/tabs
- ✅ ONE unified masonry grid
- ✅ **AUTO-DETECT slide numbers from filenames**
- ✅ **GROUP files with same slide number** (display side-by-side)
- ✅ **SCALE grouped items** (slightly smaller than solo items)
- ✅ Varied grid sizes based on grouping
- ✅ Responsive adapts beautifully
- ✅ Professional hover/modal interactions

---

## 📋 REQUIREMENTS - SZCZEGÓŁOWE

### A. ARCHITEKTURA KOMPONENTY

**Komponent:** `BrandGridShowcase.tsx` (refactor)
- **Lokalizacja:** `src/components/BrandGridShowcase.tsx`
- **Zmiana:** Parse filenames → extract slide numbers → group → render intelligently
- **Data:** Use all slides, smart grouping based on slide number

---

### B. SMART SLIDE GROUPING ALGORITHM

#### **1️⃣ PARSE FILENAMES & GROUP SLIDES**

**Algorithm:**

```typescript
interface SlideGroup {
  slideNumber: number;      // e.g., 8
  files: string[];          // e.g., ["Pattern1Slide8.jpg", "Pattern2Slide8.jpg"]
  isGrouped: boolean;       // true if files.length > 1
  displayAs: 'solo' | 'group';
}

function parseAndGroupSlides(slides: string[]): SlideGroup[] {
  const groups = new Map<number, SlideGroup>();

  // Parse each filename to extract slide number
  slides.forEach((filename) => {
    // Extract number from "NameSlide8.jpg" → 8
    const match = filename.match(/Slide(\d+)/i);
    const slideNum = match ? parseInt(match[1], 10) : null;

    if (slideNum !== null) {
      if (!groups.has(slideNum)) {
        groups.set(slideNum, {
          slideNumber: slideNum,
          files: [],
          isGrouped: false,
          displayAs: 'solo',
        });
      }

      groups.get(slideNum)!.files.push(filename);
    }
  });

  // Mark grouped items
  groups.forEach((group) => {
    group.isGrouped = group.files.length > 1;
    group.displayAs = group.isGrouped ? 'group' : 'solo';
  });

  // Return sorted by slide number
  return Array.from(groups.values()).sort((a, b) => a.slideNumber - b.slideNumber);
}

// Example output:
// [
//   { slideNumber: 1, files: ["LogoSlide1.jpg"], isGrouped: false, displayAs: 'solo' },
//   { slideNumber: 2, files: ["LogoVariationsSlide2.jpg"], isGrouped: false, displayAs: 'solo' },
//   { slideNumber: 8, files: ["Pattern1Slide8.jpg", "Pattern2Slide8.jpg"], isGrouped: true, displayAs: 'group' },
//   ...
// ]
```

---

#### **2️⃣ GRID LAYOUT LOGIC**

**Desktop (4 columns):**

```
┌────────────┬────────────┬────────────┬────────────┐
│            │            │            │            │
│  Slide 1   │ Slide 2    │ Slide 3    │ Slide 4    │ ← 1x1 each
│ (solo)     │ (solo)     │ (solo)     │ (solo)     │
│            │            │            │            │
├────────────┼────────────┴────────────┼────────────┤
│            │                        │            │
│  Slide 5   │  Slide 6 (solo - 2x1) │  Slide 7   │ ← Slide 6 wider
│ (solo)     │                        │ (solo)     │
│            │                        │            │
├────────────┼────────────┬───────┬────┼────────────┤
│            │            │ Slide 8 │   │            │
│ Slide 8    │ Slide 9    │ GROUP  │   │ Slide 9    │ ← Grouped: 2 files side-by-side (smaller)
│ GROUP      │ (solo)     │  img1  │   │ (solo)     │
│  img1|img2 │            │  img2  │   │            │
│(2x1 grid)  │            │        │   │            │
└────────────┴────────────┴────────┴────┴────────────┘
```

**CSS Grid Strategy:**

```css
.masonry-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 300px;
  gap: 16px;
}

/* SOLO items (1 file) */
.grid-item--solo {
  grid-column: span 1;
  grid-row: span 1;
}

.grid-item--solo:nth-of-type(6n) {
  grid-column: span 2; /* Every 6th solo item: wider */
}

.grid-item--solo:nth-of-type(8n) {
  grid-row: span 2; /* Every 8th solo item: taller */
}

/* GROUPED items (2+ files in same slide) */
.grid-item--group {
  grid-column: span 1;
  grid-row: span 1;
  
  display: grid;
  grid-template-columns: 1fr 1fr; /* Side-by-side */
  gap: 8px; /* Small gap between grouped files */
  
  padding: 12px; /* Padding for grouped container */
}

/* GROUPED subitem image */
.grid-item--group .group-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}
```

---

#### **3️⃣ RENDERING LOGIC**

**Component structure:**

```typescript
function BrandGridShowcase({ project, onClose }: BrandGridShowcaseProps) {
  // Parse and group slides
  const slideGroups = parseAndGroupSlides(project.slides);

  return (
    <motion.div className="masonry-grid" variants={containerVariants}>
      {slideGroups.map((group, index) => (
        group.isGrouped ? (
          // GROUPED: Multiple files in same slide
          <motion.div
            key={`group-${group.slideNumber}`}
            className="grid-item--group"
            variants={itemVariants}
            custom={index}
          >
            {group.files.map((file) => (
              <div
                key={file}
                className="group-image-wrapper"
                onClick={() => openModal(file)}
              >
                <img
                  src={file}
                  alt={`Slide ${group.slideNumber}`}
                  className="group-image"
                  loading="lazy"
                />
                {/* Hover overlay (applies to both images) */}
                <div className="hover-overlay">
                  <Eye size={20} />
                  <span>VIEW</span>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          // SOLO: Single file
          <motion.div
            key={`solo-${group.slideNumber}`}
            className="grid-item--solo"
            variants={itemVariants}
            custom={index}
            onClick={() => openModal(group.files[0])}
          >
            <img
              src={group.files[0]}
              alt={`Slide ${group.slideNumber}`}
              loading="lazy"
            />
            {/* Hover overlay */}
            <div className="hover-overlay">
              <Eye size={20} />
              <span>VIEW</span>
            </div>
          </motion.div>
        )
      ))}
    </motion.div>
  );
}
```

---

### C. VISUAL PRESENTATION

#### **1️⃣ SOLO ITEMS (Normal)**

```
┌──────────────────────┐
│                      │
│   Image (Full)       │
│   Grayscale          │
│                      │
│ ON HOVER:            │
│ ┌──────────────────┐ │
│ │ Gradient OVL +   │ │
│ │ Eye Icon + VIEW  │ │
│ └──────────────────┘ │
└──────────────────────┘
```

---

#### **2️⃣ GROUPED ITEMS (2 files)**

```
┌─────────────────────────┐
│ ┌────────┐ ┌────────┐  │
│ │        │ │        │  │
│ │ Image1 │ │ Image2 │  │ ← Side-by-side, smaller
│ │Grayscale Grayscale│  │
│ └────────┘ └────────┘  │
│ ┌─────────────────────┐ │
│ │ Gradient OVL        │ │ ← Overlay covers both
│ │ Eye Icon + VIEW     │ │
│ └─────────────────────┘ │
└─────────────────────────┘

Grid item size: 1x1 (same as solo)
But contains 2 images inside (scaled smaller)
Hover overlay covers entire group
Click on any image in group: open modal
```

---

### D. HOVER & INTERACTION

#### **1️⃣ SOLO ITEM HOVER**

**Standard hover effect:**
- Grayscale → color (300ms)
- Overlay gradient slides in
- Scale: 1 → 1.03
- Shadow deepens
- Eye icon + "VIEW" text appears

---

#### **2️⃣ GROUPED ITEMS HOVER**

**Smart hover:**
- **Option A:** Both images in group → color together
- **Option B:** Each sub-image has own hover state
- **Recommended:** Option A - cleaner UX
  
**Behavior:**
```
BEFORE HOVER:
┌─────────┬─────────┐
│ Image 1 │ Image 2 │ (both grayscale)
└─────────┴─────────┘

ON HOVER:
┌─────────┬─────────┐
│ Color 1 │ Color 2 │ (both color)
└─────────┴─────────┘
WITH OVERLAY covering entire group area
```

**Tech:**
- Hover on container applies to all children
- All images desaturate together
- Single overlay for entire group
- Click anywhere in group: opens modal (shows which image clicked)

---

#### **3️⃣ MODAL BEHAVIOR**

**On click (solo or grouped):**
- Modal opens
- Shows clicked image (HIGH-RES)
- If grouped: show which of the 2 images is displayed
- Navigation: prev/next within same slide group (if grouped)

**Modal structure:**
```
┌─────────────────────────────────┐
│ × (close)                       │
├─────────────────────────────────┤
│                                 │
│       HIGH-RES IMAGE            │
│       max-h-[90vh]              │
│       object-contain            │
│                                 │
│ (if grouped: "Image 1 of 2" text)
│                                 │
│ [← prev] [next →] (if grouped)  │
│                                 │
└─────────────────────────────────┘
```

---

### E. RESPONSIVE ADJUSTMENTS

#### **Mobile (<640px)**

**Changes:**
- Grid: 1 column
- All items: 1x1 (no spans)
- Grouped items: STACK vertically instead of side-by-side

```css
.grid-item--group {
  grid-template-columns: 1fr; /* Stack vertically */
  gap: 8px;
}
```

Visual result:
```
Slide 8 (grouped):
┌──────────┐
│ Image 1  │
├──────────┤
│ Image 2  │
└──────────┘
(Taller on mobile, but still in 1 grid cell)
```

---

#### **Tablet (md: 768px)**

**Changes:**
- Grid: 2 columns
- Grouped items: STILL side-by-side (no stacking)
- Some solo items span 2 columns

```css
.grid-item--group {
  grid-template-columns: 1fr 1fr; /* Keep side-by-side */
}
```

---

#### **Desktop (lg: 1024px+)**

**Full masonry with grouping:**
- 4 columns
- Solo items: varied spans (1x1, 2x1, 1x2, 2x2)
- Grouped items: 1x1 (contains 2 images)
- Grouped items: slightly smaller fonts/icons

---

### F. ANIMATIONS

#### **1️⃣ Grid Entrance**

**Per slide group (whether solo or grouped):**
```
Group 0: appear at delay 0ms
Group 1: appear at delay 50ms
Group 2: appear at delay 100ms
... (each +50ms)
```

**Animation:**
- Opacity: 0 → 1 (400ms)
- Y: 20px → 0px (400ms)
- Scale: 0.95 → 1.0 (400ms)
- Easing: [0.16,1,0.3,1]

---

#### **2️⃣ Grouped Images Animation**

**On hover (grouped item):**
- Both images desaturate simultaneously
- Stagger NOT needed (they're related)
- Single overlay fade-in

---

### G. DATA STRUCTURE

**No changes to constants.ts:**
- Keep existing `slides: string[]` array
- Files MUST follow naming: `NameSlideX.jpg` (X = 1-12)
- Component auto-parses and groups

**Example slides array:**
```typescript
slides: [
  "LogoSlide1.jpg",
  "LogoVariationsSlide2.jpg",
  "ColorPaletteSlide4.jpg",
  "TypographySlide5.jpg",
  "Pattern1Slide8.jpg",      // ← Grouped
  "Pattern2Slide8.jpg",      // ← Grouped (same slide number)
  "AlpineXSlide1.jpg",
  "ShowcaseSlide3.jpg",
  "Matchday2Slide9.jpg",
  "VictorySlide10.jpg",
  "DefeatSlide11.jpg",
  "BlackWhiteLogoSlide12.jpg",
]
```

---

## 🎨 STYLING GUIDELINES

**Colors:**
- Background: `bg-stone-50`
- Solo card: `bg-stone-100`
- Grouped card: `bg-stone-100` (same)
- Border: `border-stone-300` hover `border-stone-900`
- Text: `text-stone-900`

**Grouped Items Specifics:**
```css
.grid-item--group {
  padding: 12px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.group-image {
  border-radius: 4px; /* Slightly rounded inside container */
}

.group-image-wrapper {
  position: relative;
  cursor: pointer;
}
```

**Spacing:**
- Grid gap: `gap-4` (mobile), `gap-6` (tablet), `gap-4` (desktop)
- Grouped internal gap: `gap-2` md:`gap-3` lg:`gap-2`
- Grouped padding: `p-3` md:`p-4` lg:`p-2`

**Effects:**
- Solo hover: `shadow-xl`
- Grouped hover: `shadow-xl` (same)
- Overlay: `linear-gradient(90deg, transparent, rgba(0,0,0,0.7))`

---

## 🔧 IMPLEMENTATION CHECKLIST

### Phase 1: Core Grid with Grouping (8-10h)
- [ ] Parse filenames: extract slide numbers
- [ ] Group slides by number
- [ ] Create data structure: SlideGroup[]
- [ ] Render solo items vs grouped items
- [ ] Implement CSS Grid (responsive 1/2/4 columns)
- [ ] Add grayscale filter to images
- [ ] Grouped items: side-by-side layout (desktop), stack (mobile)
- [ ] Basic styling (colors, gaps, borders)
- [ ] Integration with `App.tsx`
- [ ] Test: AlpineX + Minlime render correctly with grouping

### Phase 2: Interactions (6-8h)
- [ ] Hover effects (grayscale → color for solo AND grouped)
- [ ] Overlay gradient on hover
- [ ] Scale/shadow on hover
- [ ] Modal click-to-expand (works for solo and grouped)
- [ ] Modal navigation (prev/next for grouped items)
- [ ] Modal close (×, ESC, click-outside)
- [ ] Entrance animations (stagger per group)
- [ ] Mobile responsiveness (1 col, grouped stack)

### Phase 3: Polish (4-6h)
- [ ] Framer Motion fine-tuning
- [ ] Image lazy-loading
- [ ] Accessibility (aria-labels, keyboard nav)
- [ ] Performance (Lighthouse >90)
- [ ] Micro-animations

---

## 📱 RESPONSIVE STRATEGY

**Mobile (<640px):**
- 1 column grid
- All solo items: 1x1
- Grouped items: stack vertically (2 images stacked, not side-by-side)
- No grayscale (always color)
- Gap: 16px

**Tablet (md: 768px):**
- 2 columns grid
- Some solo items: 2 columns span
- Grouped items: STILL side-by-side (important!)
- Gap: 20px

**Desktop (lg: 1024px+):**
- 4 columns grid
- Solo items: varied spans (1x1, 2x1, 1x2, 2x2)
- Grouped items: 1x1 (contains 2 images)
- Grayscale hover → color
- Full hover effects
- Gap: 24px

---

## 🎭 USER JOURNEY

1. **User clicks project (AlpineX)**
   - BrandGridShowcase mounts
   - Slides parsed & grouped
   - Grid items appear with stagger animation

2. **User sees grid**
   - Mostly solo items (1 file per slide)
   - Some grouped items (2 files, same slide number, side-by-side)
   - Visual understanding: "Complete brand, smartly organized"

3. **User hovers over item**
   - Solo: standard grayscale → color
   - Grouped: both images → color together
   - Overlay appears
   - "VIEW" text visible

4. **User clicks**
   - Modal opens
   - If grouped: shows which image, with prev/next nav
   - If solo: shows image normally

5. **User closes modal**
   - Grid visible, state preserved

---

## 🛠️ TECHNICAL NOTES

**File naming convention (CRITICAL):**
- Format: `{Name}Slide{Number}.{ext}`
- Example: `Pattern1Slide8.jpg`, `LogoSlide1.jpg`, `ColorPaletteSlide4.jpg`
- Parser looks for `/Slide(\d+)/i` regex

**Parsing edge cases:**
- Files without slide number: ignored (or treated as "other")
- Duplicate filenames: last one wins (or both included if numbers match)
- Out-of-order filenames: sorted by slide number

**Performance:**
- Grouped items: no extra DOM overhead
- Grouped images: lazy-loaded (each has `loading="lazy"`)
- Grid: `will-change: transform` on hover
- Modal: `createPortal`

**Accessibility:**
- Solo: `alt="Brand element - Slide X"`
- Grouped: `alt="Slide X - Image 1 of 2"`
- Modal nav: keyboard arrows work
- Focus trap in modal

---

## 🚀 DEPLOYMENT NOTES

```bash
npm run dev    # Test locally

# CHECK:
# - Filenames parsed correctly (slide numbers extracted)
# - Grouping works (files with same number together)
# - Grid layout correct (solo vs grouped)
# - Hover smooth (both solo and grouped)
# - Modal shows correct image
# - Grouped: prev/next navigation works
# - Mobile: grouped items stack vertically
# - Tablet: grouped items side-by-side
# - All images load

npm run deploy # Push to GitHub Pages
```

**Pre-Deploy Checklist:**
- [ ] File naming matches `NameSlideX.jpg` pattern
- [ ] Grouped items display side-by-side (desktop)
- [ ] Grouped items stack vertically (mobile)
- [ ] Modal prev/next works for grouped
- [ ] Hover animations smooth (60fps)
- [ ] Grayscale → color smooth
- [ ] All images load CORS-free
- [ ] Lighthouse performance >90
- [ ] Lighthouse accessibility >95
- [ ] No console errors

---

## ❓ QUESTIONS FOR AGENT

1. **If file has no slide number, what to do?**
   - **Answer:** Create default group with unique number (e.g., 999) or warn in console

2. **Grouped item click: open which image?**
   - **Answer:** The one clicked. Modal shows which of 2 displayed.

3. **Grouped items: should they count as 1 grid item or 2?**
   - **Answer:** 1 grid item (grouped cell). But 2 images displayed inside.

4. **Should grouped items have different styling (border, shadow)?**
   - **Answer:** NO - same as solo items. Only internal layout differs.

5. **If 3+ files same slide number?**
   - **Answer:** Support only pairs (2 files). If 3+, treat as 2+1 (group 2, add 1 solo).

---

## 📝 KEY PHILOSOPHY

**Result:**
✨ Single beautiful grid where files are intelligently grouped by slide number
✨ Creates visual context (e.g., "Pattern 1" and "Pattern 2" together make sense)
✨ Still maintains organic, interesting composition
✨ User sees complete brand at a glance, with logical relationships visible

---

**Inspirations:**
- Your reference image (chaotic but organized)
- Masonry layouts with intelligent grouping
- Design portfolios that show relationships

---

**Success = Smart grouping enhances understanding without breaking grid aesthetic**

Good luck! 🚀🎨