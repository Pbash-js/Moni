import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import "react-native-gesture-handler";
import {
  openDatabase,
  initializeTables,
  checkTxnTable,
  checkCategoriesTable,
  populateCategoriesTable,
  checkBudgetTable,
  createBudgetTrigger,
  loopThroughBudgets,
  dropAllTables,
} from "./state/sqlite";
import { Provider } from "react-redux";

import { useEffect, useState } from "react";

import { NavigationContainer, DefaultTheme } from "@react-navigation/native";

import HomeNavigator from "./screens/HomeNavigator";

import { lightTheme, darkTheme } from "./colors/Colors";
import { getSavedSettings, setCurrency, setTheme } from "./state/asyncStorage";
import LoadingScreen from "./screens/LoadingScreen";
import { store } from "./state/store";

export default function App() {
  const [isLoading, setLoading] = useState(true);
  const [txnState, setTxnState] = useState([]);
  const [catState, setCatState] = useState([]);
  const [budgetState, setBudgetState] = useState([]);
  const [savedSettings, setSavedSettings] = useState({
    theme: "",
    currency: "",
  });

  useEffect(() => {
    async function fetchData() {
      openDatabase("costofliving");
      await dropAllTables();

      let isInitialized = await initializeTables();

      if (isInitialized) {
        try {
          let catPersistentState = await checkCategoriesTable();
          let isCatPop = null;
          if (catPersistentState.length == 0) {
            isCatPop = await populateCategoriesTable();
            if (isCatPop) {
              catPersistentState = await checkCategoriesTable();
            }
          }

          let budgetPersistentState = await checkBudgetTable();

          await loopThroughBudgets(budgetPersistentState);

          if (budgetPersistentState.length != 0) {
            await createBudgetTrigger();
          }

          let txnPersistentState = await checkTxnTable();
          if (
            txnPersistentState &&
            catPersistentState &&
            budgetPersistentState
          ) {
            setTxnState(txnPersistentState);
            setCatState(catPersistentState);
            setBudgetState(budgetPersistentState);
            setTimeout(() => {
              setLoading(false);
            }, 600);
          }
        } catch (err) {
          console.log(err);
        }
      }

      getSavedSettings(setSavedSettings);
    }
    fetchData();
  }, []);

  const Themes = {
    lightTheme: lightTheme,
    darkTheme: darkTheme,
  };
  const [themeType, setThemeType] = useState(savedSettings.theme);
  const [myTheme, setMyTheme] = useState(DefaultTheme);

  useEffect(() => {
    setTheme(themeType);
    setMyTheme((prevState) => {
      return {
        ...prevState,
        colors: {
          ...prevState.colors,
          ...Themes[themeType],
        },
      };
    });
  }, [themeType]);

  useEffect(() => {
    setTheme(savedSettings.theme);
    setCurrency(savedSettings.currency);
    console.log(savedSettings);

    setMyTheme((prevState) => {
      return {
        ...prevState,
        colors: {
          ...prevState.colors,
          ...Themes[savedSettings.theme],
        },
      };
    });
  }, [savedSettings]);

  if (isLoading) {
    return <LoadingScreen />;
  } else
    return (
      <>
        <Provider store={store}>
          <NavigationContainer theme={myTheme}>
            {/* <Drawer.Navigator
            initialRouteName="HomeBase"
            screenOptions={{ headerShown: false, swipeEdgeWidth: 150 }}
            drawerContent={(props) => (
              <CustomDrawer {...props} themeSelect={setThemeType} />
              )}
              >
              <Drawer.Screen
              name="HomeBase"
              children={() => (
                <HomeNavigator
                catState={catState}
                setCatState={setCatState}
                txnState={txnState}
                setTxnState={setTxnState}
                budgetState={budgetState}
                setBudgetState={setBudgetState}
                />
                )}
                />
              </Drawer.Navigator> */}
            <HomeNavigator
              catState={catState}
              setCatState={setCatState}
              txnState={txnState}
              setTxnState={setTxnState}
              budgetState={budgetState}
              setBudgetState={setBudgetState}
              setThemeType={setThemeType}
              savedSettings={savedSettings}
              setSavedSettings={setSavedSettings}
            />
          </NavigationContainer>
          <StatusBar style="inverted" />
        </Provider>
      </>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
