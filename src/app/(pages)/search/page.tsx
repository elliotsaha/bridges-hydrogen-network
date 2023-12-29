'use client';
import {
  Container,
  SimpleGrid,
  VStack,
  HStack,
  Badge,
  Stack,
  InputLeftAddon,
  InputRightAddon,
  InputGroup,
  Input,
  Heading,
  Icon,
  FormControl,
  FormLabel,
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
} from '@chakra-ui/react';
import {Subheader} from '@components';
import {FiSearch, FiSliders, FiArrowRight} from 'react-icons/fi';
import {strictFormOptions} from '@forms/company/register';
import {useForm, FieldValues, Controller} from 'react-hook-form';
import {useDebounce} from 'usehooks-ts';
import {useEffect, useState, ChangeEvent} from 'react';
import {Select} from 'chakra-react-select';
import React from 'react';
import FilterSelect from '@components/filterSelect';
import {SelectOption} from '@types';

interface FormOptionData {
  name: string;
  description?: string;
}

const mapOptions = (options: SelectOption[]) => {
  const result = options.map((option: SelectOption) => option.value);
  return result;
};

const defaultValues = {
  company_name: '',
  market_segment_focus: [],
  technologies_used: [],
  operating_regions: [],
  types_of_businesses: [],
  services_or_products: [],
  years_in_business: {},
};

const Search = () => {
  const [queryValue, setQueryValue] = useState<string>('');
  const debouncedQueryValue = useDebounce<string>(queryValue, 1000);
  const [bodyValue, setBodyValue] = useState(defaultValues);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQueryValue(event.target.value);
  };

  const {isOpen, onOpen, onClose} = useDisclosure();
  const finalRef = React.useRef(null);

  useEffect(() => {
    // make api request here
    console.log(debouncedQueryValue);
  }, [debouncedQueryValue]);

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

  const {control, handleSubmit} = useForm({
    mode: 'onChange',
    defaultValues: defaultValues,
  });
  const onSubmit = (data: FieldValues) => {
    const {
      market_segment_focus,
      operating_regions,
      services_or_products,
      technologies_used,
      types_of_businesses,
      years_in_business,
    } = data;

    const body = {
      market_segment_focus: mapOptions(market_segment_focus),
      operating_regions: mapOptions(operating_regions),
      services_or_products: mapOptions(services_or_products),
      technologies_used: mapOptions(technologies_used),
      types_of_business: mapOptions(types_of_businesses),
      years_in_business: years_in_business.value,
    };

    console.log(body);
  };

  return (
    <>
      <Container maxW="container.xl">
        <SimpleGrid
          columns={1}
          spacing="12"
          px="2
        "
          alignItems="center"
          pt="14"
        >
          <VStack alignItems="flex-start">
            <HStack>
              <Subheader>A CHA Project</Subheader>
              <Badge colorScheme="orange">Beta</Badge>
            </HStack>
            <Heading as="h1" size="3xl" mb="3">
              Looking for a company?
            </Heading>
            <Stack spacing={4} w="2xl">
              <InputGroup>
                <InputLeftAddon h="auto">
                  <FiSearch />
                </InputLeftAddon>
                <Input
                  id="email_address"
                  type="email"
                  placeholder="Canadian Hydrogen Association"
                  size="lg"
                  onChange={handleChange}
                />
                <InputRightAddon h="auto" onClick={onOpen}>
                  <FiSliders />
                </InputRightAddon>
              </InputGroup>
            </Stack>
            <Modal
              finalFocusRef={finalRef}
              size="2xl"
              isOpen={isOpen}
              onClose={onClose}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalCloseButton />
                <ModalBody>
                  <Container
                    maxW="container.md"
                    variant="bold"
                    size="sm"
                    py="10"
                  >
                    <Heading px="4" py="4" as="h1" size="lg" mb="3">
                      Filters
                    </Heading>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <SimpleGrid
                        columns={2}
                        px="2"
                        alignItems="center"
                        spacing="16"
                      >
                        <FormControl>
                          <VStack alignItems="flex-start">
                            <FormLabel>Market segment focus</FormLabel>
                            <Box w="100%">
                              <FilterSelect
                                size="md"
                                control={control}
                                name="market_segment_focus"
                                options={selectOptions.marketFocuses}
                              />
                            </Box>
                          </VStack>
                        </FormControl>

                        <FormControl>
                          <VStack alignItems="flex-start">
                            <FormLabel>Technologies used</FormLabel>
                            <Box w="100%">
                              <FilterSelect
                                size="md"
                                control={control}
                                name="technologies_used"
                                options={selectOptions.technologies}
                              />
                            </Box>
                          </VStack>
                        </FormControl>

                        <FormControl>
                          <VStack alignItems="flex-start">
                            <FormLabel>Operating regions</FormLabel>
                            <Box w="100%">
                              <FilterSelect
                                size="md"
                                control={control}
                                name="operating_regions"
                                options={selectOptions.regions}
                              />
                            </Box>
                          </VStack>
                        </FormControl>

                        <FormControl>
                          <VStack alignItems="flex-start">
                            <FormLabel>Types of businesses</FormLabel>
                            <Box w="100%">
                              <FilterSelect
                                size="md"
                                control={control}
                                name="types_of_businesses"
                                options={selectOptions.businesses}
                              />
                            </Box>
                          </VStack>
                        </FormControl>

                        <FormControl>
                          <VStack alignItems="flex-start">
                            <FormLabel>Services or products</FormLabel>
                            <Box w="100%">
                              <FilterSelect
                                size="md"
                                control={control}
                                name="services_or_products"
                                options={selectOptions.services}
                              />
                            </Box>
                          </VStack>
                        </FormControl>

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
                                        value: JSON.stringify({
                                          max: 2,
                                        }),
                                      },
                                      {
                                        label: '2-5',
                                        value: JSON.stringify({
                                          min: 2,
                                          max: 5,
                                        }),
                                      },
                                      {
                                        label: '5-10',
                                        value: JSON.stringify({
                                          min: 5,
                                          max: 10,
                                        }),
                                      },
                                      {
                                        label: '10-25',
                                        value: JSON.stringify({
                                          mix: 10,
                                          max: 25,
                                        }),
                                      },
                                      {
                                        label: '25+',
                                        value: JSON.stringify({
                                          min: 25,
                                        }),
                                      },
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
                          onClick={onClose}
                        >
                          Apply changes
                        </Button>
                      </SimpleGrid>
                    </form>
                  </Container>
                </ModalBody>
              </ModalContent>
            </Modal>
          </VStack>
        </SimpleGrid>
      </Container>
    </>
  );
};

export default Search;
