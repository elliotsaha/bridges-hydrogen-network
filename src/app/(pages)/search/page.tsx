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
import {useForm, Controller} from 'react-hook-form';
import {useDebounce} from 'usehooks-ts';
import {useEffect, useState, ChangeEvent, useReducer} from 'react';
import {Select} from 'chakra-react-select';
import React from 'react';
import FilterSelect from '@components/filterSelect';
import {SelectOption, SearchCompanyRequestFilters} from '@types';
import {Company} from '@models';
import axios from 'axios';

interface FormOptionData {
  name: string;
  description?: string;
}

interface FormOptions {
  operating_regions: SelectOption[];
  market_focus: SelectOption[];
  services: SelectOption[];
  technologies: SelectOption[];
  type_of_business: SelectOption[];
  years_in_business?: SelectOption;
}

const mapOptions = (options: SelectOption[]) => {
  const result = options.map((option: SelectOption) => option.value);
  return result;
};

const defaultValues = {
  market_focus: [],
  technologies: [],
  operating_regions: [],
  type_of_business: [],
  services: [],
};

const Search = () => {
  // rawSearchInput and requestBody must be seperated because
  // the searchbar input must be debounced
  const [rawSearchInput, setRawSearchInput] = useState<string>('');
  const [requestBody, setRequestBody] =
    useState<SearchCompanyRequestFilters>(defaultValues);

  const debouncedSearchInput = useDebounce<string>(rawSearchInput, 1000);

  const INITIAL_COMPANY_DATA_STATE = {
    loading: true,
    data: null,
    error: false,
  };

  type QueryAction =
    | {type: 'FETCH_START'}
    | {type: 'FETCH_SUCCESS'; payload: Company[]}
    | {type: 'FETCH_ERROR'};

  interface QueryState {
    loading: boolean;
    data: Company[] | null;
    error: boolean;
  }

  const companyQueryReducer = (
    state: QueryState,
    action: QueryAction
  ): QueryState => {
    switch (action.type) {
      case 'FETCH_START':
        return {
          loading: true,
          data: null,
          error: false,
        };
      case 'FETCH_SUCCESS':
        return {
          loading: false,
          data: action.payload,
          error: false,
        };
      case 'FETCH_ERROR':
        return {
          loading: false,
          data: null,
          error: true,
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(
    companyQueryReducer,
    INITIAL_COMPANY_DATA_STATE
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRawSearchInput(event.target.value);
  };

  const {isOpen, onOpen, onClose} = useDisclosure();
  const finalRef = React.useRef(null);

  const makeSelect = (el: FormOptionData | string) => {
    const isElObj = typeof el === 'object';
    const elVal = isElObj ? el.name : el;
    return {
      label: elVal,
      value: elVal,
    };
  };

  const selectOptions = {
    marketFocuses: strictFormOptions.marketFocuses.map(makeSelect),
    technologies: strictFormOptions.technologies.map(makeSelect),
    regions: strictFormOptions.operatingRegions.map(makeSelect),
    businesses: strictFormOptions.typesOfBusinesses.map(makeSelect),
    services: strictFormOptions.services.map(makeSelect),
  };

  const {control, handleSubmit} = useForm<FormOptions>({
    mode: 'onChange',
    defaultValues,
  });

  const onSubmit = (data: FormOptions) => {
    const {
      market_focus,
      operating_regions,
      services,
      technologies,
      type_of_business,
      years_in_business,
    } = data;

    const formBody = {
      market_focus: mapOptions(market_focus),
      operating_regions: mapOptions(operating_regions),
      services: mapOptions(services),
      technologies: mapOptions(technologies),
      type_of_business: mapOptions(type_of_business),
      years_in_business: years_in_business?.value,
    };

    setRequestBody(formBody);
  };

  const getCompaniesFromQuery = async () => {
    try {
      const res = await axios.post<Company[]>(
        `${process.env.NEXT_PUBLIC_HOSTNAME}/api/company/query`,
        {
          company_name: debouncedSearchInput,
          operating_regions: requestBody.operating_regions,
          market_focus: requestBody.market_focus,
          services: requestBody.services,
          technologies: requestBody.technologies,
          type_of_business: requestBody.type_of_business,
          years_in_business: requestBody.years_in_business,
        }
      );
      dispatch({type: 'FETCH_SUCCESS', payload: res.data});
    } catch (e) {
      dispatch({type: 'FETCH_ERROR'});
    }
  };

  useEffect(() => {
    dispatch({type: 'FETCH_START'});
    getCompaniesFromQuery();
  }, [debouncedSearchInput, requestBody]);

  console.log(state);
  return (
    <>
      <Container maxW="container.xl">
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
                id="company_name"
                name="company_name"
                placeholder="Canadian Hydrogen Association"
                size="lg"
                onChange={handleInputChange}
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
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Container
                    maxW="container.md"
                    variant="bold"
                    size="sm"
                    py="10"
                  >
                    <Heading px="4" py="4" as="h1" size="lg" mb="3">
                      Filters
                    </Heading>
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
                              name="market_focus"
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
                              name="technologies"
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
                              name="type_of_business"
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
                              name="services"
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
                                  isClearable
                                  options={yearsInBusinessFormOptions}
                                  {...field}
                                />
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
                  </Container>
                </form>
              </ModalBody>
            </ModalContent>
          </Modal>

          {/* Loading state */}
          {state.loading && <div>Loading</div>}

          {/* Error state */}
          {state.error && <div>error</div>}

          {/* Data state */}
          {state.data && (
            <Box>
              {state.data.map(company => (
                <Box>{company.company_name}</Box>
              ))}
            </Box>
          )}
        </VStack>
      </Container>
    </>
  );
};

const yearsInBusinessFormOptions = [
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
      min: 10,
      max: 25,
    }),
  },
  {
    label: '25+',
    value: JSON.stringify({
      min: 25,
    }),
  },
];

export default Search;
