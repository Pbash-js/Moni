import { StyleSheet, View } from "react-native";
import React, { useEffect } from "react";
import Animated, { Layout } from "react-native-reanimated";

import HomeOverview from "../components/HomeComponents/HomeOverview";
import TitleText from "../components/TextComponents/TitleText";
import SafeScreen from "../components/LayoutComponents/SafeScreen";
import AddExpenseModal from "../screens/AddExpenseModal";
import TxnItem from "../components/LayoutComponents/TxnItem";

import { parseAmount } from "../functions/functions";
import { removeTxn } from "../state/sqlite";
import CaptionText from "../components/TextComponents/CaptionText";
import { useState } from "react";
//TODO add filters in list of txns

const extractItemKey = (item) => {
  return item.txnIdx;
};

const Home = ({
  isModalVisible,
  currentTxn,
  setCurrentTxn,
  txnState,
  setTxnState,
  catState,
  setCatState,
  savedSettings,
}) => {
  const callRemoveTxn = (txnIdx) => {
    removeTxn(txnIdx, setTxnState);
  };

  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const showGreeting = () => {
      let greetings = [
        "Have a great day!",
        "Good Morning!",
        "Good Afternoon!",
        "Good Evening!",
        "It's Late. Sleep.",
      ];

      let hour = new Date().getHours();
      if (hour >= 5 && hour < 9) return greetings[0];
      else if (hour >= 9 && hour < 12) return greetings[1];
      else if (hour >= 12 && hour < 17) return greetings[2];
      else if (hour >= 17 && hour < 24) return greetings[3];
      else if (hour >= 0 && hour < 5) return greetings[4];
    };

    setGreeting(showGreeting());
  }, []);

  return (
    <SafeScreen>
      <TitleText text={greeting} />
      <HomeOverview txnState={txnState} currency={savedSettings.currency} />
      <CaptionText
        //change this
        customStyles={{
          fontSize: 15,
          fontWeight: "bold",
          marginTop: 15,
        }}
        text={
          txnState.length === 0
            ? "No transactions recorded"
            : "Recent transactions:"
        }
      >
        {txnState.length !== 0
          ? "Recent transactions"
          : "No transactions recorded"}
      </CaptionText>
      <View style={styles.txnListContainer}>
        <Animated.FlatList
          itemLayoutAnimation={Layout.springify()}
          keyExtractor={extractItemKey}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 10,
          }}
          style={{
            marginHorizontal: -10,
            paddingBottom: 100,
          }}
          data={txnState}
          fadingEdgeLength={200}
          renderItem={({ item }) => (
            <TxnItem item={item} callRemoveTxn={callRemoveTxn} />
          )}
        />
      </View>
      <AddExpenseModal
        isModalVisible={isModalVisible}
        currentTxn={currentTxn}
        setCurrentTxn={setCurrentTxn}
        catState={catState}
        setCatState={setCatState}
      />
    </SafeScreen>
  );
};

export default Home;
export { parseAmount };

const styles = StyleSheet.create({
  txnListContainer: {
    marginVertical: 10,
    flex: 1,
  },
});
