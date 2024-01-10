'use client';
import {FormRegistration} from '@types';
import {ZOD_ERR} from '@constants';
import z from 'zod';
import {
  HStack,
  Button,
  Heading,
  Box,
  FormControl,
  VStack,
  Text,
  FormLabel,
  Textarea,
  FormErrorMessage,
  Icon,
} from '@chakra-ui/react';
import React, {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';
import {FiCamera} from 'react-icons/fi';

export const brandDetailsSchema = z.object({
  description: z
    .string()
    .nonempty(ZOD_ERR.REQ_FIELD)
    .max(300, {message: 'Your description is too long'}),
  profile: z.string().nonempty(ZOD_ERR.REQ_FIELD),
});

type Form = z.infer<typeof brandDetailsSchema>;

export const BrandDetails = ({
  formControl,
  formNavigation,
}: FormRegistration<Form>) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');
    reader.onload = () => {
      const binaryStr = reader.result as string;
      formControl.setValue('profile', binaryStr);
    };
    reader.readAsDataURL(file);
  }, []);
  const {getRootProps, getInputProps} = useDropzone({onDrop});
  return (
    <form onSubmit={formNavigation.next}>
      <Box w="100%">
        <VStack align="flex-start" minH="lg">
          <FormControl
            isInvalid={Boolean(formControl.formState.errors.profile)}
          >
            <Heading as="h1">What's your company's brand?</Heading>
            <Text color="gray.500" mt="5">
              Please upload an image and provide a description below
            </Text>
            <Box
              {...getRootProps()}
              w="100"
              border="1px"
              borderColor={
                formControl.formState.errors.profile ? 'red.500' : 'gray.200'
              }
              p={20}
              borderRadius="10"
            >
              <input {...getInputProps()} />
              <VStack>
                <Icon as={FiCamera} color="gray.500" w={20} />
                <Text color="gray.500">
                  Drag 'n' drop some files here, or click to select files
                </Text>
              </VStack>
            </Box>
            <FormErrorMessage>
              {formControl.formState.errors?.profile?.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl
            isInvalid={Boolean(formControl.formState.errors.description)}
          >
            <VStack w="100%" align="flex-start" mb="4" mt="2">
              <FormLabel color="gray.500" htmlFor="description" mb="0">
                Company Description
              </FormLabel>
              <Box w="100%" position="relative">
                <Textarea
                  id="description"
                  w="100%"
                  h="50%"
                  placeholder="e.g. We are a company who excels in the green energy field..."
                  autoComplete="off"
                  disabled={formControl.formState.isSubmitting}
                  size="lg"
                  {...formControl.register('description')}
                />
                <FormErrorMessage>
                  {formControl.formState.errors?.description?.message}
                </FormErrorMessage>
              </Box>
            </VStack>
          </FormControl>
        </VStack>
      </Box>
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
