import { Avatar, Box, Button, Flex, HStack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import useAuth from "../hooks/auth";

export default function TopBar() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <Box w="full" py="2" bg="white" position="fixed" top="0" left="0" zIndex={10} px="2">
      <Flex justifyContent="flex-end" w="full">
        <Avatar name={user?.firstName + " " + user?.lastName} size="sm" mr="2" />
        <Text>{user?.role}</Text>
      </Flex>
    </Box>
  );
}
