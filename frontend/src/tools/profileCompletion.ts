export const getCompletionColor = (pct: number) => {
  if (pct === 100) return "rgba(250,204,21,0.8)"; // gold
  if (pct >= 75) return "rgba(74,222,128,0.7)"; // green
  if (pct >= 50) return "rgba(96,165,250,0.7)"; // blue
  if (pct >= 25) return "rgba(251,146,60,0.7)"; // orange
  return "rgba(255,255,255,0.3)"; // default white
};

export const profileCompletion = (form: UserProp) => {
  const filledCount = Object.values(form).filter(
    (val) => val?.trim() !== "",
  ).length;

  const totalFields = Object.keys(form).length;

  const completion = Math.floor((filledCount / totalFields) * 100);

  return completion;
};
