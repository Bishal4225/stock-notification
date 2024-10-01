"use client";
import TradingViewWidgets from "@/widgets/TradingViewWidgets";
import { useParams } from "next/navigation";
export interface StocksDetailsProps {}

export default function StocksDetails(props: StocksDetailsProps) {
  const params = useParams<{ id: string }>();

  return (
    <>
      <TradingViewWidgets symbol={params.id} />
    </>
  );
}
