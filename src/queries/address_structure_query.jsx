import { useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getAddressStructure,
	addAddressStructure,
	updateAddressStructure,
	deleteAddressStructure,
} from "../helpers/addressstructure_backend_helper";

// --- Build tree, attach UUIDs, and extract all levels ---
const buildAndExtract = (data) => {
	if (!data || !Array.isArray(data)) {
		console.warn("Invalid data format for building the tree:", data);
		return { tree: [], regions: [], zones: [], woredas: [] };
	}

	const oromia = [
		{
			id: "1", // ensure string
			name: "Oromia",
			add_name_am: "ኦሮሚያ",
			add_name_en: "Oromia",
			rootId: null,
			level: "region",
			children: [],
		},
	];

	oromia[0].children = [...data];

	const regions = [];
	const zones = [];
	const woredas = [];

	const traverse = (node, parentId = null) => {
		const withUUID = {
			...node,
			id: node.id?.toString() || uuidv4(),
			parentId,
			children: node.children?.map((child) => traverse(child, node.id)) || [],
		};

		// determine level
		if (withUUID.children.length === 0 && withUUID.rootId !== "1") {
			withUUID.level = "woreda";
			woredas.push(withUUID);
		} else {
			const hasGrandChildren = withUUID.children.some(
				(child) => child.children.length > 0
			);
			if (hasGrandChildren) {
				withUUID.level = "region";
				regions.push(withUUID);
			} else {
				withUUID.level = "zone";
				zones.push(withUUID);
			}
		}

		return withUUID;
	};

	const tree = oromia.map((region) => traverse(region));
	return { tree, regions, zones, woredas };
};

// --- Custom hook ---
export const useFetchAddressStructures = (userId) => {
	const query = useQuery({
		queryKey: ["addresses", userId],
		queryFn: () => getAddressStructure(),
		staleTime: 1000 * 60 * 15,
		gcTime: 1000 * 60 * 16,
		select: (res) => buildAndExtract(res?.data),
		refetchOnMount: true,
		refetchOnWindowFocus: false,
	});

	// --- Memoize the return to prevent infinite loops ---
	return useMemo(
		() => ({
			...query,
			tree: query.data?.tree || [],
			regions: query.data?.regions || [],
			zones: query.data?.zones || [],
			woredas: query.data?.woredas || [],
		}),
		[query]
	);
};

// Custom hook for adding a folder
export const useAddAddressStructures = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (passed) => addAddressStructure(passed),
		onSuccess: (newFolder) => {
			queryClient.invalidateQueries({ queryKey: ["addresses"] });
		},
	});
};

// Custom hook for renaming a folder
export const useUpdateAddressStructures = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (passed) => updateAddressStructure(passed),
		onSuccess: (updatedFolder) => {
			queryClient.invalidateQueries({ queryKey: ["addresses"] });
		},
	});
};

// Custom hook for deleting a folder
export const useDeleteAddressStructures = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id) => deleteAddressStructure(id),
		onSuccess: (deletedId, variable) => {
			queryClient.invalidateQueries({ queryKey: ["addresses"] });
		},
	});
};
