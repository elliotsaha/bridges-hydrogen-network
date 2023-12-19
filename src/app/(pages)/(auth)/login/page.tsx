'use client';
import {useEffect, useState} from 'react';
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
import {Field, Formik} from 'formik';
import {FiArrowRight} from 'react-icons/fi';
import {Subheader} from '@components';
import {useSearchParams} from 'next/navigation';
import {authBroadcast} from '@broadcasts';
import z from 'zod';
import axios from 'axios';
import {toFormikValidationSchema} from 'zod-formik-adapter';

interface FormParams {
  email_address: string;
  password: string;
}

const formSchema = z.object({
  email_address: z.string().email({message: 'Invalid email address'}),
  password: z.string(),
});

const Login = () => {
  const [loading, setLoading] = useState(false);
  const statusToast = useToast();
  const params = useSearchParams();
  const redirectURL = params.get('redirect');
  const confirmationStatus = params.get('confirmation-status');

  useEffect(() => {
    // only render statusToast if param is actually set in url
    if (confirmationStatus) {
      if (confirmationStatus === 'true') {
        statusToast({
          title: 'Email address successfully confirmed',
          status: 'success',
        });
      } else {
        statusToast({
          title: 'Invalid email address confirmation token',
          status: 'error',
        });
      }
    }
  }, [confirmationStatus, statusToast]);

  useEffect(() => {
    if (redirectURL) {
      statusToast({
        title: 'Sign in first',
        description: 'Please sign in before proceeding',
        status: 'info',
      });
    }
  }, [redirectURL, statusToast]);

  const redirect = () => {
    if (redirectURL) {
      // need full page reload to account for auth state change
      window.location.href = redirectURL;
    } else {
      // redirect home if no redirect url is specified
      window.location.href = '/';
    }
  };

  const submitForm = async ({email_address, password}: FormParams) => {
    setLoading(true);

    try {
      await axios.post('/api/auth/login', {
        email_address,
        password,
      });

      authBroadcast.postMessage('reload-auth');
      redirect();
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        statusToast({
          title: e?.response?.data?.message,
          status: 'error',
        });
      }
    }

    setLoading(false);
  };

  return (
    <>
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
              src="/static/images/stock/windmill.jpg"
              alt="Windmill"
              borderRadius="lg"
              width="100%"
              h="2xl"
              objectFit="cover"
              filter="brightness(70%)"
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
              Back to join the fight for clean energy?
            </Heading>
          </Box>
          <Formik
            initialValues={{
              email_address: '',
              password: '',
            }}
            validationSchema={toFormikValidationSchema(formSchema)}
            onSubmit={submitForm}
          >
            {({handleSubmit, errors, touched}) => (
              <form onSubmit={handleSubmit}>
                <VStack
                  align="flex-start"
                  spacing="19"
                  w={{base: '100%', sm: 'max-content'}}
                  mx="auto"
                >
                  <Heading as="h1" size="2xl">
                    Login
                  </Heading>
                  <Subheader mt="-2" mb="1">
                    Welcome Back
                  </Subheader>
                  <FormControl
                    isInvalid={!!errors.email_address && touched.email_address}
                  >
                    <Field
                      as={Input}
                      id="email_address"
                      name="email_address"
                      type="email"
                      placeholder="Email Address"
                      disabled={loading}
                      w={{base: '100%', sm: 'sm'}}
                      size="lg"
                    />
                    <FormErrorMessage>{errors.email_address}</FormErrorMessage>
                  </FormControl>
                  <FormControl
                    isInvalid={!!errors.password && touched.password}
                  >
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Password"
                      disabled={loading}
                      w={{base: '100%', sm: 'sm'}}
                      size="lg"
                    />
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>
                  <Button
                    mt="2"
                    colorScheme="brand"
                    type="submit"
                    isLoading={loading}
                    loadingText="Signing in..."
                    size="lg"
                    rightIcon={<Icon as={FiArrowRight} />}
                  >
                    Continue
                  </Button>
                </VStack>
              </form>
            )}
          </Formik>
        </SimpleGrid>
      </Container>
    </>
  );
};

export default Login;
