// SAP Services Endpoints
export const SERVICE_URL = {
  menus: '/sap/opu/odata/sap/ZCM_MENUPLANNING_SRV',
  central: '/sap/opu/odata/sap/ZCM_CENTRALMENU_SRV',
  concepts: '/sap/opu/odata/sap/ZCM_MENUPLANNING_SRV',
  conditions: '/sap/opu/odata/sap/ZCM_API_CONDITIONS_SRV',
  recipes: '/sap/opu/odata/sap/ZCM_API_RECIPE_SRV',
}

// Scheduler
export const SCHEDULER_VIEW_MODE = new Map([
  ['Week', 7],
  ['3 days', 3],
  ['1 day', 1],
])

// Convert week of day in JS to ABAP...
export const DAY_OF_WEEK_MAP = new Map([
  [0, 6], // Sunday 0 -> 6
  [1, 0], // Monday 1 -> 0
  [2, 1], // Tuesday 2 -> 1
  [3, 2], // Wednesday 3 -> 2
  [4, 3], // Thursday 4 -> 3
  [5, 4], // Friday 5 -> 4
  [6, 5], // Saturday 6 -> 5
])

export const DATE_FORMAT = 'DD/MM/YYYY'
