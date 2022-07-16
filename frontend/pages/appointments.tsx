import {
  Button,
  HStack,
  Text,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Box,
  Link as CLink,
} from "@chakra-ui/react";
import AvailabilityModal from "../components/appointments/AvailabilityModal";
import Layout from "../components/Layout";
import useAuth from "../hooks/auth";
import useSWR from "swr";
import API from "../libs/api";
import { IAppointmentBasic } from "../types/models";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import Link from "next/link";
import BookingModal from "../components/appointments/BookingModal";

dayjs.extend(utc);
dayjs.extend(LocalizedFormat);

export default function Appointments() {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const { user } = useAuth();
  const { data } = useSWR(
    `/${user?.role === "patient" ? "patients" : "pharmacists"}/appointments`,
    (url: string) => API.get(url).then((res) => res.data)
  );

  const appointments = data as IAppointmentBasic[];

  return (
    <Layout>
      {user?.role === "pharmacist" ? (
        <AvailabilityModal {...{ onClose, isOpen }} />
      ) : (
        <BookingModal {...{ onClose, isOpen }} />
      )}
      <HStack>
        <Text fontSize="2xl" fontWeight="bold" mr="auto">
          Appointments
        </Text>

        {user?.role === "pharmacist" ? (
          <Button colorScheme="blue" ml="auto" onClick={onOpen}>
            Set Availabilities
          </Button>
        ) : (
          <Button colorScheme="blue" ml="auto" onClick={onOpen}>
            Book Appointment
          </Button>
        )}
      </HStack>
      <Box bg="white" borderRadius="xl" mt="10" p="4">
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Date</Th>
                <Th>{user?.role === "patient" ? "Pharmacist" : "Patient"}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {appointments?.map((appointment, i) => (
                <Tr key={`appointment_basic_${i}`}>
                  <Td>{i + 1}</Td>
                  <Td>{dayjs(appointment.date).local().format("LLL")}</Td>
                  <Td>
                    {appointment.patient && (
                      <CLink href={`/patients/${appointment.patient.id}`} color="blue">
                        {appointment.patient.firstName + " " + appointment.patient.lastName}
                      </CLink>
                    )}
                    {appointment.pharmacist &&
                      `${appointment.pharmacist.firstName} ${appointment.pharmacist.lastName}`}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Layout>
  );
}
