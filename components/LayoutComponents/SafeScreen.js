import { StyleSheet, Text, View } from "react-native";
import React from "react";

const SafeScreen = ({ children }) => {
  return <View style={styles.safeScreen}>{children}</View>;
};

export default SafeScreen;

const styles = StyleSheet.create({
  safeScreen: {
    flex: 1,
    marginTop: 40,
    marginHorizontal: 22,
  },
});
