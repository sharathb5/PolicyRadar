# Legend/Help Implementation Plan

**Date**: 2025-01-XX  
**Goal**: Add Policy Radar Number Key legend to frontend in a non-invasive, simple way

---

## 🎯 Design Approach

### Primary: Help Icon in Header → Dialog Modal
- **Location**: Add "?" or "ℹ️" icon button in `PolicyHeader` component
- **Placement**: Next to "Policy Radar" title OR next to User menu
- **Interaction**: Click opens a Dialog modal with full legend content
- **Non-invasive**: Doesn't take up space, only appears on click

### Secondary: Contextual Tooltips (Optional)
- **Location**: Add small "?" tooltips next to specific fields:
  - Impact Score (in policy list and drawer)
  - Confidence (in drawer)
  - Impact factor bars (in drawer)
- **Interaction**: Hover or click to see short explanation
- **Non-invasive**: Only shows when needed

---

## 📋 Implementation Plan

### Phase 1: Help Icon + Dialog (Primary Solution)

#### Step 1: Create Legend Dialog Component
**File**: `policy-radar-frontend/components/legend-dialog.tsx`

**Features**:
- Dialog component using existing `Dialog` UI component
- Contains all legend content verbatim (as provided)
- Scrollable content area
- Clean, readable formatting
- Close button (X in top-right)

**Content Structure**:
```
# Policy Radar – Number Key

[Impact Score section]
[Confidence section]
[Impact factor bars section]
[Effective date section]
[Last updated section]
[Version section]
[Saved groupings section]

[Suggested tooltips section]
[Color band legend]
```

#### Step 2: Add Help Icon to Header
**File**: `policy-radar-frontend/components/policy-header.tsx`

**Changes**:
- Import `HelpCircle` or `Info` icon from `lucide-react`
- Import `LegendDialog` component
- Add help icon button next to "Policy Radar" title
- Add state to control dialog open/close
- Add click handler to open dialog

**Code Pattern**:
```tsx
import { HelpCircle } from "lucide-react"
import { LegendDialog } from "@/components/legend-dialog"

// In component:
const [isLegendOpen, setIsLegendOpen] = useState(false)

// In JSX (next to title):
<Button
  variant="ghost"
  size="icon"
  className="h-8 w-8"
  onClick={() => setIsLegendOpen(true)}
  aria-label="Open help legend"
>
  <HelpCircle className="h-4 w-4 text-muted-foreground" />
</Button>

<LegendDialog open={isLegendOpen} onOpenChange={setIsLegendOpen} />
```

#### Step 3: Style Dialog Content
**Considerations**:
- Use consistent typography (matches rest of app)
- Use proper spacing and hierarchy
- Make it scannable (headers, bullets, emphasis)
- Responsive (works on mobile)
- Accessible (proper ARIA labels)

---

### Phase 2: Contextual Tooltips (Optional Enhancement)

#### Step 1: Create Tooltip Components
**Files**: 
- `policy-radar-frontend/components/tooltip-help.tsx` (reusable tooltip wrapper)
- Or use existing `Popover` component from UI library

#### Step 2: Add Tooltips to Specific Fields

**Impact Score** (in `policy-row.tsx` or policy drawer):
- Small "?" icon next to "Impact Score" label
- Tooltip: "How actionable this policy is (0–100). Calculated from timing, mandatory vs voluntary, scopes/sectors affected, and disclosure complexity."

**Confidence** (in policy drawer):
- Small "?" icon next to "Confidence" label
- Tooltip: "How sure we are about these labels (0–1). It reflects classification certainty, not policy severity."

**Impact Factor Bars** (in policy drawer):
- Small "?" icon next to "Impact Factors" label
- Tooltip: Individual tooltips for each factor (Mandatory, Time proximity, etc.)

---

## 🎨 Design Specifications

### Help Icon Button
- **Icon**: `HelpCircle` from `lucide-react` (or `Info`)
- **Size**: Small (h-4 w-4 or h-5 w-5)
- **Style**: Ghost button variant, muted color
- **Position**: Left of "Policy Radar" title (or right side near User menu)
- **Accessibility**: Proper `aria-label`

### Dialog Modal
- **Width**: `max-w-2xl` or `max-w-3xl` (comfortable reading width)
- **Height**: Auto (scrollable if content is long)
- **Padding**: Consistent with app spacing (p-6)
- **Typography**:
  - H1: "Policy Radar – Number Key" (prominent)
  - H2: Section headings (Impact Score, Confidence, etc.)
  - Body: Regular text (readable, good line-height)
  - Lists: Bulleted lists for clarity
- **Color Bands**: Visual indicator if using color pills
  - Low 0–39: [Color swatch]
  - Medium 40–69: [Color swatch]
  - High 70–100: [Color swatch]

### Tooltip (Optional)
- **Icon**: Tiny "?" or `Info` icon (h-3 w-3)
- **Trigger**: Hover or click
- **Position**: Next to field label
- **Style**: Minimal, doesn't interfere with UI

---

## 📁 Files to Create/Modify

### New Files
1. `policy-radar-frontend/components/legend-dialog.tsx`
   - Dialog component with legend content
   - All content verbatim from user's legend
   - Proper formatting and structure

### Modified Files
1. `policy-radar-frontend/components/policy-header.tsx`
   - Add help icon button
   - Add dialog state and handler
   - Import `LegendDialog` component

### Optional (Phase 2)
2. `policy-radar-frontend/components/tooltip-help.tsx` (if creating reusable tooltip)
3. `policy-radar-frontend/components/policy-drawer.tsx` (add tooltips to fields)
4. `policy-radar-frontend/components/ui/policy-row.tsx` (add tooltip to Impact Score)

---

## ✅ Success Criteria

### Must Have (Phase 1)
- [ ] Help icon visible in header
- [ ] Clicking help icon opens dialog
- [ ] Dialog contains complete legend content
- [ ] Dialog is readable and well-formatted
- [ ] Dialog can be closed (X button or ESC)
- [ ] Non-invasive (doesn't clutter UI)
- [ ] Accessible (keyboard navigation, ARIA labels)
- [ ] Responsive (works on mobile)

### Nice to Have (Phase 2)
- [ ] Contextual tooltips on specific fields
- [ ] Tooltips show short explanations
- [ ] Tooltips don't interfere with UI

---

## 🚀 Implementation Steps

### Step 1: Create Legend Dialog Component
1. Create `legend-dialog.tsx` file
2. Structure content with proper sections
3. Use Dialog component from UI library
4. Format content for readability
5. Add close functionality

### Step 2: Add Help Icon to Header
1. Import necessary icons and components
2. Add help icon button next to title
3. Add state for dialog open/close
4. Wire up click handler
5. Test dialog open/close

### Step 3: Style and Polish
1. Ensure consistent typography
2. Add proper spacing
3. Test responsive design
4. Verify accessibility
5. Add color band legend (if using color pills)

### Step 4: Test
1. Test dialog opens/closes
2. Test on mobile (responsive)
3. Test keyboard navigation
4. Test accessibility (screen reader)
5. Verify content is complete and accurate

---

## 📝 Content to Include (Verbatim from User)

All content from the user's legend should be included exactly as provided:

1. **Impact Score (0–100)** - Full explanation
2. **Confidence (0.00–1.00)** - Full explanation
3. **Impact factor bars (0–100 each)** - Full explanation
4. **Effective date** - Explanation
5. **Last updated** - Explanation
6. **Version** - Explanation
7. **Saved groupings** - Explanation
8. **Suggested tooltips** - All tooltip text
9. **Color band legend** - "Low 0–39 • Medium 40–69 • High 70–100"

---

## 💡 Design Recommendations

### Placement Options

**Option A: Next to Title** (Recommended)
```
[ℹ️] Policy Radar | [Search box] | [Sort] [Order] | [User]
```
- Most visible
- Logical placement (help about the app)
- Doesn't interfere with actions

**Option B: Next to User Menu**
```
Policy Radar | [Search box] | [Sort] [Order] | [ℹ️] [User]
```
- Keeps help with user-related actions
- Less prominent
- Might be less discoverable

**Option C: In User Menu**
```
[User menu] → Help / Legend
```
- Hidden but accessible
- Less discoverable
- Doesn't take up header space

### Recommendation: **Option A** (Next to Title)
- Most discoverable
- Logical placement
- Non-invasive
- Easy to find

---

## 🔧 Technical Considerations

### Dependencies
- Existing `Dialog` component (already available)
- `lucide-react` for icons (already used)
- No new dependencies needed

### Accessibility
- Help icon has `aria-label="Open help legend"` or `aria-label="Show legend"`
- Dialog has proper ARIA attributes (from Dialog component)
- Keyboard navigation (ESC to close, focus management)
- Screen reader friendly

### Performance
- Dialog content is static (no API calls)
- Dialog only renders when open (lazy loading possible)
- Minimal impact on bundle size

### Testing
- Unit test: Dialog opens/closes correctly
- E2E test: User can open and read legend
- Accessibility test: Keyboard navigation works
- Responsive test: Works on mobile

---

## 📊 Implementation Priority

### Phase 1: Core Implementation (High Priority)
- Help icon + Dialog modal
- Complete legend content
- Basic styling

### Phase 2: Enhancements (Medium Priority)
- Contextual tooltips
- Color band visualizations
- Enhanced formatting

### Phase 3: Polish (Low Priority)
- Animations/transitions
- Advanced accessibility features
- Analytics tracking (if needed)

---

**This plan ensures the legend is accessible but non-invasive, maintaining simplicity while providing comprehensive help.**

