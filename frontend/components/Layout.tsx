import { Box, Flex } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./Topbar";
import useAuth from "../hooks/auth";

interface ILayoutProps {
  children: ReactElement | ReactElement[];
}

export default function Layout({ children }: ILayoutProps) {
  const { isAuth } = useAuth();
  return isAuth ? (
    <Flex w="full" minH="100vh">
      <Sidebar />
      <TopBar />
      <Box flex={1} p="6" pt="16" bgColor="gray.100">
        {children}
      </Box>
    </Flex>
  ) : null;
}
