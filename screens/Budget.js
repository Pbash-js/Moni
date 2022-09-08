import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Modal,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import SafeScreen from "../components/LayoutComponents/SafeScreen";
import BudgetItem from "../components/BudgetComponents/BudgetItem";
import TitleText from "../components/TextComponents/TitleText";
import { useTheme } from "@react-navigation/native";
import Card from "../components/LayoutComponents/Card";
import BudgetModal from "../components/BudgetComponents/BudgetModal";
import { checkBudgetTable } from "../state/sqlite";

const Budget = ({
  budgetState,
  setBudgetState,
  currentTxn,
  setCurrentTxn,
  catState,
  setCatState,
  txnState,
  setTxnState,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editBudget, setEditBudget] = useState(null);
  const { colors } = useTheme();

  const handleBudgetModal = (editBudgetObject, isClosing = true) => {
    setCurrentTxn({ ...currentTxn, txnType: "Expense" });
    if (editBudgetObject !== null) setEditBudget(editBudgetObject);
    else setEditBudget(null);
    setModalVisible(isClosing);
  };

  useEffect(() => {
    const refreshBudState = async () => {
      let result = await checkBudgetTable();
      setBudgetState(result);
    };

    refreshBudState();
  }, [txnState]);

  return (
    <SafeScreen>
      <TitleText text="Budget" customStyles={{ marginBottom: 20 }} />
      <View style={styles.layoutContainer}>
        <FlatList
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 10,
          }}
          style={{
            marginHorizontal: -10,
            paddingBottom: 100,
          }}
          data={budgetState}
          renderItem={({ item }) => (
            <BudgetItem
              item={item}
              setBudgetState={setBudgetState}
              handleBudgetModal={handleBudgetModal}
              setTxnState={setTxnState}
            />
          )}
        />
        <Pressable
          onPress={() => setModalVisible(true)}
          android_ripple={{ color: colors.background, foreground: true }}
        >
          <Card
            extraStyles={{
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 30,
            }}
          >
            <Text style={[styles.addCategoryText, { color: colors.primary }]}>
              Add New Budget
            </Text>
          </Card>
        </Pressable>
        <BudgetModal
          modalVisible={modalVisible}
          handleBudgetModal={handleBudgetModal}
          colors={colors}
          currentTxn={currentTxn}
          setCurrentTxn={setCurrentTxn}
          catState={catState}
          setCatState={setCatState}
          budgetState={budgetState}
          setBudgetState={setBudgetState}
          editBudget={editBudget}
        />
      </View>
    </SafeScreen>
  );
};

export default Budget;

const styles = StyleSheet.create({
  layoutContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  addCategoryText: {
    fontSize: 20,
  },
});
