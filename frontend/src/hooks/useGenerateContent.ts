import api from "@/lib/axios";

export const generateContent = async (description: string) => {
  const response = await api.post("/ai/generate", { description });
  return response.data.data;
};
