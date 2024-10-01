import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Box, Flex, HStack, Text } from "@chakra-ui/react";

// NOTE: Change this date to whatever date you want to countdown to :)
const COUNTDOWN_FROM = "2024-6-01";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

const StickyCountdown = () => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [remaining, setRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    intervalRef.current = setInterval(handleCountdown, 1000);

    return () => clearInterval(intervalRef.current || undefined);
  }, []);

  const handleCountdown = () => {
    const end = new Date(COUNTDOWN_FROM);

    const now = new Date();

    const distance = +end - +now;

    const days = Math.floor(distance / DAY);
    const hours = Math.floor((distance % DAY) / HOUR);
    const minutes = Math.floor((distance % HOUR) / MINUTE);
    const seconds = Math.floor((distance % MINUTE) / SECOND);

    setRemaining({
      days,
      hours,
      minutes,
      seconds,
    });
  };

  return (
    <Box
      position="sticky"
      top={0}
      left={0}
      right={0}
      zIndex={50}
      bg="green.600"
      px={2}
      py={0.5}
      color="white"
      boxShadow="md"
    >
      <Flex
        mx="auto"
        w="fit-content"
        maxW="5xl"
        flexWrap="wrap"
        alignItems="center"
        justifyContent="center"
        gap={4}
        fontSize={["xs", "sm"]}
      >
        <CountdownItem num={remaining.days} text="days" />
        <CountdownItem num={remaining.hours} text="hours" />
        <CountdownItem num={remaining.minutes} text="minutes" />
        <CountdownItem num={remaining.seconds} text="seconds" />
      </Flex>
    </Box>
  );
};

const CountdownItem = ({ num, text }: { num: number; text: string }) => {
  return (
    <HStack w="fit-content" py={2}>
      <Box position="relative" overflow="hidden" textAlign="center">
        <AnimatePresence mode="popLayout">
          <Box
            key={num}
            as={motion.span}
            initial={{ y: "100%" }}
            fontSize="lg"
            animate={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={{ ease: "backIn", duration: 0.75 } as any}
            fontWeight="semibold"
            fontFamily="mono"
            display="block"
          >
            {num}
          </Box>
        </AnimatePresence>
      </Box>
      <Text textAlign="center" fontFamily="mono" fontSize="lg">
        {text}
      </Text>
    </HStack>
  );
};

export default StickyCountdown;
