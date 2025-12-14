import React from "react";
import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const useErrorMessages = () => {
	const { t } = useTranslation();
	return {
		452: t("errors_duplicateEntry"),
		453: t("errors_missingField"),
		454: t("errors_invalidReference"),
		455: t("errors_genericError"),
		456: t("errors_valueTooLong"),
		457: t("errors_updateIdNotProvided"),
		458: t("errors_dataNotFoundWithId"),
		459: t("errors_notAllowedSave"),
		460: t("errors_notAllowedUpdate"),
		461: t("errors_notAllowedViewList"),
		429: t("Too Many Attempts"),
		487: t("Incorrect Input"),
		500: t("Internal Server Error"),
	};
};

// Function to extract API error message
const getErrorMessage = ({ error }) => {
	const statusMessages = useErrorMessages();
	if (error?.response?.status) {
		return `${statusMessages[error?.response?.status]}`;
	} else if (error?.response?.data) {
		const { status_code, errorMsg, column } = error.response.data;
		if (statusMessages[status_code]) {
			return `${statusMessages[status_code]} ${column ? `on ${column}` : ""}`;
		}
		return `${errorMsg} ${column ? `on ${column}` : ""}`;
	}

	return error.message || "An unexpected error occurred.";
};

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
	queryCache: new QueryCache({
		// onError: (error) => {
		//   const message = getErrorMessage(error);
		//   toast.error(message);
		// },
	}),
	mutationCache: new MutationCache({
		onError: (error, variables, context, mutation) => {
			const skipGlobalError =
				error.handledByMutationCache ||
				error.response?.status === 401 ||
				mutation.options.meta?.skipGlobalErrorHandler;

			if (!skipGlobalError) {
				error.handledByMutationCache = true;
				const message = getErrorMessage(error);
				toast.error(message, { autoClose: 3000 });
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
				buster: "1",
			}}
		>
			{children}
			<ReactQueryDevtools initialIsOpen={false} />
		</PersistQueryClientProvider>
	);
};

export default QueryProvider;
