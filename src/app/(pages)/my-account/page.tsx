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
} from '@chakra-ui/react';
import {FiArrowRight, FiCheck} from 'react-icons/fi';
import axios from 'axios';
import {useForm} from 'react-hook-form';
import {useState} from 'react';
import z from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {ZOD_ERR} from '@constants/error-messages';

const schema = z.object({
  email_address: z.string().email(ZOD_ERR.INVALID_EMAIL),
  password: z.string().min(1, ZOD_ERR.REQ_FIELD),
});

type Form = z.infer<typeof schema>;

const MyAccount = () => {
  const [submitted, setSubmitted] = useState(false);
  const onSubmit = () => {
    return;
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
                    disabled={isSubmitting || submitted}
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
                    disabled={isSubmitting || submitted}
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
                rightIcon={<Icon as={submitted ? FiCheck : FiArrowRight} />}
                isLoading={isSubmitting}
                isDisabled={submitted}
              >
                {submitted ? 'Sent' : 'Submit'}
              </Button>
            </VStack>
          </form>
        </Box>
      </Container>
    </>
  );
};

export default MyAccount;
