```markdown
# SchoolPay Ledger - Frontend Design Specifications

## 1. Overview

| Property        | Value                                             |
| --------------- | ------------------------------------------------- |
| Product         | SchoolPay Ledger                                  |
| Type            | Web application (desktop-first, responsive)       |
| Framework       | React / Vue / Svelte (unopinionated)              |
| Styling         | Tailwind CSS or styled-components                 |
| Target Browsers | Chrome, Firefox, Safari, Edge (latest 2 versions) |

---

## 2. Color System

| Role          | Hex       | Usage                                   |
| ------------- | --------- | --------------------------------------- |
| Primary       | `#1e3a5f` | Headers, primary buttons, active states |
| Primary Light | `#2c4c7a` | Hover states                            |
| Secondary     | `#2c7a4d` | Success/paid badges, confirm actions    |
| Warning       | `#e6b422` | Partial badges, caution states          |
| Danger        | `#c73e2c` | Unpaid badges, delete actions           |
| Gray 50       | `#f9fafb` | Page background                         |
| Gray 100      | `#f3f4f6` | Card backgrounds, table headers         |
| Gray 200      | `#e5e7eb` | Borders, dividers                       |
| Gray 500      | `#6b7280` | Secondary text, icons                   |
| Gray 900      | `#111827` | Primary text                            |
| White         | `#ffffff` | Card backgrounds, modals                |

---

## 3. Typography

| Element         | Font  | Weight | Size | Line Height |
| --------------- | ----- | ------ | ---- | ----------- |
| Body            | Inter | 400    | 14px | 20px        |
| Small text      | Inter | 400    | 12px | 16px        |
| H1 (page title) | Inter | 600    | 24px | 32px        |
| H2 (section)    | Inter | 500    | 18px | 24px        |
| Card metric     | Inter | 600    | 28px | 36px        |
| Badge           | Inter | 500    | 12px | 16px        |
| Button          | Inter | 500    | 14px | 20px        |

Fallback: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial`

---

## 4. Layout & Spacing

| Element                  | Value                       |
| ------------------------ | --------------------------- |
| Container max-width      | 1440px                      |
| Page padding             | 24px                        |
| Card padding             | 20px                        |
| Card border-radius       | 8px                         |
| Card shadow              | `0 1px 3px rgba(0,0,0,0.1)` |
| Gap (between cards)      | 20px                        |
| Gap (between table rows) | 12px                        |
| Icon size                | 20px                        |

---

## 5. Component Specifications

### 5.1 Navigation (Sidebar)
```

Width: 260px (collapsible to 72px)
Background: White
Border-right: 1px solid #e5e7eb

```

**Nav Items:**
- Dashboard (icon: home)
- Upload (icon: upload)
- Reports (icon: chart)
- Settings (icon: cog)

Active state: Primary text + left border (3px solid `#1e3a5f`)

---

### 5.2 Header

```

Height: 64px
Background: White
Border-bottom: 1px solid #e5e7eb
Padding: 0 24px

```

**Elements:**
- Left: School name (18px, semibold)
- Right: Month selector (dropdown), user avatar (circle, 32px)

**Month Selector:**
- Format: "March 2026"
- Dropdown shows previous/next months
- Icon: calendar

---

### 5.3 Metric Cards

```

Width: auto (flex equal)
Background: White
Border-radius: 8px
Padding: 16px 20px
Shadow: 0 1px 3px rgba(0,0,0,0.05)

```

**Structure:**
```

[label] [icon]
[value]
[trend (optional)]

```

**Icon:** 32px circle background with primary light opacity 10%

---

### 5.4 Status Badges

| Type | Background | Text | Icon |
|------|------------|------|------|
| Paid | `#e8f5e9` | `#2c7a4d` | check-circle |
| Partial | `#fef4e6` | `#b45309` | clock |
| Unpaid | `#fee2e2` | `#c73e2c` | exclamation |

```

Padding: 4px 10px
Border-radius: 40px (pill)
Display: inline-flex
Gap: 6px
Font-size: 12px
Font-weight: 500

```

---

### 5.5 Data Table

**Container:**
```

Background: White
Border-radius: 8px
Border: 1px solid #e5e7eb
Overflow-x: auto

```

**Header:**
```

Background: #f9fafb
Padding: 12px 16px
Font-weight: 500
Border-bottom: 1px solid #e5e7eb

```

**Row:**
```

Padding: 12px 16px
Border-bottom: 1px solid #e5e7eb
Hover background: #f9fafb

```

**Columns:**
| Column | Width | Align |
|--------|-------|-------|
| Student Name | 20% | left |
| Grade | 12% | left |
| Parent Contact | 20% | left |
| Status | 12% | left |
| Amount Paid | 12% | right |
| Balance | 12% | right |
| Actions | 12% | center |

**Actions:** Three-dot menu (icon) → dropdown: View Details, Send Reminder, Record Payment

---

### 5.6 Buttons

| Type | Background | Text | Border | Usage |
|------|------------|------|--------|-------|
| Primary | `#1e3a5f` | white | none | Main actions (Save, Upload, Export) |
| Secondary | transparent | `#1e3a5f` | 1px `#1e3a5f` | Cancel, Back |
| Danger | `#c73e2c` | white | none | Delete, Remove |
| Ghost | transparent | `#6b7280` | none | Icon buttons, contextual |

**Padding:** Primary: 8px 20px, Ghost: 8px

**Border-radius:** 6px

---

### 5.7 Modal / Side Panel

**Modal (confirmation):**
- Width: 480px
- Centered overlay (background: rgba(0,0,0,0.5))
- Padding: 24px
- Buttons: Cancel + Confirm

**Side Panel (student detail):**
- Width: 480px
- Right side slide-in
- Overlay: none (push content)
- Header with title + close icon
- Footer with action buttons

---

### 5.8 Forms

**Input Field:**
```

Padding: 8px 12px
Border: 1px solid #e5e7eb
Border-radius: 6px
Focus: border-primary + ring (0 0 0 2px rgba(30,58,95,0.2))
Height: 40px

```

**Label:**
```

Font-size: 14px
Font-weight: 500
Margin-bottom: 6px

```

**Select:**
Same as input, with dropdown chevron icon

---

### 5.9 CSV Upload Area

```

Border: 2px dashed #e5e7eb
Border-radius: 8px
Padding: 48px
Text-align: center
Background: #f9fafb
Drag-active: border-primary + background #f0f4f9

```

**Elements:**
- Upload icon (cloud upload, 48px, gray-400)
- Title: "Drag and drop CSV file or click to browse"
- Subtitle: "Format: Student ID, Student Name, Amount, Status, Month"
- Accepted file: .csv, max 10MB

---

### 5.10 Toast Notifications

```

Position: top-right, fixed
Padding: 12px 16px
Border-radius: 6px
Shadow: 0 4px 6px rgba(0,0,0,0.1)
Duration: 4 seconds

```

| Type | Background | Icon |
|------|------------|------|
| Success | `#e8f5e9` | check-circle |
| Error | `#fee2e2` | alert-circle |
| Info | `#e6f0fa` | info |

---

## 6. Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| > 1200px | Full sidebar, multi-column metrics |
| 768px - 1200px | Collapsed sidebar, 2-column metrics |
| < 768px | Hidden sidebar (hamburger menu), stacked cards, table horizontal scroll |

---

## 7. Empty States

| Component | Empty State Message |
|-----------|---------------------|
| Dashboard | "No students added yet. Upload a CSV to get started." + Upload button |
| Reports | "No payment data available for the selected period." |
| Upload | No custom message, show dropzone |

---

## 8. Loading States

- Skeleton loaders for metric cards (4 cards)
- Skeleton rows for table (5 rows)
- Spinner on buttons during async actions (size: 16px, color: white or primary)

---

## 9. Icon Set

Use **Heroicons** (outline style, 20px default size)

| Feature | Icon |
|---------|------|
| Dashboard | home |
| Upload | cloud-arrow-up |
| Reports | chart-bar |
| Settings | cog-6-tooth |
| Export | arrow-down-tray |
| Filter | funnel |
| Search | magnifying-glass |
| Menu (dots) | ellipsis-vertical |
| Close | x-mark |
| Calendar | calendar |
| User | user-circle |
| Check | check-circle |
| Clock | clock |
| Exclamation | exclamation-triangle |

---

## 10. Page-Specific Requirements

### Dashboard
- Month selector in header affects all metrics and table
- Table default sort: Unpaid first, then Partial, then Paid
- Click student row opens side panel

### Upload Page
- Preview table after CSV upload shows first 5 rows
- Column mapping: auto-detect (Student Name, Amount, Status, Month)
- "Confirm Upload" button disabled until mapping confirmed

### Reports Page
- Bar chart: library agnostic (Chart.js, Recharts, etc.)
- Chart: Paid vs Unpaid by grade
- Export buttons: "Export Unpaid List (CSV)", "Export Summary (CSV)"

### Settings Page
- School profile: name, logo (image upload, preview)
- Tuition: number input with "$" prefix, default 7000
- Reminder template: textarea (pre-filled default message)

---

## 11. Accessibility

- All interactive elements keyboard navigable (tab order)
- ARIA labels on icon-only buttons
- Color not sole indicator of status (badges have icons)
- Focus visible outlines on all interactive elements
- Semantic HTML (main, nav, header, section)

---

## 12. Deliverables for Frontend Team

1. Component library (Storybook optional)
2. Responsive layout implementation
3. API integration layer (fetch wrapper, error handling)
4. State management (local state for UI, global for data)
5. CSV parsing library (PapaParse recommended)
6. Chart library integration
7. Unit tests for critical components (metric cards, status badges, table)

---

**Version:** 1.0
**Last Updated:** March 2026
```
