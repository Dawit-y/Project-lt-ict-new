import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import Breadcrumb from "../../components/Common/Breadcrumb";
import { useTranslation } from "react-i18next";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import AddressStructureForProject from "../Project/AddressStructureForProject";
import {
  useFetchProjects,
  useSearchProjects,
} from "../../queries/project_query";
import { useFetchProjectCategorys } from "../../queries/projectcategory_query";
import { createSelectOptions } from "../../utils/commonMethods";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import Spinners from "../../components/Common/Spinner";
import "leaflet/dist/leaflet.css";

const ProjectsLocation = () => {
  const [viewState, setViewState] = useState({
    latitude: 9.0192,
    longitude: 38.7525,
    zoom: 8,
  });
  const [hoveredMarker, setHoveredMarker] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [projectParams, setProjectParams] = useState({});
  const [prjLocationRegionId, setPrjLocationRegionId] = useState(null);
  const [prjLocationZoneId, setPrjLocationZoneId] = useState(null);
  const [prjLocationWoredaId, setPrjLocationWoredaId] = useState(null);
  const [isAddressLoading, setIsAddressLoading] = useState(false);

  const { data: projectCategoryData } = useFetchProjectCategorys();
  const projectCategoryOptions = createSelectOptions(
    projectCategoryData?.data || [],
    "pct_id",
    "pct_name_or"
  );

  const { data, isLoading, error, isError, refetch } =
    useFetchProjects(projectParams);
  const { t } = useTranslation();

  const parseGeoLocation = (geoLocation) => {
    if (!geoLocation) return null;
    const [latitude, longitude] = geoLocation.split(",").map(Number);
    return { latitude, longitude };
  };

  const markers = (showSearchResult ? searchResults?.data : data?.data)
    ?.map((project) => ({
      id: project.prj_id,
      name: project.prj_name,
      code: project.prj_code,
      ...parseGeoLocation(project.prj_geo_location),
    }))
    .filter((location) => location.latitude && location.longitude);

  const handleSearchResults = ({ data, error }) => {
    setSearchResults(data);
    setSearchError(error);
    setShowSearchResult(true);
  };

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

  const handleNodeSelect = (node) => {
    if (node.level === "region") {
      setPrjLocationRegionId(node.id);
      setPrjLocationZoneId(null); // Clear dependent states
      setPrjLocationWoredaId(null);
    } else if (node.level === "zone") {
      setPrjLocationZoneId(node.id);
      setPrjLocationWoredaId(null); // Clear dependent state
    } else if (node.level === "woreda") {
      setPrjLocationWoredaId(node.id);
    }
  };

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }

  return (
    <div className="page-content">
      <div className="" style={{ position: "relative" }}>
        <Breadcrumb
          title={t("projects_location")}
          breadcrumbItem={t("projects_location")}
        />
        <div className="w-100 d-flex gap-2">
          <AddressStructureForProject
            onNodeSelect={handleNodeSelect}
            setIsAddressLoading={setIsAddressLoading}
          />
          <div className="w-100">
            <AdvancedSearch
              searchHook={useSearchProjects}
              textSearchKeys={["prj_name", "prj_code"]}
              dropdownSearchKeys={[
                {
                  key: "prj_project_category_id",
                  options: projectCategoryOptions,
                },
              ]}
              additionalParams={projectParams}
              setAdditionalParams={setProjectParams}
              onSearchResult={handleSearchResults}
              setIsSearchLoading={setIsSearchLoading}
              setSearchResults={setSearchResults}
              setShowSearchResult={setShowSearchResult}
            />
            {isLoading || isSearchLoading || isAddressLoading ? (
              <div style={{ width: "100%", height: "400px" }}>
                <Spinners />
              </div>
            ) : markers && markers.length > 0 ? (
              <MapContainer
                center={[viewState.latitude, viewState.longitude]}
                zoom={viewState.zoom}
                style={{ height: "400px", width: "100%", zIndex: "1" }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {markers.map((marker) => (
                  <Marker
                    key={marker.id}
                    position={[marker.latitude, marker.longitude]}
                    eventHandlers={{
                      mouseover: () => setHoveredMarker(marker.id),
                    }}
                  >
                    {hoveredMarker === marker.id && (
                      <Popup>
                        <h6>{marker.name}</h6>
                        <h6>{marker.code}</h6>
                      </Popup>
                    )}
                  </Marker>
                ))}
              </MapContainer>
            ) : (
              <div className="position-absolute top-70 start-50">
                <h6 className="mt-5 mb-1">{t("No data available")}</h6>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsLocation;
