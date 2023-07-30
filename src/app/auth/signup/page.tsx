"use client";
import { useState } from "react";
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
} from "@chakra-ui/react";
import { FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { supabase } from "@db/client";
import { Subheader } from "@/components/subheader";
import { Formik, Field } from "formik";
import isEmail from "validator/es/lib/isEmail";

interface FormParams {
  email: string;
  password: string;
  confirmPassword: string;
}

const Signup = () => {
  const [loading, setLoading] = useState(false);

  const statusToast = useToast();
  const router = useRouter();

  const submitForm = async ({ email, password }: FormParams) => {
    setLoading(true);

    let { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      statusToast({
        title: "Account creation failed",
        description: error.message,
        status: "error",
      });
    } else if (data?.user?.identities?.length === 0) {
      statusToast({
        title: "Account creation failed",
        description: "Email Address already in use",
        status: "error",
      });
    } else {
      statusToast({
        title: "Account created",
        description: "Thank you for registering",
        status: "success",
      });
      router.push("/auth/signup/verification-email");
    }

    setLoading(false);
  };

  return (
    <>
      <Container maxW="container.xl" py={{ base: "32", lg: "20" }}>
        <Formik
          initialValues={{
            email: "",
            password: "",
            confirmPassword: "",
          }}
          onSubmit={submitForm}
        >
          {({ values, handleSubmit, errors, touched }) => (
            <SimpleGrid
              columns={{ base: 1, lg: 2 }}
              px="4"
              alignItems="center"
              spacing="16"
            >
              <Box
                w="100%"
                h="100%"
                display={{ base: "none", lg: "block" }}
                position="relative"
              >
                <Img
                  src="/static/images/cliffs.jpg"
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
              <form onSubmit={handleSubmit}>
                <VStack
                  align="flex-start"
                  spacing="19"
                  w={{ base: "100%", sm: "max-content" }}
                  mx="auto"
                >
                  <Heading as="h1" size="2xl">
                    Sign up
                  </Heading>
                  <Subheader mt="-2" mb="1">
                    Register With Bridges
                  </Subheader>
                  <FormControl isInvalid={!!errors.email && touched.email}>
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Email Address"
                      disabled={loading}
                      w={{ base: "100%", sm: "sm" }}
                      size="lg"
                      validate={(value: string) => {
                        let error;

                        if (!isEmail(value)) {
                          error = "Email Address is invalid";
                        }

                        return error;
                      }}
                    />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
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
                      w={{ base: "100%", sm: "sm" }}
                      size="lg"
                      validate={(value: string) => {
                        let error;

                        if (value.length < 8) {
                          error = "Password must be at least 8 characters long";
                        }

                        return error;
                      }}
                    />
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>
                  <FormControl
                    isInvalid={
                      !!errors.confirmPassword && touched.confirmPassword
                    }
                  >
                    <Field
                      as={Input}
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm Password"
                      disabled={loading}
                      w={{ base: "100%", sm: "sm" }}
                      size="lg"
                      validate={(value: string) => {
                        let error;

                        if (value !== values.password) {
                          error = "Passwords do not match";
                        }

                        return error;
                      }}
                    />
                    <FormErrorMessage>
                      {errors.confirmPassword}
                    </FormErrorMessage>
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
            </SimpleGrid>
          )}
        </Formik>
      </Container>
    </>
  );
};

export default Signup;
