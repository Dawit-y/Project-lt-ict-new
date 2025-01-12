import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { Button, Spinner } from "reactstrap";
import { useUpdateProject } from "../../queries/project_query";
import { toast } from "react-toastify";

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const GeoLocation = (props) => {
  const { passedId } = props;
  const [markerPosition, setMarkerPosition] = useState({
    lat: 9.0192,
    lng: 38.7525,
  });

  const [viewState, setViewState] = useState({
    latitude: 9.0192,
    longitude: 38.7525,
    zoom: 8,
  });
  const updateProject = useUpdateProject();
  const handleUpdateProject = async (data) => {
    try {
      await updateProject.mutateAsync(data);
      toast.success(`data updated successfully`, {
        autoClose: 2000,
      });
      validation.resetForm();
    } catch (error) {
      toast.error(`Failed to update Data`, {
        autoClose: 2000,
      });
    }
    toggle();
  };

  const handleMapClick = useCallback((event) => {
    const lat = event.detail.latLng.lat;
    const lng = event.detail.latLng.lng;
    setMarkerPosition({ lat, lng });
  }, []);

  const handleMarkerDragEnd = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarkerPosition({ lat, lng });
  }, []);

  const handleZoomIn = () => {
    setViewState((prevState) => ({
      ...prevState,
      zoom: Math.min(prevState.zoom + 1, 21),
    }));
  };

  const handleZoomOut = () => {
    setViewState((prevState) => ({
      ...prevState,
      zoom: Math.max(prevState.zoom - 1, 1),
    }));
  };

  const handleLocationUpdate = (passedId) => {
    const data = {
      prj_id: passedId,
      prj_geo_location: `${markerPosition.lat},${markerPosition.lng}`,
    };
    handleUpdateProject(data);
  };

  return (
    <div style={{ position: "relative" }}>
      <APIProvider apiKey={API_KEY}>
        <Map
          style={{ height: "100vh" }}
          viewState={viewState}
          onViewStateChange={({ viewState }) => setViewState(viewState)}
          center={{ lat: viewState.latitude, lng: viewState.longitude }}
          zoom={viewState.zoom}
          gestureHandling="greedy"
          disableDefaultUI={true}
          onClick={handleMapClick}
        >
          <Marker
            position={markerPosition}
            draggable={true}
            onDragEnd={handleMarkerDragEnd}
          />
        </Map>
      </APIProvider>

      {/* Zoom Controls */}
      <div className="position-absolute bottom-0 end-0 me-3 mb-5 pb-3 d-flex flex-column gap-2">
        <Button color="primary" onClick={handleZoomIn}>
          +
        </Button>
        <Button color="primary" onClick={handleZoomOut}>
          -
        </Button>
      </div>

      <div className="mt-3 w-full">
        {updateProject.isPending ? (
          <Button
            color="primary"
            className="mx-auto"
            onClick={() => handleLocationUpdate(passedId)}
            disabled
          >
            <span className="flex align-items-center justify-content-center">
              <Spinner size={"sm"} /> <span className="ms-2">Update</span>
            </span>
          </Button>
        ) : (
          <Button
            color="primary"
            className="mx-auto"
            onClick={() => handleLocationUpdate(passedId)}
            disabled={updateProject.isPending}
          >
            Update
          </Button>
        )}
      </div>
    </div>
  );
};

GeoLocation.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default GeoLocation;
