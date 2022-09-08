import * as SQLite from "expo-sqlite";

//database
let db = null;
export const openDatabase = (name) => {
  db = SQLite.openDatabase(name);
};

export const initializeTables = async () => {
  return new Promise(
    async (resolve) => {
      let txnCreated = await createTxnTable();
      let catCreated = await createCategoryTable();
      let budgetCreated = await createBudgetTable();
      let txnBudMapCreated = await createTxnBudgetMap();

      if (txnCreated && catCreated && budgetCreated && txnBudMapCreated) {
        console.log("INITIALIZING");
        resolve(true);
      }
    },
    (reject) => {
      console.log("INITIALIZATION FAILED");
    }
  );
};

export const dropAllTables = async () => {
  return new Promise(async (resolve) => {
    console.log("asdsdsdsdsdsd");
    let txnDropped = await dropTxnTable();
    let catDropped = await dropCategoryTable();
    console.log("0923i4i0293");
    let budgetDropped = await dropBudgetTable();
    let txnBudMapDropped = await dropTxnBudgetMap();
    console.log("xp8u12398uj");

    if (txnDropped && catDropped && budgetDropped && txnBudMapDropped) {
      resolve(true);
    }
  });
};

export const createTxnTable = async () => {
  return new Promise(async (resolve) => {
    await db.transaction(
      async (tx) =>
        await tx.executeSql(
          `CREATE TABLE IF NOT EXISTS txns
        ( 
            txnIdx INTEGER PRIMARY KEY AUTOINCREMENT,
            txnAmount REAL NOT NULL,
            txnNote TEXT,
            txnCategory TEXT,
            txnType TEXT NOT NULL, 
            txnDate TEXT NOT NULL
            );`,
          null,
          async () => {
            console.log("TXN TABLE CREATED/FOUND");
            resolve(true);
          },
          () => console.log("TXN TABLE NOT CREATED")
        )
    );
  });
};

const dropTxnTable = async () => {
  return new Promise(async (resolve) => {
    await db.transaction(
      async (tx) =>
        await tx.executeSql(
          `DROP TABLE IF EXISTS txns;`,
          null,
          () => {
            console.log("TXN TABLE DROPPED");
            resolve(true);
          },
          () => {
            console.log("TXN TABLE DROP FAILED");
          }
        )
    );
  });
};

const _insertionSort = (newEntry, entryCompareProp, state) => {
  for (let i = 0; i < state.length; i++) {
    if (newEntry[entryCompareProp] > state[i][entryCompareProp]) {
      console.log(state[i][entryCompareProp]);
      state.splice(i, 0, newEntry);
      return state;
    }
  }
  state.push(newEntry);
  return state;
};

export const addTxn = async (
  { txnAmount, txnNote, txnCategory, txnType, txnDate },
  txnState,
  setTxnState
) => {
  return new Promise(async (resolve) => {
    await db.transaction(async (tx) => {
      await tx.executeSql(
        "INSERT INTO txns(txnAmount,txnNote,txnCategory,txnType,txnDate) VALUES(?,?,?,?,?);",
        [txnAmount, txnNote, txnCategory, txnType, txnDate.toISOString()],
        async (_, data) => {
          await tx.executeSql(
            "SELECT * FROM txns WHERE txnIdx=?;",
            [data.insertId],
            async (_, data) => {
              //if today, no need to sort
              if (
                txnState[0] == undefined ||
                txnDate >= new Date(txnState[0].txnDate)
              )
                setTxnState([data.rows._array[0], ...txnState]);
              else
                setTxnState(
                  _insertionSort(data.rows._array[0], "txnDate", txnState)
                );

              console.log("INTERNAL STATE UPDATED");
              resolve(true);
              ``;
            },
            () => console.log("INTERNAL STATE NOT UPDATED")
          );
          console.log("ADDED TXN");
        },
        (_, err) => {
          console.log("ADD TXN FAILED");
          console.log(err);
        }
      );
    });
  });
};

export const removeTxn = async (txnIdx, setTxnState) => {
  return new Promise(async (resolve) => {
    db.transaction(async (tx) => {
      await tx.executeSql(
        "DELETE FROM txns WHERE txnIdx = ?;",
        [txnIdx],
        async (_, data) => {
          setTimeout(() => {
            setTxnState((prevState) =>
              prevState.filter((item) => item.txnIdx !== txnIdx)
            );
          }, 300);
          resolve(true);
          console.log("TXN REMOVED");
        },
        () => console.log("TXN REMOVE FAILED")
      );
    });
  });
};

export const checkTxnTable = async () => {
  return new Promise(async (resolve) => {
    await db.transaction(async (tx) => {
      await tx.executeSql(
        `SELECT * FROM txns ORDER BY date(txnDate) DESC`,
        0,
        async (_, { rows }) => {
          resolve(rows._array);
        },
        () => console.log("CHECK TXN TABLE FAILED:")
      );
    });
  });
};

export const getBudgetTxns = async (budgetIdx) => {
  return new Promise(async (resolve) => {
    await db.transaction(async (tx) => {
      tx.executeSql(
        `SELECT * FROM txns WHERE txnIdx IN(
          SELECT txnIdx FROM txnBudgetMap WHERE budgetIdx=?
        );`,
        [budgetIdx],
        async (_, data) => {
          resolve(data.rows._array);
          console.log("FETCHED BUDGET TXNS");
        },
        () => console.log("FETCH BUDGET DATA FAILED")
      );
    });
  });
};

export const createTxnBudgetMap = async () => {
  return new Promise(async (resolve) => {
    await db.transaction(
      async (tx) =>
        await tx.executeSql(
          `CREATE TABLE IF NOT EXISTS txnBudgetMap
        ( 
            txnIdx INTEGER,
            budgetIdx INTEGER
            );`,
          null,
          async () => {
            console.log("BUDGET MAP CREATED/FOUND");
            resolve(true);
          },
          () => console.log("BUDGET MAP NOT CREATED")
        )
    );
  });
};

export const checkTxnBudgetMap = async () => {
  return new Promise(async (resolve) => {
    await db.transaction(async (tx) => {
      await tx.executeSql(
        `SELECT * FROM txnBudgetMap;`,
        [],
        async (_, data) => {
          console.log(data.rows._array);
          resolve(true);
        },
        () => console.log("txnBudget check failed")
      );
    });
  });
};

const dropTxnBudgetMap = async () => {
  return new Promise(async (resolve) => {
    await db.transaction(
      async (tx) =>
        await tx.executeSql(
          `DROP TABLE IF EXISTS txnBudgetMap;`,
          null,
          async () => {
            console.log("txnBudgetMap TABLE DROPPED");
            resolve(true);
          },
          () => {
            console.log("txnBudgetMap TABLE DROP FAILED");
          }
        )
    );
  });
};

export const createBudgetTrigger = async () => {
  return new Promise(async (resolve) => {
    await db.transaction(async (tx) => {
      await tx.executeSql(
        `CREATE TRIGGER IF NOT EXISTS budgetADDTrigger 
          AFTER INSERT ON txns
          BEGIN
            INSERT INTO txnBudgetMap SELECT new.txnIdx, budgetIdx 
            FROM budget 
            WHERE date(new.txnDate) > date(budget.budgetLastUpdated) 
            AND (new.txnCategory 
            IN (SELECT budgetCategory FROM budget WHERE budgetCategory = new.txnCategory) OR budgetCategory = '');
          END;`,

        null,
        async (tx) => {
          await tx.executeSql(
            `CREATE TRIGGER IF NOT EXISTS budgetUPDTrigger 
              AFTER INSERT ON txns
              BEGIN
                UPDATE budget SET budgetRemaining = budgetRemaining - new.txnAmount WHERE (budgetCategory = new.txnCategory OR budgetCategory = '') 
                  AND date(new.txnDate) > date(budget.budgetLastUpdated);
              END;`,
            null,
            async (tx) => {
              await tx.executeSql(
                `CREATE TRIGGER IF NOT EXISTS catUPDTrigger 
              AFTER INSERT ON txns
              BEGIN
                UPDATE categories SET catPrevDate = "${new Date().toISOString()}" WHERE catName = new.txnCategory;
              END;`,
                null,
                async (tx) => {
                  await tx.executeSql(
                    `CREATE TRIGGER IF NOT EXISTS bMapUPDTrigger 
                        AFTER UPDATE ON budget
                        BEGIN
                          DELETE FROM txnBudgetMap 
                            WHERE budgetIdx IN (
                              SELECT budgetIdx FROM txnBudgetMap AS bMap 
                                INNER JOIN txns AS txs
                                ON bMap.txnIdx = txs.txnIdx
                              WHERE date(new.budgetLastUpdated) > date(txs.txnDate)
                            );
                        END;`,
                    null,
                    async (tx) => {
                      await tx.executeSql(
                        `CREATE TRIGGER IF NOT EXISTS txnMapDel 
                        AFTER DELETE ON txns
                        BEGIN
                          UPDATE budget SET budgetRemaining = budgetRemaining + old.txnAmount WHERE budgetIdx IN (
                            SELECT budgetIdx FROM txnBudgetMap WHERE txnIdx = old.txnIdx
                          );
                        END;`,
                        null,
                        async () => {
                          console.log("BUDGet AMOUNT TRIGGER CREATED");
                          resolve(true);
                        },
                        (_, err) => console.log(err)
                      );

                      console.log("BudgetMap UPDATE TRIGGER CREATED");
                    },
                    () => {
                      console.log("BudgetMap UPDATE TRIGGER CREATION FAILED");
                    }
                  );
                  console.log("CAT TRIGGER UPDATE CREATED IN TXNS");
                },
                () => console.log("CAT TRIGGER UPDATE CREATION FAILED")
              );
              console.log("BUD TRIGGER ADD CREATED IN TXNS");
            },
            () => console.log("BUD TRIGGER UPDATE CREATION FAILED")
          );
          console.log("MAP TRIGGER ADD CREATED IN TXNS");
        },
        (_, err) => {
          console.log("MAP TRIGGER ADD FAILED");
          console.log(err);
        }
      );
    });
  });
};

export const createCategoryTable = async () => {
  return new Promise(async (resolve) => {
    await db.transaction(
      async (tx) =>
        await tx.executeSql(
          `CREATE TABLE IF NOT EXISTS categories
            ( 
              catIdx INTEGER PRIMARY KEY,
              catName TEXT UNIQUE NOT NULL,
              catIcon TEXT NOT NULL,
              catPrevDate TEXT NOT NULL,
              catType TEXT NOT NULL
            );`,
          null,
          async () => {
            console.log("CAT TABLE CREATED/FOUND");
            resolve(true);
          },
          () => console.log("CAT TABLE NOT CREATED")
        )
    );
  });
};

const dropCategoryTable = async () => {
  return new Promise(async (resolve) => {
    await db.transaction(async (tx) => {
      await tx.executeSql(`DROP TABLE IF EXISTS categories`, null, () => {
        console.log("Category table dropped");
        resolve(true);
      });
    });
  });
};

const catDate = new Date().toISOString();

const catBatch = [
  {
    catIdx: 1,
    catName: "Food",
    catIcon: "🥣",
    catPrevDate: catDate,
    catType: "Expense",
  },
  {
    catIdx: 2,
    catName: "Travel",
    catIcon: "🚗",
    catPrevDate: catDate,
    catType: "Expense",
  },
  {
    catIdx: 3,
    catName: "Groceries",
    catIcon: "🛒",
    catPrevDate: catDate,
    catType: "Expense",
  },
  {
    catIdx: 4,
    catName: "Transfers",
    catIcon: "🔄",
    catPrevDate: catDate,
    catType: "Expense",
  },
  {
    catIdx: 5,
    catName: "Bills",
    catIcon: "💸",
    catPrevDate: catDate,
    catType: "Expense",
  },
  {
    catIdx: 6,
    catName: "Shopping",
    catIcon: "🛍️",
    catPrevDate: catDate,
    catType: "Expense",
  },
  {
    catIdx: 7,
    catName: "Entertain",
    catIcon: "🍿",
    catPrevDate: catDate,
    catType: "Expense",
  },
  {
    catIdx: 8,
    catName: "Salary",
    catIcon: "💰",
    catPrevDate: catDate,
    catType: "Income",
  },
  {
    catIdx: 9,
    catName: "Investing",
    catIcon: "🏛️",
    catPrevDate: catDate,
    catType: "Income",
  },
  {
    catIdx: 10,
    catName: "Returns",
    catIcon: "💸",
    catPrevDate: catDate,
    catType: "Income",
  },
  {
    catIdx: 11,
    catName: "Loans",
    catIcon: "💲",
    catPrevDate: catDate,
    catType: "Income",
  },
];

export const populateCategoriesTable = async () => {
  return new Promise(async (resolve) => {
    let result = await _populateCategoryBatch(catBatch);
    resolve(result);
  });
};

const _populateCategoryBatch = async (batch) => {
  return new Promise(async (resolve) => {
    let tempRes = [];

    await batch.forEach(async (category) => {
      await db.transaction(async (tx) => {
        await tx.executeSql(
          `
        INSERT INTO categories VALUES (?, ?, ?, ?, ?);
        `,
          [
            category.catIdx,
            category.catName,
            category.catIcon,
            category.catPrevDate,
            category.catType,
          ],
          async (_, { rows }) => {
            tempRes.push(rows._array[0]);
            // console.log("POPULATED CAT TABLE :" + category.catName);
          },
          () => console.log("POPULATE CAT TABLE FAILED")
        );
      });
    });

    resolve(tempRes);
  });
};

export const checkCategoriesTable = async () => {
  return new Promise(async (resolve) => {
    await db.transaction(async (tx) => {
      await tx.executeSql(
        `SELECT * FROM categories ORDER BY date(catPrevDate) DESC;`,
        null,
        async (_, { rows }) => {
          resolve(rows._array);
        },
        () => console.log("CHECK CATEGORY TABLE FAILED")
      );
    });
  });
};

export const addCategory = async (
  { catName, catIcon, catPrevDate, catType },
  catState,
  setCatState
) => {
  return new Promise(async (resolve) => {
    await db.transaction(async (tx) => {
      await tx.executeSql(
        `
        INSERT INTO categories VALUES (?, ?, ?, ?, ?);
        `,
        [catState.length + 1, catName, catIcon, catPrevDate, catType],
        async (_, data) => {
          await tx.executeSql(
            "SELECT * FROM categories WHERE catIdx=?;",
            [data.insertId],
            async (_, data) => {
              if (
                catState[0] == undefined ||
                catPrevDate >= new Date(catState[0].catPrevDate)
              )
                setCatState([data.rows._array[0], ...txnState]);
              else
                setCatState(
                  _insertionSort(data.rows._array[0], "catPrevDate", catState)
                );
            },
            () => console.log("INTERNAL STATE NOT UPDATED")
          );
          resolve(true);
        },
        () => console.log("ADD CATEGORY FAILED")
      );
    });
  });
};

export const removeCategory = async (catIdx, setCatState) => {
  return new Promise(async (resolve) => {
    await db.transaction(async (tx) => {
      await tx.executeSql(
        `
        DELETE FROM categories WHERE catIdx=?;
        `,
        [catIdx],
        async () => {
          setCatState((prevState) =>
            prevState.filter((item) => item.catIdx !== catIdx)
          );
          console.log("REMOVED CATEGORY");
          resolve(true);
        },
        () => console.log("REMOVE CATEGORY FAILED")
      );
    });
  });
};

export const createBudgetTable = async () => {
  return new Promise(async (resolve) => {
    await db.transaction(async (tx) => {
      await tx.executeSql(
        `CREATE TABLE IF NOT EXISTS budget (
        budgetIdx INTEGER PRIMARY KEY AUTOINCREMENT,
        budgetName TEXT NOT NULL,
        budgetAmount INTEGER NOT NULL,
        budgetRemaining INTEGER NOT NULL,
        budgetDuration INTEGER NOT NULL,
        budgetLastUpdated TEXT NOT NULL,
        budgetCategory TEXT
      );`,
        [],
        async () => {
          console.log("BUDGET TABLE CREATED/FOUND");
          resolve(true);
        },
        () => {
          console.log("BUDGET TABLE NOT CREATED");
        }
      );
    });
  });
};

const dropBudgetTable = async () => {
  console.log("123");
  return new Promise(async (resolve) => {
    await db.transaction(
      async (tx) =>
        await tx.executeSql(
          `DROP TABLE IF EXISTS budget;`,
          null,
          () => {
            console.log("BUDGET TABLE DROPPED");
            resolve(true);
          },
          () => {
            console.log("BUDGET TABLE DROP FAILED");
          }
        )
    );
  });
};

export const checkBudgetTable = async (setBudgetState) => {
  return new Promise(async (resolve) => {
    await db.transaction(async (tx) => {
      await tx.executeSql(
        `SELECT * FROM budget`,
        0,
        async (_, { rows }) => {
          if (setBudgetState) setBudgetState(rows._array);
          loopThroughBudgets(rows._array);
          resolve(rows._array);
        },
        () => console.log("CHECK BUDGET TABLE FAILED")
      );
    });
  });
};

export const loopThroughBudgets = async (budgetState) => {
  return new Promise(async (resolve) => {
    await budgetState.forEach(async (budget) => {
      let now = new Date();
      let budgetDate = new Date(budget.budgetLastUpdated);

      let isSameYear = now.getFullYear() === budgetDate.getFullYear();
      let isSameQuarter = false;
      let isSameMonth = false;
      let isSameWeek = false;
      let isSameDay = false;

      if (isSameYear) {
        isSameQuarter = now.getMonth() % 3 === budgetDate.getMonth() % 3;

        if (isSameQuarter) {
          isSameMonth = now.getMonth() === budgetDate.getMonth();

          if (isSameMonth) {
            let oneJan = new Date(now.getFullYear(), 0, 1);
            let numberOfDaysforNow = Math.floor(
              (now - oneJan) / (24 * 60 * 60 * 1000)
            );
            let numberOfDaysforBU = Math.floor(
              (budgetDate - oneJan) / (24 * 60 * 60 * 1000)
            );
            let weekNow = Math.ceil(
              (now.getDay() + 1 + numberOfDaysforNow) / 7
            );
            let weekBU = Math.ceil(
              (budgetDate.getDay() + 1 + numberOfDaysforBU) / 7
            );

            isSameWeek = weekNow === weekBU;

            if (isSameWeek) {
              isSameDay = now.getDay() === budgetDate.getDay();
            }
          }
        }
      }

      if (budget.budgetDuration === "Daily" && !isSameDay) {
        await refreshBudget(budget.budgetIdx, now.toISOString());
      } else if (budget.budgetDuration === "Weekly" && !isSameWeek) {
        await refreshBudget(budget.budgetIdx, now.toISOString());
      } else if (budget.budgetDuration === "Monthly" && !isSameMonth) {
        await refreshBudget(budget.budgetIdx, now.toISOString());
      } else if (budget.budgetDuration === "Quarterly" && !isSameQuarter) {
        await refreshBudget(budget.budgetIdx, now.toISOString());
      } else if (budget.budgetDuration === "Yearly" && !isSameYear) {
        await refreshBudget(budget.budgetIdx, now.toISOString());
      }
    });
    resolve(true);
  });
};

const refreshBudget = async (budgetIdx, now) => {
  return new Promise(async (resolve) => {
    await db.transaction(async (tx) => {
      await tx.executeSql(
        `UPDATE budget SET budgetRemaining = budgetAmount, budgetLastUpdated = ? 
        WHERE budgetIdx = ?`,
        [now, budgetIdx],
        async (_, { rows }) => {
          console.log("BUDGET UPDATED");
          resolve(rows._array);
        },
        () => console.log("BUDGET UPDATE FAILED")
      );
    });
  });
};

export const addBudget = async (
  {
    budgetName,
    budgetAmount,
    budgetRemaining,
    budgetDuration,
    budgetLastUpdated,
    budgetCategory,
  },
  setBudgetState
) => {
  return new Promise(async (resolve) => {
    await db.transaction(async (tx) => {
      await tx.executeSql(
        "INSERT INTO budget (budgetName,budgetAmount,budgetRemaining, budgetDuration, budgetLastUpdated, budgetCategory) VALUES(?,?,?,?,?,?);",
        [
          budgetName,
          budgetAmount,
          budgetRemaining,
          budgetDuration,
          budgetLastUpdated,
          budgetCategory,
        ],
        async (_, data) => {
          console.log(budgetCategory + "is something");

          await tx.executeSql(
            "SELECT * FROM budget WHERE budgetIdx=?;",
            [data.insertId],
            async (_, data) => {
              setBudgetState((prevState) => [
                ...prevState,
                data.rows._array[0],
              ]);
              await createBudgetTrigger();
              console.log("INTERNAL STATE UPDATED");
              resolve(true);
            },
            () => console.log("INTERNAL STATE NOT UPDATED")
          );
          console.log("ADDED BUDGET");
        },
        (error) => {
          console.log("ADD BUDGET FAILED");
        }
      );
    });
  });
};

export const removeBudget = async (budgetIdx, setBudgetState) => {
  return new Promise(async (resolve) => {
    await db.transaction(async (tx) => {
      await tx.executeSql(
        "DELETE FROM budget WHERE budgetIdx=?",
        [budgetIdx],
        async (_, data) => {
          setTimeout(() => {
            if (setBudgetState)
              setBudgetState((prevState) =>
                prevState.filter((item) => item.budgetIdx !== budgetIdx)
              );
          }, 100);
          resolve(true);
          console.log("BUDGET REMOVED");
        },
        () => console.log("BUDGET REMOVE FAILED")
      );
    });
  });
};

export const updateBudget = async (
  {
    budgetIdx,
    budgetName,
    budgetAmount,
    budgetRemaining,
    budgetDuration,
    budgetLastUpdated,
    budgetCategory,
  },
  setBudgetState
) => {
  return new Promise(async (resolve) => {
    await db.transaction(async (tx) => {
      await tx.executeSql(
        "UPDATE budget SET budgetName =?,budgetAmount =?,budgetRemaining =?, budgetDuration =?, budgetLastUpdated = ?, budgetCategory=? WHERE budgetIdx=?",
        [
          budgetName,
          budgetAmount,
          budgetRemaining,
          budgetDuration,
          budgetLastUpdated,
          budgetCategory,
          budgetIdx,
        ],
        async (_, data) => {
          await tx.executeSql(
            "SELECT * FROM budget",
            [],
            async (_, data) => {
              setTimeout(() => {
                if (setBudgetState) setBudgetState(data.rows._array);
              }, 100);
              console.log("BUDGET UPDATED");
            },
            () => {
              console.log("BUDGET UPDATE FAILED");
            }
          );
          console.log(data);

          resolve(true);
          console.log("BUDGET UPDATED");
        },
        () => {
          console.log("BUDGET UPDATE FAILED");
        }
      );
    });
  });
};
