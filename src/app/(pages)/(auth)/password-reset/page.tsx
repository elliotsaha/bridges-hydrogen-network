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
  useToast,
  SimpleGrid,
  Img,
} from '@chakra-ui/react';
import {FiArrowRight, FiAtSign} from 'react-icons/fi';
import {useForm} from 'react-hook-form';
import {ZOD_ERR} from '@constants/error-messages';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {DEFAULT_SERVER_ERR} from '@constants/error-messages';
import {Subheader} from '@components/subheader';
import axios from 'axios';

const schema = z.object({
  email_address: z.string().email(ZOD_ERR.INVALID_EMAIL),
});

type Form = z.infer<typeof schema>;
const Page = () => {
  const statusToast = useToast();
  const onSubmit = async ({email_address}: Form) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_HOSTNAME}/api/auth/password-reset`,
        {
          email_address,
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack
              alignItems="flex-start"
              spacing="19"
              w={{base: '100%', sm: 'max-content'}}
              mx="auto"
            >
              <Heading as="h1" size="2xl">
                Reset your password
              </Heading>
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
        </SimpleGrid>
      </Container>
    </>
  );
};

export default Page;
