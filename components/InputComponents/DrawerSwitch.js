import { StyleSheet, Text, View, Switch } from "react-native";
import React, { useState } from "react";
import { useTheme } from "@react-navigation/native";
import SettingsItem from "../SettingsComponents/SettingsItem";

const DrawerSwitch = ({
  text = "",
  defaultState = false,
  handleValueChange,
}) => {
  const { colors } = useTheme();
  const [switchValue, setSwitchValue] = useState(defaultState);

  const handleChange = () => {
    setSwitchValue((prevState) => !prevState);
    handleValueChange();
  };
  return (
    <SettingsItem>
      <Text style={{ color: colors.text }}>{text}</Text>
      <Switch value={switchValue} onValueChange={handleChange} />
    </SettingsItem>
  );
};

export default DrawerSwitch;

const styles = StyleSheet.create({});
