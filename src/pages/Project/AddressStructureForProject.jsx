import { useEffect, useState, memo } from "react";
import { post } from "../../helpers/api_Lists";
import TreeNode from "../AddressTreeStructure/TreeNode";
import { useTranslation } from "react-i18next";
import { useFetchFolders } from "../../queries/address_structure_query";
import { Col, Input, Label, Row } from "reactstrap";

const AddressStructureForProject = ({
  onNodeSelect,
  setIsAddressLoading,
  setInclude,
}) => {
  const { t } = useTranslation();
  const storedUser = JSON.parse(sessionStorage.getItem("authUser"));
  const userId = storedUser?.user.usr_id;
  const { data, isLoading, isError, error, refetch } = useFetchFolders(userId);

  const handleCheckboxChange = (e) => {
    if (setInclude) {
      setInclude(e.target.checked ? 1 : 0);
    }
  };

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
      className="w-20 pe-2 flex-shrink-0 bg-white border-end overflow-auto shadow-sm col-md-2"
      style={{ minHeight: "450px" }}
    >
      <h4 className="mb-2 text-secondary p-2">{t("address_tree_Search")}</h4>
      <hr className="text-dark" />

      <>
        <Col className="d-flex gap-2 ms-3">
          <Input
            id="include"
            name="include"
            type="checkbox"
            onChange={handleCheckboxChange}
          />
          <Label for="include">Include Sub Addresses</Label>
        </Col>
      </>

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
