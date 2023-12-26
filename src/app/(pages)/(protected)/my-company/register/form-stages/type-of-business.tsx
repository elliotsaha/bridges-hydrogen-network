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

export const typeOfBusinessSchema = z
  .object({
    type_of_business: z
      .string()
      .array()
      .nonempty(ZOD_ERR.REQ_FIELD)
      .or(z.boolean()),
  })
  .superRefine((data, ctx) => {
    if (!data.type_of_business) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['type_of_business'],
        message: ZOD_ERR.REQ_FIELD.message,
      });
    }
  });

type Form = z.infer<typeof typeOfBusinessSchema>;

export const TypeOfBusiness = ({
  formControl,
  formNavigation,
}: FormRegistration<Form>) => {
  const watched = {
    type_of_business: formControl.watch('type_of_business') as string[],
  };

  return (
    <form onSubmit={formNavigation.next}>
      <Box w="100%">
        {/*Type of Business Field*/}
        <FormControl
          isInvalid={Boolean(formControl.formState.errors.type_of_business)}
        >
          <VStack align="flex-start" minH="lg">
            <Heading as="h1">What type of business do you run?</Heading>
            <Text color="gray.500">Select all that apply</Text>
            <FormErrorMessage m="0">
              {formControl.formState.errors?.type_of_business?.message}
            </FormErrorMessage>
            <Flex flexDir="column" wrap="wrap" h={{base: '100%', lg: 'sm'}}>
              <CheckboxGroup
                colorScheme="brand"
                value={watched.type_of_business}
              >
                {typesOfBusinesses.map((i, idx) => (
                  <Checkbox
                    key={`${i}-${idx}`}
                    id={`${i}-${idx}`}
                    value={JSON.stringify(i)}
                    mb="2"
                    mr="12"
                    {...formControl.register('type_of_business')}
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
          Next
        </Button>
      </HStack>
    </form>
  );
};

export const typesOfBusinesses = [
  {
    name: 'Hydrogen Producer',
    description:
      'Companies involved in the production of hydrogen, through electrolysis, steam methane reforming, or other methods.',
  },
  {
    name: 'Fuel Cell Manufacturer',
    description:
      'Firms that manufacture fuel cells for various applications, such as vehicles or stationary power sources.',
  },
  {
    name: 'Infrastructure Provider',
    description:
      'Companies that provide infrastructure for hydrogen transport, storage, or fueling.',
  },
  {
    name: 'Consultant',
    description:
      'Companies offering consulting services in the field of hydrogen and clean energy, providing technical or strategic advice.',
  },
  {
    name: 'Investor',
    description:
      'Venture capital firms, private equity, or other financial entities that invest in hydrogen and clean energy companies.',
  },
  {
    name: 'Research & Development',
    description:
      'Entities primarily focused on R&D in hydrogen and clean energy technologies.',
  },
  {
    name: 'Education and Training',
    description:
      'Organizations offering educational services or training programs related to hydrogen and clean energy.',
  },
  {
    name: 'Hydrogen Storage & Distribution',
    description:
      'Companies involved in the safe storage, distribution, and transport of hydrogen.',
  },
  {
    name: 'Electrolyzer Manufacturer',
    description:
      'Companies that design, manufacture, and sell electrolyzers for hydrogen production.',
  },
  {
    name: 'Energy Software Developer',
    description:
      'Firms that develop software for energy management, monitoring, optimization, etc., specifically in the realm of hydrogen and clean energy.',
  },
  {
    name: 'Legal Services',
    description:
      'Firms providing legal counsel and services pertinent to the hydrogen and clean energy industry.',
  },
  {
    name: 'Policy and Regulation',
    description:
      'Organizations involved in setting or influencing policy and regulation in the hydrogen and clean energy sector.',
  },
  {
    name: 'Non-Profit/Advocacy',
    description:
      'Non-profit organizations or advocacy groups working towards the advancement of hydrogen and clean energy.',
  },
  {
    name: 'Hydrogen Equipment Supplier',
    description:
      'Companies that supply various equipment and tools used in the hydrogen industry.',
  },
  {
    name: 'Component Manufacturer',
    description:
      'Companies that manufacture components for hydrogen systems such as valves, pipes, fittings, etc.',
  },
];
