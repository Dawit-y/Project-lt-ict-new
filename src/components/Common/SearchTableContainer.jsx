import PropTypes from "prop-types";

const SearchTableContainer = ({
	children,
	isCollapsed,
	widthInPercent = 75,
}) => {
	return (
		<div
			style={{
				flex: isCollapsed ? "1 1 auto" : `0 0 ${widthInPercent}%`,
				transition: "all 0.3s ease",
			}}
		>
			{children}
		</div>
	);
};

SearchTableContainer.propTypes = {
	isCollapsed: PropTypes.bool.isRequired,
	children: PropTypes.node,
};

export default SearchTableContainer;
