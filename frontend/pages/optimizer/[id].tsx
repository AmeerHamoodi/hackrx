import { Editor } from "@tinymce/tinymce-react";

import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  IconButton,
  SimpleGrid,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import Layout from "../../components/Layout";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import API from "../../libs/api";
import { IMedication, IPatient } from "../../types/models";
import useSWR from "swr";
import { BsFillTrashFill, BsPencilSquare } from "react-icons/bs";
import MedicationModal from "../../components/optimizer/MedicationModal";
import useInternalToast from "../../hooks/useInternalToast";
import { handleHttpError } from "../../libs/error-handler";
import Suggestions from "../../components/optimizer/Suggestions";
import { MEDICATION_SUGGESTION_MAP } from "../../libs/medication-suggestion-map";

export default function Optimizer() {
  const editorRef = useRef<any>();
  const router = useRouter();
  const { data, mutate } = useSWR(`/patients/${router.query.id}`, (url) =>
    !url.includes("undefined") ? API.get(url).then((res) => res.data) : null
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { success, error } = useInternalToast();
  const [removeLoading, setRemoveLoading] = useState<(number | string)[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const patient = data as IPatient;

  async function deleteMedication(id: number | string) {
    setRemoveLoading([...removeLoading, id]);
    try {
      const response = await API.delete("/medications/" + id);

      success("Successfully removed medication from patient's list!");
      mutate();
    } catch (errorOb: any) {
      const errorMessage = handleHttpError(errorOb);
      if (Array.isArray(errorMessage)) errorMessage.forEach((err) => error(err));
      else error(errorMessage);
    }

    let cloned = removeLoading.splice(0);
    cloned.splice(removeLoading.length - 1, 1);
    setRemoveLoading(cloned);
  }

  async function saveNote() {
    try {
      const relatedSuggestions = suggestions.map((medicationName) => {
        const message =
          MEDICATION_SUGGESTION_MAP[
            medicationName.split(" ")[0].toUpperCase() as keyof typeof MEDICATION_SUGGESTION_MAP
          ];

        const medicationId = (
          patient.medications.find((medication) => {
            return medication.name === medicationName;
          }) as IMedication
        ).id;

        console.log(medicationId);

        return {
          message,
          medicationId,
        };
      });

      const { data }: { data: { id: number } } = await API.post(
        "/pharmacists/note/" + patient.referal.id,
        {
          content: editorRef.current.getContent(),
          suggestions: relatedSuggestions,
        }
      );

      success("Successfully saved note!");
      router.push(`/optimizer/report/${data.id}`);
    } catch (errorOb: any) {
      console.log(errorOb);
      const errorMessage = handleHttpError(errorOb);
      if (Array.isArray(errorMessage)) errorMessage.forEach((err) => error(err));
      else error(errorMessage);
    }
  }

  return (
    <Layout>
      <MedicationModal {...{ isOpen, onClose, mutate }} />
      <HStack>
        <Text fontSize="2xl" fontWeight="bold" mr="auto">
          optiMedizer
        </Text>
        <Button onClick={saveNote} colorScheme="blue" ml="auto">
          Generate Report
        </Button>
      </HStack>
      <Text fontSize="lg" fontWeight="semibold" mt="4">
        Pharmacist Notes
      </Text>
      <SimpleGrid columns={4} gap={8} my="4">
        <GridItem colSpan={3}>
          <Editor
            onInit={(event, editor) => (editorRef.current = editor)}
            // TODO: not do this lmao
            apiKey={"o0wlrg9n1ytq9va36abyzt4hsi71zw2xyig4mg5iufz9xgta"}
          />
        </GridItem>
        <Box bg="white" borderRadius="md" p="6">
          <Text fontSize="lg" fontWeight="semibold" mt="4">
            Patient Info
          </Text>
          {patient ? (
            <VStack justifyContent="flex-start">
              <HStack>
                <Text fontWeight="bold">Full name: </Text>
                <Text>
                  {patient.firstName} {patient.lastName}
                </Text>
              </HStack>
              <HStack>
                <Text fontWeight="bold">Diagnosis: </Text>
                <Text>{patient.referal.diagnosis}</Text>
              </HStack>
              <HStack>
                <Text fontWeight="bold">Notes: </Text>
                <Text>{patient.referal.notes}</Text>
              </HStack>
              <HStack>
                <Text fontWeight="bold">Referred By: </Text>
                <Text>
                  Dr. {patient.referal.referringDoctor.firstName}{" "}
                  {patient.referal.referringDoctor.lastName}
                </Text>
              </HStack>
              <Text color="blue" textDecor="underline" cursor="pointer">
                Lab values
              </Text>
            </VStack>
          ) : null}
        </Box>
      </SimpleGrid>
      <SimpleGrid columns={4} gap={8} my="4">
        <GridItem colSpan={3}>
          <Box bg="white" borderRadius="md" p="6">
            <HStack>
              <Text fontSize="lg" fontWeight="semibold" mt="4" mr="auto">
                Medications
              </Text>
              <Button ml="auto" onClick={onOpen}>
                Add Medication
              </Button>
            </HStack>

            {patient && (
              <Table>
                <Thead>
                  <Tr>
                    <Th>#</Th>
                    <Th>Name</Th>
                    <Th>Dosage</Th>
                    <Th>Instructions</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                {patient.medications && (
                  <Tbody>
                    {patient.medications.map((med, i) => (
                      <Tr key={`medication_${i}`}>
                        <Td>{i + 1}</Td>
                        <Td>{med.name}</Td>
                        <Td>{med.dosage}</Td>
                        <Td>{med.instructions}</Td>
                        <Td>
                          <HStack>
                            <Tooltip label="Remove medication">
                              <IconButton
                                aria-label="Remove medication"
                                colorScheme="red"
                                icon={<BsFillTrashFill />}
                                isLoading={removeLoading.includes(med.id)}
                                onClick={() => deleteMedication(med.id)}
                              />
                            </Tooltip>
                            <Tooltip label="Edit medication">
                              <IconButton
                                aria-label="Edit medication"
                                colorScheme="blue"
                                icon={<BsPencilSquare />}
                              />
                            </Tooltip>
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                )}
              </Table>
            )}
          </Box>
        </GridItem>

        <Box bg="white" borderRadius="md" p="6">
          <Text fontSize="lg" fontWeight="semibold" mt="4">
            Suggestions
          </Text>
          <Text>
            Please checck the suggestions that you&apos;d like to include in the generated report.
          </Text>
          {patient ? (
            <Suggestions medications={patient.medications} setSuggestions={setSuggestions} />
          ) : null}
        </Box>
      </SimpleGrid>
    </Layout>
  );
}
