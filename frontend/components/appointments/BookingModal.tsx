import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Wrap,
  WrapItem,
  Flex,
  Text,
  Link,
  HStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import useInternalToast from "../../hooks/useInternalToast";
import { handleHttpError } from "../../libs/error-handler";
import API from "../../libs/api";
import { IAvailabilityBasic } from "../../types/models";

dayjs.extend(utc);
dayjs.extend(LocalizedFormat);

interface IAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: IAvailabilityModalProps) {
  const [availabilities, setAvailabilities] = useState<IAvailabilityBasic[]>([]);
  const [month, setMonth] = useState(dayjs().get("month"));
  const [limit, setLimit] = useState(8);
  const [selectedAval, setSelectedAval] = useState<null | IAvailabilityBasic>(null);
  const { error, success } = useInternalToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getSchedule() {
      try {
        const { data }: { data: IAvailabilityBasic[] } = await API.get(
          `/pharmacists/availabilities/${month}`
        );

        setAvailabilities(
          data
            .map((aval) => {
              aval.date = dayjs(aval.date).local();
              return aval;
            })
            .sort((a, b) => (a.date > b.date ? 1 : -1))
        );
      } catch (errorOb: any) {
        const errorMessage = handleHttpError(errorOb);
        if (Array.isArray(errorMessage)) errorMessage.forEach((err) => error(err));
        else error(errorMessage);
      }
    }

    getSchedule();
  }, []);

  function convertDateToUTCISO(date: Date) {
    const d = dayjs(date).utc(false).toISOString();
    return d;
  }

  async function saveSelection() {
    setIsLoading(true);
    try {
      if (!selectedAval) {
        setIsLoading(false);
        return error("Please select an appointment!");
      }
      const { data } = await API.post(`/pharmacists/book/${selectedAval?.id}`);
      setIsLoading(false);

      success("Successfully booked appointment");
    } catch (errorOb: any) {
      const errorMessage = handleHttpError(errorOb);
      if (Array.isArray(errorMessage)) errorMessage.forEach((err) => error(err));
      else error(errorMessage);
      setIsLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Appointment</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Please select the appointment that works best for you.
          {/* <HStack>
            <Button disabled={month > dayjs().get("month")} onClick={() => setMonth(month + 1)}>
              Previous Month
            </Button>
            <Button disabled={month < dayjs().get("month")} onClick={() => setMonth(month + 1)}>
              Next Month
            </Button>
          </HStack> */}
          <Flex wrap={"wrap"} justifyContent="center">
            {availabilities
              .slice(0, limit < availabilities.length ? limit : availabilities.length)
              .map((aval, i) => (
                <Button
                  key={`availability_item_${i}`}
                  m="1"
                  isActive={aval.id === selectedAval?.id}
                  onClick={() => {
                    setSelectedAval(aval);
                  }}
                >
                  {aval.date.format("LLL")}
                </Button>
              ))}
          </Flex>
          {limit < availabilities.length && (
            <Link onClick={() => setLimit(limit + 8)}>Load more times</Link>
          )}
          <Text fontWeight="bold">
            {selectedAval ? `Selected appointment: ${selectedAval.date.format("LLL")}` : ""}
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={1} onClick={saveSelection} isLoading={isLoading}>
            Save
          </Button>
          <Button colorScheme="red" mr={1} onClick={onClose} isDisabled={isLoading}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
