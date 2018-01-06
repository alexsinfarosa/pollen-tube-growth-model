import React from "react";
import AppBar from "material-ui/AppBar";
import FlatButton from "material-ui/FlatButton";

const AppHeader = () => (
  <AppBar
    title="Pollen Tube Growth Model Developed By Virginia Tech"
    iconElementRight={<FlatButton label="NEWA" />}
    showMenuIconButton={false}
  />
);

export default AppHeader;
