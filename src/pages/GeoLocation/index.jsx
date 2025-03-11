import React, { useState, useRef, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Spinner } from "reactstrap";
import { useUpdateProject, useFetchProject } from "../../queries/project_query";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import { toast } from "react-toastify";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./leaflet-container.css";
import L from "leaflet"
import customMarkerImg from "../../assets/images/marker.png"
import { FullscreenControl } from "react-leaflet-fullscreen";
import "react-leaflet-fullscreen/styles.css";


const customMarkerIcon = L.icon({
  iconUrl: customMarkerImg,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const MapResizer = ({ isActive }) => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 500);
  }, [map, isActive]);

  return null;
};

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });

  return null;
};

const GeoLocation = ({ passedId, isActive }) => {
  const storedUser = JSON.parse(localStorage.getItem("authUser"));
  const userId = storedUser?.user.usr_id;
  const project = useFetchProject(passedId, userId, true);

  const fetchedLocation = project?.data?.data?.prj_geo_location;
  const isValidLocation = fetchedLocation?.includes(",");
  const location = isValidLocation
    ? fetchedLocation
    : "9.033210806941447,38.753355757339804";

  const [latitude, longitude] = location.split(",").map(Number);
  const position = [latitude, longitude];

  const [markerPos, setMarkerPos] = useState(position);
  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setMarkerPos([marker.getLatLng().lat, marker.getLatLng().lng]);
        }
      },
    }),
    []
  );

  const updateProject = useUpdateProject();

  const handleUpdateProject = async () => {
    try {
      const data = {
        prj_id: passedId,
        prj_geo_location: `${markerPos[0]},${markerPos[1]}`,
      };
      await updateProject.mutateAsync(data);
      toast.success(`Data updated successfully`, {
        autoClose: 2000,
      });
    } catch (error) {
      toast.error(`Failed to update data`, {
        autoClose: 2000,
      });
    }
  };

  const handleMapClick = (latlng) => {
    setMarkerPos([latlng.lat, latlng.lng]);
  };

  if (project.isError) {
    return (
      <FetchErrorHandler error={project.error} refetch={project.refetch} />
    );
  }
  return (
    <>
      <div className="w-full h-full d-flex align-items-center justify-content-center">
        {project.isLoading ? (
          <Spinner />
        ) : (
          <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "400px", width: "100%" }}
          >
            <MapResizer isActive={isActive} />
            <MapClickHandler onMapClick={handleMapClick} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              draggable={true}
              eventHandlers={eventHandlers}
              position={markerPos}
              ref={markerRef}
              icon={customMarkerIcon}
            />
            <FullscreenControl
              position="bottomleft"
              forcePseudoFullscreen
              forceSeparateButton
            />
          </MapContainer>
        )}
      </div>
      <div className="mt-3 w-full">
        {updateProject.isPending ? (
          <Button color="primary" className="mx-auto" disabled>
            <span className="flex align-items-center justify-content-center">
              <Spinner size={"sm"} /> <span className="ms-2">Update</span>
            </span>
          </Button>
        ) : (
          <Button
            color="primary"
            className="mx-auto"
            onClick={handleUpdateProject}
            disabled={updateProject.isPending}
          >
            Update
          </Button>
        )}
      </div>
    </>
  );
};

GeoLocation.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default GeoLocation;
