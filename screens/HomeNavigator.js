import { Keyboard, StyleSheet, Text, View } from "react-native";
import React from "react";
// import { addTxn as addTxnRedux } from "./state/transactionsReducer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useState, useEffect } from "react";
import { useTheme, useRoute } from "@react-navigation/native";

import Ionicons from "react-native-vector-icons/Ionicons";

import Home from "./Home";

//components
import HomeButton from "../components/InputComponents/HomeButton";
import Budget from "./Budget";
import Settings from "./Settings";

const Tab = createBottomTabNavigator();

const HomeNavigator = ({
  navigation,
  txnState,
  setTxnState,
  catState,
  setCatState,
  budgetState,
  setBudgetState,
  setThemeType,
  savedSettings,
  setSavedSettings,
}) => {
  const { colors } = useTheme();

  const [isModalVisible, setModalVisible] = useState(false);

  const defaultTxn = {
    txnIdx: "",
    txnAmount: 0,
    txnNote: "",
    txnCategory: "Uncategorized",
    txnType: "Expense",
    txnDate: new Date(),
  };

  const handleModal = () => {
    setModalVisible((prevState) => !prevState);
    setTimeout(() => {
      Keyboard.dismiss();
    }, 1000);
  };

  const [currentTxn, setCurrentTxn] = useState(defaultTxn);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      defaultScreenOptions={({ navigation }) => {}}
      screenOptions={{
        headerShown: false,
        style: { backgroundColor: "#ffffff" },
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          paddingBottom: 5,
          height: 55,
        },
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: colors.darkGrey,
      }}
    >
      <Tab.Screen
        name="Budget"
        children={() => (
          <Budget
            budgetState={budgetState}
            setBudgetState={setBudgetState}
            currentTxn={currentTxn}
            setCurrentTxn={setCurrentTxn}
            catState={catState}
            setCatState={setCatState}
            txnState={txnState}
            setTxnState={setTxnState}
          />
        )}
        listeners={{
          tabPress: (e) => {
            if (isModalVisible) {
              setModalVisible(false);
            }
          },
        }}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              size={26}
              name="calculator"
              color={focused ? colors.white : colors.darkGrey}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        children={() => (
          <Home
            isModalVisible={isModalVisible}
            currentTxn={currentTxn}
            setCurrentTxn={setCurrentTxn}
            txnState={txnState}
            setTxnState={setTxnState}
            catState={catState}
            setCatState={setCatState}
            savedSettings={savedSettings}
          />
        )}
        options={{
          tabBarButton: ({ focused, color }) => (
            <HomeButton
              handleModal={handleModal}
              isModalVisible={isModalVisible}
              defaultTxn={defaultTxn}
              currentTxn={currentTxn}
              setCurrentTxn={setCurrentTxn}
              txnState={txnState}
              setTxnState={setTxnState}
              budgetState={budgetState}
              setBudgetState={setBudgetState}
            />
          ),
          tabBarLabel: "",
        }}
      />
      <Tab.Screen
        name="Settings"
        children={() => (
          <Settings
            savedSettings={savedSettings}
            setSavedSettings={setSavedSettings}
            themeSelect={setThemeType}
          />
        )}
        listeners={{
          tabPress: (e) => {
            if (isModalVisible) {
              setModalVisible(false);
            }
          },
        }}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              size={26}
              name="settings"
              color={focused ? colors.white : colors.darkGrey}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeNavigator;

const styles = StyleSheet.create({});
