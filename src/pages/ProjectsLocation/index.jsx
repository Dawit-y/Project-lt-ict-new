import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import {
  APIProvider,
  Map,
  Marker,
  AdvancedMarker,
  InfoWindow,
  Pin,
} from "@vis.gl/react-google-maps";
import Breadcrumb from "../../components/Common/Breadcrumb";
import { useTranslation } from "react-i18next";
import { getProject } from "../../store/project/actions";

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const ProjectsLocation = () => {
  const [viewState, setViewState] = useState({
    latitude: 9.0192,
    longitude: 38.7525,
    zoom: 8,
  });
  const [hoveredMarker, setHoveredMarker] = useState(null); // State to store hovered marker
  const dispatch = useDispatch();

  const { t } = useTranslation();

  useEffect(() => {
    dispatch(getProject());
  }, [dispatch]);

  const projectProperties = createSelector(
    (state) => state.ProjectR,
    (ProjectReducer) => ({
      project: ProjectReducer.project,
      loading: ProjectReducer.loading,
      update_loading: ProjectReducer.update_loading,
    })
  );

  const {
    project: { data = [] },
    loading,
  } = useSelector(projectProperties);

  const parseGeoLocation = (geoLocation) => {
    if (!geoLocation) return null;
    const [latitude, longitude] = geoLocation.split(",").map(Number);
    return { latitude, longitude };
  };

  const markers = data
    .map((project) => ({
      id: project.prj_id,
      name: project.prj_name, // Assuming the project name is available in the data
      ...parseGeoLocation(project.prj_geo_location),
    }))
    .filter((location) => location.latitude && location.longitude);

  return (
    <div className="page-content">
      <div className="container-fluid" style={{ position: "relative" }}>
        <Breadcrumb
          title={t("projects_location")}
          breadcrumbItem={t("projects_location")}
        />
        <APIProvider apiKey={API_KEY}>
          <Map
            defaultCenter={{
              lat: viewState.latitude,
              lng: viewState.longitude,
            }}
            // zoom={viewState.zoom}
            defaultZoom={8}
            style={{ height: "100vh" }}
            onDrag={(e) => {
              console.log("event in map", e);
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
                onMouseEnter={() => setHoveredMarker(marker.id)} // Show InfoWindow on hover
                onMouseLeave={() => setHoveredMarker(null)} // Hide InfoWindow on mouse out
              >
                <Pin />
                {hoveredMarker === marker.id && (
                  <InfoWindow
                    position={{ lat: marker.latitude, lng: marker.longitude }}
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
      </div>
    </div>
  );
};

export default ProjectsLocation;
