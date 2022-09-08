import { StyleSheet, Text, View, Animated, Easing } from "react-native";
import React, { useRef } from "react";
import LottieView from "lottie-react-native";

const HomeButtonIcon = ({ value = 1 }) => {
  const animationProgress = useRef(new Animated.Value(0));

  Animated.timing(animationProgress.current, {
    toValue: value,
    duration: 700,
    easing: Easing.ease,
    useNativeDriver: false,
  }).start();

  return (
    <LottieView
      source={require("../../assets/HomeIconAnim.json")}
      progress={animationProgress.current}
      loop={true}
      style={{ margin: 5 }}
      pointerEvents="none"
    />
  );
};

export default HomeButtonIcon;

const styles = StyleSheet.create({});
