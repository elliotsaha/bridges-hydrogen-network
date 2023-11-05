"use client";
import { useState, createContext, useContext, useEffect, useRef } from "react";
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
  FormErrorMessage,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import { Formik, Field, useFormikContext } from "formik";
import { scrollToTop, truncateText, omit } from "@utils";
import { steps } from "./formSteps";
import {
  typeOfBusinesses,
  services,
  marketSegmentFocus,
  technologiesUsed,
  operatingRegions,
} from "./formOptions";
import { useDebounce } from "usehooks-ts";
import axios, { AxiosResponse } from "axios";
import { useQuery } from "@tanstack/react-query";
import { useOnClickOutside } from "usehooks-ts";
import { FiAlertCircle, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import z from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

interface Form {
  company_name: string;
  headquarters_location: string;
  years_in_business: string;
  less_than_2_years: boolean;
  operating_regions: string[];
  type_of_business: string[];
  services_or_products: string[];
  technologies_used: string[];
  market_segment_focus: string[];
}

interface StepperScreenContext {
  activeStep: number;
  setActiveStep: Dispatch<SetStateAction<number>>;
  // company headquarters
  headquartersLocation: string;
  updateHeadquartersLocation: Dispatch<SetStateAction<string>>;
  locationResponse: AxiosResponse<any, any> | undefined;
  locationIsLoading: boolean;
  locationQuery: string;
  updateLocationQuery: Dispatch<SetStateAction<string>>;
}

const StepperScreenContext = createContext<StepperScreenContext>(
  {} as StepperScreenContext
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
    return axios.post("/api/maps/query/cities", { input: query });
  };

  const { data: locationResponse, isLoading: locationIsLoading } = useQuery(
    ["headquarters", debouncedHeadquartersQuery],
    () => fetchCities(debouncedHeadquartersQuery),
    { enabled: Boolean(debouncedHeadquartersQuery) }
  );

  const submitForm = async (values: Form) => {
    const formQuery = values.less_than_2_years
      ? omit("years_in_business", values)
      : {
          ...values,
          years_in_business: parseInt(values.years_in_business),
        };

    console.log(formQuery);
    const res = await axios.post("/api/my-company/register", formQuery);

    console.log(res);
  };

  const formSchema = z.object({
    company_name: z.string({ required_error: "Company name required" }),
    operating_regions: z
      .string()
      .array()
      .nonempty("Please select at least one operating region"),

    type_of_business: z
      .string()
      .array()
      .nonempty("Please select one type of business"),
    services_or_products: z
      .string()
      .array()
      .min(
        1,
        "Please select at least one service / product your business provides"
      ),
    technologies_used: z
      .string()
      .array()
      .nonempty("Please select at least one technology your business uses"),
    market_segment_focus: z
      .string()
      .array()
      .nonempty(
        "Please select at least one market your business caters towards"
      ),
  });

  return (
    <Container maxW="container.xl" py={{ base: "32", lg: "20" }} px="8">
      <Formik
        enableReinitialize
        initialValues={{
          company_name: "",
          headquarters_location: "",
          years_in_business: "",
          less_than_2_years: false,
          operating_regions: [],
          type_of_business: [],
          services_or_products: [],
          technologies_used: [],
          market_segment_focus: [],
        }}
        validationSchema={toFormikValidationSchema(formSchema)}
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

const NextButton = ({
  validateBefore,
}: {
  validateBefore: Array<keyof Form>;
}) => {
  const { setActiveStep } = useContext(StepperScreenContext);

  const {
    setFieldTouched,
    errors: formErrors,
    dirty,
  } = useFormikContext<Form>();

  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    setRendered(true);
  }, []);

  const clickHandler = () => {
    validateBefore.map((formKey) => {
      setFieldTouched(formKey, true, true);
    });
    if (dirty) {
      let continueStep = true;
      for (let i = 0; i < validateBefore.length; i++) {
        if (formErrors.hasOwnProperty(validateBefore[i])) {
          continueStep = false;
        }
      }
      if (continueStep) {
        setActiveStep((prev) => prev + 1);
        scrollToTop();
      }
    }
  };

  return (
    <Button
      colorScheme="brand"
      size="lg"
      onClick={clickHandler}
      isDisabled={!rendered}
    >
      Next
    </Button>
  );
};

const SubmitButton = () => {
  const { isSubmitting } = useFormikContext();
  return (
    <Button
      colorScheme="brand"
      size="lg"
      type="submit"
      loadingText="Submitting"
      isLoading={isSubmitting}
    >
      Submit
    </Button>
  );
};

const BackButton = () => {
  const { isSubmitting } = useFormikContext();
  const { activeStep, setActiveStep } = useContext(StepperScreenContext);

  return (
    <Button
      onClick={() => {
        setActiveStep((prev) => prev - 1);
        scrollToTop();
      }}
      isDisabled={activeStep === 0 || isSubmitting}
      size="lg"
    >
      Back
    </Button>
  );
};

const MobileStepper = ({ display }: { display: Record<string, string> }) => {
  const { activeStep } = useContext(StepperScreenContext);
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
  } = useContext(StepperScreenContext);

  const { setFieldTouched, setFieldValue } = useFormikContext();

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
      setFieldValue("headquarters_location", "");
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
  }, [
    locationQuery,
    headquartersLocation,
    updateHeadquartersLocation,
    setFieldValue,
  ]);

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
      setFieldValue("headquarters_location", location.description);
      setFieldTouched("headquarters_location", true, true);
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
  } = useContext(StepperScreenContext);

  const {
    values: formValues,
    setFieldValue,
    errors: formErrors,
    touched: formTouched,
    handleBlur: formHandleBlur,
    setFieldTouched,
    isSubmitting,
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
            <FormControl
              isInvalid={!!formErrors.company_name && formTouched.company_name}
            >
              <VStack w="100%" align="flex-start" mb="4" mt="2">
                <FormLabel color="gray.500" htmlFor="company_name" mb="0">
                  Company name
                </FormLabel>
                <Box w="64" position="relative">
                  <Field
                    as={Input}
                    w="64"
                    placeholder="e.g. Acme Corporation"
                    name="company_name"
                    id="company_name"
                    autoComplete="off"
                    isDisabled={isSubmitting}
                  />
                </Box>
                {!!formErrors.company_name && formTouched.company_name && (
                  <Flex
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    gap="2"
                  >
                    <Icon
                      as={FiAlertCircle}
                      fontSize="18"
                      color="red.500"
                      mt="1"
                    />
                    <Text color="red.500">{formErrors.company_name}</Text>
                  </Flex>
                )}
              </VStack>
            </FormControl>
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
                      isDisabled={isSubmitting}
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
                  (!!formErrors.less_than_2_years &&
                    formTouched.less_than_2_years) ||
                  (!!formErrors.years_in_business &&
                    formTouched.years_in_business)
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
                        if (
                          formValues.years_in_business &&
                          parseInt(formValues.years_in_business)
                        ) {
                          setFieldValue(
                            "years_in_business",
                            (
                              parseInt(formValues.years_in_business) + 1
                            ).toString()
                          );
                        } else {
                          setFieldValue("years_in_business", "2", true);
                          // work around for setFieldValue not validating input when updated
                          setTimeout(() =>
                            setFieldTouched("years_in_business", true)
                          );
                        }
                      }}
                      isDisabled={formValues.less_than_2_years || isSubmitting}
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
                        const formattedValue = formValues.years_in_business
                          ? Math.max(
                              2,
                              parseInt(formValues.years_in_business)
                            ).toString()
                          : "";

                        setFieldValue("years_in_business", formattedValue);
                        formHandleBlur(e);
                      }}
                      validate={() => {
                        let error;

                        if (
                          !formValues.less_than_2_years &&
                          !parseInt(formValues.years_in_business)
                        ) {
                          error = "This field is required";
                        }

                        return error;
                      }}
                      isDisabled={formValues.less_than_2_years || isSubmitting}
                    />
                    <Button
                      onClick={() => {
                        if (
                          formValues.years_in_business &&
                          parseInt(formValues.years_in_business) > 2
                        ) {
                          setFieldValue(
                            "years_in_business",
                            (
                              parseInt(formValues.years_in_business) - 1
                            ).toString()
                          );
                        } else {
                          setFieldValue("years_in_business", "2", true);
                          setTimeout(() =>
                            setFieldTouched("years_in_business", true)
                          );
                        }
                      }}
                      isDisabled={
                        parseInt(formValues.years_in_business) <= 2 ||
                        formValues.less_than_2_years ||
                        isSubmitting
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
                      setTimeout(() => {
                        setFieldTouched("years_in_business", true);
                        setFieldTouched("less_than_2_years", true);
                      });
                    }}
                    isDisabled={isSubmitting}
                  >
                    Less than 2 years
                  </Field>
                </VStack>
              </FormControl>
            </Stack>

            <Heading as="h3" size="md" mt="6">
              Where does your company operate
            </Heading>
            <FormControl
              isInvalid={
                !!formErrors.operating_regions && formTouched.operating_regions
              }
            >
              <Text color="gray.500">
                Select all regions that your company operates in
              </Text>
              <FormErrorMessage>
                {formErrors.operating_regions}
              </FormErrorMessage>
              <VStack align="flex-start" mt="2">
                <CheckboxGroup
                  colorScheme="brand"
                  value={formValues.operating_regions}
                >
                  {operatingRegions.map((i) => (
                    <Field
                      as={Checkbox}
                      key={i}
                      id={i}
                      name="operating_regions"
                      value={i}
                      isDisabled={isSubmitting}
                    >
                      {i}
                    </Field>
                  ))}
                </CheckboxGroup>
              </VStack>
            </FormControl>
          </VStack>
          <HStack spacing="2" alignSelf="flex-end" justifyContent="flex-end">
            <BackButton />
            <NextButton
              validateBefore={[
                "company_name",
                "headquarters_location",
                "years_in_business",
                "operating_regions",
              ]}
            />
          </HStack>
        </Box>
      );
    case 1:
      return (
        <Box w="100%" ml={{ base: "0", lg: "24" }}>
          <FormControl
            isInvalid={
              !!formErrors.type_of_business && formTouched.type_of_business
            }
          >
            <VStack align="flex-start" minH="lg" mb="6">
              <Heading as="h1">What type of business do you run?</Heading>
              <Text color="gray.500">Select all that apply</Text>
              <FormErrorMessage m="0">
                {formErrors.type_of_business}
              </FormErrorMessage>
              <Flex flexDir="column" wrap="wrap" h={{ base: "100%", lg: "sm" }}>
                <CheckboxGroup
                  colorScheme="brand"
                  value={formValues.type_of_business}
                >
                  {typeOfBusinesses.map((i) => (
                    <Field
                      as={Checkbox}
                      key={i.name}
                      mb="2"
                      mr="12"
                      id={i.name}
                      value={i.name}
                      name="type_of_business"
                      isDisabled={isSubmitting}
                    >
                      <Tooltip label={i.description} p="3" borderRadius="lg">
                        {i.name}
                      </Tooltip>
                    </Field>
                  ))}
                </CheckboxGroup>
              </Flex>
            </VStack>
          </FormControl>
          <HStack spacing="2" alignSelf="flex-end" justifyContent="flex-end">
            <BackButton />
            <NextButton validateBefore={["type_of_business"]} />
          </HStack>
        </Box>
      );
    case 2:
      return (
        <Box w="100%" ml={{ base: "0", lg: "24" }}>
          <FormControl
            isInvalid={
              !!formErrors.services_or_products &&
              formTouched.services_or_products
            }
          >
            <VStack align="flex-start" minH="lg" mb="6">
              <Heading as="h1" mb="2">
                What services / products does your business provide?
              </Heading>

              <Text color="gray.500">Select all that apply</Text>
              <FormErrorMessage m="0">
                {formErrors.services_or_products}
              </FormErrorMessage>
              <Flex flexDir="column" wrap="wrap" h={{ base: "100%", xl: "sm" }}>
                <CheckboxGroup
                  colorScheme="brand"
                  value={formValues.services_or_products}
                  isDisabled={isSubmitting}
                >
                  {services.map((i) => (
                    <Field
                      as={Checkbox}
                      key={i.name}
                      mb="2"
                      mr="12"
                      id={i.name}
                      value={i.name}
                      name="services_or_products"
                    >
                      <Tooltip label={i.description} p="3" borderRadius="lg">
                        {i.name}
                      </Tooltip>
                    </Field>
                  ))}
                </CheckboxGroup>
              </Flex>
            </VStack>
          </FormControl>
          <HStack spacing="2" alignSelf="flex-end" justifyContent="flex-end">
            <BackButton />
            <NextButton validateBefore={["services_or_products"]} />
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

            <FormControl
              isInvalid={
                !!formErrors.technologies_used && formTouched.technologies_used
              }
            >
              <Text color="gray.500" mt="-2">
                Select all that apply
              </Text>
              <FormErrorMessage m="0">
                {formErrors.technologies_used}
              </FormErrorMessage>
              <SimpleGrid columns={{ base: 1, xl: 2 }} mt="-4">
                <CheckboxGroup
                  colorScheme="brand"
                  value={formValues.technologies_used}
                  isDisabled={isSubmitting}
                >
                  {technologiesUsed.map((section) => (
                    <Box key={section.sectionTitle} mr="12">
                      <Heading as="h3" size="md" mt="8" mb="4">
                        {section.sectionTitle}
                      </Heading>

                      <Flex flexDir="column" wrap="wrap">
                        {section.technologies.map((tech) =>
                          typeof tech === "string" ? (
                            <Field
                              as={Checkbox}
                              key={tech}
                              mb="2"
                              mr="12"
                              id={tech}
                              value={tech}
                              name="technologies_used"
                            >
                              {tech}
                            </Field>
                          ) : (
                            <Field
                              as={Checkbox}
                              key={tech.name}
                              mb="2"
                              mr="12"
                              id={tech.name}
                              value={tech.name}
                              name="technologies_used"
                            >
                              <Tooltip
                                label={tech.tooltip}
                                p="3"
                                borderRadius="lg"
                              >
                                {tech.name}
                              </Tooltip>
                            </Field>
                          )
                        )}
                      </Flex>
                    </Box>
                  ))}
                </CheckboxGroup>
              </SimpleGrid>
            </FormControl>
          </VStack>
          <HStack spacing="2" alignSelf="flex-end" justifyContent="flex-end">
            <BackButton />
            <NextButton validateBefore={["technologies_used"]} />
          </HStack>
        </Box>
      );
    case 4:
      return (
        <Box w="100%" ml={{ base: "0", lg: "24" }}>
          <FormControl
            isInvalid={
              !!formErrors.market_segment_focus &&
              formTouched.market_segment_focus
            }
          >
            <VStack align="flex-start" minH="lg" mb="6">
              <Heading as="h1">
                What market does your company cater towards?
              </Heading>
              <Text color="gray.500">Select all that apply</Text>
              <FormErrorMessage m="0">
                {formErrors.market_segment_focus}
              </FormErrorMessage>
              <Flex flexDir="column" wrap="wrap" h="sm">
                <CheckboxGroup
                  colorScheme="brand"
                  value={formValues.market_segment_focus}
                  isDisabled={isSubmitting}
                >
                  {marketSegmentFocus.map((i) => (
                    <Field
                      as={Checkbox}
                      key={i.name}
                      mb="2"
                      mr="12"
                      id={i.name}
                      value={i.name}
                      name="market_segment_focus"
                    >
                      <Tooltip label={i.description} p="3" borderRadius="lg">
                        {i.name}
                      </Tooltip>
                    </Field>
                  ))}
                </CheckboxGroup>
              </Flex>
            </VStack>
          </FormControl>
          <HStack spacing="2" alignSelf="flex-end" justifyContent="flex-end">
            <BackButton />
            <SubmitButton />
          </HStack>
        </Box>
      );
    default:
      return <></>;
  }
};
export default Register;
