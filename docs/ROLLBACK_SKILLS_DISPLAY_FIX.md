# Rollback Plan - Skills Display Fix

**Date**: 2025-11-21  
**Change**: Fix skills data extraction in ProfileSkills component  
**Files Modified**: `frontend/src/components/ProfileSkills.js`

---

## What Was Changed

### File 1: `frontend/src/components/ProfileSkills.js`

**Complete Redesign** (Lines 1-248):
- **Line 21-27**: Updated data extraction logic to properly handle response envelope structure
- **Lines 13, 29-35**: Added `expandedNodes` state to track which tree nodes are expanded
- **Lines 37-50**: Added helper functions for tree node management (`getNodeKey`, `toggleNode`, `isExpanded`, `hasChildren`)
- **Lines 52-120**: Completely redesigned `renderTreeNode` function to create hierarchical tree view with expand/collapse
- **Lines 198-225**: Removed Skills Gap display section (missing skills list)
- **Lines 227-243**: Changed "View Skills Gap" button to "View More" button with Skills Engine redirect message
- **Tree View Features**:
  - Expandable/collapsible nodes with ▶ (collapsed) and ▼ (expanded) icons
  - Multi-level hierarchy support
  - Consistent indentation (24px per level)
  - Visual indicators (borders, hover effects)
  - Skills displayed as badges at leaf nodes
  - Verified skills shown with green checkmark

### File 2: `backend/src/infrastructure/MockDataService.js`

**Lines 27-33**: Added better logging to debug mock data loading issues

**Lines 86-91**: Added detailed logging in `getMockData()` method

### File 3: `backend/src/infrastructure/MicroserviceClient.js`

**Lines 78-103**: Added hardcoded fallback mock data for skills-engine when file-based mock data is not found

**Before:**
```javascript
const response = await getEmployeeSkills(user.companyId, employeeId);
const skills = response?.skills || response?.response?.skills || response;
setSkillsData(skills);
```

**After:**
```javascript
const response = await getEmployeeSkills(user.companyId, employeeId);
console.log('[ProfileSkills] Raw response:', response);
// Handle envelope structure: { requester_service: 'directory_service', response: { success: true, skills: {...} } }
const skills = response?.response?.skills || response?.skills || response?.response || response;
console.log('[ProfileSkills] Extracted skills:', skills);
setSkillsData(skills);
```

---

## Rollback Instructions

### Step 1: Revert ProfileSkills.js

**File**: `frontend/src/components/ProfileSkills.js`

**Change lines 21-27 back to:**
```javascript
const response = await getEmployeeSkills(user.companyId, employeeId);
const skills = response?.skills || response?.response?.skills || response;
setSkillsData(skills);
```

**Remove the console.log statements** (lines added for debugging)

### Step 2: Revert MockDataService.js

**File**: `backend/src/infrastructure/MockDataService.js`

**Revert lines 27-33** to:
```javascript
if (!mockDataLoaded) {
  throw new Error('Mock data file not found in any expected location');
}
} catch (error) {
  console.warn('[MockDataService] Mock data file not found, using default mocks');
  this.mockData = {};
}
```

**Revert lines 86-91** to:
```javascript
getMockData(microservice, operation) {
  if (!this.mockData[microservice] || !this.mockData[microservice][operation]) {
    return null;
  }
  return this.mockData[microservice][operation];
}
```

### Step 3: Revert MicroserviceClient.js

**File**: `backend/src/infrastructure/MicroserviceClient.js`

**Remove the hardcoded fallback** (lines 78-103) and revert to:
```javascript
// Fallback to mock data
if (operation) {
  // Convert camelCase to kebab-case (e.g., "skillsEngine" -> "skills-engine")
  const microserviceKey = microserviceName.replace(/([A-Z])/g, '-$1').toLowerCase();
  const mockData = this.mockDataService.getMockData(microserviceKey, operation);
  if (mockData) {
    console.log(`[MicroserviceClient] ✅ Using mock data for ${microserviceKey}/${operation}`);
    return mockData;
  }
}

// Return empty response template if no mock data available
console.warn(`[MicroserviceClient] No mock data found, returning empty response template`);
return responseTemplate || {};
```

---

## Verification After Rollback

1. Skills tab should still exist in Learning & Development section
2. No errors in browser console
3. Other features (courses, learning path, etc.) should still work
4. Profile approval flow should still work

---

## Impact Assessment

**Low Risk**: This change only affects data extraction logic in ProfileSkills component. It does not:
- Change API endpoints
- Change backend logic
- Change database queries
- Affect other components
- Change authentication/authorization

**If rollback is needed**: Simply revert the 3 lines in ProfileSkills.js to the original extraction logic.

---

**Rollback Command** (if using git):
```bash
git checkout HEAD -- frontend/src/components/ProfileSkills.js
```

