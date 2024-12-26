import React, { createContext, useState, useContext, useEffect } from "react";

// Create the context
const ProjectContext = createContext();

// Provider component
const ProjectProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);

  const [projectParams, setProjectParams] = useState({});
  const [prjLocationRegionId, setPrjLocationRegionId] = useState(null);
  const [prjLocationZoneId, setPrjLocationZoneId] = useState(null);
  const [prjLocationWoredaId, setPrjLocationWoredaId] = useState(null);

  useEffect(() => {
    setProjectParams({
      ...(prjLocationRegionId && {
        prj_location_region_id: prjLocationRegionId,
      }),
      ...(prjLocationZoneId && { prj_location_zone_id: prjLocationZoneId }),
      ...(prjLocationWoredaId && {
        prj_location_woreda_id: prjLocationWoredaId,
      }),
    });
  }, [prjLocationRegionId, prjLocationZoneId, prjLocationWoredaId]);

  return (
    <ProjectContext.Provider
      value={{
        searchResults,
        setSearchResults,
        isSearchLoading,
        setIsSearchLoading,
        searchError,
        setSearchError,
        showSearchResult,
        setShowSearchResult,
        projectParams,
        setProjectParams,
        prjLocationRegionId,
        setPrjLocationRegionId,
        prjLocationZoneId,
        setPrjLocationZoneId,
        prjLocationWoredaId,
        setPrjLocationWoredaId,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectProvider;
// Custom hook for using the context
export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjectContext must be used within a ProjectProvider");
  }
  return context;
};
