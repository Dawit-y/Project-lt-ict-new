import { useEffect, useState, memo } from "react";
import { useTranslation } from "react-i18next";
import { useFetchAddressStructures } from "../../queries/address_structure_query";
import { useFetchSectorCategorys } from "../../queries/sectorcategory_query";
import { useSearchSectorInformations } from "../../queries/sectorinformation_query";
import { useSearchProgramInfos } from "../../queries/programinfo_query";
import { Tree } from "react-arborist";
import { FaFolder, FaFile, FaChevronRight, FaChevronDown } from "react-icons/fa";
import { Card, CardBody, Input, Label, Col } from "reactstrap";

const AddressTree = ({ onNodeSelect, setIsAddressLoading, setInclude }) => {
  const { t } = useTranslation();
  const { data, isLoading } = useFetchAddressStructures();
  const [treeData, setTreeData] = useState([]);
  const [sectorParam, setSectorParam] = useState({})
  const [programParam, setProgramParam] = useState({})
  const [selectedCluster, setSelectedCluster] = useState({})
  const [selectedSector, setSelectedSector] = useState({})

  const { data: cluster, isLoading: isClusterLoading } = useFetchSectorCategorys();
  const { isLoading: isSectorLoading, refetch: refetchSector } = useSearchSectorInformations(sectorParam);
  const { isLoading: isProgramLoading, refetch: refetchProgram } = useSearchProgramInfos(programParam);

  useEffect(() => {
    setIsAddressLoading(isLoading || isClusterLoading || isSectorLoading || isProgramLoading);
  }, [isLoading, isClusterLoading, isSectorLoading, isProgramLoading, setIsAddressLoading]);

  useEffect(() => {
    if (data && cluster) {
      const transformData = (regions) =>
        regions.map((region) => ({
          ...region,
          id: region.id?.toString() || crypto.randomUUID(),
          children: region.children
            ? region.children.map((zone) => ({
              ...zone,
              id: zone.id?.toString() || crypto.randomUUID(),
              children: zone.children
                ? zone.children.map((woreda) => ({
                  ...woreda,
                  id: woreda.id?.toString() || crypto.randomUUID(),
                  children: [
                    ...woreda.children,
                    ...cluster?.data.map((c) => ({
                      id: `${region.id}_${zone.id}_${woreda.id}_${c.psc_id}`,
                      c_id: c.psc_id,
                      name: c.psc_name,
                      region_id: region.id,
                      zone_id: zone.id,
                      woreda_id: woreda.id,
                      level: "cluster",
                      children: [],
                    })),
                  ],
                }))
                : [],
            }))
            : [],
        }));

      setTreeData(transformData(data));
    }
  }, [data, cluster]);

  // Handle fetching sectors when cluster node is clicked
  const handleClusterClick = async (node) => {
    const { id, c_id } = node.data;

    if (node.children.length > 0) return;

    setSectorParam({ sector_category_id: c_id });
    setSelectedCluster(node.data);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: sectorData } = await refetchSector();
        const { id, region_id, zone_id, woreda_id, c_id } = selectedCluster
        const formatedSector = sectorData?.data.map((s) => ({
          ...s,
          id: `${region_id}_${zone_id}_${woreda_id}_${c_id}_${s.sci_id}`,
          s_id: s.sci_id,
          name: s.sci_name_or,
          region_id: region_id,
          zone_id: zone_id,
          woreda_id: woreda_id,
          level: "sector",
          children: []
        }))

        // Update tree with new sector data
        const updatedTreeData = updateNodeChildren(treeData, id, 'cluster', formatedSector);
        setTreeData(updatedTreeData);
      } catch (error) {
        console.error("Error during sector refetch:", error);
      }
    };

    if (Object.keys(sectorParam).length > 0) {
      fetchData();
    }
  }, [sectorParam]);

  // Handle fetching programs when sector node is clicked
  const handleSectorClick = async (node) => {
    const { id, region_id, zone_id, woreda_id, s_id } = node.data;
    if (node.children.length > 0) return;
    setProgramParam({
      pri_owner_region_id: region_id,
      pri_owner_zone_id: zone_id,
      pri_owner_woreda_id: woreda_id,
      pri_sector_id: s_id
    })
    setSelectedSector(node.data)
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: programData } = await refetchProgram();
        const { id, region_id, zone_id, woreda_id, s_id } = selectedSector
        const formatedProgram = programData?.data.map((s) => ({
          ...s,
          id: `${region_id}_${zone_id}_${woreda_id}_${s_id}_${s.pri_id}_program`,
          s_id: s.pri_id,
          name: s.pri_name_or,
          region_id: region_id,
          zone_id: zone_id,
          woreda_id: woreda_id,
          level: "program",
          children: []
        }))

        // Update tree with new program data
        const updatedTreeData = updateNodeChildren(treeData, id, 'sector', formatedProgram);
        setTreeData(updatedTreeData);
      } catch (error) {
        console.error("Error during sector refetch:", error);
      }
    };

    if (Object.keys(programParam).length > 0) {
      fetchData();
    }
  }, [programParam]);


  // Function to update children of specific node
  const updateNodeChildren = (treeData, parentId, level, newChildren) => {
    return treeData.map((region) => {
      if (region.id === parentId && region.level === level) {
        const existingChildIds = new Set(region.children.map((child) => child.id));
        const filteredChildren = newChildren.filter((child) => !existingChildIds.has(child.id));

        return {
          ...region,
          children: [...region.children, ...filteredChildren],
        };
      }

      if (region.children) {
        region.children = updateNodeChildren(region.children, parentId, level, newChildren);
      }

      return region;
    });
  };


  return (
    <Card className="border shadow-sm" style={{ minWidth: '300px' }}>
      <CardBody className="p-3">
        <h5 className="text-secondary">Address Structure</h5>
        <hr />
        <Col className="d-flex align-items-center gap-2 mb-3">
          <Input id="include" name="include" type="checkbox" />
          <Label for="include" className="mb-0">Include Sub-address</Label>
        </Col>
        <div className="border rounded p-2 bg-light overflow-auto" style={{ minHeight: "350px" }}>
          {treeData.length > 0 && (
            <Tree
              initialData={treeData}
              openByDefault={false}
              width={300}
              height={700}
              indent={24}
              rowHeight={36}
              overscanCount={1}
            >
              {({ node, style, dragHandle }) => (
                <Node
                  node={node}
                  style={style}
                  dragHandle={dragHandle}
                  handleClusterClick={handleClusterClick}
                  handleSectorClick={handleSectorClick}
                />
              )}
            </Tree>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default AddressTree;

function Node({ node, style, dragHandle, handleClusterClick, handleSectorClick }) {
  if (!node?.data) return null;
  const isLeafNode = node.isLeaf;
  const icon = isLeafNode ? <FaFile /> : <FaFolder />;
  const chevronIcon = node.isOpen ? <FaChevronDown /> : <FaChevronRight />;

  const handleNodeClick = (node) => {
    node.toggle();

    if (node.data.level === "cluster") {
      handleClusterClick(node);
    } else if (node.data.level === "sector") {
      handleSectorClick(node);
    }
  };

  return (
    <div
      onClick={() => handleNodeClick(node)}
      style={style}
      ref={dragHandle}
      className={`${node.isSelected ? "bg-primary text-light" : "hover:bg-info-subtle"} py-1 rounded`}
    >
      {!isLeafNode && <span className="me-2">{chevronIcon}</span>}
      <span className="me-2 text-warning">{icon}</span>
      <span className="text-danger my-auto px-1" style={{ fontWeight: 900 }}>
        {node.data.level.charAt(0).toUpperCase()}
      </span>
      <span
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "150px",
          display: "inline-block",
          verticalAlign: "middle",
        }}>{node.data.name}</span>
    </div>
  );
}
