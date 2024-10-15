import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { Button } from "reactstrap";
import { updateProject } from "../../store/project/actions";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { Spinner } from "reactstrap";

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const GeoLocation = (props) => {
  const { passedId } = props;
  console.log("passed id geolocation", passedId);
  const [markerPosition, setMarkerPosition] = useState({
    lat: 9.0192,
    lng: 38.7525,
  });

  const handleMapClick = useCallback((event) => {
    console.log(event);
    const lat = event.detail.latLng.lat;
    const lng = event.detail.latLng.lng;
    setMarkerPosition({ lat, lng });
  }, []);

  const projectProperties = createSelector(
    (state) => state.ProjectR, // this is geting from  reducer
    (ProjectReducer) => ({
      update_loading: ProjectReducer.update_loading,
    })
  );

  const { update_loading } = useSelector(projectProperties);

  const dispatch = useDispatch();
  const handleLocationUpdate = (passedId) => {
    const data = {
      prj_id: passedId,
      prj_geo_location: `${markerPosition.lat},${markerPosition.lng}`,
    };
    dispatch(updateProject(data));
  };

  return (
    <React.Fragment>
      <div className="container-fluid">
        <APIProvider apiKey={API_KEY}>
          <Map
            style={{ height: "100vh" }}
            defaultCenter={{ lat: 9.0192, lng: 38.7525 }}
            defaultZoom={8}
            gestureHandling="greedy"
            disableDefaultUI={true}
            onClick={handleMapClick}
          >
            <Marker position={markerPosition} />
          </Map>
        </APIProvider>
        <div className="mt-3 w-full">
          {update_loading ? (
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
              disabled={update_loading}
            >
              Update
            </Button>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default GeoLocation;
