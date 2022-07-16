import type { AppProps } from "next/app";
import { ChakraProvider, ToastProvider } from "@chakra-ui/react";
import { AuthProvider } from "../hooks/auth";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <ToastProvider>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </ToastProvider>
    </ChakraProvider>
  );
}

export default MyApp;
