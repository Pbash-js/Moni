import { StyleSheet, Text, View, Switch } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import React, { useState } from "react";
import DrawerSwitch from "../components/InputComponents/DrawerSwitch";

const CustomDrawer = (props) => {
  const [isDarkTheme, setDarkTheme] = useState(false);

  const handleTheme = () => {
    if (isDarkTheme) {
      props.themeSelect("lightTheme");
    } else {
      props.themeSelect("darkTheme");
    }
    setDarkTheme(!isDarkTheme);
  };

  return (
    <DrawerContentScrollView>
      <DrawerSwitch
        text="Dark Mode"
        defaultState={false}
        handleValueChange={handleTheme}
      />
    </DrawerContentScrollView>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({});
