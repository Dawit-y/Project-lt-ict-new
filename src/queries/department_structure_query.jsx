import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDepartmentStructure,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} from "../helpers/department_backend_helper";

// Custom hook for fetching dep
export const useFetchDepartmentStructures = (userId) => {
  return useQuery({
    queryKey: ["dep", userId],
    queryFn: () => getDepartmentStructure(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data) => buildTree(data?.data),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

// Custom hook for adding a folder
export const useAddDepartmentStructures = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (passed) => addDepartment(passed),
    onSuccess: (newFolder) => {
      queryClient.invalidateQueries({ queryKey: ["dep"] });
    },
  });
};

// Custom hook for renaming a folder
export const useUpdateDepartmentStructures = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (passed) => updateDepartment(passed),
    onSuccess: (updatedFolder) => {
      queryClient.invalidateQueries({ queryKey: ["dep"] });
    },
  });
};

// Custom hook for deleting a folder
export const useDeleteDepartmentStructures = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteDepartment(id),
    onSuccess: (deletedId, variable) => {
      queryClient.invalidateQueries({ queryKey: ["dep"] });
    },
  });
};

// Helper functions

const buildTree = (data) => {
  if (!data || !Array.isArray(data)) {
    console.warn("Invalid data format for building the tree:", data);
    return [];
  }

  const AllDepartment = [
    {
      id: 1,
      name: "AllDepartment",
      rootId: null,
      level: "Department",
      children: [...data],
    },
  ];

  const assignLevels = (node, parentLevel) => {
    if (!node.children) {
      node.children = []; // Ensure children is always an array
    }

    if (node.children.length === 0 && parentLevel === "Team") {
      node.level = "Officer";
      return;
    }

    if (parentLevel === "Department") {
      node.level = "Sector";
    } else if (parentLevel === "Sector") {
      node.level = "Team";
    } else if (parentLevel === "Team") {
      node.level = "Officer";
    }

    node.children.forEach((child) => assignLevels(child, node.level));
  };

  AllDepartment[0].children.forEach((child) =>
    assignLevels(child, "Department"),
  );
  return AllDepartment;
};

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
