export function ensureSingleRecommendedPlan(state) {
  const plans = Array.isArray(state?.plans) ? state.plans : null;
  if (!plans || plans.length === 0) return state;

  const recommendedIndexes = plans.map((p, i) => (p?.rec ? i : -1)).filter((i) => i >= 0);

  const targetIndex =
    recommendedIndexes.length > 0 ? recommendedIndexes[0] : plans.length > 1 ? 1 : 0;

  const normalizedPlans = plans.map((p, i) => ({ ...p, rec: i === targetIndex }));
  return { ...state, plans: normalizedPlans };
}
