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
import {typesOfBusinesses} from '@forms/company/register';

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
