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
import {technologies} from '@forms/company/register';

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
