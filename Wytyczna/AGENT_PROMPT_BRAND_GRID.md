# 🎯 AGENT AI PROMPT - BRAND GRID SHOWCASE SYSTEM

## KONTEKST PROJEKTU
- **Projekt:** AlpiSketch Architectural Minimalist Portfolio
- **Stack:** React 19 + TypeScript + Vite 6 + Framer Motion 12 + Tailwind CSS
- **URL:** GitHub Pages, deploy: `npm run deploy`
- **Design System:** stone-* colors, easing [0.16,1,0.3,1], responsive md/lg breakpoints

---

## 🎯 ZADANIE - IMPLEMENTATION GOAL

**Zmień presentację projektów "Brand Identity" z LINEAR SLIDES na INTERACTIVE GRID SHOWCASE.**

Skonkretyzowane dla: **AlpineX, Minlime** i przyszłych projektów brand identity.

---

## 📋 REQUIREMENTS - SZCZEGÓŁOWE

### A. STRUKTURA KOMPONENTU

**Nowy komponent:** `BrandGridShowcase.tsx`
- **Lokalizacja:** `src/components/BrandGridShowcase.tsx`
- **Zastępuje:** `ProjectRow.tsx` render dla `slides`-based projektów
- **Integracja:** Conditional render w `App.tsx` na podstawie typu projektu

---

### B. FUNCTIONALITY

#### 1️⃣ **TAB SYSTEM** (Top of section)
```
[All] [Logotype] [Colors] [Typography] [Patterns] [Applications]
```

**Logika:**
- **All** → pokazuje wszystkie slajdy w masonry grid
- **Logotype** → slajdy zawierające "logo" w nazwie (case-insensitive)
- **Colors** → slajdy zawierające "color" / "palette"
- **Typography** → slajdy zawierające "typography" / "type"
- **Patterns** → slajdy zawierające "pattern"
- **Applications** → slajdy zawierające "app" / "application" / "victory" / "defeat" / "matchday"

**Default:** "All" tab aktywny

---

#### 2️⃣ **GRID LAYOUT** (Masonry)

**CSS Grid Structure:**
```css
display: grid;
grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
gap: 16px;
```

**Responsive Breakpoints:**
- **Mobile** (<640px): 1 column
- **Tablet** (md): 2 columns
- **Desktop** (lg): 3-4 columns (auto-fit)
- **XL** (xl): 4 columns

**Cell Sizing:**
- Każde zdjęcie aspect-ratio własne (preserve)
- object-contain (nie crop)
- max-height: 400px (desktop), 300px (mobile) — aby nie było zbyt duże

---

#### 3️⃣ **CARD COMPONENT** (Grid item)

**Struktura einzelnej karty:**
```
┌─────────────────────┐
│                     │
│   Image (Full)      │
│   (Grayscale)       │
│                     │
├─────────────────────┤
│ Filename (small)    │
│ [i] info icon       │
└─────────────────────┘
```

**Interakcje:**

a) **Hover (Desktop)**
   - Image: color (grayscale → full color) z easing 0.3s
   - Border: `border-2 border-stone-800` pojawia się
   - Scale: subtle `scale-102` (1.02x)
   - Shadow: `shadow-lg` pojawia się
   - Label fade-in: opacity 0→1

b) **Click**
   - Modal full-screen z HIGH-RES image
   - Tło: semi-transparent overlay `bg-black/80`
   - Obrazek: centered, max-h-[85vh], object-contain
   - Close: `×` button top-right, ESC key, click-outside

c) **Mobile**
   - Tap zamiast hover
   - Kartka bez hover effects (tylko border on tap)
   - Image natychmiast full-color (brak grayscale mobile)

---

#### 4️⃣ **ANIMATION STRATEGY**

**On Tab Change:**
- Grid items fade-out: opacity 0 (150ms)
- Filter zmienia się
- Grid items fade-in: opacity 1 + stagger (75ms delay between items)
- First item: delay 0ms, second: 75ms, third: 150ms, etc.

**Framer Motion:**
```typescript
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.075,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};
```

**Grid Entrance:**
- Po otwarciu projektów: cards wjeżdżają z opóźnieniem (stagger effect)

---

### C. DATA STRUCTURE CHANGES

**Update `constants.ts`:**

```typescript
interface Project {
  // ... istniejące pola
  
  // NOWE - dla Brand Grid
  slides?: string[];           // Jak obecnie
  gridMode?: "masonry" | "slides"; // "masonry" → nowy grid, "slides" → stary slideshow
  slideCategories?: Record<string, string[]>; // OPTIONAL - advanced filtering
  
  // EXAMPLE:
  slideCategories?: {
    all: ["Slide1", "Slide2", ...],
    logotype: ["LogoShowcase.jpg"],
    colors: ["ColorPalette.jpg"],
    typography: ["Typography.jpg"],
    patterns: ["Pattern1.jpg", "Pattern2.jpg"],
    applications: ["Victory.jpg", "Defeat.jpg", "Matchday.jpg"],
  }
}
```

**UPROSZCZONE (rekomendowane):**
- Auto-detect na podstawie nazwy pliku
- Nie potrzeba manualne kategorizacji w `constants.ts`
- Agent wydzieli kategorie z nazw automatycznie

---

### D. COMPONENT API

**Użycie w App.tsx:**

```typescript
{activeProject === 'p1' && (
  <BrandGridShowcase
    project={PROJECTS[0]} // AlpineX
    onClose={() => setActiveProject(null)}
  />
)}
```

---

## 🎨 STYLING - DESIGN GUIDELINES

**Color Palette:**
- Background: `bg-stone-50` lub `bg-white`
- Cards: `bg-stone-100` hover `bg-stone-50`
- Border: `border-stone-300` hover `border-stone-800`
- Text: `text-stone-900` labels, `text-stone-600` meta

**Typography:**
- Tab labels: `text-sm font-mono uppercase tracking-widest`
- Card label: `text-xs text-stone-600 mt-2`
- Kategoria na hover: inline `text-stone-700 font-medium`

**Spacing:**
- Grid gap: `gap-4` (mobile), `gap-6` (desktop)
- Padding: `p-6` cards
- Section padding: `px-6 md:px-12 lg:px-24 py-24`

**Shadows:**
- Default: none
- Hover: `shadow-lg`
- Modal: `shadow-2xl`

---

## 🔧 IMPLEMENTATION CHECKLIST

### Phase 1: Core Grid (Easy - 4-6h)
- [ ] Create `BrandGridShowcase.tsx` component
- [ ] CSS Grid layout (responsive)
- [ ] Tab selector (basic)
- [ ] Image filtering logic
- [ ] Grayscale → color hover
- [ ] Basic modal (click to expand)
- [ ] Integration z `App.tsx` (conditional render dla slides projects)
- [ ] Test: AlpineX + Minlime
- [ ] Deploy & check responsiveness

### Phase 2: Polish + Animations (Medium - 4-6h)
- [ ] Framer Motion stagger entrance
- [ ] Tab transition animations (fade + stagger)
- [ ] Hover interactions (border, shadow, scale)
- [ ] Mobile tap behavior (no grayscale)
- [ ] Modal animations (scale + fade)
- [ ] ESC key close modal
- [ ] Accessibility (aria-labels, keyboard nav)
- [ ] Performance optimization (lazy image loading)

### Phase 3: Advanced (Optional - 6-8h)
- [ ] Color highlighting (show items with same color palette)
- [ ] Detailed metadata cards (hover show: dimensions, format, etc.)
- [ ] 3D parallax depth effect (advanced)
- [ ] Export/download capability per item
- [ ] "View Related" suggestions (items in same category)

---

## 📱 RESPONSIVE STRATEGY

**Mobile (<640px):**
```
[All] [Logo] [Color] [Type]
(scroll horizontal or stack vertically)

Grid: 1 column
Images: grayscale OFF (always color)
Modal: full-screen, tight padding
```

**Tablet (md: 768px):**
```
[All] [Logo] [Colors] [Typography] [Patterns] [Apps]

Grid: 2 columns
Gap: 16px
Modal: centered, max-w-2xl
```

**Desktop (lg: 1024px+):**
```
[All] [Logotype] [Colors] [Typography] [Patterns] [Applications]

Grid: 3-4 columns (auto-fit)
Gap: 24px
Modal: centered, max-w-3xl
Hover effects: full
```

---

## 🎭 USER JOURNEY

1. **User clicks "AlpineX" project header**
   - ProjectRow expands
   - BrandGridShowcase montuje się w sekcji expanded
   - Wszystkie slajdy ładują się w "All" tab (stagger animation)

2. **User patrzy na grid**
   - Widzi ~12 items (logo, colors, patterns, apps, etc.)
   - Każde zdjęcie grayscale (desktop)
   - Natychmiast widać kolory i tematykę brandu

3. **User kliknie na "Colors" tab**
   - Grid fade-out
   - Filter aplikuje się (pokazuje tylko color-related slides)
   - Grid fade-in z nową subset (np. 2-3 items, ColorPalette, etc.)
   - Stagger animation od nowa

4. **User hovers over card**
   - Image: color (grayscale → full)
   - Border: highlight
   - Label: fade-in
   - Cursor: pointer

5. **User clicks card**
   - Modal opens (center screen, blurred overlay)
   - Full-res image
   - Title: filename
   - Close: ×, ESC, click-outside

6. **User closes modal**
   - Fade-out animation
   - Grid stays active (tab selection preserved)

---

## 🛠️ TECHNICAL NOTES

**Performance:**
- Images lazy-loaded (native `loading="lazy"`)
- Modals use `createPortal` do root
- Framer Motion: `will-change` na animated elements
- No localStorage/sessionStorage (sandbox restriction)

**Accessibility:**
- All buttons: `aria-label`
- Tab selector: keyboard navigation (arrow keys)
- Modal: `role="dialog"`, focus trap
- Images: `alt="[Project Name] - [Slide Name]"`
- Color contrast: WCAG AA minimum

**Browser Support:**
- CSS Grid: all modern browsers ✅
- Framer Motion: no IE11 needed ✅
- Object-contain: universal ✅

---

## 📚 REFERENCE IMPLEMENTATIONS

**Inspiracje (for code patterns):**
- Resn.com - bento grid masonry
- Locomotive.ca - tab switching with smooth transitions
- Bruno Simon portfolio - modal interactions
- Ramotion.com - card hover states

---

## 🚀 DEPLOYMENT NOTES

```bash
# After implementation:
npm run build    # Verify no errors
npm run dev      # Test locally (both desktop + mobile via localhost:5173)
npm run deploy   # Push to GitHub Pages
```

**Test Checklist Before Deploy:**
- [ ] All tabs filter correctly
- [ ] Animations smooth on desktop
- [ ] Mobile responsive (1 col, tap-to-expand)
- [ ] Modal works (open/close/keyboard)
- [ ] Images load without CORS issues
- [ ] Lighthouse performance >85
- [ ] No console errors

---

## ❓ QUESTIONS FOR AGENT

1. Should we keep old "slides" mode for other projects (Posters, Website Design)?
   - **Answer:** YES - only apply BrandGridShowcase to brand identity projects
   - Other projects keep ProjectRow + slides mode

2. Should tabs auto-populate or manual in constants?
   - **Answer:** AUTO-DETECT from filenames (easier maintenance)

3. Mobile: hide tabs or stack vertically?
   - **Answer:** STACK vertically, horizontal scroll on larger tabs

4. Should we show project description somewhere?
   - **Answer:** YES - above grid, same as current (title + description)

---

## 📝 FINAL NOTES

- **Goal:** Transform "boring slideshow" → "beautiful brand system showcase"
- **Key:** Show visual cohesion - wszystkie elementy grają razem
- **Philosophy:** Align z AlpiSketch minimalism + architectural thinking
- **Result:** Awwwards-level presentation dla brand identity projektów

**Start point:** Create `BrandGridShowcase.tsx`, export it, integrate into App.tsx conditional render.

Good luck! 🚀