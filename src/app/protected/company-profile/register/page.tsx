"use client";
import {
  useState,
  createContext,
  useContext,
  useEffect,
  useReducer,
  useMemo,
  useRef,
} from "react";
import {
  Icon,
  Spinner,
  Container,
  Heading,
  Box,
  Step,
  StepDescription,
  StepIndicator,
  StepIcon,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  HStack,
  Input,
  VStack,
  useNumberInput,
  CheckboxGroup,
  Checkbox,
  Text,
  UnorderedList,
  ListItem,
  Button,
  Tooltip,
  Flex,
  SimpleGrid,
  Stack,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import {
  Formik,
  Field,
  FormikErrors,
  FormikTouched,
  useFormikContext,
  FormikProps,
} from "formik";
import { scrollToTop } from "@/utils/scrollToTop";
import { truncateText } from "@/utils/truncateText";
import { steps } from "./formSteps";
import {
  typeOfBusinesses,
  services,
  marketSegmentFocus,
  technologiesUsed,
  operatingRegions,
} from "./formOptions";
import { useDebounce } from "usehooks-ts";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useOnClickOutside } from "usehooks-ts";
import { FiAlertCircle, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

interface Form {
  headquarters_location: string;
  years_in_business: string;
  less_than_2_years: boolean;
  operating_regions: string[];
  company_headquarters: string[];
  type_of_business: string[];
  services_or_products: string[];
  technologies_used: string[];
  market_segment_focus: string[];
}

interface StepperScreenContextProps {
  activeStep: number;
  setActiveStep: Dispatch<SetStateAction<number>>;
  // company headquarters
  headquartersLocation: string;
  updateHeadquartersLocation: Dispatch<SetStateAction<string>>;
  locationResponse: axios.AxiosResponse<any, any> | undefined;
  locationIsLoading: boolean;
  locationQuery: string;
  updateLocationQuery: Dispatch<SetStateAction<string>>;
}

const StepperScreenContext = createContext<StepperScreenContextProps | null>(
  null
);

const Register = () => {
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  // set location of the company's headquarters (only set if option from dropdown is set)
  const [headquartersLocation, setHeadquartersLocation] = useState<string>("");
  // headquarters query needs a seperate state away from formik as it calls for the google maps places api
  const [headquartersQuery, setHeadquartersQuery] = useState<string>("");

  const debouncedHeadquartersQuery = useDebounce<string>(
    headquartersQuery,
    400
  );

  const fetchCities = (query: string) => {
    return axios.post("/maps/query/cities", { input: query });
  };

  const { data: locationResponse, isLoading: locationIsLoading } = useQuery(
    ["headquarters", debouncedHeadquartersQuery],
    () => fetchCities(debouncedHeadquartersQuery),
    { enabled: Boolean(debouncedHeadquartersQuery) }
  );

  const submitForm = (values: Form) => {
    console.log(values);
  };

  return (
    <Container maxW="container.xl" py={{ base: "32", lg: "20" }} px="8">
      <Formik
        enableReinitialize
        initialValues={{
          headquarters_location: "",
          years_in_business: "",
          less_than_2_years: false,
          operating_regions: [],
          company_headquarters: [],
          type_of_business: [],
          services_or_products: [],
          technologies_used: [],
          market_segment_focus: [],
        }}
        onSubmit={submitForm}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Stack
              spacing={{ base: "16", lg: "92" }}
              align={{ base: "center", lg: "flex-start" }}
              direction={{ base: "column", lg: "row" }}
            >
              <Stepper
                index={activeStep}
                orientation="vertical"
                h="xl"
                gap="0"
                colorScheme="brand"
                display={{ base: "none", lg: "flex" }}
              >
                {steps.map((step, index) => (
                  <Step key={index}>
                    <StepIndicator>
                      <StepStatus
                        complete={<StepIcon />}
                        incomplete={<StepNumber />}
                        active={<StepNumber />}
                      />
                    </StepIndicator>

                    <Box flexShrink="0">
                      <StepTitle>{step.title}</StepTitle>
                      <StepDescription>{step.description}</StepDescription>
                    </Box>

                    <StepSeparator />
                  </Step>
                ))}
              </Stepper>
              <StepperScreenContext.Provider
                value={{
                  activeStep,
                  setActiveStep,
                  headquartersLocation,
                  updateHeadquartersLocation: setHeadquartersLocation,
                  locationResponse,
                  locationIsLoading,
                  locationQuery: headquartersQuery,
                  updateLocationQuery: setHeadquartersQuery,
                }}
              >
                <MobileStepper display={{ base: "flex", lg: "none" }} />
                <StepperScreen />
              </StepperScreenContext.Provider>
            </Stack>
          </form>
        )}
      </Formik>
    </Container>
  );
};

const NextButton = () => {
  const { activeStep, setActiveStep } = useContext(
    StepperScreenContext
  ) as StepperScreenContextProps;

  const { values: formValues } = useFormikContext<Form>();
  console.log(formValues);

  return (
    <Button
      colorScheme="brand"
      size="lg"
      onClick={() => {
        setActiveStep((prev) => prev + 1);
        scrollToTop();
      }}
      isDisabled={activeStep === steps.length}
    >
      Next
    </Button>
  );
};

const BackButton = () => {
  const { activeStep, setActiveStep } = useContext(
    StepperScreenContext
  ) as StepperScreenContextProps;
  return (
    <Button
      onClick={() => {
        setActiveStep((prev) => prev - 1);
        scrollToTop();
      }}
      isDisabled={activeStep === 0}
      size="lg"
    >
      Back
    </Button>
  );
};

const MobileStepper = ({ display }: { display: Record<string, string> }) => {
  const { activeStep, setActiveStep } = useContext(
    StepperScreenContext
  ) as StepperScreenContextProps;
  const activeStepText = steps[activeStep].description;

  return (
    <Stack spacing="4" display={display} w="100%">
      <Stepper size="sm" index={activeStep} gap="0" colorScheme="brand">
        {steps.map((_, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus complete={<StepIcon />} />
            </StepIndicator>
            <StepSeparator />
          </Step>
        ))}
      </Stepper>
      <Text>
        Step {activeStep + 1}: <b>{activeStepText}</b>
      </Text>
    </Stack>
  );
};

const LocationSelect = () => {
  const {
    headquartersLocation,
    updateHeadquartersLocation,
    locationResponse,
    locationIsLoading,
    locationQuery,
    updateLocationQuery,
  } = useContext(StepperScreenContext) as StepperScreenContextProps;

  const [render, setRender] = useState(false);

  const ref = useRef(null);

  const handleClickOutside = (e: any) => {
    // if user is clicking anywhere but the input field or the dropdown
    if (e?.target?.name !== "headquarters_location") {
      setRender(false);
    }
  };

  useOnClickOutside(ref, handleClickOutside);

  const Wrapper = ({
    children,
    center = false,
  }: {
    children?: React.ReactNode;
    center?: boolean;
  }) => {
    return (
      <Box
        ref={ref}
        borderWidth="thin"
        borderRadius="md"
        position="absolute"
        w="64"
        top="12"
        p="4"
        zIndex="200"
        bg="white"
        h={center ? "60" : "auto"}
        display={render ? "flex" : "none"}
        alignItems={center ? "center" : "flex-start"}
        justifyContent={center ? "center" : "flex-start"}
        flexDirection="column"
      >
        {children}
      </Box>
    );
  };

  useEffect(() => {
    if (locationQuery !== headquartersLocation) {
      updateHeadquartersLocation("");
    }

    if (locationQuery !== "" && headquartersLocation === "") {
      setRender(true);
    }

    if (locationQuery === "") {
      // If empty query (user did not type anything) then no dropdown should pop up
      setRender(false);
    }

    const handleInputClick = (e: any) => {
      if (e.target.name === "headquarters_location" && locationQuery !== "") {
        setRender(true);
      }
    };

    window.addEventListener("click", handleInputClick);

    return () => window.removeEventListener("click", handleInputClick);
  }, [locationQuery, headquartersLocation, updateHeadquartersLocation]);

  if (locationIsLoading) {
    return (
      <Wrapper center>
        <Spinner colorScheme="brand" />
      </Wrapper>
    );
  }

  if (locationResponse?.data.status === "ZERO_RESULTS") {
    return (
      <Wrapper center>
        <Icon as={FiAlertCircle} fontSize="32" color="red.300" />
        <Text as="h4" mt="2" color="gray.600" textAlign="center">
          Nothing found
        </Text>
      </Wrapper>
    );
  }

  if (locationResponse?.data.status === "OK") {
    const onLocationClick = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      location: Record<string, string>
    ) => {
      e.persist();
      updateLocationQuery(location.description);
      updateHeadquartersLocation(location.description);
      setRender(false);
    };
    return (
      <Wrapper>
        <UnorderedList listStyleType="none" display="contents">
          {locationResponse?.status === 200 &&
            locationResponse.data.predictions
              .slice(0, 5)
              .map((i: Record<string, string>) => (
                <ListItem key={i.description} py="1" w="100%">
                  <Button
                    size="sm"
                    variant="ghost"
                    justifyContent="flex-start"
                    onClick={(e) => onLocationClick(e, i)}
                    onMouseDown={(e) => e.preventDefault()}
                    w="100%"
                    colorScheme="brand"
                  >
                    {truncateText(i.description, 28)}
                  </Button>
                </ListItem>
              ))}
        </UnorderedList>
      </Wrapper>
    );
  }

  // error occurred
  return (
    <Wrapper center>
      <Icon as={FiAlertCircle} fontSize="32" color="red.300" />
      <Text as="h4" mt="2" color="gray.600" mx="4" textAlign="center">
        An unexpected error occurred
      </Text>
    </Wrapper>
  );
};

const StepperScreen = () => {
  const {
    activeStep,
    headquartersLocation,
    locationQuery,
    updateLocationQuery,
  } = useContext(StepperScreenContext) as StepperScreenContextProps;

  const {
    values: formValues,
    setFieldValue,
    errors: formErrors,
    touched: formTouched,
    handleBlur: formHandleBlur,
  } = useFormikContext<Form>();

  const hasError = (key: keyof Form): boolean => {
    return Boolean(formErrors[key] && formTouched[key]);
  };

  switch (activeStep) {
    case 0:
      return (
        <Box w="100%" ml={{ base: "0", lg: "24" }}>
          <VStack align="flex-start" minH="lg" mb="6">
            <Heading as="h1" mb="2">
              Let&apos;s get to know your company
            </Heading>
            <Stack
              spacing="42"
              align="flex-start"
              direction={{ base: "column", lg: "row" }}
            >
              <FormControl
                isInvalid={
                  !!formErrors.headquarters_location &&
                  formTouched.headquarters_location
                }
              >
                <VStack w="100%" align="flex-start">
                  <FormLabel
                    color="gray.500"
                    htmlFor="headquarters_location"
                    mb="0"
                  >
                    Headquarters Location
                  </FormLabel>
                  <Box w="64" position="relative">
                    <Field
                      as={Input}
                      w="64"
                      placeholder="e.g. Edmonton, AB"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateLocationQuery(e?.target?.value)
                      }
                      value={locationQuery}
                      name="headquarters_location"
                      id="headquarters_location"
                      autoComplete="off"
                      validate={() => {
                        let error;

                        if (headquartersLocation === "") {
                          error = "Location not set";
                        }

                        return error;
                      }}
                    />
                    <LocationSelect />
                    <Flex
                      mt="2"
                      justifyContent="flex-start"
                      alignItems="flex-start"
                      gap="2"
                    >
                      {headquartersLocation ? (
                        <>
                          <Icon
                            as={FiCheckCircle}
                            fontSize="18"
                            color="green.500"
                            mt="1"
                          />
                          <Box color="gray.600">
                            Location set to:{" "}
                            <Text color="gray.900" fontWeight="bold">
                              {headquartersLocation}
                            </Text>
                          </Box>
                        </>
                      ) : (
                        <>
                          <Icon
                            as={
                              hasError("headquarters_location")
                                ? FiAlertCircle
                                : FiAlertTriangle
                            }
                            fontSize="18"
                            color={
                              hasError("headquarters_location")
                                ? "red.500"
                                : "orange.300"
                            }
                            mt="1"
                          />
                          <Text
                            color={
                              hasError("headquarters_location")
                                ? "red.500"
                                : "gray.500"
                            }
                          >
                            Location not set
                          </Text>
                        </>
                      )}
                    </Flex>
                  </Box>
                </VStack>
              </FormControl>

              <FormControl
                isInvalid={
                  (!!formErrors.years_in_business &&
                    formTouched.years_in_business) ||
                  (!!formErrors.less_than_2_years &&
                    formTouched.less_than_2_years)
                }
              >
                <VStack w="100%" align="flex-start">
                  <FormLabel
                    htmlFor="years_in_business"
                    color="gray.500"
                    mb="0"
                  >
                    Years in Business
                  </FormLabel>
                  <HStack>
                    <Button
                      onClick={() => {
                        if (parseInt(formValues.years_in_business)) {
                          setFieldValue(
                            "years_in_business",
                            (
                              parseInt(formValues.years_in_business) + 1
                            ).toString()
                          );
                        } else {
                          setFieldValue("years_in_business", "2");
                        }
                      }}
                      isDisabled={formValues.less_than_2_years}
                    >
                      +
                    </Button>
                    <Field
                      as={Input}
                      id="years_in_business"
                      name="years_in_business"
                      type="number"
                      pattern="[0-9]"
                      onBlur={(e: FocusEvent) => {
                        const formattedValue = Math.max(
                          2,
                          parseInt(formValues.years_in_business)
                        ).toString();

                        setFieldValue("years_in_business", formattedValue);
                        formHandleBlur(e);
                      }}
                      validate={() => {
                        let error;

                        if (
                          !formValues.less_than_2_years &&
                          !formValues.years_in_business
                        ) {
                          error = "This field is required";
                        }

                        return error;
                      }}
                      isDisabled={formValues.less_than_2_years}
                    />
                    <Button
                      onClick={() => {
                        if (parseInt(formValues.years_in_business) > 2) {
                          setFieldValue(
                            "years_in_business",
                            (
                              parseInt(formValues.years_in_business) - 1
                            ).toString()
                          );
                        } else {
                          setFieldValue("years_in_business", "2");
                        }
                      }}
                      isDisabled={
                        parseInt(formValues.years_in_business) <= 2 ||
                        formValues.less_than_2_years
                      }
                    >
                      -
                    </Button>
                  </HStack>
                  <Field
                    as={Checkbox}
                    colorScheme="brand"
                    color="gray.600"
                    id="less_than_2_years"
                    name="less_than_2_years"
                    onChange={(e: any) => {
                      setFieldValue("less_than_2_years", e.target.checked);
                      setFieldValue("years_in_business", "");
                    }}
                  >
                    Less than 2 years
                  </Field>
                </VStack>
              </FormControl>
            </Stack>

            <Heading as="h3" size="md" mt="6">
              Where does your company operate
            </Heading>
            <Text color="gray.500">
              Select all regions that your company operates in
            </Text>
            <CheckboxGroup colorScheme="brand">
              {operatingRegions.map((i) => (
                <Field
                  as={Checkbox}
                  key={i}
                  id={i}
                  name="operating_regions"
                  value={i}
                >
                  {i}
                </Field>
              ))}
            </CheckboxGroup>
          </VStack>
          <HStack spacing="2" alignSelf="flex-end" justifyContent="flex-end">
            <BackButton />
            <NextButton />
          </HStack>
        </Box>
      );
    case 1:
      return (
        <Box w="100%" ml={{ base: "0", lg: "24" }}>
          <VStack align="flex-start" minH="lg" mb="6">
            <Heading as="h1">What type of business do you run?</Heading>

            <Text color="gray.500">Select all that apply</Text>
            <Flex flexDir="column" wrap="wrap" h={{ base: "100%", lg: "sm" }}>
              <CheckboxGroup colorScheme="brand">
                {typeOfBusinesses.map((i) => (
                  <Checkbox key={i.name} mb="2" mr="12">
                    <Tooltip label={i.description} p="3" borderRadius="lg">
                      {i.name}
                    </Tooltip>
                  </Checkbox>
                ))}
              </CheckboxGroup>
            </Flex>
          </VStack>
          <HStack spacing="2" alignSelf="flex-end" justifyContent="flex-end">
            <BackButton />
            <NextButton />
          </HStack>
        </Box>
      );
    case 2:
      return (
        <Box w="100%" ml={{ base: "0", lg: "24" }}>
          <VStack align="flex-start" minH="lg" mb="6">
            <Heading as="h1" mb="2">
              What services / products does your business provide?
            </Heading>

            <Text color="gray.500">Select all that apply</Text>

            <Flex flexDir="column" wrap="wrap" h={{ base: "100%", xl: "sm" }}>
              <CheckboxGroup colorScheme="brand">
                {services.map((i) => (
                  <Checkbox key={i.name} mb="2" mr="12">
                    <Tooltip label={i.description} p="3" borderRadius="lg">
                      {i.name}
                    </Tooltip>
                  </Checkbox>
                ))}
              </CheckboxGroup>
            </Flex>
          </VStack>
          <HStack spacing="2" alignSelf="flex-end" justifyContent="flex-end">
            <BackButton />
            <NextButton />
          </HStack>
        </Box>
      );
    case 3:
      return (
        <Box w="100%" ml={{ base: "0", lg: "24" }}>
          <VStack align="flex-start" minH="lg" mb="6">
            <Heading as="h1" mb="2">
              What technologies does your business use?
            </Heading>
            <Text color="gray.500" mt="-2">
              Select all that apply
            </Text>

            <SimpleGrid columns={{ base: 1, xl: 2 }} mt="-4">
              {technologiesUsed.map((section) => (
                <Box key={section.sectionTitle} mr="12">
                  <Heading as="h3" size="md" mt="8" mb="4">
                    {section.sectionTitle}
                  </Heading>

                  <Flex flexDir="column" wrap="wrap">
                    <CheckboxGroup colorScheme="brand">
                      {section.technologies.map((tech) =>
                        typeof tech === "string" ? (
                          <Checkbox key={tech} mb="2" mr="12">
                            {tech}
                          </Checkbox>
                        ) : (
                          <Checkbox key={tech.name} mb="2" mr="12">
                            <Tooltip
                              label={tech.tooltip}
                              p="3"
                              borderRadius="lg"
                            >
                              {tech.name}
                            </Tooltip>
                          </Checkbox>
                        )
                      )}
                    </CheckboxGroup>
                  </Flex>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
          <HStack spacing="2" alignSelf="flex-end" justifyContent="flex-end">
            <BackButton />
            <NextButton />
          </HStack>
        </Box>
      );
    case 4:
      return (
        <Box w="100%" ml={{ base: "0", lg: "24" }}>
          <VStack align="flex-start" minH="lg" mb="6">
            <Heading as="h1">
              What market does your company cater towards?
            </Heading>
            <Text color="gray.500">Select all that apply</Text>
            <Flex flexDir="column" wrap="wrap" h="sm">
              <CheckboxGroup colorScheme="brand">
                {marketSegmentFocus.map((i) => (
                  <Checkbox key={i.name} mb="2" mr="12">
                    <Tooltip label={i.description} p="3" borderRadius="lg">
                      {i.name}
                    </Tooltip>
                  </Checkbox>
                ))}
              </CheckboxGroup>
            </Flex>
          </VStack>
          <HStack spacing="2" alignSelf="flex-end" justifyContent="flex-end">
            <BackButton />
            <Button colorScheme="brand" size="lg">
              Submit
            </Button>
          </HStack>
        </Box>
      );
    default:
      return <></>;
  }
};
export default Register;
