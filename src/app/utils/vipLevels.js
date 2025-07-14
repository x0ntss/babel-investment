// VIP Levels configuration - shared across client and server
export const VIP_LEVELS = [
  { level: 12, min: 30000, max: Infinity, percent: [1, 2] },
  { level: 11, min: 15000, max: 29999.99, percent: [1, 2] },
  { level: 10, min: 8000, max: 14999.99, percent: [1, 2] },
  { level: 9, min: 5000, max: 7999.99, percent: [1, 2] },
  { level: 8, min: 3000, max: 4999.99, percent: [1, 2] },
  { level: 7, min: 1500, max: 2999.99, percent: [1, 2] },
  { level: 6, min: 800, max: 1499.99, percent: [1, 2] },
  { level: 5, min: 500, max: 799.99, percent: [1, 2] },
  { level: 4, min: 300, max: 499.99, percent: [1, 2] },
  { level: 3, min: 150, max: 299.99, percent: [1, 2] },
  { level: 2, min: 50, max: 149.99, percent: [1, 2] },
  { level: 1, min: 25, max: 49.99, percent: [1, 2] },
];

/**
 * Calculate user's VIP level and daily income based on vipCapital
 * @param {number} vipCapital - User's current VIP capital
 * @returns {object} Object containing level, dailyIncomeMin, dailyIncomeMax, and percentRange
 */
export function getLevelAndIncome(vipCapital) {
  for (const lvl of VIP_LEVELS) {
    if (vipCapital >= lvl.min && vipCapital <= lvl.max) {
      return {
        level: lvl.level,
        dailyIncomeMin: (vipCapital * lvl.percent[0]) / 100,
        dailyIncomeMax: (vipCapital * lvl.percent[1]) / 100,
        percentRange: lvl.percent,
      };
    }
  }
  return { level: 0, dailyIncomeMin: 0, dailyIncomeMax: 0, percentRange: [0, 0] };
}

/**
 * Get VIP level display name
 * @param {number} level - VIP level number
 * @returns {string} VIP level display name
 */
export function getVipLevelName(level) {
  return `VIP ${level}`;
}

/**
 * Check if user has reached a specific VIP level
 * @param {number} vipCapital - User's current VIP capital
 * @param {number} targetLevel - Target VIP level to check
 * @returns {boolean} True if user has reached or exceeded the target level
 */
export function hasReachedLevel(vipCapital, targetLevel) {
  const levelData = VIP_LEVELS.find(lvl => lvl.level === targetLevel);
  if (!levelData) return false;
  return vipCapital >= levelData.min;
} 