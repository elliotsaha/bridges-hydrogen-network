'use client';
import z from 'zod';
import {
  VStack,
  Flex,
  FormControl,
  Box,
  FormErrorMessage,
  Heading,
  Text,
  Checkbox,
  CheckboxGroup,
  Tooltip,
  HStack,
  Button,
} from '@chakra-ui/react';
import {ZOD_ERR} from '@constants';
import {FormRegistration} from '@types';

export const marketFocusSchema = z
  .object({
    marketFocus: z.string().array().nonempty(ZOD_ERR.REQ_FIELD).or(z.boolean()),
  })
  .superRefine((data, ctx) => {
    if (!data.marketFocus) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['marketFocus'],
        message: ZOD_ERR.REQ_FIELD.message,
      });
    }
  });

type Form = z.infer<typeof marketFocusSchema>;

export const MarketFocus = ({
  formControl,
  formNavigation,
}: FormRegistration<Form>) => {
  const watched = {
    marketFocus: formControl.watch('marketFocus') as string[],
  };

  return (
    <form onSubmit={formNavigation.submit}>
      <Box w="100%">
        {/*Market Focus Field*/}
        <FormControl
          isInvalid={Boolean(formControl.formState.errors.marketFocus)}
        >
          <VStack align="flex-start" minH="lg">
            <Heading as="h1">
              What market does your company cater towards?
            </Heading>
            <Text color="gray.500">Select all that apply</Text>
            <FormErrorMessage m="0">
              {formControl.formState.errors?.marketFocus?.message}
            </FormErrorMessage>
            <Flex flexDir="column" wrap="wrap" h={{base: '100%', lg: 'sm'}}>
              <CheckboxGroup colorScheme="brand" value={watched.marketFocus}>
                {marketFocuses.map((i, idx) => (
                  <Checkbox
                    key={`${i}-${idx}`}
                    id={`${i}-${idx}`}
                    value={JSON.stringify(i)}
                    mb="2"
                    mr="12"
                    {...formControl.register('marketFocus')}
                  >
                    <Tooltip label={i.description} p="3" borderRadius="lg">
                      {i.name}
                    </Tooltip>
                  </Checkbox>
                ))}
              </CheckboxGroup>
            </Flex>
          </VStack>
        </FormControl>
      </Box>

      {/* Form Navigation */}
      <HStack
        spacing="2"
        alignSelf="flex-end"
        justifyContent="flex-end"
        w={{base: '100%', md: '35rem'}}
      >
        <Button type="button" onClick={formNavigation.back}>
          Back
        </Button>
        <Button type="submit" colorScheme="brand">
          Submit
        </Button>
      </HStack>
    </form>
  );
};

export const marketFocuses = [
  {
    name: 'Residential',
    description:
      'Companies that offer solutions designed for residential use, such as home energy systems.',
  },
  {
    name: 'Commercial',
    description:
      'Companies providing solutions for businesses, such as fuel cells for commercial buildings or hydrogen for commercial vehicle fleets.',
  },
  {
    name: 'Industrial',
    description:
      'Firms offering products or services aimed at large industrial applications, such as power generation or industrial-scale hydrogen production.',
  },
  {
    name: 'Automotive',
    description:
      'Companies involved in the development or supply of fuel cell systems for cars, trucks, buses, or other vehicles.',
  },
  {
    name: 'Maritime',
    description:
      'Businesses focused on hydrogen and clean energy applications for maritime transport (ships, boats, etc.).',
  },
  {
    name: 'Aviation',
    description: 'Companies working on hydrogen solutions for aviation.',
  },
  {
    name: 'Government/Municipal',
    description:
      'Companies that work primarily with government entities, providing solutions for public transportation, municipal buildings, etc.',
  },
  {
    name: 'Agricultural',
    description:
      'Companies offering hydrogen and clean energy solutions suitable for farming or agricultural applications.',
  },
  {
    name: 'Utility',
    description:
      'Companies providing hydrogen or fuel cell solutions to utility companies, such as large-scale power generation or grid storage solutions.',
  },
];