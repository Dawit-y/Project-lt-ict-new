import React from "react";
import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { toast } from "react-toastify";

// Create a Web Storage Persistor
const localStoragePersistor = createSyncStoragePersister({
  storage: window.localStorage,
});

// Function to extract API error message
const getErrorMessage = (error) => {
  if (error?.response?.data) {
    const { status_code, errorMsg, column } = error.response.data;
    return `[Error ${status_code}] ${errorMsg} ${column ? `on ${column}` : ""}`;
  }
  return error.message || "An unexpected error occurred.";
};

// Create the QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      gcTime: 1000 * 60 * 10,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _, __, mutation) => { 
      if (!error.handledByMutationCache) {
        error.handledByMutationCache = true; 
        const message = getErrorMessage(error);
        toast.error(message, { autoClose: 2000 });
      }
    },
  }),
});

const QueryProvider = ({ children }) => {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: localStoragePersistor,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => query.meta?.persist === true,
        },
      }}
    >
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </PersistQueryClientProvider>
  );
};

export default QueryProvider;
