import { useEffect, useState, memo } from "react";
import { post } from "../../helpers/api_Lists";
import TreeNode from "../AddressTreeStructure/TreeNode";
import { useTranslation } from "react-i18next";
import { useFetchFolders } from "../../queries/address_structure_query";

const AddressStructureForProject = ({ onNodeSelect, setIsAddressLoading }) => {
  const { t } = useTranslation();
  const storedUser = JSON.parse(sessionStorage.getItem("authUser"));
  const userId = storedUser?.user.usr_id;
  const { data, isLoading, isError, error, refetch } = useFetchFolders(userId);

  useEffect(() => {
    setIsAddressLoading(isLoading);
  }, [isLoading, setIsAddressLoading]);

  if (isLoading) {
    return (
      <div
        style={{ minHeight: "450px" }}
        className="w-20 flex-shrink-0 p-3 bg-white border-end overflow-auto shadow-sm"
      >
        <h4 className="mb-2 text-secondary">{t("address_tree_Search")}</h4>
        <hr className="text-dark" />
        <p>Loading...</p>
      </div>
    );
  }

  if (isError) {
    return <div>Error fetching address structure</div>;
  }

  return (
    <div
      className="w-20 flex-shrink-0 p-3 bg-white border-end overflow-auto shadow-sm col-md-2"
      style={{ minHeight: "450px" }}
    >
      <h4 className="mb-2 text-secondary">{t("address_tree_Search")}</h4>
      <hr className="text-dark" />

      {data.length > 0 ? (
        data.map((node) => (
          <TreeNode key={node.id} node={node} onNodeClick={onNodeSelect} />
        ))
      ) : (
        <div>No address structure data available.</div>
      )}
    </div>
  );
};

export default memo(AddressStructureForProject);
