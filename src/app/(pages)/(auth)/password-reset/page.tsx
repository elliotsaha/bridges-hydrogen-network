'use client';

import {
  VStack,
  Heading,
  FormControl,
  FormErrorMessage,
  InputGroup,
  InputLeftAddon,
  Input,
  Stack,
  Container,
  Box,
  Button,
  Icon,
} from '@chakra-ui/react';
import {FiArrowRight, FiAtSign} from 'react-icons/fi';
import {useForm} from 'react-hook-form';
import {ZOD_ERR} from '@constants/error-messages';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {useState} from 'react';
import {Subheader} from '@components/subheader';
import axios from 'axios';

const schema = z.object({
  email_address: z.string().email(ZOD_ERR.INVALID_EMAIL),
});

type Form = z.infer<typeof schema>;

const Page = () => {
  const [status, setStatus] = useState('');

  const onSubmit = async ({email_address}: Form) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_HOSTNAME}/api/auth/password-reset`,
        {
          email_address,
        }
      );
      setStatus(res.data);
    } catch (e) {
      setStatus('An unexpected error occured');
    }
  };

  const {
    handleSubmit,
    register,
    formState: {errors, isSubmitting},
  } = useForm<Form>({resolver: zodResolver(schema)});
  return (
    <>
      <Container maxW="container.xl">
        <Box w="100%" h="100%" my="48">
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack alignItems="flex-start" spacing="5">
              <Heading>Reset your password</Heading>
              <FormControl isInvalid={Boolean(errors.email_address)}>
                <Stack>
                  <InputGroup>
                    <InputLeftAddon h="auto">
                      <FiAtSign />
                    </InputLeftAddon>
                    <Input
                      id="email_address"
                      type="email"
                      placeholder="Email Address"
                      disabled={isSubmitting}
                      w={{base: '100%', sm: 'sm'}}
                      size="lg"
                      {...register('email_address')}
                    />
                  </InputGroup>
                </Stack>
                <FormErrorMessage>
                  {errors?.email_address?.message}
                </FormErrorMessage>
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
                Get Reset Link
              </Button>
              <Subheader>{status}</Subheader>
            </VStack>
          </form>
        </Box>
      </Container>
    </>
  );
};

export default Page;
