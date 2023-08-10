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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
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
} from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import { Formik, Field } from "formik";
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

interface StepperScreenContextProps {
  activeStep: number;
  setActiveStep: Dispatch<SetStateAction<number>>;
  // company headquarters
  headquartersLocation: string;
  updateHeadquartersLocation: Dispatch<SetStateAction<string>>;
  locationResponse: axios.AxiosResponse<any, any> | undefined;
  locationIsLoading: boolean;
  locationIsError: boolean;
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

  const {
    data: locationResponse,
    isLoading: locationIsLoading,
    isError: locationIsError,
  } = useQuery(
    ["headquarters", debouncedHeadquartersQuery],
    () => fetchCities(debouncedHeadquartersQuery),
    { enabled: Boolean(debouncedHeadquartersQuery) }
  );

  return (
    <Container maxW="container.xl" py={{ base: "32", lg: "20" }} px="8">
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
            locationIsError,
            locationQuery: headquartersQuery,
            updateLocationQuery: setHeadquartersQuery,
          }}
        >
          <MobileStepper display={{ base: "flex", lg: "none" }} />
          <StepperScreen />
        </StepperScreenContext.Provider>
      </Stack>
    </Container>
  );
};

const NextButton = () => {
  const { activeStep, setActiveStep } = useContext(
    StepperScreenContext
  ) as StepperScreenContextProps;
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
    locationIsError,
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
    const onLocationClick = (location: Record<string, string>) => {
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
                    onClick={() => onLocationClick(i)}
                    w="100%"
                    colorScheme="brand"
                  >
                    {truncateText(i.description, 30)}
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
              <VStack w="100%" align="flex-start">
                <Text color="gray.500">Headquarters Location</Text>
                <Box w="64" position="relative">
                  <Input
                    w="64"
                    placeholder="e.g. Edmonton, AB"
                    onChange={(e) => updateLocationQuery(e.target.value)}
                    value={locationQuery}
                    name="headquarters_location"
                    autoComplete="off"
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
                        <Text color="gray.600">
                          Location set to: {headquartersLocation}
                        </Text>
                      </>
                    ) : (
                      <>
                        <Icon
                          as={FiAlertTriangle}
                          fontSize="18"
                          color="orange.300"
                          mt="1"
                        />
                        <Text color="gray.500">Location not set</Text>
                      </>
                    )}
                  </Flex>
                </Box>
              </VStack>
              <VStack w="100%" align="flex-start">
                <Text color="gray.500">Years in Business</Text>
                <NumberInput step={1} min={2} w="36">
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Checkbox colorScheme="brand" color="gray.600">
                  Less than 2 years
                </Checkbox>
              </VStack>
            </Stack>

            <Heading as="h3" size="md" mt="6">
              Where does your company operate
            </Heading>
            <Text color="gray.500">
              Select all regions that your company operates in
            </Text>
            <CheckboxGroup colorScheme="brand">
              {operatingRegions.map((i) => (
                <Checkbox key={i}>{i}</Checkbox>
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
