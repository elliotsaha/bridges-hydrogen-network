'use client';
import {
  FormControl,
  FormErrorMessage,
  Button,
  VStack,
  Heading,
  FormLabel,
  Box,
  NumberInputField,
  NumberInput,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberIncrementStepper,
  Checkbox,
  Stack,
  HStack,
  Text,
  CheckboxGroup,
} from '@chakra-ui/react';
import {ZOD_ERR} from '@constants';
import {FormRegistration} from '@types';
import z from 'zod';
import {Controller} from 'react-hook-form';
import {AsyncSelect} from 'chakra-react-select';
import axios from 'axios';
import {PlaceAutocompleteResponseData} from '@googlemaps/google-maps-services-js';
import {useEffect} from 'react';
import {operatingRegions} from '@forms/company/register';

export const basicInformationSchema = z
  .object({
    operating_regions: z
      .string()
      .array()
      .nonempty(ZOD_ERR.REQ_FIELD)
      .or(z.boolean()),
    years_in_business: z.string(),
    less_than_2_years: z.boolean(),
    headquarters_location: z
      .object({
        label: z.string().min(1, ZOD_ERR.REQ_FIELD),
        value: z.string().min(1, ZOD_ERR.REQ_FIELD),
      })
      .nullable(),
  })
  .partial()
  .superRefine((data, ctx) => {
    if (!data.less_than_2_years && !data.years_in_business) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['years_in_business'],
        message: ZOD_ERR.REQ_FIELD.message,
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['less_than_2_years'],
        message: ZOD_ERR.REQ_FIELD.message,
      });
    }
    if (!data.headquarters_location) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['headquarters_location'],
        message: ZOD_ERR.REQ_FIELD.message,
      });
    }
    if (!data.operating_regions) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['operating_regions'],
        message: ZOD_ERR.REQ_FIELD.message,
      });
    }
  });

type Form = z.infer<typeof basicInformationSchema>;

export const BasicInformation = ({
  formControl,
  formNavigation,
}: FormRegistration<Form>) => {
  const queryLocation = async (inputValue: string) => {
    const req = await axios.post<PlaceAutocompleteResponseData>(
      `${process.env.NEXT_PUBLIC_HOSTNAME}/api/maps/query/cities`,
      {
        input: inputValue,
      }
    );
    const predictionValues = req.data.predictions.map(i => ({
      label: i.description,
      value: i.place_id,
    }));

    return predictionValues;
  };

  const watched = {
    less_than_2_years: formControl.watch('less_than_2_years'),
    operating_regions: formControl.watch('operating_regions') as string[],
  };

  useEffect(() => {
    if (watched.less_than_2_years) {
      formControl.setValue('years_in_business', '');
    }
  }, [watched.less_than_2_years]);

  return (
    <form onSubmit={formNavigation.next}>
      <Box w="100%">
        <VStack align="flex-start" minH="lg" mb="6">
          <Heading as="h1" mb="2">
            Let&apos;s get to know your company
          </Heading>

          <Stack
            align="flex-start"
            gap="12"
            direction={{base: 'column', lg: 'row'}}
          >
            {/*Headquarters location API*/}
            <Controller
              control={formControl.control}
              name="headquarters_location"
              render={({field}) => (
                <FormControl
                  isInvalid={Boolean(
                    formControl.formState.errors.headquarters_location
                  )}
                >
                  <VStack align="flex-start">
                    <FormLabel
                      color="gray.500"
                      htmlFor="headquarters_location"
                      mb="0"
                    >
                      Headquarters location
                    </FormLabel>
                    <Box w="64" position="relative">
                      <AsyncSelect
                        loadOptions={queryLocation}
                        size="md"
                        isClearable
                        placeholder="Select city..."
                        {...field}
                      />
                      <FormErrorMessage>
                        {
                          formControl.formState.errors?.headquarters_location
                            ?.message
                        }
                      </FormErrorMessage>
                    </Box>
                  </VStack>
                </FormControl>
              )}
            />

            <VStack>
              {/*Years in Business Field*/}
              <FormControl
                isInvalid={
                  Boolean(formControl.formState.errors.less_than_2_years) &&
                  Boolean(formControl.formState.errors.years_in_business)
                }
              >
                <VStack w="100%" align="flex-start">
                  <FormLabel
                    color="gray.500"
                    htmlFor="years_in_business"
                    mb="0"
                  >
                    Years in Business
                  </FormLabel>
                  <Box w="64" position="relative">
                    <Controller
                      name="years_in_business"
                      control={formControl.control}
                      render={({field: {ref, ...restField}}) => (
                        <NumberInput
                          {...restField}
                          precision={0}
                          step={1}
                          min={2}
                          isDisabled={watched.less_than_2_years}
                        >
                          <NumberInputField ref={ref} name={restField.name} />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      )}
                    />
                    <FormErrorMessage>
                      {formControl.formState.errors?.years_in_business?.message}
                    </FormErrorMessage>
                  </Box>
                </VStack>
              </FormControl>

              {/*Less than 2 years checkbox*/}
              <FormControl
                isInvalid={
                  Boolean(formControl.formState.errors.less_than_2_years) &&
                  Boolean(formControl.formState.errors.years_in_business)
                }
              >
                <Checkbox
                  colorScheme="brand"
                  color="gray.600"
                  id="less_than_2_years"
                  {...formControl.register('less_than_2_years')}
                >
                  Less than 2 years
                </Checkbox>
              </FormControl>
            </VStack>
          </Stack>

          {/* Operating Regions */}
          <Heading as="h3" size="md" mt="6">
            Where does your company operate
          </Heading>
          <FormControl
            isInvalid={Boolean(formControl.formState.errors.operating_regions)}
          >
            <Text color="gray.500">
              Select all regions that your company operates in
            </Text>
            <FormErrorMessage>
              {formControl.formState.errors?.operating_regions?.message}
            </FormErrorMessage>
            <VStack align="flex-start" mt="2">
              <CheckboxGroup
                colorScheme="brand"
                value={watched.operating_regions}
              >
                {operatingRegions.map((i, idx) => (
                  <Checkbox
                    key={`${i}-${idx}`}
                    id={`${i}-${idx}`}
                    value={i}
                    {...formControl.register('operating_regions')}
                  >
                    {i}
                  </Checkbox>
                ))}
              </CheckboxGroup>
            </VStack>
          </FormControl>
        </VStack>
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
