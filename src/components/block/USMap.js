import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Map as LMap, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import { matchIconsToStations } from "utils/utils";

import { Modal } from "antd";

import { SectionMap } from "styles";

@inject("app")
@observer
export default class USMap extends Component {
  state = {
    visible: false,
    selectedState: ""
  };

  handleOkCancel = d => {
    this.setState({ visible: false, selectedState: "" });
  };

  //   onClickSetStation = e => {
  //     const { lat, lng } = e.latlng;

  //     const {
  //       stations,
  //       state,
  //       states,
  //     } = this.props.app;

  //     const selectedStation = stations.find(
  //       station => station.lat === lat && station.lon === lng
  //     );

  //     const selectedState = states.find(
  //       state => state.postalCode === selectedStation.state
  //     );

  //     if (state.name === "All States") {
  //       setState(selectedState.name);
  //       setStation(selectedStation.id);
  //       setIsMap(false);
  //     } else if (selectedStation.state === state.postalCode) {
  //       setStation(selectedStation.id);
  //       setIsMap(false);
  //     } else {
  //       this.setState({ visible: true, selectedState: selectedState.name });
  //     }
  //   };

  render() {
    const { stations } = this.props.app;
    const { state } = this.props.bl;

    const stationsWithMatchedIcons = stations.map(station => {
      station["icon"] = matchIconsToStations(station, state);
      return station;
    });

    // Marker list
    const MarkerList = stationsWithMatchedIcons.map((station, i) => (
      //   console.log(station);
      <Marker
        key={`${station.id} ${station.network}`}
        position={[station.lat, station.lon]}
        icon={L.icon({ iconUrl: station.icon })}
        title={station.name}
        // onClick={this.onClickSetStation}
      />
    ));

    return (
      <SectionMap>
        <LMap
          style={{ width: "100%", height: "100%" }}
          zoomControl={this.props.breakpoints.xs ? false : true}
          scrollWheelZoom={false}
          center={[state.lat, state.lon]}
          zoom={state.zoom}
        >
          <TileLayer
            url={`${
              window.location.protocol
            }//server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}`}
          />
          {MarkerList}
        </LMap>

        <Modal
          visible={this.state.visible}
          onOk={this.handleOkCancel}
          onCancel={this.handleOkCancel}
        >
          <p>{`Select ${
            this.state.selectedState
          } from the State menu to access this station.`}</p>
        </Modal>
      </SectionMap>
    );
  }
}
