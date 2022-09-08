import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import SafeScreen from "../components/LayoutComponents/SafeScreen";
import TitleText from "../components/TextComponents/TitleText";
import DrawerSwitch from "../components/InputComponents/DrawerSwitch";
import Currency from "../components/SettingsComponents/Currency";
import ReportBug from "../components/SettingsComponents/ReportBug";

const Settings = ({ savedSettings, setSavedSettings }) => {
  const handleTheme = () => {
    console.log(savedSettings.theme + "In settings");
    if (savedSettings.theme === "darkTheme") {
      setSavedSettings((prevState) => {
        return { ...prevState, theme: "lightTheme" };
      });
      // themeSelect("lightTheme");
    } else {
      // themeSelect("darkTheme");
      setSavedSettings((prevState) => {
        return { ...prevState, theme: "darkTheme" };
      });
    }
  };

  const handleCurrency = (newCurrency) => {
    setSavedSettings((prevState) => {
      return { ...prevState, currency: newCurrency };
    });
  };

  return (
    <SafeScreen>
      <TitleText text="Settings" />
      <Currency
        currency={savedSettings.currency}
        handleCurrency={handleCurrency}
      />
      <DrawerSwitch
        text="Dark Mode"
        defaultState={savedSettings.theme === "lightTheme" ? false : true}
        handleValueChange={handleTheme}
      />
      <ReportBug />
    </SafeScreen>
  );
};

export default Settings;

const styles = StyleSheet.create({});
