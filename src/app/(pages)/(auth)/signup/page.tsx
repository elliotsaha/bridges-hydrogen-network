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
import { Subheader } from "@components";
import { Formik, Field } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import z from "zod";
import axios from "axios";

// zod form validation
const formSchema = z
  .object({
    first_name: z.string(),
    last_name: z.string(),
    email_address: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Does not match password field",
    path: ["confirm_password"],
  });

type Form = z.infer<typeof formSchema>;

const Signup = () => {
  const [loading, setLoading] = useState(false);

  const statusToast = useToast();
  const router = useRouter();

  const submitForm = async ({
    first_name,
    last_name,
    email_address,
    password,
  }: Form) => {
    setLoading(true);

    try {
      await axios.post("/api/auth/signup", {
        first_name,
        last_name,
        email_address,
        password,
      });

      window.location.href = "/";
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <>
      <Container maxW="container.xl" py={{ base: "32", lg: "20" }}>
        <Formik
          initialValues={{
            first_name: "",
            last_name: "",
            email_address: "",
            password: "",
            confirm_password: "",
          }}
          validationSchema={toFormikValidationSchema(formSchema)}
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
                  <SimpleGrid
                    w={{ base: "100%", sm: "sm" }}
                    columns={2}
                    spacing="4"
                  >
                    <FormControl
                      isInvalid={!!errors.first_name && touched.first_name}
                    >
                      <Field
                        as={Input}
                        id="first_name"
                        name="first_name"
                        placeholder="First Name"
                        disabled={loading}
                        w="100%"
                        size="lg"
                      />
                      <FormErrorMessage>{errors.first_name}</FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isInvalid={!!errors.last_name && touched.last_name}
                    >
                      <Field
                        as={Input}
                        id="last_name"
                        name="last_name"
                        placeholder="Last Name"
                        disabled={loading}
                        w="100%"
                        size="lg"
                      />
                      <FormErrorMessage>{errors.last_name}</FormErrorMessage>
                    </FormControl>
                  </SimpleGrid>
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
                      w={{ base: "100%", sm: "sm" }}
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
                      w={{ base: "100%", sm: "sm" }}
                      size="lg"
                    />
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>
                  <FormControl
                    isInvalid={
                      !!errors.confirm_password && touched.confirm_password
                    }
                  >
                    <Field
                      as={Input}
                      id="confirm_password"
                      name="confirm_password"
                      type="password"
                      placeholder="Confirm Password"
                      disabled={loading}
                      w={{ base: "100%", sm: "sm" }}
                      size="lg"
                    />
                    <FormErrorMessage>
                      {errors.confirm_password}
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
