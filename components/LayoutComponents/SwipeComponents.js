import { StyleSheet, Text, View } from "react-native";

import React from "react";

export const LeftContent = ({ color }) => {
  return (
    <View style={[styles.pullContent, styles.left, { backgroundColor: color }]}>
      <Text>🛑</Text>
    </View>
  );
};

export const RightContent = ({ color, text }) => {
  return (
    <View style={[styles.pullContent, styles.left, { backgroundColor: color }]}>
      <Text>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pullContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
  },
  left: {
    marginLeft: 20,
    alignItems: "flex-start",
  },
  right: {
    marginRight: 20,
    alignItems: "flex-start",
  },
});
