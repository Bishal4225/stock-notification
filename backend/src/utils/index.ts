export const exchangeTradingSymbols = (
  exchange: string,
  instruments: string[]
) => {
  return instruments.map((instrument) => `${exchange}:${instrument}`);
};

export const toFixed2Number = (value: number) => {
  return Number(value.toFixed(2));
};

export const isMarketClosed = () => {
  const currentDateTime = new Date();
  const currentMinutes =
    currentDateTime.getHours() * 60 + currentDateTime.getMinutes();
  const marketOpenMinutes = 9 * 60 + 15; // 9:15 AM in minutes past midnight
  const marketCloseMinutes = 15 * 60 + 30; // 3:30 PM in minutes past midnight

  if (
    currentMinutes < marketOpenMinutes ||
    currentMinutes > marketCloseMinutes
  ) {
    return true;
  }
  return false;
};

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
