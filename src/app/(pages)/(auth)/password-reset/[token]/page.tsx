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
import {FiKey, FiArrowRight} from 'react-icons/fi';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';

const schema = z
  .object({
    new_password: z.string().min(8, {
      message: 'New password must be at least 8 characters long',
    }),
    confirm_password: z.string(),
  })
  .refine(data => data.new_password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

type Form = z.infer<typeof schema>;

const Page = () => {
  const onSubmit = async () => {
    console.log('submitted');
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
              <Heading>Set new password</Heading>
              <FormControl isInvalid={Boolean(errors.new_password)}>
                <Stack>
                  <InputGroup>
                    <InputLeftAddon h="auto">
                      <FiKey />
                    </InputLeftAddon>
                    <Input
                      id="new_password"
                      type="password"
                      placeholder="New Password"
                      disabled={isSubmitting}
                      w={{base: '100%', sm: 'sm'}}
                      size="lg"
                      {...register('new_password')}
                    />
                  </InputGroup>
                </Stack>
                <FormErrorMessage>
                  {errors?.new_password?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={Boolean(errors.confirm_password)}>
                <Stack>
                  <InputGroup>
                    <InputLeftAddon h="auto">
                      <FiKey />
                    </InputLeftAddon>
                    <Input
                      id="confirm_password"
                      type="password"
                      placeholder="Confirm Password"
                      disabled={isSubmitting}
                      w={{base: '100%', sm: 'sm'}}
                      size="lg"
                      {...register('confirm_password')}
                    />
                  </InputGroup>
                </Stack>
                <FormErrorMessage>
                  {errors?.confirm_password?.message}
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
                Set Password
              </Button>
            </VStack>
          </form>
        </Box>
      </Container>
    </>
  );
};

export default Page;
