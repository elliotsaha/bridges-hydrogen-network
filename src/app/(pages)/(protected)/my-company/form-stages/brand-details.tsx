'use client';
import {FormRegistration} from '@types';
import {ZOD_ERR} from '@constants';
import z from 'zod';
import {
  Input,
  HStack,
  Spinner,
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
  Image,
} from '@chakra-ui/react';
import React, {useCallback} from 'react';
import {FileRejection, useDropzone} from 'react-dropzone';
import {FiCamera} from 'react-icons/fi';
import {MAX_COMPANY_DESCRIPTION_LEN} from '@constants';
import {useState} from 'react';

export const brandDetailsSchema = z.object({
  company_name: z.string().min(1, ZOD_ERR.REQ_FIELD),
  description: z
    .string()
    .min(1, ZOD_ERR.REQ_FIELD)
    .max(300, {message: 'Your description is too long'}),
  profile: z.string().min(1, ZOD_ERR.REQ_FIELD),
});

type Form = z.infer<typeof brandDetailsSchema>;

export const BrandDetails = ({
  formControl,
  formNavigation,
}: FormRegistration<Form>) => {
  const MAX_IMG_SIZE: number = 1024 ** 2 * 2;
  const [dropzoneError, setDropzoneError] = useState<string | boolean>(false);
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (acceptedFiles.length !== 0) {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onabort = () => console.error('file reading was aborted');
        reader.onerror = () => console.error('file reading has failed');
        reader.onload = () => {
          const binaryStr = reader.result as string;
          formControl.setValue('profile', binaryStr);
          formControl.clearErrors('profile');
          setDropzoneError(false);
        };
        reader.readAsDataURL(file);
      }
      if (rejectedFiles.length !== 0) {
        const fileError = rejectedFiles[0];
        setDropzoneError(fileError.errors[0].code);
      }
    },
    []
  );

  const {getRootProps, getInputProps} = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/jpg': [],
      'image/svg+xml': [],
    },
    maxSize: MAX_IMG_SIZE,
    disabled: formControl.formState.disabled,
  });

  const watched = formControl.watch();
  return (
    <form onSubmit={formNavigation.next}>
      <Box w="100%">
        <VStack align="flex-start" minH="lg">
          <Heading as="h1">What's your company's brand?</Heading>

          {/*Company Name Field*/}
          <FormControl
            isInvalid={Boolean(formControl.formState.errors.company_name)}
          >
            <VStack w="100%" align="flex-start" mt="2" mb="3">
              <FormLabel color="gray.500" htmlFor="company_name" mb="0">
                Company name
              </FormLabel>
              <Box w="64" position="relative">
                <Input
                  id="company_name"
                  w="64"
                  placeholder="e.g. Acme Corporation"
                  autoComplete="off"
                  isDisabled={formControl.formState.isSubmitting}
                  size="md"
                  {...formControl.register('company_name')}
                />
                <FormErrorMessage>
                  {formControl.formState.errors?.company_name?.message}
                </FormErrorMessage>
              </Box>
            </VStack>
          </FormControl>

          <FormControl
            isInvalid={Boolean(formControl.formState.errors.profile)}
          >
            <Box mb="3">
              <Text color="gray.500" fontWeight="medium">
                Company logo
              </Text>
              {dropzoneError === 'file-invalid-type' && (
                <Text color="red.500" fontSize="sm">
                  Image must be of either SVG, JPG, JPEG, or PNG format.
                </Text>
              )}
              {dropzoneError === 'file-too-large' && (
                <Text color="red.500" fontSize="sm">
                  Image must be less than 2 MB in size.
                </Text>
              )}
            </Box>
            <Box
              {...getRootProps()}
              w="100"
              borderWidth={formControl.formState.errors.profile ? 2 : 'thin'}
              borderColor={
                formControl.formState.errors.profile ? 'red.500' : 'gray.200'
              }
              p={20}
              borderRadius="10"
            >
              <input
                {...getInputProps()}
                accept="image/png, image/jpeg, image/jpg"
              />
              <VStack>
                {watched.profile ? (
                  <Image
                    src={watched.profile}
                    w="auto"
                    maxW="48"
                    h="12"
                    objectFit="fill"
                    borderRadius="md"
                  />
                ) : formControl.formState.disabled ? (
                  <Spinner />
                ) : (
                  <Icon as={FiCamera} color="gray.500" fontSize="24" />
                )}
                <Text color="gray.500" textAlign="center">
                  {formControl.formState.disabled
                    ? 'Loading set company logo'
                    : "Drag 'n' drop your logo here, or click to select a file"}
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
                Company description
              </FormLabel>
              <Box w="100%" position="relative">
                <Textarea
                  id="description"
                  w="100%"
                  h="36"
                  placeholder="e.g. We are a company who excels in the green energy field..."
                  autoComplete="off"
                  disabled={formControl.formState.isSubmitting}
                  size="md"
                  {...formControl.register('description')}
                />
                {formControl.formState.errors?.description ? (
                  <FormErrorMessage>
                    {formControl.formState.errors?.description?.message}
                  </FormErrorMessage>
                ) : (
                  <Text
                    color={
                      watched?.description?.length > MAX_COMPANY_DESCRIPTION_LEN
                        ? 'red.500'
                        : 'gray.500'
                    }
                    fontSize="sm"
                    mt="2"
                  >
                    {watched.description
                      ? `${
                          MAX_COMPANY_DESCRIPTION_LEN -
                          watched.description.length
                        } characters remaining`
                      : `${MAX_COMPANY_DESCRIPTION_LEN} characters remaining`}
                  </Text>
                )}
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
        <Button type="button" onClick={formNavigation.back} isDisabled>
          Back
        </Button>
        <Button type="submit" colorScheme="brand">
          Next
        </Button>
      </HStack>
    </form>
  );
};
