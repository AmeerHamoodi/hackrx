import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  HStack,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Box,
  SimpleGrid,
  GridItem,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import useInternalToast from "../../hooks/useInternalToast";
import API from "../../libs/api";
import { handleHttpError } from "../../libs/error-handler";

interface IMedicationModalProps {
  onClose: () => void;
  isOpen: boolean;
  mutate: () => void;
}

export default function MedicationModal({ isOpen, onClose, mutate }: IMedicationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [medication, setMedication] = useState<number | null>(null);
  const [dosage, setDosage] = useState<number | null>(null);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [searchBlur, setSearchBlur] = useState(false);
  const [instructions, setInstructions] = useState("");
  const router = useRouter();
  const { success, error } = useInternalToast();

  async function onMedicationSearchChange(value: string) {
    if (!value || searchBlur) return;

    const { data }: { data: any[] } = await API.get(
      `https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search?terms=${value}&ef=STRENGTHS_AND_FORMS`
    );
    setSearchResults(data);
    setMedication(null);
  }

  async function save() {
    try {
      if (typeof medication !== "number" || typeof dosage !== "number" || !instructions) {
        return error("Please fill in all fields!");
      }
      const response = await API.post("/medications", {
        name: searchResults[1][medication as number],
        dosage: searchResults[2].STRENGTHS_AND_FORMS[medication as number][dosage as number],
        instructions,
        patientId: router.query.id,
      });

      mutate();
      success("Successfully added medication to their list!");
      close();
    } catch (errorOb: any) {
      console.log(errorOb);
      const errorMessage = handleHttpError(errorOb);
      if (Array.isArray(errorMessage)) errorMessage.forEach((err) => error(err));
      else error(errorMessage);
      setIsLoading(false);
    }
  }

  function close() {
    onClose();
    setMedication(null);
    setDosage(null);
    setSearchResults(null);
    setSearchBlur(false);
    setInstructions("");
  }

  return (
    <Modal isOpen={isOpen} onClose={close} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Medication</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid columns={6}>
            <GridItem colSpan={4}>
              <VStack>
                <FormControl>
                  <FormLabel htmlFor="med-name">Enter medication name</FormLabel>
                  <Input
                    id="med-name"
                    type="text"
                    onChange={(event) => {
                      setSearchBlur(false);
                      onMedicationSearchChange(event.target.value);
                    }}
                    onBlur={() => setSearchBlur(true)}
                  />
                </FormControl>
                <VStack justifyContent="flex-start">
                  {searchResults
                    ? searchResults[1].map((res: string, i: number) => (
                        <Box
                          key={`search_result_${i}`}
                          _hover={{ opacity: 0.6 }}
                          transition="all"
                          cursor="pointer"
                          onClick={() => {
                            setMedication(i);
                          }}
                          fontWeight={medication === i ? "semibold" : "normal"}
                        >
                          <Text>{res}</Text>
                        </Box>
                      ))
                    : null}
                </VStack>
              </VStack>
            </GridItem>
            <GridItem colSpan={2}>
              <VStack>
                <FormLabel>Dosage</FormLabel>
                {typeof medication === "number" ? (
                  searchResults[2].STRENGTHS_AND_FORMS[medication].map(
                    (dose: string, i: number) => (
                      <Box
                        key={`dosage_${i}`}
                        _hover={{ opacity: 0.6 }}
                        transition="all"
                        cursor="pointer"
                        onClick={() => {
                          setDosage(i);
                        }}
                        fontWeight={dosage === i ? "semibold" : "normal"}
                      >
                        <Text>{dose}</Text>
                      </Box>
                    )
                  )
                ) : (
                  <Text>Select a medication to view it&apos;s dosages.</Text>
                )}
              </VStack>
            </GridItem>
          </SimpleGrid>
          <FormControl>
            <FormLabel htmlFor="instructions">Instructions</FormLabel>
            <Input
              id="instructions"
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={1} isLoading={isLoading} onClick={save}>
            Save
          </Button>
          <Button colorScheme="red" mr={1} onClick={close} disabled={isLoading}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
