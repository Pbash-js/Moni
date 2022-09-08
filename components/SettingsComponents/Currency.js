import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Modal,
  FlatList,
} from "react-native";
import React from "react";
import SettingsItem from "../SettingsComponents/SettingsItem";
import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import currencies from "../../assets/currency-list.json";

const Currency = ({ currency, handleCurrency }) => {
  const { colors } = useTheme();
  const [isOpen, toggleOpen] = useState(false);

  const handleCurrencySelect = (newCur) => {
    handleCurrency(newCur);
    toggleOpen(false);
  };
  return (
    <SettingsItem>
      <Text style={{ color: colors.text }}>Currency</Text>
      <Pressable onPress={() => toggleOpen(true)}>
        <View style={styles.well}>
          <Text style={{ color: colors.text }}>{currency}</Text>
        </View>
      </Pressable>
      <Modal
        animationType="slide"
        visible={isOpen}
        onRequestClose={() => {
          toggleOpen(!isOpen);
        }}
        style={{
          flexGrow: 1,
          justifyContent: "space-between",
          padding: 20,
        }}
      >
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <FlatList
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 20,
            }}
            style={{
              marginHorizontal: -10,
              paddingBottom: 100,
            }}
            data={currencies}
            renderItem={({ item, index }) => (
              <Pressable
                android_ripple={{ color: colors.background, foreground: true }}
                onPress={() => handleCurrencySelect(item.symbol)}
              >
                <SettingsItem>
                  <Text style={{ color: colors.text }}>{item.name}</Text>
                  <Text style={{ color: colors.text }}>{item.symbol}</Text>
                </SettingsItem>
              </Pressable>
            )}
          />
        </View>
      </Modal>
    </SettingsItem>
  );
};

export default Currency;

const styles = StyleSheet.create({
  well: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
  },
});
