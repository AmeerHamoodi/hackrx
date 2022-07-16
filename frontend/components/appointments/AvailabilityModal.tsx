import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
// @ts-ignore
import ScheduleSelector from "react-schedule-selector";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import useInternalToast from "../../hooks/useInternalToast";
import { handleHttpError } from "../../libs/error-handler";
import API from "../../libs/api";

dayjs.extend(utc);

interface IAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AvailabilityModal({ isOpen, onClose }: IAvailabilityModalProps) {
  const [schedule, setSchedule] = useState<Date[]>([]);
  const { error, success } = useInternalToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getSchedule() {
      try {
        const { data } = await API.get("pharmacists/self-availabilities");
        setSchedule(data.map((d: any) => dayjs(d.date).local().toDate()));
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

  async function saveAvailabilities() {
    setIsLoading(true);
    try {
      const response = await API.post("pharmacists/availabilities", {
        availabilities: schedule.map((date) => convertDateToUTCISO(date)),
      });

      success("Successfully saved availabilities");
      setIsLoading(false);
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
        <ModalHeader>Weekly Availabilities</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Please select your weekly availabilities for the next 3 months.
          <ScheduleSelector
            selection={schedule}
            numDays={5}
            minTime={8}
            maxTime={22}
            hourlyChunks={1}
            onChange={setSchedule}
            startDate={new Date(dayjs().add(1, "week").startOf("week").add(1, "day").toISOString())}
            dateFormat="dddd"
          />
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={1} onClick={saveAvailabilities} isLoading={isLoading}>
            Save
          </Button>
          <Button colorScheme="red" mr={1} onClick={onClose} disabled={isLoading}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
