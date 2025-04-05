import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "react-leaflet-fullscreen/styles.css";
import { FullscreenControl } from "react-leaflet-fullscreen";
import MarkerClusterGroup from "react-leaflet-cluster";
import customMarkerImg from "../../assets/images/marker.png";
import Breadcrumb from "../../components/Common/Breadcrumb";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import TreeForLists from "../../components/Common/TreeForLists";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import Spinners from "../../components/Common/Spinner";
import { useTranslation } from "react-i18next";
import {
  useFetchProjects,
  useSearchProjects,
} from "../../queries/project_query";
import { useFetchProjectCategorys } from "../../queries/projectcategory_query";
import {
  createSelectOptions,
  createMultiSelectOptions,
} from "../../utils/commonMethods";

const customMarkerIcon = L.icon({
  iconUrl: customMarkerImg,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const ProjectsLocation = () => {
  const [viewState, setViewState] = useState({
    latitude: 9.0192,
    longitude: 38.7525,
    zoom: 8,
  });
  const [hoveredMarker, setHoveredMarker] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [projectParams, setProjectParams] = useState({});
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const { data: projectCategoryData } = useFetchProjectCategorys();

  const {
    pct_name_en: projectCategoryOptionsEn,

    pct_name_or: projectCategoryOptionsOr,
    pct_name_am: projectCategoryOptionsAm,
  } = createMultiSelectOptions(projectCategoryData?.data || [], "pct_id", [
    "pct_name_en",
    "pct_name_or",
    "pct_name_am",
  ]);

  console.log("projectCategoryOptions", projectCategoryData);

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

  const handleMapClick = () => {
    setHoveredMarker(null);
  };

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }

  return (
    <div className="page-content">
      <Breadcrumb
        title={t("projects_location")}
        breadcrumbItem={t("projects_location")}
      />
      <div className="w-100 d-flex gap-2">
        <TreeForLists
          setIsAddressLoading={setIsAddressLoading}
          onNodeSelect={(node) => setProjectParams({ region: node.id })}
        />
        <div className="w-100">
          <AdvancedSearch
            searchHook={useSearchProjects}
            textSearchKeys={["prj_name", "prj_code"]}
            dropdownSearchKeys={[
              {
                key: "prj_project_category_id",
                options:
                  lang === "en"
                    ? projectCategoryOptionsEn
                    : lang === "am"
                    ? projectCategoryOptionsAm
                    : projectCategoryOptionsOr,
              },
            ]}
            additionalParams={projectParams}
            setAdditionalParams={setProjectParams}
            onSearchResult={handleSearchResults}
            setIsSearchLoading={setIsSearchLoading}
          />
          {isLoading || isSearchLoading ? (
            <div style={{ width: "100%", height: "100vh" }}>
              <Spinners />
            </div>
          ) : markers?.length > 0 ? (
            <MapContainer
              center={[viewState.latitude, viewState.longitude]}
              zoom={viewState.zoom}
              style={{ height: "100vh", width: "100%" }}
              scrollWheelZoom={true}
              onClick={handleMapClick}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MarkerClusterGroup>
                {markers.map((marker) => (
                  <Marker
                    key={marker.id}
                    position={[marker.latitude, marker.longitude]}
                    eventHandlers={{
                      mouseover: () => setHoveredMarker(marker.id),
                      mouseout: () => setHoveredMarker(null),
                      click: () => setHoveredMarker(marker.id),
                    }}
                    icon={customMarkerIcon}
                  >
                    {hoveredMarker === marker.id && (
                      <Popup>
                        <h5>{marker.name}</h5>
                        <p>
                          <strong>Code:</strong> {marker.code}
                        </p>
                      </Popup>
                    )}
                  </Marker>
                ))}
              </MarkerClusterGroup>
              <FullscreenControl
                position="bottomleft"
                forcePseudoFullscreen
                forceSeparateButton
              />
            </MapContainer>
          ) : (
            <div className="text-center mt-5">
              <h5 className="text-muted">{t("No data available")}</h5>
              <p>{t("Try changing your filters or searching again.")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsLocation;
