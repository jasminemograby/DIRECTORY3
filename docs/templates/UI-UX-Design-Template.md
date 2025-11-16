# UI/UX Design Template

**Purpose:** This template captures UI/UX specifications, mockups, and component-level decisions for a feature.

**Expected Outputs:**
- UI/UX design document
- Component specifications
- User flow diagrams
- Design system compliance notes
- Implementation notes for developers

---

## Step 1: Feature Identification

**Question 1:** What is the Feature ID? (e.g., F004, F005)

**Your Answer:** [FXXX]

---

**Question 2:** What is the feature title?

**Your Answer:** [Title]

---

## Step 2: User Story & Flow

**Question 3:** What is the user story? (As a [user type], I want [goal], so that [benefit])

**Your Answer:** [User story]

---

**Question 4:** What is the primary user flow? (List steps 1-5)

**Your Answer:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Instructions for AI:** Based on the user's answer to Question 4, dynamically generate follow-up questions. Ask if there are alternative flows, and if yes, ask about each alternative flow mentioned - what it is, when it occurs (trigger conditions), and how it differs from the primary flow. Generate these questions on the fly based on the specific flows mentioned.

---

## Step 3: Pages & Components

**Question 5:** How many pages/screens are needed? (Number)

**Your Answer:** [Count]

**Instructions for AI:** Based on the user's answer to Question 5, dynamically generate follow-up questions for each page mentioned. For each page, ask about: name/purpose, components on that page, how users navigate to it, and how users navigate from it. Generate these questions on the fly based on the number of pages and their specific details as they are provided.

---

**Question 6:** Are there reusable components needed? (Yes/No)

**Your Answer:** [Yes/No]

**Instructions for AI:** If the user answers "Yes" to Question 6, dynamically generate follow-up questions. First, ask how many reusable components are needed. Then, for each component mentioned, ask about: name and purpose, props needed, state management, whether it will be used by other features, and if yes, where it should be located (`/core` or `/shared`). Generate these questions on the fly based on the specific components mentioned.

---

## Step 4: Design System Compliance

**Question 7:** Which design system elements will be used? (Select all that apply)
- Colors (Primary, Secondary, Accent)
- Typography (Headings, Body text)
- Spacing (Layout, Components)
- Buttons
- Forms/Inputs
- Cards/Containers
- Icons
- Other: [Specify]

**Your Answer:** [Selected elements]

**Instructions for AI:** Based on the user's answer to Question 7, dynamically generate follow-up questions for each selected element. For Colors: ask about primary color usage, color variations (light, dark, hover states), and color scheme requirements. For Typography: ask about heading sizes, body text styles, font families, and typography hierarchy. For Forms/Inputs: ask about input types needed, validation feedback requirements, and form-specific styling. For other elements selected, ask relevant questions about their usage, styling, and requirements. If "Other" is mentioned, ask about the element name, purpose, and requirements. Generate these questions on the fly based on the specific elements mentioned.

---

## Step 5: Responsive Design

**Question 8:** Which screen sizes need to be supported? (Select all that apply)
- Mobile (< 768px)
- Tablet (768px - 1024px)
- Desktop (> 1024px)
- Large Desktop (> 1440px)
- Other: [Specify]

**Your Answer:** [Screen sizes]

**Instructions for AI:** Based on the user's answer to Question 8, dynamically generate follow-up questions for each screen size selected. For Mobile: ask about layout approach (single column vs multi-column), mobile-specific interactions (swipe, pull-to-refresh), and mobile-specific requirements. For Tablet: ask about layout approach (share mobile layout or separate), tablet-specific interactions, and tablet requirements. For Desktop/Large Desktop: ask about layout requirements, desktop-specific features, and desktop interactions. If multiple sizes are selected, ask about breakpoints (Tailwind defaults or custom), which components need different layouts per breakpoint, and responsive design strategy. If "Other" is mentioned, ask about the specific screen size, dimensions, and requirements. Generate these questions on the fly based on the specific screen sizes mentioned.

---

## Step 6: User Experience

**Question 9:** What loading states are needed? (Select all that apply)
- Initial page load
- Data fetching
- Form submission
- File upload
- Other: [Specify]

**Your Answer:** [Loading states]

**Instructions for AI:** Based on the user's answer to Question 9, dynamically generate follow-up questions for each loading state mentioned. For each state, ask about: how it should be displayed (spinner, skeleton, progress bar), expected duration, user feedback needed, and any state-specific requirements. If "Other" is mentioned, ask about the loading state type, purpose, and requirements. Generate these questions on the fly based on the specific loading states mentioned.

---

**Question 10:** What error states need handling? (List scenarios)

**Your Answer:** [Error scenarios]

**Instructions for AI:** Based on the user's answer to Question 10, dynamically generate follow-up questions for each error scenario mentioned. For each scenario, ask about: how it should be displayed (error message, modal, inline, toast), what user actions are available (retry, go back, contact support), error message content, and any scenario-specific requirements. Generate these questions on the fly based on the specific error scenarios mentioned.

---

**Question 11:** What empty states are needed? (List scenarios, e.g., no data, no results)

**Your Answer:** [Empty state scenarios]

**Instructions for AI:** Based on the user's answer to Question 11, dynamically generate follow-up questions for each empty state scenario mentioned. For each scenario, ask about: how it should be displayed (message, illustration, call-to-action), what actions should be available (create new, search, go back), empty state content, and any scenario-specific requirements. Generate these questions on the fly based on the specific empty state scenarios mentioned.

---

## Step 7: Accessibility

**Question 12:** What accessibility requirements are needed? (Select all that apply)
- ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast
- Focus indicators
- Other: [Specify]

**Your Answer:** [Requirements]

**Instructions for AI:** Based on the user's answer to Question 12, dynamically generate follow-up questions for each accessibility requirement selected. For ARIA labels: ask about which elements need labels, label content, and ARIA-specific requirements. For Keyboard navigation: ask about keyboard shortcuts needed, tab order, and keyboard navigation patterns. For Screen reader support: ask about screen reader announcements needed, status changes, and screen reader-specific requirements. For other requirements selected, ask relevant questions about their implementation and requirements. If "Other" is mentioned, ask about the requirement name, purpose, and implementation needs. Generate these questions on the fly based on the specific accessibility requirements mentioned.

---

## Important: Complete Information Collection

**Instructions for AI:** Before proceeding to the Generation Phase, you must ensure ALL required information has been collected. Continue asking dynamic follow-up questions based on the user's answers until you have:

- Complete user story and primary user flow
- All pages/screens fully specified with components
- All reusable components identified and specified
- Complete design system compliance details
- All responsive design requirements specified
- All loading, error, and empty states specified
- All accessibility requirements specified

**Do NOT proceed to Generation Phase until:**
- All questions have been answered
- All follow-up questions based on answers have been asked and answered
- No assumptions or defaults are needed
- All required information is explicitly provided

If any information is missing, continue asking questions until it is provided.

---

## Final Checklist & Verification

**Have ALL required questions been asked and answered?** (Yes/No)

**Your Answer:** [Yes/No]

**If No:** I will continue asking questions until all required information is collected. Please specify what information is still needed.

**If Yes:** I will verify that no assumptions are needed and proceed to the Generation Phase.

---

## Verification Before Generation

**Before generating any outputs, verify:**
- ✅ User story and flow are complete
- ✅ All pages and components are specified
- ✅ Design system compliance is detailed
- ✅ Responsive design requirements are complete
- ✅ All UX states (loading, error, empty) are specified
- ✅ Accessibility requirements are complete
- ✅ No information is missing or assumed

**If any item above is not verified, continue asking questions.**

---

## Generation Phase

**Only proceed if all information above is verified.**

Based on your complete answers, I will now generate:

1. **UI/UX Design Document** - Complete design specification
2. **Component Specifications** - Props, state, styling
3. **User Flow Diagrams** - Visual flow representation
4. **Design System Notes** - Compliance checklist
5. **Implementation Notes** - Developer guidelines

**Files to be created/updated:**
- `docs/feature-docs/FXXX/ui-ux-design.md`
- `docs/feature-docs/FXXX/component-specs.md` (if needed)

---

## Design Overview Summary

---

## UI Components

### Pages
- **Page 1:** [Description]
  - Purpose: [What it does]
  - Components: [List of components]
  - Navigation: [How user navigates to/from]

### Components
- **Component 1:** [Description]
  - Props: [Props list]
  - State: [State management]
  - Styling: [Tailwind classes used]

---

## Design System Compliance

### Colors
- Primary: [Color usage]
- Secondary: [Color usage]
- Accent: [Color usage]

### Typography
- Headings: [Font sizes, weights]
- Body: [Font sizes, weights]

### Spacing
- Layout: [Spacing approach]
- Components: [Component spacing]

### Responsive Design
- **Mobile:** [Mobile layout]
- **Tablet:** [Tablet layout]
- **Desktop:** [Desktop layout]

---

## User Experience

### Interactions
- **Hover States:** [Hover effects]
- **Click Actions:** [Click behaviors]
- **Form Validation:** [Validation UX]

### Loading States
- **Initial Load:** [Loading indicator]
- **Data Fetching:** [Loading states]

### Error States
- **Error Messages:** [Error display]
- **Empty States:** [Empty state design]

### Success States
- **Success Messages:** [Success feedback]

---

## Accessibility

### ARIA Labels
[ARIA labels used]

### Keyboard Navigation
[Keyboard navigation support]

### Screen Reader Support
[Screen reader considerations]

---

## Design Decisions

### Why This Design?
[Rationale for design choices]

### Alternatives Considered
[Alternative designs considered and why they were rejected]

---

## Mockups/Wireframes
[Links to mockups or wireframes, if available]

---

## Implementation Notes
[Notes for developers implementing this design]

---

## Status
- **Design:** ✅ Complete
- **Review:** ✅ Approved
- **Ready for Implementation:** ✅ Yes

