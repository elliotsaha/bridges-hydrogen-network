'use client';
import {
  Text,
  Card,
  Container,
  SimpleGrid,
  VStack,
  InputLeftElement,
  InputRightElement,
  InputGroup,
  Input,
  Heading,
  Icon,
  FormControl,
  FormLabel,
  Box,
  Badge,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  IconButton,
  SkeletonText,
  SkeletonCircle,
  CardBody,
  Skeleton,
} from '@chakra-ui/react';
import {FiSearch, FiSliders, FiArrowRight, FiAlertCircle} from 'react-icons/fi';
import {strictFormOptions} from '@forms/company/register';
import {useForm, Controller} from 'react-hook-form';
import {useDebounce} from 'usehooks-ts';
import {useEffect, useState, ChangeEvent, useReducer} from 'react';
import {Select} from 'chakra-react-select';
import React from 'react';
import {FilterSelect, CompanyCard} from '@components';
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
  const [filterCount, setFilterCount] = useState(0);
  const [rawSearchInput, setRawSearchInput] = useState<string>('');
  const [requestBody, setRequestBody] =
    useState<SearchCompanyRequestFilters>(defaultValues);

  const debouncedSearchInput = useDebounce<string>(rawSearchInput, 200);

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

  const {control, handleSubmit, watch} = useForm<FormOptions>({
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

  const closeModal = () => {
    const watched = watch();
    console.log(watched);
    let count = 0;

    if (watched.years_in_business) {
      count++;
    }

    const filterKeys: Array<keyof Omit<FormOptions, 'years_in_business'>> = [
      'market_focus',
      'operating_regions',
      'services',
      'technologies',
      'type_of_business',
    ];

    filterKeys.map(key => (count += watched[key].length));

    setFilterCount(count);
    onSubmit(watched);
    onClose();
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

  return (
    <>
      <Container maxW="container.xl">
        <VStack
          alignItems={{
            base: 'flex-start',
            md: 'center',
          }}
          mt="12"
        >
          <Heading as="h1" textAlign={{base: 'left', md: 'center'}}>
            Find who you want to work with
          </Heading>
          <Text
            textAlign={{base: 'left', md: 'center'}}
            color="gray.600"
            mb="4"
          >
            Identify and Engage with Key Industry Players
          </Text>
          <InputGroup
            w={{base: '100%', md: '40rem'}}
            size={{base: 'md', md: 'lg'}}
          >
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color="gray.500" />
            </InputLeftElement>
            <Input
              id="company_name"
              name="company_name"
              placeholder="Canadian Hydrogen Association"
              onChange={handleInputChange}
            />
            <InputRightElement>
              <Box
                css={{
                  position: 'relative',
                }}
              >
                <IconButton
                  aria-label="Filter search"
                  colorScheme="brand"
                  variant="ghost"
                  onClick={onOpen}
                  icon={<Icon as={FiSliders} />}
                />
                <Badge
                  position="absolute"
                  bottom="0"
                  right="0"
                  colorScheme="brand"
                  borderRadius="full"
                  fontSize="2xs"
                >
                  {filterCount}
                </Badge>
              </Box>
            </InputRightElement>
          </InputGroup>
          <Modal
            finalFocusRef={finalRef}
            size={{base: 'full', md: 'xl', lg: '2xl'}}
            isOpen={isOpen}
            onClose={closeModal}
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
                    <Heading py="2" as="h1" size="lg">
                      Refine your search
                    </Heading>
                    <Text color="gray.600" mb="8">
                      Narrow down to the best matches with precision filters
                    </Text>
                    <SimpleGrid
                      columns={{base: 1, md: 2}}
                      alignItems="center"
                      spacing="12"
                    >
                      <FormControl>
                        <VStack alignItems="flex-start">
                          <FormLabel color="gray.600">Market focus</FormLabel>
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
                          <FormLabel color="gray.600">
                            Technologies used
                          </FormLabel>
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
                          <FormLabel color="gray.600">
                            Operating regions
                          </FormLabel>
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
                          <FormLabel color="gray.600">
                            Type of business
                          </FormLabel>
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
                          <FormLabel color="gray.600">
                            Services or products
                          </FormLabel>
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
                              <FormLabel color="gray.600">
                                Years in business
                              </FormLabel>
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
                    </SimpleGrid>
                    <Button
                      mt="12"
                      colorScheme="brand"
                      type="submit"
                      loadingText="Submitting..."
                      size="md"
                      rightIcon={<Icon as={FiArrowRight} />}
                      onClick={closeModal}
                    >
                      Filter search
                    </Button>
                  </Container>
                </form>
              </ModalBody>
            </ModalContent>
          </Modal>

          {/* Loading state */}
          {state.loading && (
            <SimpleGrid
              columns={{base: 1, md: 2, lg: 3}}
              spacing="4"
              py="10"
              alignItems="center"
              w={{base: '100%', lg: 'auto'}}
            >
              {[...Array(9).keys()].map(idx => (
                <Card
                  key={idx}
                  size="lg"
                  w={{base: 'auto', lg: '72'}}
                  h="72"
                  variant="outline"
                >
                  <CardBody>
                    <SkeletonCircle size="10" mb="4" mt="4" />
                    <Skeleton height="6" mb="4" />
                    <SkeletonText size="md" mb="2" />
                    <Skeleton height="2" w="24" mt="20" />
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          )}

          {/* Error state */}
          {state.error && (
            <VStack mt="8" justifyContent="center" w="100%">
              <Icon as={FiAlertCircle} fontSize="32" color="red.400" />
              <Text color="gray.600" textAlign="center" w="48">
                An unexpected error has occurred
              </Text>
            </VStack>
          )}

          {/* Data state */}
          {state.data && (
            <SimpleGrid
              columns={{base: 1, md: 2, lg: 3}}
              spacing="4"
              py="10"
              alignItems="center"
              w={{base: '100%', lg: 'auto'}}
            >
              {state.data.map(company => (
                <CompanyCard {...company} />
              ))}
            </SimpleGrid>
          )}

          {/* If no results */}
          {state?.data?.length === 0 && (
            <VStack mt="8" justifyContent="center" w="100%">
              <Heading as="h3" size="md" textAlign="center">
                No results found
              </Heading>
              <Text color="gray.500" textAlign="center">
                Try broadening your search result
              </Text>
            </VStack>
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
