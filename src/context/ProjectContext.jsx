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
  const [selectedLocations, setSelectedLocations] = useState({
    region: null,
    zone: null,
    woreda: null,
    cluster: null,
    sector: null,
    program: null,
  });
  const [include, setInclude] = useState(0);

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
      ...(selectedLocations.region && { prj_location_region_id: selectedLocations.region }),
      ...(selectedLocations.zone && { prj_location_zone_id: selectedLocations.zone }),
      ...(selectedLocations.woreda && { prj_location_woreda_id: selectedLocations.woreda }),
      ...(selectedLocations.cluster && { prj_location_cluster_id: selectedLocations.cluster }),
      ...(selectedLocations.sector && { prj_location_sector_id: selectedLocations.sector }),
      ...(selectedLocations.program && { prj_location_program_id: selectedLocations.program }),
      ...(include === 1 && { include }),
    });
  }, [selectedLocations, include]);


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
        setSelectedLocations,
        params,
        setParams,
        searchParams,
        setSearchParams,
        searchData,
        setInclude,
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
