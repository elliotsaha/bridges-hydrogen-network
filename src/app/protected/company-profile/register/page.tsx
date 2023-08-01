"use client";
import {
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
  TagLabel,
  TagCloseButton,
  Tag,
  Button,
  Tooltip,
  Icon,
  Wrap,
  Flex,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import {
  typeOfBusinesses,
  services,
  marketSegmentFocus,
  technologiesUsed,
} from "./formOptions";

const scrollToTop = () => {
  window.scrollTo({ top: 0 });
};

const steps = [
  {
    title: "Basic Information",
    description: "Standard information about your company",
  },
  {
    title: "Type of Business",
    description: "What type of business do you operate?",
  },
  {
    title: "Provided Services",
    description: "What services / products do you provide?",
  },
  {
    title: "Technologies Used",
    description: "What technologies does your company use?",
  },
  {
    title: "Market Segment Focus",
    description: "What market does your company cater towards?",
  },
];

const Register = () => {
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const activeStepText = steps[activeStep].description;

  return (
    <Container maxW="container.xl" py={{ base: "32", lg: "20" }} px="8">
      <Stack
        spacing="92"
        align="flex-start"
        direction="row"
        display={{ base: "none", lg: "flex" }}
      >
        <Stepper
          index={activeStep}
          orientation="vertical"
          h="xl"
          gap="0"
          colorScheme="brand"
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
        <StepperScreen activeStep={activeStep} setActiveStep={setActiveStep} />
      </Stack>

      <Stack display={{ base: "flex", lg: "none" }} spacing="16">
        <MobileStepper activeStep={activeStep} />
        <StepperScreen activeStep={activeStep} setActiveStep={setActiveStep} />
      </Stack>
    </Container>
  );
};

interface ProgressButtonProps {
  activeStep: number;
  setActiveStep: Dispatch<SetStateAction<number>>;
}

interface StepperScreenProps extends ProgressButtonProps {}

const NextButton = ({ activeStep, setActiveStep }: ProgressButtonProps) => (
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

const BackButton = ({ activeStep, setActiveStep }: ProgressButtonProps) => (
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

const MobileStepper = ({ activeStep }: { activeStep: number }) => {
  const activeStepText = steps[activeStep].description;

  return (
    <Stack spacing="4">
      <Stepper size="sm" index={activeStep} gap="0" colorScheme="brand">
        {steps.map((step, index) => (
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

const StepperScreen = ({ activeStep, setActiveStep }: StepperScreenProps) => {
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
                <Input w="64" placeholder="e.g. Edmonton, AB" />
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

            <Heading as="h3" size="md" mt="8">
              Where does your company operate
            </Heading>
            <Text color="gray.500">
              Select all regions that your company operates in
            </Text>
            <Input w="64" placeholder="e.g. Vancouver, BC" />
          </VStack>
          <HStack spacing="2" alignSelf="flex-end" justifyContent="flex-end">
            <BackButton activeStep={activeStep} setActiveStep={setActiveStep} />
            <NextButton activeStep={activeStep} setActiveStep={setActiveStep} />
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
            <BackButton activeStep={activeStep} setActiveStep={setActiveStep} />
            <NextButton activeStep={activeStep} setActiveStep={setActiveStep} />
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
            <BackButton activeStep={activeStep} setActiveStep={setActiveStep} />
            <NextButton activeStep={activeStep} setActiveStep={setActiveStep} />
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
            <BackButton activeStep={activeStep} setActiveStep={setActiveStep} />
            <NextButton activeStep={activeStep} setActiveStep={setActiveStep} />
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
            <BackButton activeStep={activeStep} setActiveStep={setActiveStep} />
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
