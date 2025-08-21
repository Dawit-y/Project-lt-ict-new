import React, { useState, useRef, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Spinner,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
} from "reactstrap";
import { useAuthUser } from "../../hooks/useAuthUser";
import {
  useUpdateProject,
  useFetchProject,
} from "../../queries/citizenship_project_query";

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
import L from "leaflet";
import customMarkerImg from "../../assets/images/marker.png";
import { FullscreenControl } from "react-leaflet-fullscreen";
import "react-leaflet-fullscreen/styles.css";

// Ethiopia boundaries
const ETHIOPIA_BOUNDS = {
  minLat: 3.397,
  maxLat: 14.894,
  minLng: 32.997,
  maxLng: 47.989,
};

const ETHIOPIA_CENTER = [9.0332, 38.7534]; // Approximate center of Ethiopia
const DEFAULT_ZOOM = 7;
const FOCUS_ZOOM = 9;

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

const MapFocuser = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, FOCUS_ZOOM, {
        duration: 1,
        easeLinearity: 0.25,
      });
    }
  }, [position, map]);

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
  const { user: storedUser, isLoading: authLoading, userId } = useAuthUser();
  const project = useFetchProject(passedId, userId, true);

  const fetchedLocation = project?.data?.data?.prj_geo_location;
  const isValidLocation = fetchedLocation?.includes(",");
  const location = isValidLocation
    ? fetchedLocation
    : ETHIOPIA_CENTER.join(",");

  const [latitude, longitude] = location.split(",").map(Number);
  const initialPosition = [latitude, longitude];

  const [markerPos, setMarkerPos] = useState(initialPosition);
  const [manualLat, setManualLat] = useState(latitude.toString());
  const [manualLng, setManualLng] = useState(longitude.toString());
  const [inputErrors, setInputErrors] = useState({});
  const [isManualUpdate, setIsManualUpdate] = useState(false);
  const markerRef = useRef(null);

  // Validate if coordinates are within Ethiopia
  const validateEthiopiaCoordinates = (lat, lng) => {
    const errors = {};
    const numLat = parseFloat(lat);
    const numLng = parseFloat(lng);

    if (isNaN(numLat) || isNaN(numLng)) {
      errors.coordinates = "Please enter valid numbers";
      return errors;
    }

    if (numLat < ETHIOPIA_BOUNDS.minLat || numLat > ETHIOPIA_BOUNDS.maxLat) {
      errors.latitude = `Latitude must be between ${ETHIOPIA_BOUNDS.minLat} and ${ETHIOPIA_BOUNDS.maxLat}`;
    }

    if (numLng < ETHIOPIA_BOUNDS.minLng || numLng > ETHIOPIA_BOUNDS.maxLng) {
      errors.longitude = `Longitude must be between ${ETHIOPIA_BOUNDS.minLng} and ${ETHIOPIA_BOUNDS.maxLng}`;
    }

    return errors;
  };

  // Sync marker position with fetched data
  useEffect(() => {
    if (fetchedLocation && isValidLocation) {
      const [lat, lng] = fetchedLocation.split(",").map(Number);
      setMarkerPos([lat, lng]);
      setManualLat(lat.toString());
      setManualLng(lng.toString());
    }
  }, [fetchedLocation, isValidLocation]);

  // Handle automatic updates when manual inputs change
  useEffect(() => {
    if (isManualUpdate) {
      const timer = setTimeout(() => {
        const errors = validateEthiopiaCoordinates(manualLat, manualLng);

        if (Object.keys(errors).length === 0) {
          const newPos = [parseFloat(manualLat), parseFloat(manualLng)];
          setMarkerPos(newPos);
          setInputErrors({});
        } else {
          setInputErrors(errors);
        }
      }, 1000); // 1 second debounce

      return () => clearTimeout(timer);
    }
  }, [manualLat, manualLng, isManualUpdate]);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const newPos = [marker.getLatLng().lat, marker.getLatLng().lng];
          setMarkerPos(newPos);
          setManualLat(newPos[0].toString());
          setManualLng(newPos[1].toString());
          setIsManualUpdate(false); // This is from map interaction, not manual input
        }
      },
    }),
    [],
  );

  const updateProject = useUpdateProject();

  const handleUpdateProject = async () => {
    try {
      const data = {
        prj_id: passedId,
        prj_geo_location: `${markerPos[0]},${markerPos[1]}`,
      };
      await updateProject.mutateAsync(data);
      toast.success(`Location updated successfully`, {
        autoClose: 2000,
      });
      project.refetch();
    } catch (error) {
      toast.error(`Failed to update location`, {
        autoClose: 2000,
      });
    }
  };

  const handleMapClick = (latlng) => {
    const newPos = [latlng.lat, latlng.lng];
    setMarkerPos(newPos);
    setManualLat(newPos[0].toString());
    setManualLng(newPos[1].toString());
    setInputErrors({});
    setIsManualUpdate(false); // This is from map interaction, not manual input
  };

  const handleManualChange = (e, type) => {
    setIsManualUpdate(true);
    if (type === "lat") {
      setManualLat(e.target.value);
    } else {
      setManualLng(e.target.value);
    }
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
            center={ETHIOPIA_CENTER}
            zoom={DEFAULT_ZOOM}
            scrollWheelZoom={true}
            style={{ height: "400px", width: "100%" }}
          >
            <MapResizer isActive={isActive} />
            <MapFocuser position={markerPos} />
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

      {/* Manual Coordinates Input */}
      <Form className="mt-3">
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="latitude">Latitude</Label>
              <Input
                type="text"
                id="latitude"
                value={manualLat}
                onChange={(e) => handleManualChange(e, "lat")}
                invalid={!!inputErrors.latitude || !!inputErrors.coordinates}
              />
              {inputErrors.latitude && (
                <div className="text-danger small">{inputErrors.latitude}</div>
              )}
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="longitude">Longitude</Label>
              <Input
                type="text"
                id="longitude"
                value={manualLng}
                onChange={(e) => handleManualChange(e, "lng")}
                invalid={!!inputErrors.longitude || !!inputErrors.coordinates}
              />
              {inputErrors.longitude && (
                <div className="text-danger small">{inputErrors.longitude}</div>
              )}
              {inputErrors.coordinates && (
                <div className="text-danger small">
                  {inputErrors.coordinates}
                </div>
              )}
            </FormGroup>
          </Col>
        </Row>
        <div className="text-muted  mt-2">
          Ethiopia bounds: Latitude <strong>{ETHIOPIA_BOUNDS.minLat}</strong> to{" "}
          <strong>{ETHIOPIA_BOUNDS.maxLat}</strong>, Longitude{" "}
          <strong>{ETHIOPIA_BOUNDS.minLng}</strong> to{" "}
          <strong>{ETHIOPIA_BOUNDS.maxLng}</strong>
        </div>
      </Form>

      {/* Update Button */}
      <div className="mt-3 w-full">
        {updateProject.isPending ? (
          <Button color="primary" className="mx-auto" disabled>
            <span className="flex align-items-center justify-content-center">
              <Spinner size={"sm"} />{" "}
              <span className="ms-2">Update Location</span>
            </span>
          </Button>
        ) : (
          <Button
            color="primary"
            className="mx-auto"
            onClick={handleUpdateProject}
            disabled={
              updateProject.isPending || Object.keys(inputErrors).length > 0
            }
          >
            Update Location
          </Button>
        )}
      </div>
    </>
  );
};

GeoLocation.propTypes = {
  passedId: PropTypes.any.isRequired,
  isActive: PropTypes.bool,
};

export default GeoLocation;
