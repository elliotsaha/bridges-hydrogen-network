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
import {marketFocuses} from '@forms/company/register';

export const marketFocusSchema = z
  .object({
    market_focus: z
      .string()
      .array()
      .nonempty(ZOD_ERR.REQ_FIELD)
      .or(z.boolean()),
  })
  .superRefine((data, ctx) => {
    if (!data.market_focus) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['market_focus'],
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
    market_focus: formControl.watch('market_focus') as string[],
  };

  return (
    <form onSubmit={formControl.handleSubmit(formNavigation.submit)}>
      <Box w="100%">
        {/*Market Focus Field*/}
        <FormControl
          isInvalid={Boolean(formControl.formState.errors.market_focus)}
        >
          <VStack align="flex-start" minH="lg">
            <Heading as="h1">
              What market does your company cater towards?
            </Heading>
            <Text color="gray.500">Select all that apply</Text>
            <FormErrorMessage m="0">
              {formControl.formState.errors?.market_focus?.message}
            </FormErrorMessage>
            <Flex flexDir="column" wrap="wrap" h={{base: '100%', lg: 'sm'}}>
              <CheckboxGroup colorScheme="brand" value={watched.market_focus}>
                {marketFocuses.map((i, idx) => (
                  <Checkbox
                    key={`${i}-${idx}`}
                    id={`${i}-${idx}`}
                    value={JSON.stringify(i)}
                    mb="2"
                    mr="12"
                    {...formControl.register('market_focus')}
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
