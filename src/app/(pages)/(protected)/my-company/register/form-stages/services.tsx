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
import {services} from '@forms/company/register';

export const servicesSchema = z
  .object({
    services: z.string().array().nonempty(ZOD_ERR.REQ_FIELD).or(z.boolean()),
  })
  .superRefine((data, ctx) => {
    if (!data.services) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['services'],
        message: ZOD_ERR.REQ_FIELD.message,
      });
    }
  });

type Form = z.infer<typeof servicesSchema>;

export const Services = ({
  formControl,
  formNavigation,
}: FormRegistration<Form>) => {
  const watched = {
    services: formControl.watch('services') as string[],
  };

  return (
    <form onSubmit={formNavigation.next}>
      <Box w="100%">
        {/*Services Field*/}
        <FormControl isInvalid={Boolean(formControl.formState.errors.services)}>
          <VStack align="flex-start" minH="lg">
            <Heading as="h1">What services does your business provide?</Heading>
            <Text color="gray.500">Select all that apply</Text>
            <FormErrorMessage m="0">
              {formControl.formState.errors?.services?.message}
            </FormErrorMessage>
            <Flex flexDir="column" wrap="wrap" h={{base: '100%', lg: 'sm'}}>
              <CheckboxGroup colorScheme="brand" value={watched.services}>
                {services.map((i, idx) => (
                  <Checkbox
                    key={`${i}-${idx}`}
                    id={`${i}-${idx}`}
                    value={JSON.stringify(i)}
                    mb="2"
                    mr="12"
                    {...formControl.register('services')}
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
