"use client";
import { trpc } from "@/trpc/client";
import { Box, Button, Heading } from "@chakra-ui/react";
import { useState } from "react";

function Dashboard() {
  const [start, setStart] = useState(false);
  // const constrolIntradayStockScreener =
  //   trpc.stockScreener.controlIntradayStockScreener.useMutation();

  // const getStockIndicesQuery = trpc.nse.getStockIndices.useQuery({
  //   indexName: "NIFTY 50",
  // });

  // const getAllIndices = trpc.nse.getIndexNames.useQuery();
  // console.log(getStockIndicesQuery.data?.data);
  // console.log(getAllIndices.data?.data);
  return (
    <Box>
      <Heading>Dashboard</Heading>
      {/* <Button
        onClick={() => {
          setStart(!start);
          constrolIntradayStockScreener.mutate({ start: !start });
        }}
      >
        {start ? "Stop" : "Start"}
      </Button> */}
    </Box>
  );
}

export default Dashboard;
