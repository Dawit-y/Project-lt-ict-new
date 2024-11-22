import React from "react";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Create a Web Storage Persistor
const localStoragePersistor = createSyncStoragePersister({
  storage: window.localStorage,
});

// Create the QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      gcTime: 1000 * 60 * 10,
    },
  },
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
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </PersistQueryClientProvider>
  );
};

export default QueryProvider;
