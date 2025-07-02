import { Box, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const AnimatedLogo = () => {
  return (
    <MotionBox
      display="flex"
      alignItems="center"
      justifyContent="center"
      gap={2}
      fontWeight="bold"
      fontSize="2xl"
      color="teal.400"
      initial={{ scale: 0.8, rotate: 0 }}
      animate={{ scale: 1, rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    >
      🚀
      <Text fontSize="xl" fontWeight="extrabold">
        ProManage
      </Text>
    </MotionBox>
  );
};

export default AnimatedLogo;
