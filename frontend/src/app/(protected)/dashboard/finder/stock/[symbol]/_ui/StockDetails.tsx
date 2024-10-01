"use client";
import { trpc } from "@/trpc/client";
import {
  Container,
  Heading,
  Divider,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Box,
  Text,
  Tag,
  HStack,
  Flex,
} from "@chakra-ui/react";

export interface StockDetailsProps {
  tradingSymbol: string;
}

function StockDetails(props: StockDetailsProps) {
  const { tradingSymbol } = props;

  const getEquityDetailsQuery = trpc.nse.getEquityDetails.useQuery({
    symbol: tradingSymbol,
  });

  const data = getEquityDetailsQuery.data;

  if (!data) {
    return <div>Loading...</div>;
  }

  const { info, metadata, priceInfo, industryInfo } = data;

  return (
    <Container maxW="container.xl">
      <Flex justify="space-between" w="full">
        <Heading as="h2" size="lg">
          {info.companyName}
          <Tag ml="2">{info.symbol}</Tag>
        </Heading>

        <Box>
          <Stat>
            <StatLabel>Last Price</StatLabel>
            <StatNumber>₹{priceInfo.lastPrice}</StatNumber>
            <StatHelpText>
              <StatArrow
                type={priceInfo.change > 0 ? "increase" : "decrease"}
              />
              {priceInfo.change?.toFixed(2)} ({priceInfo.pChange?.toFixed(2)}%)
            </StatHelpText>
          </Stat>
        </Box>
      </Flex>

      <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
        <Text fontSize="lg" mb={2}>
          Industry: {info.industry}
        </Text>
        <Text fontSize="lg" mb={2}>
          Listed on: {metadata.listingDate}
        </Text>

        {industryInfo && (
          <>
            <Heading as="h4" size="md" mb={4}>
              Industry Information
            </Heading>
            <Text fontSize="lg" mb={2}>
              Macro: {industryInfo.macro}
            </Text>
            <Text fontSize="lg" mb={2}>
              Sector: {industryInfo.sector}
            </Text>
            <Text fontSize="lg" mb={2}>
              Industry: {industryInfo.industry}
            </Text>
            <Text fontSize="lg" mb={2}>
              Basic Industry: {industryInfo.basicIndustry}
            </Text>
          </>
        )}

        <Divider my={4} />

        <SimpleGrid columns={{ sm: 2, md: 3 }} spacing={8}>
          <Stat>
            <StatLabel>Last Price</StatLabel>
            <StatNumber>₹{priceInfo.lastPrice}</StatNumber>
            <StatHelpText>
              <StatArrow
                type={priceInfo.change > 0 ? "increase" : "decrease"}
              />
              {priceInfo.change} ({priceInfo.pChange?.toFixed(2)}%)
            </StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>Open Price</StatLabel>
            <StatNumber>₹{priceInfo.open}</StatNumber>
          </Stat>

          <Stat>
            <StatLabel>Previous Close</StatLabel>
            <StatNumber>₹{priceInfo.previousClose}</StatNumber>
          </Stat>

          <Stat>
            <StatLabel>Intraday High</StatLabel>
            <StatNumber>₹{priceInfo.intraDayHighLow?.max}</StatNumber>
          </Stat>

          <Stat>
            <StatLabel>Intraday Low</StatLabel>
            <StatNumber>₹{priceInfo.intraDayHighLow?.min}</StatNumber>
          </Stat>

          <Stat>
            <StatLabel>52 Week High</StatLabel>
            <StatNumber>₹{priceInfo.weekHighLow?.max}</StatNumber>
            <StatHelpText>on {priceInfo.weekHighLow?.maxDate}</StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>52 Week Low</StatLabel>
            <StatNumber>₹{priceInfo.weekHighLow?.min}</StatNumber>
            <StatHelpText>on {priceInfo.weekHighLow?.minDate}</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Lower Band</StatLabel>
            <StatNumber>₹{priceInfo.lowerCP}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Upper Band</StatLabel>
            <StatNumber>₹{priceInfo.upperCP}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>VWAP</StatLabel>
            <StatNumber>₹{priceInfo.vwap.toFixed(2)}</StatNumber>
          </Stat>
        </SimpleGrid>

        <Divider my={4} />

        <Divider my={4} />

        <Heading as="h4" size="md" mb={4}>
          Other Information
        </Heading>
        <Text fontSize="lg" mb={2}>
          Sector PE: {metadata.pdSectorPe}
        </Text>

        <Text fontSize="lg" mb={2}>
          Sector Index: {metadata.pdSectorInd.trim()}
        </Text>
      </Box>
    </Container>
  );
}

export default StockDetails;
