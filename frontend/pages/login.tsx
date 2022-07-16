import { Box, Button, FormControl, FormLabel, Input, Link, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import useAuth from "../hooks/auth";
import useInternalToast from "../hooks/useInternalToast";
import API from "../libs/api";
import { handleHttpError } from "../libs/error-handler";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { error } = useInternalToast();
  const { updateUser, updateToken, setIsAuth } = useAuth();
  const router = useRouter();

  async function login() {
    setIsLoading(true);
    try {
      const response = await API.post("/auth/login", { email, password });

      updateUser(response.data.user);
      updateToken(response.data.token);
      setIsAuth(true);
      setIsLoading(false);
      router.push("/");
    } catch (errorOb: any) {
      const errorMessage = handleHttpError(errorOb);
      if (Array.isArray(errorMessage)) errorMessage.forEach((e) => error(e));
      else error(errorMessage);
      setIsLoading(false);
    }
  }

  return (
    <Box
      shadow="md"
      borderColor="blackAlpha.500"
      borderWidth="1"
      px="4"
      py="10"
      maxW="xl"
      mx="auto"
      mt="15%"
      borderRadius="2xl"
    >
      <Text fontSize="xl" textAlign="center">
        Login
      </Text>
      <FormControl>
        <FormLabel htmlFor="email">Email address</FormLabel>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="password">Passowrd</FormLabel>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>
      <VStack justifyContent="flex-start" ml="0">
        <Button mt="4" onClick={login} isLoading={isLoading}>
          Submit
        </Button>
        <Link href="/signup">Click here to sign up</Link>
      </VStack>
    </Box>
  );
}
