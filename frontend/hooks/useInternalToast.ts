import { useToast } from "@chakra-ui/react";

export default function useInternalToast() {
  const toast = useToast();

  const success = (content: string) =>
    toast({
      position: "top",
      status: "success",
      description: content,
      title: "Success",
    });

  const info = (content: string) =>
    toast({
      position: "top",
      status: "info",
      description: content,
      title: "Info",
    });

  const warning = (content: string) =>
    toast({
      position: "top",
      status: "warning",
      description: content,
      title: "Warning",
    });

  const error = (content: string) =>
    toast({
      position: "top",
      status: "error",
      description: content,
      title: "Error",
    });

  return { error, warning, success, info };
}
