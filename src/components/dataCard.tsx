'use client';

import {
  Card,
  CardHeader,
  Img,
  Heading,
  CardBody,
  Text,
  Wrap,
  Button,
  HStack,
  VStack,
  Icon,
  Badge,
} from '@chakra-ui/react';

import {FiArrowRight, FiMapPin, FiTool} from 'react-icons/fi';

interface FormData {
  company_name: string;
  less_than_2_years: boolean;
  services: string[];
  headquarters_location: string;
}

export const DataCard = ({
  company_name,
  less_than_2_years,
  services,
  headquarters_location,
}: FormData) => {
  return (
    <Card overflow="hidden" variant="outline" p="4" width="400px">
      <CardHeader>
        <Img src="/static/images/brand/cha.png" w="10" mb="4" />
        <HStack>
          <Heading as="h4" size="md">
            {company_name}
          </Heading>
          {less_than_2_years && <Badge size="md">Less than 2 years</Badge>}
        </HStack>
      </CardHeader>
      <CardBody>
        <HStack mt="-4">
          <Icon as={FiMapPin} />
          <Text size="md">{headquarters_location}</Text>
        </HStack>
        <HStack mt="1">
          <Icon as={FiTool} />
          <Text size="md">{services[0]}</Text>
        </HStack>
        <Button
          mt="6"
          colorScheme="brand"
          type="submit"
          loadingText="Submitting..."
          size="md"
          rightIcon={<Icon as={FiArrowRight} />}
        >
          View Company
        </Button>
      </CardBody>
    </Card>
  );
};
