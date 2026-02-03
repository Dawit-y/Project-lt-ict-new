import React from "react";
import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { toast } from "react-toastify";
import i18n from "i18next";

const getStatusMessages = () => ({
	452: i18n.t("errors_duplicateEntry"),
	453: i18n.t("errors_missingField"),
	454: i18n.t("errors_invalidReference"),
	455: i18n.t("errors_genericError"),
	456: i18n.t("errors_valueTooLong"),
	457: i18n.t("errors_updateIdNotProvided"),
	458: i18n.t("errors_dataNotFoundWithId"),
	459: i18n.t("errors_notAllowedSave"),
	460: i18n.t("errors_notAllowedUpdate"),
	461: i18n.t("errors_notAllowedViewList"),
	429: i18n.t("Too Many Attempts"),
	487: i18n.t("Incorrect Input"),
	500: i18n.t("Internal Server Error"),
});

const getErrorMessage = (error) => {
	const statusMessages = getStatusMessages();

	// Axios HTTP status
	if (error?.response?.status) {
		return (
			statusMessages[error.response.status] || i18n.t("errors_genericError")
		);
	}

	// Custom backend error payload
	if (error?.response?.data) {
		const { status_code, errorMsg, column } = error.response.data;

		if (statusMessages[status_code]) {
			return `${statusMessages[status_code]}${column ? ` on ${column}` : ""}`;
		}

		return `${errorMsg || i18n.t("errors_genericError")}${
			column ? ` on ${column}` : ""
		}`;
	}

	return error?.message || i18n.t("errors_genericError");
};

const localStoragePersistor = createSyncStoragePersister({
	storage: window.localStorage,
});

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			refetchOnWindowFocus: false,
			gcTime: 1000 * 60 * 10,
		},
	},
	queryCache: new QueryCache({
		// Optional global query error handling
		// onError: (error) => {
		// 	toast.error(getErrorMessage(error));
		// },
	}),
	mutationCache: new MutationCache({
		onError: (error, variables, context, mutation) => {
			const skipGlobalError =
				error?.handledByMutationCache ||
				error?.response?.status === 401 ||
				mutation?.options?.meta?.skipGlobalErrorHandler;

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
