import { useEffect, useState, useCallback, useRef, memo } from "react";
import { useTranslation } from "react-i18next";
import { useFetchAddressStructures } from "../../queries/address_structure_query";
import { Tree } from "react-arborist";
import {
  FaFolder,
  FaChevronRight,
  FaChevronDown,
  FaChevronUp,
  FaBars,
  FaSearch,
} from "react-icons/fa";
import {
  Card,
  CardBody,
  Input,
  Label,
  Col,
  Row,
  Button,
  UncontrolledTooltip,
} from "reactstrap";
import useResizeObserver from "use-resize-observer";
import { v4 as uuidv4 } from "uuid";
import { useAuthUser } from "../../hooks/useAuthUser";
import { useDragDropManager } from "react-dnd";

const TreeForLists = ({
	onNodeSelect,
	setIsAddressLoading,
	setInclude,
	isCollapsed,
	setIsCollapsed,
}) => {
	const { t, i18n } = useTranslation();
	const dndManager = useDragDropManager();
	const treeRef = useRef();
	const searchInputRef = useRef();
	const { userId } = useAuthUser();
	const { data, isLoading, isError } = useFetchAddressStructures(userId);
	const [treeData, setTreeData] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedNode, setSelectedNode] = useState({});
	const [includeChecked, setIncludeChecked] = useState(false);
	const { ref, width, height } = useResizeObserver();

	useEffect(() => {
		setIsAddressLoading(isLoading);
	}, [isLoading]);

	useEffect(() => {
		if (data) {
			const transformData = (regions) =>
				regions.map((region) => ({
					...region,
					id: region.id?.toString() || uuidv4(),
					children:
						region.children?.map((zone) => ({
							...zone,
							id: zone.id?.toString() || uuidv4(),
							children:
								zone.children?.map((woreda) => ({
									...woreda,
									id: woreda.id?.toString() || uuidv4(),
								})) || [],
						})) || [],
				}));
			setTreeData(transformData(data));
		}
	}, [data]);

	const handleCheckboxChange = (e) => {
		const checked = e.target.checked;
		setIncludeChecked(checked);
		if (setInclude) {
			setInclude(checked ? 1 : 0);
		}
	};

	const handleSearchTerm = (e) => {
		setSearchTerm(e.target.value);
	};

	const handleNodeSelect = (nodeData) => {
		onNodeSelect(nodeData);
		setSelectedNode((prev) => {
			if (Object.keys(nodeData).length === 0) return {};
			return {
				...nodeData,
				level: nodeData.level || "unknown",
			};
		});
	};

	const handleExpandAndFocusSearch = () => {
		setIsCollapsed(false);
		setTimeout(() => {
			if (selectedNode?.id) {
				treeRef.current?.select(selectedNode.id);
				treeRef.current?.scrollTo(selectedNode.id);
			}
			searchInputRef.current?.focus();
		}, 200);
	};

	const searchMatch = useCallback((node, term, lang) => {
		if (!term) return true;
		const searchTerm = term.toLowerCase();
		const getNodeName = (node) => {
			if (!node?.data) return "";
			if (lang === "en" && node.data.add_name_en)
				return node.data.add_name_en.toLowerCase();
			if (lang === "am" && node.data.add_name_am)
				return node.data.add_name_am.toLowerCase();
			return node.data.name?.toLowerCase() || "";
		};
		const nameExists = (currentNode) => {
			if (getNodeName(currentNode).includes(searchTerm)) return true;
			if (currentNode.parent) return nameExists(currentNode.parent);
			return false;
		};
		return nameExists(node);
	}, []);

	const lang = i18n.language;

	if (isLoading || isError) {
		return (
			<div
				style={{ minHeight: "100vh", minWidth: "250px" }}
				className="w-20 flex-shrink-0 p-3 border-end overflow-auto shadow-sm"
			>
				<h5>{t("address_tree_Search")}</h5>
				<hr />
				<p className="text-center">
					{isLoading ? "Loading..." : "Error fetching address structure"}
				</p>
			</div>
		);
	}

	return (
		<div
			style={{
				flex: isCollapsed ? "0 0 60px" : "0 0 25%",
				minWidth: isCollapsed ? "60px" : "250px",
				transition: "all 0.3s ease",
			}}
		>
			<div
				className="d-flex"
				style={{
					transition: "width 0.3s ease",
					width: "100%",
					height: "100%",
				}}
			>
				<Card
					className="border-0 w-100"
					style={isCollapsed ? { minHeight: "100vh" } : {}}
				>
					<CardBody className="p-2">
						{isCollapsed ? (
							<div className="d-flex justify-content-center align-items-center mb-2 mx-auto w-100">
								<>
									<Button
										id="expand-tree-button"
										size="sm"
										color="light"
										onClick={handleExpandAndFocusSearch}
									>
										<FaBars />
									</Button>
									<UncontrolledTooltip
										placement="right"
										target="expand-tree-button"
									>
										Expand
									</UncontrolledTooltip>
								</>
							</div>
						) : (
							<div className="d-flex justify-content-between align-items-center mb-2">
								<h5 className="mb-0">{t("address_tree_Search")}</h5>
								<Button
									id="collapse-tree-button"
									size="sm"
									color="light"
									onClick={() => setIsCollapsed(true)}
									className="ms-auto"
								>
									<FaBars />
								</Button>
								<UncontrolledTooltip
									placement="top"
									target="collapse-tree-button"
								>
									Collapse
								</UncontrolledTooltip>
							</div>
						)}

						{isCollapsed ? (
							<div className="d-flex justify-content-center align-items-start mb-2 mt-3 mx-auto h-100">
								<div className="d-flex flex-column align-items-center gap-3">
									<>
										<Input
											id="collapsed-include"
											type="checkbox"
											checked={includeChecked}
											onChange={handleCheckboxChange}
										/>
										<UncontrolledTooltip
											placement="right"
											target="collapsed-include"
										>
											{t("include_sub_address")}
										</UncontrolledTooltip>
									</>
									<>
										<Button
											id="collapsed-search-button"
											size="sm"
											color="light"
											onClick={handleExpandAndFocusSearch}
										>
											<FaSearch />
										</Button>
										<UncontrolledTooltip
											placement="right"
											target="collapsed-search-button"
										>
											Search
										</UncontrolledTooltip>
									</>
									{selectedNode && Object.keys(selectedNode).length > 0 && (
										<>
											<div
												id="selected-node-tooltip"
												className="d-flex align-items-center gap-1 bg-info-subtle px-2 py-1 rounded"
												style={{ cursor: "pointer" }}
												onClick={() => handleNodeSelect({})}
											>
												<span className="text-warning">
													<FaFolder />
												</span>
												<span
													className="text-danger"
													style={{ fontWeight: 900, fontSize: "0.9rem" }}
												>
													{selectedNode.level.charAt(0).toUpperCase()}
												</span>
											</div>
											<UncontrolledTooltip
												placement="right"
												target="selected-node-tooltip"
											>
												{lang === "en" && selectedNode.add_name_en
													? selectedNode.add_name_en
													: lang === "am" && selectedNode.add_name_am
													? selectedNode.add_name_am
													: selectedNode.name}
											</UncontrolledTooltip>
										</>
									)}
								</div>
							</div>
						) : (
							<>
								<Row className="mb-2">
									<Col className="d-flex align-items-center gap-2 my-auto">
										<Input
											id="include"
											type="checkbox"
											checked={includeChecked}
											onChange={handleCheckboxChange}
											className="my-auto"
										/>
										<Label for="include" className="my-auto">
											{t("include_sub_address")}
										</Label>
									</Col>
								</Row>
								<Row className="mb-2">
									<Col className="d-flex gap-2">
										<Input
											id="searchterm"
											type="text"
											bsSize="sm"
											ref={searchInputRef}
											placeholder={t("search")}
											value={searchTerm}
											onChange={handleSearchTerm}
										/>
										<>
											<Button
												id="close-all-button"
												onClick={() => {
													onNodeSelect({});
													treeRef.current?.closeAll();
												}}
												size="sm"
												color="light"
												className="border"
											>
												<FaChevronUp />
											</Button>
											<UncontrolledTooltip
												placement="top"
												target="close-all-button"
											>
												{t("Close All")}
											</UncontrolledTooltip>
										</>
									</Col>
								</Row>
								<div
									ref={ref}
									className="border rounded p-1"
									style={{
										height: "100vh",
										overflow: "auto",
									}}
								>
									{treeData.length > 0 && width && height && (
										<Tree
											initialData={treeData}
											openByDefault={false}
											searchTerm={searchTerm}
											searchMatch={(node, term) =>
												searchMatch(node, term, lang)
											}
											ref={treeRef}
											width={Math.max(width || 350, 350)}
											height={height || 800}
											indent={24}
											rowHeight={36}
											overscanCount={1}
											disableDrag
											disableDrop
											dndManager={dndManager}
										>
											{({ node, style, dragHandle }) => (
												<Node
													node={node}
													style={style}
													dragHandle={dragHandle}
													onNodeSelect={handleNodeSelect}
												/>
											)}
										</Tree>
									)}
								</div>
							</>
						)}
					</CardBody>
				</Card>
			</div>
		</div>
	);
};

const Node = ({ node, style, dragHandle, onNodeSelect }) => {
  if (!node?.data) return null;
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const isLeafNode = node.isLeaf;
  const chevronIcon = node.isOpen ? <FaChevronDown /> : <FaChevronRight />;

  const handleNodeClick = (node) => {
    node.toggle();
    onNodeSelect(node.data);
  };

  return (
    <div
      onClick={() => handleNodeClick(node)}
      style={{ ...style, display: "flex" }}
      ref={dragHandle}
      className={`${
        node.isSelected ? "bg-info-subtle" : ""
      } py-1 rounded hover-zoom`}
    >
      {!isLeafNode && node.data.level !== "woreda" && (
        <span className="me-2 ps-2">{chevronIcon}</span>
      )}
      <span
        className={`${
          node.data.level === "woreda" ? "ms-4" : ""
        }  me-1 text-warning`}
      >
        <FaFolder />
      </span>
      <span className="text-danger my-auto px-1" style={{ fontWeight: 900 }}>
        {node.data.level.charAt(0).toUpperCase()}
      </span>
      <span
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "100%",
          display: "inline-block",
          verticalAlign: "middle",
        }}
      >
        {lang === "en" && node.data.add_name_en
          ? node.data.add_name_en
          : lang === "am" && node.data.add_name_am
          ? node.data.add_name_am
          : node.data.name}
      </span>
    </div>
  );
};

export default memo(TreeForLists);
