"use client";
import { useState } from "react";
import {
  Box,
  Container,
  VStack,
  Button,
  Link,
  Text,
  Heading,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { supabase } from "../../../db";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    let { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    setEmail("");
    setPassword("");
  };

  return (
    <>
      <Container maxW="container.xl" pt="20">
        <VStack align="flex-start" maxW="md" mx="auto">
          <Heading as="h1" mb="5">
            Sign up
          </Heading>
          <FormControl>
            <VStack spacing="5" align="flex-start">
              <Input
                id="email"
                type="email"
                placeholder="Email Address"
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                id="password"
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button colorScheme="brand" onClick={submit}>
                Continue
              </Button>
            </VStack>
          </FormControl>
        </VStack>
      </Container>
    </>
  );
};

export default Signup;
