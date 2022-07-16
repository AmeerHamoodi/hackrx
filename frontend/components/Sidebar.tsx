import { Box, VStack, Link as CLink, HStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { AiOutlineHome } from "react-icons/ai";
import { MdPeopleOutline } from "react-icons/md";
import { HiOutlineClipboardList } from "react-icons/hi";
import useAuth from "../hooks/auth";
import { IUser } from "../types/models";

const SIDEBAR_ITEMS = [
  {
    name: "Home",
    href: "/",
    icon: <AiOutlineHome />,
  },
  {
    name: "Patients",
    href: "/patients",
    icon: <MdPeopleOutline />,
  },
  {
    name: "Appointments",
    href: "/appointments",
    icon: <HiOutlineClipboardList />,
  },
];

function hasPermissionToView(user: IUser, route: string) {
  if (user.role === "doctor" && route === "/patients") return true;
  else if (route === "/patients") return false;

  if (user.role === "doctor" && route === "/appointments") return false;
  return true;
}

export default function Sidebar() {
  const route = useRouter();
  const { user } = useAuth();

  return user ? (
    <VStack w="72" h="full" overflowY="auto" py="6" gap={6} zIndex={100} bg="white">
      {SIDEBAR_ITEMS.filter((item) => hasPermissionToView(user, item.href)).map((item, i) => (
        <HStack
          key={`sidebar_item_${i}`}
          fontWeight="semibold"
          fontSize="lg"
          color={route.pathname == item.href ? "grey.800" : "gray.500"}
        >
          {item.icon}
          <CLink
            href={item.href}
            fontWeight="semibold"
            fontSize="lg"
            color={route.pathname == item.href ? "grey.800" : "gray.500"}
          >
            {item.name}
          </CLink>
        </HStack>
      ))}
    </VStack>
  ) : null;
}
