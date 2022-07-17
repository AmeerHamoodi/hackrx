import { HStack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MEDICATION_SUGGESTION_MAP } from "../../libs/medication-suggestion-map";
import { IMedication } from "../../types/models";

interface ISuggestionProps {
  medications: IMedication[];
}

interface ISuggestion {
  message: string;
  key: string;
}

export default function Suggestions({ medications }: ISuggestionProps) {
  const [suggestions, setSuggestions] = useState<ISuggestion[]>([]);

  useEffect(() => {
    setSuggestions(
      medications
        .map((med) => {
          const medMapKey = med.name.split(" ")[0].toUpperCase();
          if (medMapKey in MEDICATION_SUGGESTION_MAP)
            return {
              message:
                MEDICATION_SUGGESTION_MAP[medMapKey as keyof typeof MEDICATION_SUGGESTION_MAP],
              key: med.name,
            };
          else return null;
        })
        .filter((item) => Boolean(item)) as ISuggestion[]
    );
  }, [medications]);

  return (
    <VStack>
      {suggestions.map((suggestion, i) => (
        <HStack key={`suggestion_${i}`}>
          <Text fontWeight="bold">{suggestion.key}:</Text>
          <Text>{suggestion.message}</Text>
        </HStack>
      ))}
    </VStack>
  );
}
