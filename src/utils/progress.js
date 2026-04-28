export const BADGE_ORDER_BY_ID = {
  boulder_badge: 1,
  cascade_badge: 2,
  thunder_badge: 3,
  rainbow_badge: 4,
  soul_badge: 5,
  marsh_badge: 6,
  volcano_badge: 7,
  earth_badge: 8,
};

export const getBadgeCount = (gameState = {}) => {
  const earned = new Set();
  (gameState.badges || []).forEach(badge => {
    if (typeof badge === 'number') earned.add(badge);
    if (BADGE_ORDER_BY_ID[badge]) earned.add(BADGE_ORDER_BY_ID[badge]);
  });
  return earned.size;
};

export const hasBadge = (gameState = {}, badgeId, order) => {
  const badges = gameState.badges || [];
  return badges.includes(badgeId) || badges.includes(order || BADGE_ORDER_BY_ID[badgeId]);
};

export const hasProgressRequirement = (gameState = {}, requirement) => {
  if (!requirement) return true;
  if (requirement === 'has_starter') {
    return (gameState.team?.length || 0) > 0 || (gameState.worldFlags || []).includes('has_starter');
  }
  if (requirement === 'champion') {
    return (gameState.worldFlags || []).includes('champion');
  }
  if (requirement.includes('_badges')) {
    return getBadgeCount(gameState) >= Number.parseInt(requirement, 10);
  }
  if (BADGE_ORDER_BY_ID[requirement]) {
    return hasBadge(gameState, requirement);
  }
  return (gameState.worldFlags || []).includes(requirement) || (gameState.badges || []).includes(requirement);
};
