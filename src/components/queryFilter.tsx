'use client';

import {
  Container,
  SimpleGrid,
  VStack,
  Heading,
  Icon,
  FormControl,
  FormLabel,
  Box,
  Button,
} from '@chakra-ui/react';
import {FiArrowRight} from 'react-icons/fi';
import {Select} from 'chakra-react-select';
import {strictFormOptions} from '@forms/company/register';
import {FieldValues, useForm, Controller} from 'react-hook-form';

interface FormOptionData {
  name: string;
  description?: string;
}

export const QueryFilter = () => {
  const makeSelect = (obj: FormOptionData) => ({
    label: obj.name,
    value: obj.name,
  });

  const selectOptions = {
    marketFocuses: strictFormOptions.marketFocuses.map(makeSelect),
    technologies: strictFormOptions.technologies.map(makeSelect),
    regions: strictFormOptions.operatingRegions.map(str => ({
      label: str,
      value: str,
    })),
    businesses: strictFormOptions.typesOfBusinesses.map(makeSelect),
    services: strictFormOptions.services.map(makeSelect),
  };

  const {control, handleSubmit} = useForm();
  const onSubmit = (data: FieldValues) => {
    console.log(data);
  };

  return (
    <Container maxW="container.md" variant="bold" size="sm" py="10">
      <Heading px="4" py="4" as="h1" size="lg" mb="3">
        Filters
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={2} px="4" alignItems="center" spacing="16">
          <Controller
            control={control}
            name="market_segment_focus"
            render={({field}) => (
              <FormControl>
                <VStack alignItems="flex-start">
                  <FormLabel>Market segment focus</FormLabel>
                  <Box w="100%">
                    <Select
                      size="md"
                      selectedOptionStyle="check"
                      options={selectOptions.marketFocuses}
                      isMulti
                      {...field}
                    ></Select>
                  </Box>
                </VStack>
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="technologies_used"
            render={({field}) => (
              <FormControl>
                <VStack alignItems="flex-start">
                  <FormLabel>Technologies used</FormLabel>
                  <Box w="100%">
                    <Select
                      size="md"
                      selectedOptionStyle="check"
                      options={selectOptions.technologies}
                      isMulti
                      {...field}
                    ></Select>
                  </Box>
                </VStack>
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="operating_regions"
            render={({field}) => (
              <FormControl>
                <VStack alignItems="flex-start">
                  <FormLabel>Operating regions</FormLabel>
                  <Box w="100%">
                    <Select
                      size="md"
                      selectedOptionStyle="check"
                      options={selectOptions.regions}
                      isMulti
                      {...field}
                    ></Select>
                  </Box>
                </VStack>
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="types_of_businesses"
            render={({field}) => (
              <FormControl>
                <VStack alignItems="flex-start">
                  <FormLabel>Types of businesses</FormLabel>
                  <Box w="100%">
                    <Select
                      size="md"
                      selectedOptionStyle="check"
                      options={selectOptions.businesses}
                      isMulti
                      {...field}
                    ></Select>
                  </Box>
                </VStack>
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="services_or_products"
            render={({field}) => (
              <FormControl>
                <VStack alignItems="flex-start">
                  <FormLabel>Services or products</FormLabel>
                  <Box w="100%">
                    <Select
                      size="md"
                      selectedOptionStyle="check"
                      options={selectOptions.services}
                      isMulti
                      {...field}
                    ></Select>
                  </Box>
                </VStack>
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="years_in_business"
            render={({field}) => (
              <FormControl>
                <VStack alignItems="flex-start">
                  <FormLabel>Years in business</FormLabel>
                  <Box w="100%">
                    <Select
                      size="md"
                      selectedOptionStyle="check"
                      options={[
                        {
                          label: 'Less than 2 years',
                          value: 'Less than 2 years',
                        },
                        {label: '2-5', value: '2-5'},
                        {label: '5-10', value: '5-10'},
                        {label: '10-25', value: '10-25'},
                        {label: '25+', value: '25+'},
                      ]}
                      {...field}
                    ></Select>
                  </Box>
                </VStack>
              </FormControl>
            )}
          />
          <Button
            mt="2"
            w="40"
            colorScheme="brand"
            type="submit"
            loadingText="Submitting..."
            size="md"
            rightIcon={<Icon as={FiArrowRight} />}
          >
            Apply changes
          </Button>
        </SimpleGrid>
      </form>
    </Container>
  );
};
