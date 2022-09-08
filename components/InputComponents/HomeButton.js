import { StyleSheet, View, Pressable } from "react-native";
import React, { useEffect } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

import { addTxn, checkBudgetTable } from "../../state/sqlite";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import {
  useTheme,
  useNavigationState,
  useNavigation,
} from "@react-navigation/native";
import HomeButtonIcon from "./HomeButtonIcon";
import { setTxnAmount } from "../../state/reducers/currentTxn";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const HomeButton = ({
  handleModal,
  isModalVisible,
  currentTxn,
  defaultTxn,
  setCurrentTxn,
  txnState,
  setTxnState,
  budgetState,
  setBudgetState,
}) => {
  // const [currentIcon, setCurrentIcon] = useState("plus");
  // 0 -> home
  // 0.5 ->  plus
  // 1 -> tick
  const [isDisabled, setDisabled] = useState(true);
  const [currentIcon, setCurrentIcon] = useState(0);

  const currentTxnAmount = useSelector((state) => state.currentTxn.txnAmount);
  const dispatch = useDispatch();

  const xDisplacement = useSharedValue(0);
  const { colors } = useTheme();

  const routes = useNavigationState((state) => state);

  const navigation = useNavigation();

  const animatedStyleLeft = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: -xDisplacement.value }],
    };
  });
  const animatedStyleRight = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: xDisplacement.value }],
    };
  });

  const handleIconChange = (text) => {
    setCurrentIcon(text);
  };

  useEffect(() => {
    if (isModalVisible) {
      handleIconChange(1);
      xDisplacement.value = withSpring(50, { damping: 12 });
    } else {
      handleIconChange(0.5);
      xDisplacement.value = withSpring(0, { damping: 20 });
    }
  }, [isModalVisible]);

  useEffect(() => {
    console.log(currentTxnAmount);

    if (currentTxnAmount == 0 && isModalVisible) {
      setDisabled(true);
    } else if (!isModalVisible || currentTxnAmount != 0) {
      setDisabled(false);
    }
  }, [currentTxnAmount, isModalVisible]);

  useEffect(() => {
    if (routes.routeNames[routes.index] !== "Home") {
      // handleIconChange("home-circle");
      handleIconChange(0);
    } else {
      // handleIconChange("plus");
      handleIconChange(0.5);
    }
  }, [routes]);

  const handleAddPress = async () => {
    console.log("value is " + currentTxnAmount);

    if (routes.routeNames[routes.index] !== "Home") {
      navigation.navigate("Home");
      return;
    }

    if (currentTxnAmount) {
      await addTxn(
        {
          ...currentTxn,
          txnAmount: currentTxnAmount,
        },
        txnState,
        setTxnState
      );
      setCurrentTxn(defaultTxn);
      dispatch(setTxnAmount(0));

      checkBudgetTable(setBudgetState);
    }

    handleModal();
  };

  const handleCrossPress = () => {
    setCurrentTxn(defaultTxn);
    handleModal();
  };

  return (
    <View style={styles.outerContainer}>
      <AnimatedPressable
        onPress={handleCrossPress}
        style={[
          styles.container,
          animatedStyleLeft,
          { top: -25, elevation: 4 },
        ]}
      >
        {({ pressed }) => {
          return (
            <View
              style={[
                styles.button,
                {
                  backgroundColor: colors.danger,
                  top: pressed ? 5 : 0,
                },
              ]}
            >
              <MaterialCommunityIcons name="close" color="#eee" size={40} />
            </View>
          );
        }}
      </AnimatedPressable>

      <AnimatedPressable
        onPress={handleAddPress}
        style={[styles.container, animatedStyleRight, { top: -25 }]}
        disabled={isDisabled}
      >
        {({ pressed }) => (
          <View
            style={[
              styles.button,
              {
                backgroundColor: isDisabled ? colors.lightGrey : colors.tabBar,
                top: pressed ? 5 : 0,
              },
            ]}
          >
            <HomeButtonIcon value={currentIcon} />
            {/* <MaterialCommunityIcons name={currentIcon} color="#eee" size={40} /> */}
          </View>
        )}
      </AnimatedPressable>
    </View>
  );
};

export default HomeButton;

const styles = StyleSheet.create({
  outerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: {
    position: "absolute",
    top: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    height: 70,
    width: 70,
    borderRadius: 35,
    borderWidth: 10,
    borderColor: "#fff",
  },
});
