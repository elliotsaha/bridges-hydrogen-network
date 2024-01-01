'use client';

import {
  Container,
  Box,
  VStack,
  Heading,
  Text,
  FormControl,
  Stack,
  Input,
  FormErrorMessage,
  Button,
  Icon,
  useToast,
} from '@chakra-ui/react';
import {FiArrowRight, FiCheck} from 'react-icons/fi';
import axios from 'axios';
import {useForm} from 'react-hook-form';
import {useState} from 'react';
import z from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {ZOD_ERR} from '@constants/error-messages';
import {DEFAULT_SERVER_ERR} from '@constants/error-messages';

const schema = z.object({
  email_address: z.string().email(ZOD_ERR.INVALID_EMAIL),
  password: z.string().min(1, ZOD_ERR.REQ_FIELD),
});

type Form = z.infer<typeof schema>;

const MyAccount = () => {
  const statusToast = useToast();
  const onSubmit = async ({email_address, password}: Form) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_HOSTNAME}/api/auth/email-reset`,
        {
          email_address,
          password,
        }
      );

      if (res.data) {
        statusToast({
          title: res.data.message,
          status: 'success',
        });
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        statusToast({
          title: e?.response?.data?.message || DEFAULT_SERVER_ERR,
          status: 'error',
        });
      }
    }
  };

  const {
    handleSubmit,
    register,
    formState: {errors, isSubmitting},
  } = useForm<Form>({resolver: zodResolver(schema)});
  return (
    <>
      <Container maxW="container.xl" py={{base: '32', lg: '20'}}>
        <Box w="100%" h="100%" px="4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack
              alignItems="flex-start"
              spacing="19"
              w={{base: '100%', sm: 'max-content'}}
              mx="auto"
            >
              <Heading as="h1" size="2xl">
                Reset email
              </Heading>
              <Text w={{base: '100%', sm: 'sm'}} color="gray.500">
                We will send a confirmation link to your new email address to
                change your account email.
              </Text>
              <FormControl isInvalid={Boolean(errors.email_address)}>
                <Stack>
                  <Input
                    id="email_address"
                    type="email"
                    placeholder="New Email Address"
                    disabled={isSubmitting}
                    w={{base: '100%', sm: 'sm'}}
                    size="lg"
                    {...register('email_address')}
                  />
                </Stack>
                <FormErrorMessage>
                  {errors?.email_address?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={Boolean(errors.password)}>
                <Stack>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Reconfirm Your Password"
                    disabled={isSubmitting}
                    w={{base: '100%', sm: 'sm'}}
                    size="lg"
                    {...register('password')}
                  />
                </Stack>
                <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
              </FormControl>
              <Button
                mt="2"
                colorScheme="brand"
                type="submit"
                loadingText="Submitting..."
                size="lg"
                rightIcon={<Icon as={FiArrowRight} />}
                isLoading={isSubmitting}
              >
                Submit
              </Button>
            </VStack>
          </form>
        </Box>
      </Container>
    </>
  );
};

export default MyAccount;
