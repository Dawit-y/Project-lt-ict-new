import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

export const useSearchParamConverter = (config) => {
	const { t } = useTranslation();
	const { lang, dataSources } = config;

	// Memoize the converter function to prevent unnecessary recreations
	const convertSearchParamsToReadable = useCallback(
		(params) => {
			if (!params) return {};

			const readableParams = { ...params };

			// Process each field based on the configuration
			Object.keys(dataSources).forEach((fieldKey) => {
				const fieldConfig = dataSources[fieldKey];

				if (
					params[fieldKey] !== undefined &&
					params[fieldKey] !== null &&
					params[fieldKey] !== ""
				) {
					if (fieldConfig.converter) {
						readableParams[fieldKey] = fieldConfig.converter(params[fieldKey]);
					} else if (fieldConfig.dataSource) {
						const data = fieldConfig.dataSource;
						const nameKey = fieldConfig.nameKey || `name_${lang}`;

						if (Array.isArray(params[fieldKey])) {
							readableParams[fieldKey] = params[fieldKey]
								.map((id) => {
									const item = data.find(
										(item) =>
											parseInt(item[fieldConfig.idKey || "id"]) === parseInt(id)
									);
									return item ? item[nameKey] : id;
								})
								.join(", ");
						} else {
							const item = data.find(
								(item) =>
									parseInt(item[fieldConfig.idKey || "id"]) ===
									parseInt(params[fieldKey])
							);
							readableParams[fieldKey] = item
								? item[nameKey]
								: params[fieldKey];
						}
					}
				}
			});

			// Special handling for include flag
			if (params.include !== undefined) {
				readableParams.include =
					params.include === 1
						? t("Including Sub-levels")
						: t("Current Level Only");
			}

			return readableParams;
		},
		[dataSources, lang, t]
	); // Dependencies that affect the function

	return { convertSearchParamsToReadable };
};
