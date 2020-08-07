import React, { useState } from "react";
import colors from "../scss/index.scss";
import {
  Map,
  TileLayer,
  Popup,
  FeatureGroup,
  LayersControl,
  GeoJSON,
} from "react-leaflet";
const { BaseLayer, Overlay } = LayersControl;
import L from "leaflet";
import { useDispatch, useSelector } from "react-redux";
import { EditControl } from "react-leaflet-draw";
import axios from "axios";
import "leaflet-draw";
import { setAlgorithReady, updateTrainingPolygons } from "../actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-shadow.png",
});
import { message } from "antd";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

let currentPolygon;

const Leaflet = () => {
  const trainingdata = useSelector((state) => state.trainingdata);
  const authorized = useSelector((state) => state.auth.isAuthenticated);
  const userLoggedIn = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const currentProject = useSelector((state) => state.currentProject);
  const [editableFG, setEditableFG] = useState(null);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    //get GEOJson conform
    const position = currentPolygon.map((point) => [point.lng, point.lat]);
    console.log("the following polygon will be saved:", position);
    axios
      .post(
        "/api/v1/polygon",
        {},
        {
          params: {
            featureclass: form.elements[0].value,
            creator: userLoggedIn.id,
            polygon: position,
            projectid: currentProject._id,
          },
        }
      )
      .then(() => {})
      .catch((err) => {
        message.error("An error with saving the polygon has occured");
        console.log("Error with polygon saving:", err);
      });

    const drawnItems = editableFG.leafletElement._layers;
    if (Object.keys(drawnItems).length > 0) {
      Object.keys(drawnItems).forEach((layerid) => {
        const layer = drawnItems[layerid];
        editableFG.leafletElement.removeLayer(layer);
      });
    }
    message.success(
      "The " + form.elements[0].value + " polygon has saved to the database"
    );
    updateTrain();
    dispatch(setAlgorithReady());
    editableFG.leafletElement.closePopup();
  };
  const updateTrain = () => {
    axios
      .get("/api/v1/featureclass", {
        params: {
          projectid: currentProject._id,
        },
      })
      .then((featureClass) => {
        dispatch(updateTrainingPolygons(featureClass.data));
      });
  };

  const onCreated = () => {
    const drawnItems = editableFG.leafletElement._layers;
    if (Object.keys(drawnItems).length > 1) {
      Object.keys(drawnItems).forEach((layerid, index) => {
        if (index > 0) return;
        const layer = drawnItems[layerid];
        editableFG.leafletElement.removeLayer(layer);
      });
    }
    const objectKey = Object.keys(drawnItems)[0];
    currentPolygon = drawnItems[objectKey].editing.latlngs[0][0];
    editableFG.leafletElement.openPopup();
  };

  const onFeatureGroupReady = (reactFGref) => {
    // store the ref for future access to content
    setEditableFG(reactFGref);
  };

  let editPopup;
  if (authorized) {
    editPopup = (
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicClass">
          <Form.Label>featureclass</Form.Label>
          <Form.Control as="select" custom>
            {currentProject.categories.map(function (element) {
              return <option key={element}>{element}</option>;
            })}
          </Form.Control>
        </Form.Group>

        <Button variant="secondary" type="submit">
          <FontAwesomeIcon icon={faSave} />
        </Button>
      </Form>
    );
  } else {
    editPopup = (
      <>
        <p>You have to be signed in to save polygons to the database</p>
      </>
    );
  }

  const geoJSONstyle = () => {
    return {
      // the fillColor is adapted from a property which can be changed by the user (segment)
      fillColor: colors.primarycolor,
      //stroke-width: to have a constant width on the screen need to adapt with scale
      opacity: 1,
      color: colors.primarycolor,
      fillOpacity: 0.5,
    };
  };
  return (
    <Map center={currentProject.centerpoint} zoom={13}>
      <LayersControl>
        <BaseLayer checked name="investigation area">
          <TileLayer
            attribution="&copy;  contributors"
            url={"/static/layers/" + currentProject.name + "/{z}/{x}/{y}.png"}
            tms="false"
            minZoom="10"
            maxZoom="15"
          />
        </BaseLayer>
        <BaseLayer name="satellite image">
          <TileLayer
            attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png"
          />
        </BaseLayer>
        <BaseLayer name="OpenStreetMap">
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
        </BaseLayer>
        <Overlay name="AOA">
          <TileLayer
            attribution="&copy;  contributors"
            url={
              "/static/layers/" + currentProject.name + "_aoa/{z}/{x}/{y}.png"
            }
            tms="false"
            minZoom="10"
            maxZoom="15"
            opacity="0.8"
          />
        </Overlay>
        <Overlay checked key={JSON.stringify(trainingdata)} name="trainingdata">
          {" "}
          <GeoJSON data={trainingdata} style={geoJSONstyle()} />
        </Overlay>
      </LayersControl>

      <FeatureGroup
        ref={(featureGroupRef) => {
          onFeatureGroupReady(featureGroupRef);
        }}
      >
        <EditControl
          position="topright"
          onCreated={onCreated}
          draw={{
            rectangle: false,
            circle: false,
            polyline: false,
            marker: false,
            circlemarker: false,
          }}
        />
        <Popup>{editPopup}</Popup>
      </FeatureGroup>
    </Map>
  );
};

export default Leaflet;
