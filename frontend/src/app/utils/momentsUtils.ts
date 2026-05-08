export const getMomentStatus = (
  moment: MomentProp,
): "prequel" | "live" | "end" | null => {
  const now = Date.now();
  const startTime = new Date(moment.moment_start).getTime();
  const endTime = moment.moment_end
    ? new Date(moment.moment_end).getTime()
    : null;

  if (endTime && now > endTime) return "end";
  if (now < startTime) return "prequel";
  return "live";
};

export const sortMomentsByStatus = (moments: MomentProp[]): MomentProp[] => {
  const statusOrder = { live: 0, prequel: 1, end: 2 };
  return [...moments].sort((a, b) => {
    const aStatus = getMomentStatus(a) ?? "end";
    const bStatus = getMomentStatus(b) ?? "end";
    if (statusOrder[aStatus] !== statusOrder[bStatus]) {
      return statusOrder[aStatus] - statusOrder[bStatus];
    }
    return (
      new Date(a.moment_start).getTime() - new Date(b.moment_start).getTime()
    );
  });
};
