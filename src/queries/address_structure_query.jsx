import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAddressStructure,
  addAddressStructure,
  updateAddressStructure,
  deleteAddressStructure,
} from "../helpers/addressstructure_backend_helper";

// Custom hook for fetching folders
export const useFetchAddressStructures = (userId) => {
  return useQuery({
    queryKey: ["folders", userId],
    queryFn: () => getAddressStructure(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 6,
    meta: { persist: true },
    select: (data) => buildTree(data?.data),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

// Custom hook for adding a folder
export const useAddAddressStructures = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (passed) => addAddressStructure(passed),
    onSuccess: (newFolder) => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });
};

// Custom hook for renaming a folder
export const useUpdateAddressStructures = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (passed) => updateAddressStructure(passed),
    onSuccess: (updatedFolder) => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });
};

// Custom hook for deleting a folder
export const useDeleteAddressStructures = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteAddressStructure(id),
    onSuccess: (deletedId, variable) => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });
};

// Helper functions
const buildTree = (data) => {
  if (!data || !Array.isArray(data)) {
    console.warn("Invalid data format for building the tree:", data);
    return [];
  }
  const oromia = [
    {
      id: 1,
      name: "Oromia",
      add_name_am: "ኦሮሚያ",
      add_name_en: "Oromia",
      rootId: null,
      level: "region",
      children: [],
    },
  ];
  oromia[0].children = [...data];
  const assignLevels = (node) => {
    if (node.children.length === 0 && node.rootId !== 1) {
      node.level = "woreda";
    } else {
      const hasGrandChildren = node.children.some(
        (child) => child.children.length > 0
      );

      if (hasGrandChildren) {
        node.level = "region";
      } else {
        node.level = "zone";
      }
      node.children.forEach(assignLevels);
    }
  };
  oromia.forEach(assignLevels);
  return oromia;
};

// const buildTree = (data) => {
//   const map = {};
//   const result = [];

//   data.forEach((item) => {
//     map[item.id] = { ...item, children: [] }; // Initialize the node with an empty children array
//   });

//   data.forEach((item) => {
//     if (item.rootId === null) {
//       // If the rootId is null, it's a root node
//       result.push(map[item.id]);
//     } else {
//       // Add the item to its parent's children array
//       if (map[item.rootId]) {
//         map[item.rootId].children.push(map[item.id]);
//       }
//     }
//   });

//   const assignLevels = (node) => {
//     if (node.children.length === 0 && node.rootId !== 1) {
//       node.level = "woreda";
//     } else {
//       const hasGrandChildren = node.children.some(
//         (child) => child.children.length > 0
//       );

//       if (hasGrandChildren) {
//         node.level = "region";
//       } else {
//         node.level = "zone";
//       }
//       node.children.forEach(assignLevels);
//     }
//   };

//   result.forEach(assignLevels);
//   return result;
// };

const addSubFolder = (tree, parentId, newFolder) => {
  return tree.map((node) => {
    if (node.id === parentId) {
      return {
        ...node,
        children: [...(node.children || []), newFolder],
      };
    } else if (node.children) {
      return {
        ...node,
        children: addSubFolder(node.children, parentId, newFolder),
      };
    }
    return node;
  });
};

const deleteFolder = (tree, folderId) => {
  return tree
    .filter((node) => node.id !== folderId)
    .map((node) => ({
      ...node,
      children: node.children ? deleteFolder(node.children, folderId) : [],
    }));
};

const renameFolder = (tree, folderId, newName) => {
  return tree.map((node) => {
    if (node.id === folderId) {
      return {
        ...node,
        name: newName,
      };
    } else if (node.children) {
      return {
        ...node,
        children: renameFolder(node.children, folderId, newName),
      };
    }
    return node;
  });
};
