'use client';

import {
  Container,
  VStack,
  Button,
  Heading,
  Input,
  SimpleGrid,
  Img,
  Box,
  FormControl,
  FormErrorMessage,
  Stack,
  InputLeftAddon,
  InputGroup,
  Icon,
  useToast,
} from '@chakra-ui/react';
import {FiAtSign, FiUser, FiSend, FiArrowRight} from 'react-icons/fi';
import {Subheader} from '@components/subheader';
import {z} from 'zod';
import {ZOD_ERR, DEFAULT_SERVER_ERR} from '@constants/error-messages';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import axios from 'axios';

const schema = z.object({
  name: z.string().min(1, ZOD_ERR.REQ_FIELD),
  email_address: z.string().email(ZOD_ERR.INVALID_EMAIL),
  message: z.string().min(1, ZOD_ERR.REQ_FIELD),
});

type Form = z.infer<typeof schema>;

const Contact = () => {
  const statusToast = useToast();
  const {
    handleSubmit,
    register,
    formState: {errors, isSubmitting},
  } = useForm<Form>({resolver: zodResolver(schema)});

  const onSubmit = async ({name, email_address, message}: Form) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_HOSTNAME}/api/contact`,
        {
          name,
          email_address,
          message,
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
            src="/static/images/stock/solarpanel.jpg"
            alt="Solar Panel"
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
            Let us know what our services could do better.
          </Heading>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack
            align="flex-start"
            w={{base: '100%', sm: 'max-content'}}
            spacing="19"
            mx="auto"
          >
            <Heading as="h1" size="2xl">
              Contact Us
            </Heading>
            <Subheader mt="-2" mb="1">
              Got any questions?
            </Subheader>
            <FormControl isInvalid={Boolean(errors.name)}>
              <Stack spacing={4}>
                <InputGroup>
                  <InputLeftAddon h="auto">
                    <Icon as={FiUser} />
                  </InputLeftAddon>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your Name"
                    disabled={isSubmitting}
                    w={{base: '100%', sm: 'sm'}}
                    size="lg"
                    {...register('name')}
                  />
                </InputGroup>
              </Stack>
              <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={Boolean(errors.email_address)}>
              <Stack spacing={4}>
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
            <FormControl isInvalid={Boolean(errors.message)}>
              <Stack spacing={4}>
                <InputGroup>
                  <InputLeftAddon h="auto">
                    <FiSend />
                  </InputLeftAddon>
                  <Input
                    id="message"
                    type="text"
                    placeholder="Message"
                    disabled={isSubmitting}
                    w={{base: '100%', sm: 'sm'}}
                    size="lg"
                    {...register('message')}
                  />
                </InputGroup>
              </Stack>
              <FormErrorMessage>{errors?.message?.message}</FormErrorMessage>
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
              Send Message
            </Button>
          </VStack>
        </form>
      </SimpleGrid>
    </Container>
  );
};

export default Contact;
