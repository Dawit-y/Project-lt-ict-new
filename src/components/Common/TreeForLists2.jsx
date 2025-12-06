import {
	useState,
	useCallback,
	useRef,
	memo,
	forwardRef,
	useImperativeHandle,
} from "react";
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
	Spinner,
} from "reactstrap";
import useResizeObserver from "use-resize-observer";
import { useAuthUser } from "../../hooks/useAuthUser";
import { useDragDropManager } from "react-dnd";
import FetchErrorHandler from "./FetchErrorHandler";

const TreeForLists = forwardRef(
	(
		{
			onNodeSelect,
			setInclude,
			isCollapsed,
			setIsCollapsed,
			widthInPercent = 25,
		},
		ref
	) => {
		const { t, i18n } = useTranslation();
		const dndManager = useDragDropManager();

		// Use provided ref or create internal one
		const internalTreeRef = useRef();
		const treeRef = ref;

		const searchInputRef = useRef();
		const { userId } = useAuthUser();
		const {
			tree: treeData,
			isLoading,
			isError,
			error,
			refetch,
		} = useFetchAddressStructures(userId);

		const [searchTerm, setSearchTerm] = useState("");
		const [selectedNode, setSelectedNode] = useState({});
		const [includeChecked, setIncludeChecked] = useState(false);
		const { ref: resizeRef, width, height } = useResizeObserver();

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
		const handleClearSelection = () => {
			if (internalTreeRef.current) {
				internalTreeRef.current.deselectAll();
			}
			setIncludeChecked(false);
			if (setInclude) {
				setInclude(0);
			}
			// Clear selected node
			setSelectedNode({});
			// Notify parent that selection is cleared
			if (onNodeSelect) {
				onNodeSelect({});
			}
		};

		const handleNodeSelect = (nodeData) => {
			if (onNodeSelect) {
				onNodeSelect(nodeData);
			}
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

		// Expose methods to parent component via ref
		useImperativeHandle(ref, () => ({
			clearSelection: handleClearSelection,
		}));

		const lang = i18n.language;
		if (isError) setIsCollapsed(false);
		if (isLoading || isError) {
			return (
				<div
					style={{
						position: "relative",
						flex: isCollapsed ? "0 0 60px" : `0 0 ${widthInPercent}%`,
						minWidth: isCollapsed ? "60px" : "250px",
						transition: "all 0.3s ease",
					}}
					className="w-20 flex-shrink-0 p-3 border-end overflow-auto shadow-sm"
				>
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
						<h5>{t("address_tree_Search")}</h5>
					)}
					<hr />
					<div className="text-center">
						{isLoading ? (
							<Spinner size={"sm"} color="primary" />
						) : (
							<div className="absolute top-0">
								<FetchErrorHandler error={error} refetch={refetch} onTree />
							</div>
						)}
					</div>
				</div>
			);
		}

		return (
			<div
				style={{
					flex: isCollapsed ? "0 0 60px" : `0 0 ${widthInPercent}%`,
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
														handleNodeSelect({});
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
											<>
												<Button
													id="clear-all-button"
													onClick={handleClearSelection}
													size="sm"
													color="light"
													className="border"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="12"
														height="12"
														fill="currentColor"
														className="bi bi-x-square"
														viewBox="0 0 16 16"
													>
														<path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
														<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
													</svg>
												</Button>
												<UncontrolledTooltip
													placement="top"
													target="clear-all-button"
												>
													{t("Clear All")}
												</UncontrolledTooltip>
											</>
										</Col>
									</Row>
									<div
										ref={resizeRef}
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
												ref={internalTreeRef}
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
	}
);

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
