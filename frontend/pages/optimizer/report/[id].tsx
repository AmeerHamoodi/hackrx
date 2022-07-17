import { Box, Flex, Text, Table, Thead, Th, Td, Tr, Tbody, HStack, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import useSWR from "swr";
import API from "../../../libs/api";
import { IMedication, INoteReport } from "../../../types/models";

export default function Report() {
  const router = useRouter();
  const { data } = useSWR(`/pharmacists/note/${router.query.id}`, (url) =>
    API.get(url).then((res) => res.data)
  );

  const note = data?.note as INoteReport;
  const medications = data?.medications as IMedication[];

  return (
    <Box w="full" h="full" bg="gray.200">
      <Flex justifyContent="center" py="10">
        <Box bg="white" shadow="md" minH="1056px" w="816px" p="2">
          <Flex justifyContent="center">
            <img
              src="https://lh6.googleusercontent.com/MgU82xUVe-I-cPjNMMNEKF_xKs4SYrI2uHvkuiBWZVGmu3aN6kvvBP7I3iwLb1r4C2sRPeJINVBpISaj75FH=w1920-h942"
              width="200px"
              height="50px"
              alt="optiMed"
            />
          </Flex>
          <VStack align="flex-start" spacing={0} pt="4" pb="6">
            <Text>
              {note.referal.pharmacist.firstName} {note.referal.pharmacist.lastName}
            </Text>
            <Text>Orchadview Pharmacy</Text>
            <Text>155 Main St. E #107, L3M 1P2</Text>
            <Text>Phone: (905) 945-6088</Text>
            <Text>Fax: (905) 945-6326</Text>
          </VStack>

          <Text>To whom it may concern,</Text>
          <br />
          <Text>
            Please find the auto-generated optiMed report below for {note.referal.patient.firstName}{" "}
            {note.referal.patient.lastName} that was created by {note.referal.pharmacist.firstName}{" "}
            {note.referal.pharmacist.lastName}, a board certified pharmacist.
          </Text>
          <Text fontSize="2xl" fontWeight="bold" mt="12">
            Pharmacuetical Opinion:
          </Text>
          {note?.content ? (
            <div dangerouslySetInnerHTML={{ __html: note.content }}></div>
          ) : (
            <Text>No pharmaceutical opinion recorded</Text>
          )}

          <Text fontSize="2xl" fontWeight="bold" mt="12">
            Patient&apos;s Medications:
          </Text>
          <Table>
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Name</Th>
                <Th>Dosage</Th>
                <Th>Instructions</Th>
              </Tr>
            </Thead>
            {medications && (
              <Tbody>
                {medications.map((med, i) => (
                  <Tr key={`medication_${i}`}>
                    <Td>{i + 1}</Td>
                    <Td>{med.name}</Td>
                    <Td>{med.dosage}</Td>
                    <Td>{med.instructions}</Td>
                  </Tr>
                ))}
              </Tbody>
            )}
          </Table>
          <Text></Text>
        </Box>
      </Flex>
    </Box>
  );
}
