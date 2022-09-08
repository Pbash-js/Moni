export const parseAmount = (amount, currency = "₹") => {
  if (amount > 1000000) {
    let millions = Math.floor(amount / 1000000);

    return `${millions}.${Math.floor((amount - 1000000 * millions) / 100000)}M`;
  } else if (amount > 1000) {
    let thousands = Math.floor(amount / 1000);

    return `${thousands}.${Math.floor((amount - 1000 * thousands) / 100)}K`;
  } else return `${amount} ${currency}`;
};

export const getFormattedDate = (date = new Date()) => {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

export const getOverview = async (txnState) => {
  return new Promise((resolve) => {
    let thisWeekIncome = 0;
    let thisWeekExpense = 0;
    let thisMonthIncome = 0;
    let thisMonthExpense = 0;
    let thisYearIncome = 0;
    let thisYearExpense = 0;
    let thisLifeIncome = 0;
    let thisLifeExpense = 0;

    txnState.forEach((item) => {
      const txnType = item.txnType;
      const itemAmount = item.txnAmount;
      const txnDateTime = new Date(item.txnDate).getTime();
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - txnDateTime;
      if (timeDiff < 604800000) {
        //this week
        if (txnType === "Expense") {
          thisWeekExpense += itemAmount;
          thisMonthExpense += itemAmount;
          thisYearExpense += itemAmount;
          thisLifeExpense += itemAmount;
        } else if (txnType === "Income") {
          thisWeekIncome += itemAmount;
          thisMonthIncome += itemAmount;
          thisYearIncome += itemAmount;
          thisLifeIncome += itemAmount;
        }
      } else if (timeDiff < 2419200000) {
        // this month
        if (txnType === "Expense") {
          thisMonthIncome += itemAmount;
          thisYearIncome += itemAmount;
          thisLifeIncome += itemAmount;
        } else if (txnType === "Income") {
          thisMonthExpense += itemAmount;
          thisYearExpense += itemAmount;
          thisLifeExpense += itemAmount;
        }
      } else if (timeDiff < 2.90304 * Math.pow(10, 10)) {
        //this year
        if (txnType === "Expense") {
          thisYearExpense += itemAmount;
          thisLifeExpense += itemAmount;
        } else if (txnType === "Income") {
          thisYearIncome += itemAmount;
          thisLifeIncome += itemAmount;
        }
      } else {
        //all time
        if (txnType === "Expense") {
          thisLifeExpense += itemAmount;
        }
        if (txnType === "Income") {
          thisLifeIncome += itemAmount;
        }
      }
    });

    resolve({
      thisWeekIncome,
      thisWeekExpense,
      thisMonthIncome,
      thisMonthExpense,
      thisYearIncome,
      thisYearExpense,
      thisLifeIncome,
      thisLifeExpense,
    });
  });
};
