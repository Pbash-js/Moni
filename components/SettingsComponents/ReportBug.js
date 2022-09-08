import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Modal,
  FlatList,
  Linking,
} from "react-native";
import React from "react";
import SettingsItem from "../SettingsComponents/SettingsItem";
import { useTheme } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useState } from "react";

const ReportBug = () => {
  const { colors } = useTheme();

  const openMail = async () => {
    try {
      await Linking.openURL("mailto:purnanshuborkarofficial@gmail.com");
    } catch (error) {}
  };

  return (
    <Pressable
      android_ripple={{ color: colors.background, foreground: true }}
      onPress={openMail}
    >
      <SettingsItem>
        <Text style={{ color: colors.text }}>Bugs/Suggestions</Text>
        <Ionicons name="bug" size={24} color={colors.text} />
      </SettingsItem>
    </Pressable>
  );
};

export default ReportBug;

const styles = StyleSheet.create({});
