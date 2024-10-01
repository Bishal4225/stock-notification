"use client";
import { Charts } from "./_ui/Charts";
import StockDetails from "./_ui/StockDetails";
export interface StockPageProps {
  params: {
    symbol: string;
  };
}

export default function StockPage(props: StockPageProps) {
  const { params } = props;
  const { symbol } = params;

  return (
    <>
      <StockDetails tradingSymbol={symbol} />
      <Charts tradingSymbol={symbol} />
    </>
  );
}
