'use client';
import {
  Container,
  VStack,
  Button,
  Heading,
  Input,
  useToast,
  SimpleGrid,
  Icon,
  Img,
  Box,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';
import {FiArrowRight} from 'react-icons/fi';
import {Subheader} from '@components';
import {useForm} from 'react-hook-form';
import z from 'zod';
import axios from 'axios';
import {zodResolver} from '@hookform/resolvers/zod';
import {DEFAULT_SERVER_ERR, ZOD_ERR} from '@constants';

const schema = z
  .object({
    first_name: z.string().min(1, ZOD_ERR.REQ_FIELD),
    last_name: z.string().min(1, ZOD_ERR.REQ_FIELD),
    email_address: z.string().email(ZOD_ERR.INVALID_EMAIL),
    password: z
      .string()
      .min(8, {message: 'Password must be at least 8 characters'})
      .max(256, {message: 'Password must be less than 256 characters'}),
    confirm_password: z.string().min(1, ZOD_ERR.REQ_FIELD),
    role: z.string().min(1, ZOD_ERR.INVALID_EMAIL).max(20, {
      message: 'Your input should be less than 20 characters',
    }),
  })
  .refine(data => data.password === data.confirm_password, {
    message: 'Does not match password field',
    path: ['confirm_password'],
  });

type Form = z.infer<typeof schema>;

const Signup = () => {
  const statusToast = useToast();

  const {
    handleSubmit,
    register,
    formState: {errors, isSubmitting},
  } = useForm<Form>({resolver: zodResolver(schema)});

  const onSubmit = async ({
    first_name,
    last_name,
    email_address,
    password,
    role,
  }: Form) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/auth/signup`, {
        first_name,
        last_name,
        email_address,
        password,
        role,
      });

      window.location.href = '/signup/verify-email';
    } catch (e) {
      if (axios.isAxiosError(e)) {
        statusToast({
          title: e?.response?.data?.message || DEFAULT_SERVER_ERR,
          status: 'error',
        });
      }
    }
  };

  return (
    <Container maxW="container.xl" py={{base: '32', lg: '20'}}>
      <SimpleGrid
        columns={{base: 1, lg: 2}}
        px="4"
        alignItems="center"
        spacing="16"
      >
        <Box
          w="100%"
          h="100%"
          display={{base: 'none', lg: 'block'}}
          position="relative"
        >
          <Img
            src="/static/images/stock/cliffs.jpg"
            alt="Nature"
            borderRadius="lg"
            width="100%"
            h="2xl"
            objectFit="cover"
            filter="brightness(50%)"
          />
          <Heading
            as="h3"
            size="xl"
            position="absolute"
            zIndex="2"
            top="8"
            left="8"
            mr="20"
            color="white"
          >
            Join us in the fight for achieving net zero
          </Heading>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack
            align="flex-start"
            spacing="19"
            w={{base: '100%', sm: 'max-content'}}
            mx="auto"
          >
            <Heading as="h1" size="2xl">
              Sign up
            </Heading>
            <Subheader mt="-2" mb="1">
              Register With Bridges
            </Subheader>
            <SimpleGrid w={{base: '100%', sm: 'sm'}} columns={2} spacing="4">
              <FormControl isInvalid={Boolean(errors.first_name)}>
                <Input
                  id="first_name"
                  placeholder="First Name"
                  disabled={isSubmitting}
                  w="100%"
                  size="lg"
                  {...register('first_name')}
                />
                <FormErrorMessage>
                  {errors?.first_name?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={Boolean(errors.last_name)}>
                <Input
                  id="last_name"
                  placeholder="Last Name"
                  disabled={isSubmitting}
                  w="100%"
                  size="lg"
                  {...register('last_name')}
                />
                <FormErrorMessage>
                  {errors?.last_name?.message}
                </FormErrorMessage>
              </FormControl>
            </SimpleGrid>
            <FormControl isInvalid={Boolean(errors.role)}>
              <Input
                id="role"
                placeholder="Role in company (e.g. Web Developer)"
                disabled={isSubmitting}
                w={{base: '100%', sm: 'sm'}}
                size="lg"
                {...register('role')}
              />
              <FormErrorMessage>{errors?.role?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={Boolean(errors.email_address)}>
              <Input
                id="email_address"
                type="email"
                placeholder="Email Address"
                disabled={isSubmitting}
                w={{base: '100%', sm: 'sm'}}
                size="lg"
                {...register('email_address')}
              />
              <FormErrorMessage>
                {errors?.email_address?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={Boolean(errors.password)}>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                disabled={isSubmitting}
                w={{base: '100%', sm: 'sm'}}
                size="lg"
                {...register('password')}
              />
              <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={Boolean(errors.password)}>
              <Input
                id="confirm_password"
                type="password"
                placeholder="Confirm Password"
                disabled={isSubmitting}
                w={{base: '100%', sm: 'sm'}}
                size="lg"
                {...register('confirm_password')}
              />
              <FormErrorMessage>
                {errors?.confirm_password?.message}
              </FormErrorMessage>
            </FormControl>
            <Button
              mt="2"
              colorScheme="brand"
              type="submit"
              isLoading={isSubmitting}
              loadingText="Signing up..."
              size="lg"
              rightIcon={<Icon as={FiArrowRight} />}
            >
              Continue
            </Button>
          </VStack>
        </form>
      </SimpleGrid>
    </Container>
  );
};

export default Signup;
