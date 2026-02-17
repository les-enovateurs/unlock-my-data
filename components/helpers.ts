export const getScoreColor = (score: number) => {
  if (score >= 80) return "text-red-600";
  if (score >= 60) return "text-orange-600";
  if (score >= 40) return "text-yellow-600";
  if (score >= 20) return "text-blue-600";
  return "text-green-600";
};

export const getScoreBg = (score: number) => {
  if (score >= 80) return "from-red-500 to-red-600";
  if (score >= 60) return "from-orange-500 to-orange-600";
  if (score >= 40) return "from-yellow-500 to-yellow-600";
  if (score >= 20) return "from-blue-500 to-blue-600";
  return "from-green-500 to-green-600";
};
