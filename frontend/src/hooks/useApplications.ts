import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";

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
    refetchOnWindowFocus: false,
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
  const queryClient = useQueryClient();
  return useMutation({
    //sends the actual PUT request
    mutationFn: (data: { id: string; status: string }) => {
      return api.put(`/applications/${data.id}`, { status: data.status });
    },
    //runs before the api call
    //cancel any in-flight get request
    onMutate: async (data) => {
      //cancels the query and revert back to its previous state
      //tells it to cancel update
      //kills any pending fetches
      await queryClient.cancelQueries({ queryKey: ["applications"] });

      //used to get an existing's query's cached data.
      // returns whatever is attached to the query key
      //reads the cache
      const previous = queryClient.getQueryData(["applications"]);
      //use to immediately update a query's cached data
      //queryKey, newData
      //setting/updating the cache
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData(["applications"], (old: any) => ({
        ...old, // copies everything from the cached response
        data: {
          // but override 'data' with
          ...old.data, //copy everthing inside old.data (axios layer)
          data: old.data.data.map(
            (
              a: ApplicationProp, // but override the inner 'data' array with the mapped version
            ) => (a.id === data.id ? { ...a, status: data.status } : a),
          ),
        },
      }));
      return { previous };
    },

    //Just sets it back to the previous data
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["applications"], context?.previous);
    },
    //marks "applications" as stale and triggers a refetch from the server
    //forces a stbc so the cache matches what's actually in the database
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
};
