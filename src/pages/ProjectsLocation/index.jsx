import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  Pin,
} from "@vis.gl/react-google-maps";
import Breadcrumb from "../../components/Common/Breadcrumb";
import { useTranslation } from "react-i18next";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import CascadingDropdowns from "../../components/Common/CascadingDropdowns2";
import {
  useFetchProjects,
  useSearchProjects,
} from "../../queries/project_query";
import Spinners from "../../components/Common/Spinner";

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

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
  const [projectCategoryOptions, setProjectCategoryOptions] = useState([]);

  const { data, isLoading, error, isError } = useFetchProjects();
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
      ...parseGeoLocation(project.prj_geo_location),
    }))
    .filter((location) => location.latitude && location.longitude);

  const handleSearchResults = ({ data, error }) => {
    setSearchResults(data);
    setSearchError(error);
    setShowSearchResult(true);
  };
  useEffect(() => {
    const fetchProjectCategory = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_API_URL}project_category/listgrid`
        );
        const transformedData = response.data.data.map((item) => ({
          label: item.pct_name_or.toString(),
          value: item.pct_id.toString(),
        }));
        const optionsWithDefault = [
          { label: "Select Project Category", value: "" },
          ...transformedData,
        ];
        setProjectCategoryOptions(optionsWithDefault);
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    };
    fetchProjectCategory();
  }, []);

  return (
    <div className="page-content">
      <div className="container-fluid" style={{ position: "relative" }}>
        <Breadcrumb
          title={t("projects_location")}
          breadcrumbItem={t("projects_location")}
        />
        <AdvancedSearch
          searchHook={useSearchProjects}
          textSearchKeys={["prj_name", "prj_code"]}
          dropdownSearchKeys={[
            {
              key: "prj_project_category_id",
              options: projectCategoryOptions,
            },
          ]}
          Component={CascadingDropdowns}
          component_params={{
            dropdown1name: "prj_location_region_id",
            dropdown2name: "prj_location_zone_id",
            dropdown3name: "prj_location_woreda_id",
          }}
          onSearchResult={handleSearchResults}
          setIsSearchLoading={setIsSearchLoading}
          setSearchResults={setSearchResults}
          setShowSearchResult={setShowSearchResult}
        />
        {isLoading || isSearchLoading ? (
          <Spinners top={"top-65"} />
        ) : markers && markers.length > 0 ? ( // Correct condition
          <APIProvider apiKey={API_KEY}>
            <Map
              defaultCenter={{
                lat: viewState.latitude,
                lng: viewState.longitude,
              }}
              defaultZoom={8}
              style={{ height: "100vh" }}
              onDrag={(e) => {
                setViewState({
                  latitude: e.latLng.lat(),
                  longitude: e.latLng.lng(),
                  zoom: viewState.zoom,
                });
              }}
              options={(maps) => ({
                gestureHandling: "greedy",
                zoomControl: true,
                zoomControlOptions: {
                  position: maps.ControlPosition.TOP_RIGHT,
                },
              })}
              reuseMaps={true}
              mapId={"DEMO_MAP_ID"}
            >
              {markers.map((marker) => (
                <AdvancedMarker
                  key={marker.id}
                  position={{ lat: marker.latitude, lng: marker.longitude }}
                  onMouseEnter={() => setHoveredMarker(marker.id)}
                  onMouseLeave={() => setHoveredMarker(null)}
                >
                  <Pin />
                  {hoveredMarker === marker.id && (
                    <InfoWindow
                      position={{
                        lat: marker.latitude,
                        lng: marker.longitude,
                      }}
                      options={{
                        pixelOffset: new window.google.maps.Size(0, -40),
                      }}
                    >
                      <h6 className="">{marker.name}</h6>
                    </InfoWindow>
                  )}
                </AdvancedMarker>
              ))}
            </Map>
          </APIProvider>
        ) : (
          <div className="position-absolute top-70 start-50">
            <h6 className="text-danger mb-1">{t("No data available")}</h6>
          </div>
        )}
      </div>
    </div>
  );
};
export default ProjectsLocation;
