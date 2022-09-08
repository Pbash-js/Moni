import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

import { parseAmount } from "../../functions/functions";

const SlidingDigit = ({ number = 0, color }) => {
  const delY = useSharedValue(0);

  useEffect(() => {
    delY.value = withSpring(10 - number, {
      // stiffness: 200,
      damping: 25,
      // mass: 5,
    });
  }, [number]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      bottom: `${delY.value * 10}%`,
      color: color,
    };
  });
  return (
    <View style={styles.digitContainer}>
      <Animated.Text style={[styles.textContainer, animatedStyle]}>
        {" "}
      </Animated.Text>
      <Animated.Text style={[styles.textContainer, animatedStyle]}>
        9
      </Animated.Text>
      <Animated.Text style={[styles.textContainer, animatedStyle]}>
        8
      </Animated.Text>
      <Animated.Text style={[styles.textContainer, animatedStyle]}>
        7
      </Animated.Text>
      <Animated.Text style={[styles.textContainer, animatedStyle]}>
        6
      </Animated.Text>
      <Animated.Text style={[styles.textContainer, animatedStyle]}>
        5
      </Animated.Text>
      <Animated.Text style={[styles.textContainer, animatedStyle]}>
        4
      </Animated.Text>
      <Animated.Text style={[styles.textContainer, animatedStyle]}>
        3
      </Animated.Text>
      <Animated.Text style={[styles.textContainer, animatedStyle]}>
        2
      </Animated.Text>
      <Animated.Text style={[styles.textContainer, animatedStyle]}>
        1
      </Animated.Text>
      <Animated.Text style={[styles.textContainer, animatedStyle]}>
        0
      </Animated.Text>
    </View>
  );
};

const SlidingCounter = ({ number, color, currency }) => {
  const [currentValue, setCurrentValue] = useState(number);

  useEffect(() => {
    setCurrentValue(number);
  });

  return (
    <View style={styles.container}>
      {parseAmount(currentValue, currency)
        .split("")
        .map((digit, idx) => {
          if (isNaN(parseInt(digit))) {
            return (
              <Text key={idx} style={[styles.textContainer, { color: color }]}>
                {digit}
              </Text>
            );
          } else
            return (
              <SlidingDigit key={idx} color={color} number={parseInt(digit)} />
            );
        })}
    </View>
  );
};

export default SlidingCounter;

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    flexDirection: "row",
    height: 25,
  },
  digitContainer: {
    height: 250,
  },
  textContainer: {
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 25,
    height: 25,
    includeFontPadding: false,
  },
});
