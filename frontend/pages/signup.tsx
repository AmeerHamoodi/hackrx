import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Text,
  useToast,
  Radio,
  Stack,
  RadioGroup,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import useInternalToast from "../hooks/useInternalToast";
import API from "../libs/api";
import { handleHttpError } from "../libs/error-handler";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordc, setPasswordc] = useState("");
  const [pError, setPError] = useState<null | string>(null);
  const [role, setRole] = useState("patient");

  const [isLoading, setIsLoading] = useState(false);
  const { error, info } = useInternalToast();
  const router = useRouter();

  async function signup() {
    setIsLoading(true);
    try {
      if (passwordc !== password) {
        setPError("Your passwords do not match!");
        setIsLoading(false);
        return;
      }
      const response = await API.post(`/auth/register/${role}`, {
        email,
        password,
        firstName,
        lastName,
      });

      info("We have successfully registered you, please login now");
      router.push("/login");
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
      mb="10"
      borderRadius="2xl"
    >
      <Text fontSize="xl" textAlign="center">
        Sign up
      </Text>
      <FormControl>
        <FormLabel htmlFor="fname">First name</FormLabel>
        <Input
          id="fname"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="lname">Last name</FormLabel>
        <Input
          id="lname"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </FormControl>
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
      <FormControl>
        <FormLabel htmlFor="passwordc">Confirm password</FormLabel>
        <Input
          id="passwordc"
          type="password"
          value={passwordc}
          onChange={(e) => setPasswordc(e.target.value)}
        />
        <FormHelperText color="red.500">{pError}</FormHelperText>
      </FormControl>
      <RadioGroup onChange={setRole} value={role}>
        <Stack direction="row">
          <Radio value="patient">Patient</Radio>
          <Radio value="pharmacist">Pharmacist</Radio>
          <Radio value="doctor">Doctor</Radio>
        </Stack>
      </RadioGroup>
      <Button mt="4" onClick={signup} isLoading={isLoading}>
        Submit
      </Button>
    </Box>
  );
}
