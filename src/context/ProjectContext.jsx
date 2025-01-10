import React, { createContext, useState, useContext, useEffect } from "react";
import { useSearchProjects } from "../queries/project_query";
import FetchErrorHandler from "../components/Common/FetchErrorHandler";

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

  const [params, setParams] = useState({});
  const [searchParams, setSearchParams] = useState({});
  const {
    data: searchData,
    error: srError,
    isError: isSrError,
    refetch: search,
  } = useSearchProjects(searchParams);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsSearchLoading(true);
        await search();
        setShowSearchResult(true);
      } catch (error) {
        console.error("Error during search:", error);
      } finally {
        setIsSearchLoading(false);
      }
    };
    if (Object.keys(searchParams).length > 0) {
      fetchData();
    }
  }, [searchParams]);

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

  if (isSrError) {
    return <FetchErrorHandler error={srError} refetch={search} />;
  }

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
        params,
        setParams,
        searchParams,
        setSearchParams,
        searchData,
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
