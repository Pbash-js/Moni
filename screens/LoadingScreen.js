import { StyleSheet, View } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require("../assets/moni-splash.json")}
        loop={true}
        autoPlay={true}
      />
    </View>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#12dd32",
  },
});
