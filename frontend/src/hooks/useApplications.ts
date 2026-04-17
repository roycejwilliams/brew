import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

//Axios gives cleaner syntax
//automatic json parsing
// built-in request/response
//automatic auth header via interceptors
//axios just replaces the fetch method

//TanStack replaces the try/catch
//Retrieve All Applications (Admin)
//replaces the useEffect/useState/try/catch boilerplate
export const useGetAllApplications = () => {
  return useQuery({
    //used internally for refetching, caching, and sharing queries
    //you can uniquely describe its data
    queryKey: ["applications"],
    //any function that returns a promise.. either resolves or throw an error
    queryFn: () => api.get("/applications"),
  });
};

export const useLookUpUser = () => {
  return useMutation({
    mutationFn: (email: string) => api.post(`/auth/lookup/`, { email }),
  });
};

//Create an application (User)
export const useCreateApplication = () => {
  return useMutation({
    mutationFn: (data: ApplicationProp) => {
      return api.post("/applications", data);
    },
  });
};

//Update Application Status (Admin)
export const useUpdateApplicationStatus = () => {
  return useMutation({
    mutationFn: (data: ApplicationProp) => {
      return api.put(`/applications/${data.id}`, { status: data.status });
    },
  });
};
