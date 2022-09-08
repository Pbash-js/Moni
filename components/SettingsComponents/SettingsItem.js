import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Card from "../LayoutComponents/Card";

const SettingsItem = ({ children }) => {
  return (
    <Card>
      <View style={styles.container}>{children}</View>
    </Card>
  );
};

export default SettingsItem;

const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
});
