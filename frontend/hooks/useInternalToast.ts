import { useToast } from "@chakra-ui/react";

export default function useInternalToast() {
  const toast = useToast();

  const success = (content: string) =>
    toast({
      position: "top",
      status: "success",
      description: content,
      title: "Success",
      isClosable: true,
    });

  const info = (content: string) =>
    toast({
      position: "top",
      status: "info",
      description: content,
      title: "Info",
      isClosable: true,
    });

  const warning = (content: string) =>
    toast({
      position: "top",
      status: "warning",
      description: content,
      title: "Warning",
      isClosable: true,
    });

  const error = (content: string) =>
    toast({
      position: "top",
      status: "error",
      description: content,
      title: "Error",
      isClosable: true,
    });

  return { error, warning, success, info };
}
