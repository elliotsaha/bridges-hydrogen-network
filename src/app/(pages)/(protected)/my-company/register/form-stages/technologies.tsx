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
  SimpleGrid,
  HStack,
  Button,
} from '@chakra-ui/react';
import {ZOD_ERR} from '@constants';
import {FormRegistration} from '@types';

export const technologiesSchema = z
  .object({
    technologies: z
      .string()
      .array()
      .nonempty(ZOD_ERR.REQ_FIELD)
      .or(z.boolean()),
  })
  .superRefine((data, ctx) => {
    if (!data.technologies) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['technologies'],
        message: ZOD_ERR.REQ_FIELD.message,
      });
    }
  });

type Form = z.infer<typeof technologiesSchema>;

export const Technologies = ({
  formControl,
  formNavigation,
}: FormRegistration<Form>) => {
  const watched = {
    technologies: formControl.watch('technologies') as string[],
  };

  return (
    <form onSubmit={formNavigation.next}>
      <Box w="100%">
        <VStack align="flex-start" minH="lg" mb="6">
          <Heading as="h1" mb="2">
            What technologies does your business use?
          </Heading>

          {/*Technologies field*/}
          <FormControl
            isInvalid={Boolean(formControl.formState.errors.technologies)}
          >
            <Text color="gray.500" mt="-2">
              Select all that apply
            </Text>
            <FormErrorMessage m="0">
              {formControl.formState.errors?.technologies?.message}
            </FormErrorMessage>
            <SimpleGrid columns={{base: 1, xl: 2}}>
              <CheckboxGroup colorScheme="brand" value={watched.technologies}>
                {technologies.map(section => (
                  <Box key={section.sectionTitle} mr="12">
                    <Heading as="h3" size="md" mt="8" mb="4">
                      {section.sectionTitle}
                    </Heading>

                    <Flex flexDir="column" wrap="wrap">
                      {section.technologies.map((i, idx) => (
                        <Checkbox
                          key={`${i}-${idx}`}
                          id={`${i}-${idx}`}
                          mb="2"
                          mr="12"
                          value={JSON.stringify(i)}
                          {...formControl.register('technologies')}
                        >
                          {i.description ? (
                            <Tooltip
                              label={i.description}
                              p="3"
                              borderRadius="lg"
                            >
                              {i.name}
                            </Tooltip>
                          ) : (
                            i.name
                          )}
                        </Checkbox>
                      ))}
                    </Flex>
                  </Box>
                ))}
              </CheckboxGroup>
            </SimpleGrid>
          </FormControl>
        </VStack>
      </Box>

      {/* Form Navigation */}
      <HStack
        spacing="2"
        alignSelf="flex-end"
        justifyContent="flex-end"
        w={{base: '100%', md: '35rem', xl: '40rem'}}
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

export const technologies = [
  {
    sectionTitle: 'Hydrogen Production Technologies',
    technologies: [
      {name: 'Proton Exchange Membrane (PEM) Electrolysis'},
      {name: 'Alkaline Electrolysis'},
      {name: 'Solid Oxide Electrolyzer Cell (SOEC)'},
      {name: 'Steam Methane Reforming'},
      {name: 'Gasification (from biomass)'},
      {name: 'Photoelectrochemical'},
      {name: 'Biological methods'},
      {name: 'Thermochemical Water Splitting'},
      {name: 'Dark Fermentation'},
      {name: 'High-Temperature Electrolysis (HTE)'},
    ],
  },
  {
    sectionTitle: 'Fuel Cell Technologies',
    technologies: [
      {name: 'Proton Exchange Membrane Fuel Cell (PEMFC)'},
      {name: 'Solid Oxide Fuel Cell (SOFC)'},
      {name: 'Molten Carbonate Fuel Cell (MCFC)'},
      {name: 'Alkaline Fuel Cell (AFC)'},
      {name: 'Direct Methanol Fuel Cell (DMFC)'},
      {name: 'Phosphoric Acid Fuel Cell (PAFC)'},
      {name: 'Regenerative Fuel Cells'},
      {name: 'Microbial Fuel Cells'},
    ],
  },
  {
    sectionTitle: 'Hydrogen Storage Technologies',
    technologies: [
      {name: 'Compressed Hydrogen'},
      {name: 'Liquid Hydrogen'},
      {name: 'Metal Hydride Storage'},
      {name: 'Chemical Hydride Storage'},
      {name: 'Carbon Nanotube Storage'},
      {
        name: 'Advanced Physical Storage',
        description:
          'This includes innovations in material science that may allow for higher-density storage, such as clathrate hydrates or glass capillary arrays.',
      },
      {
        name: 'Underground Storage',
        description:
          'This involves storing hydrogen in geological formations underground, similar to natural gas storage.',
      },
    ],
  },
  {
    sectionTitle: 'Renewable Energy Technologies',
    technologies: [
      {name: 'Solar Photovoltaic (PV)'},
      {name: 'Concentrated Solar Power (CSP)'},
      {name: 'Wind Turbines'},
      {name: 'Hydropower'},
      {name: 'Geothermal'},
    ],
  },
  {
    sectionTitle: 'Safety and Monitoring Technologies',
    technologies: [
      {name: 'Hydrogen Sensors'},
      {name: 'Leak Detection Systems'},
      {name: 'Pressure Monitoring Systems'},
      {name: 'Temperature Monitoring Systems'},
    ],
  },
  {
    sectionTitle: 'Transport and Distribution Technologies',
    technologies: [
      {name: 'Pipelines'},
      {name: 'Tanker Trucks'},
      {name: 'Rail'},
      {name: 'Ships'},
    ],
  },
  {
    sectionTitle: 'Integration Technologies',
    technologies: [
      {name: 'Power-to-Gas Systems'},
      {name: 'Grid Energy Storage'},
      {name: 'Hybrid Systems', description: '(e.g. coupling with batteries)'},
      {name: 'Coupling with Carbon Capture and Storage'},
    ],
  },
];
