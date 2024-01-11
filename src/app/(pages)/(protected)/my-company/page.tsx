'use client';
import React, {useEffect, useState} from 'react';
import {
  useToast,
  SlideFade,
  Modal,
  ModalOverlay,
  ModalFooter,
  Container,
  Text,
  Box,
  Heading,
  Img,
  Flex,
  Divider,
  Button,
  Tooltip,
  useDisclosure,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  UnorderedList,
  ListItem,
  Badge,
  Card,
  CardBody,
  Icon,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  VStack,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Link,
  ToastId,
  useClipboard,
} from '@chakra-ui/react';
import {
  FiMap,
  FiMapPin,
  FiPackage,
  FiTool,
  FiRadio,
  FiAlertCircle,
  FiCopy,
  FiCheck,
  FiArrowRight,
  FiUsers,
  FiTrash,
} from 'react-icons/fi';
import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import {FormOptionData, ViewPartner, ViewCompanyResponse} from '@types';
import {IconType} from 'react-icons';
import {Subheader} from '@components';
import {useSearchParams} from 'next/navigation';
import NextLink from 'next/link';

const MyCompany = () => {
  const statusToast = useToast();
  const searchParams = useSearchParams();
  const statusError = searchParams.get('status');
  const noCompanyError = searchParams.get('no_company');

  const statusToastRef = React.useRef<ToastId>();

  // for delete modal
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();

  // for team modal
  const {
    isOpen: isOpenTeam,
    onOpen: onOpenTeam,
    onClose: onCloseTeam,
  } = useDisclosure();

  const [isDeleting, setIsDeleting] = useState(false);

  const TEAM_LIMIT = 4;
  useEffect(() => {
    if (statusError === 'ERR') {
      if (!statusToast.isActive('status_error')) {
        statusToast({
          id: 'status_error',
          title: 'An unexpected error has occurred',
          status: 'error',
        });
      }
    }
  }, [statusError]);

  useEffect(() => {
    if (noCompanyError === 'true') {
      if (!statusToast.isActive('no_company')) {
        statusToast({
          id: 'no_company',
          title: 'You must register your company before performing this action',
          status: 'error',
        });
      }
    }
  }, [noCompanyError]);

  React.useEffect(() => {
    if (isDeleting && !statusToast.isActive('delete-toast')) {
      statusToastRef.current = statusToast({
        title: 'Please be patient while we delete your company',
        status: 'info',
        colorScheme: 'brand',
        position: 'bottom',
        isClosable: false,
        id: 'delete-toast',
        variant: 'subtle',
      });
    }
  }, [isDeleting]);

  const fetchCompany = async () => {
    const res = await axios.get<ViewCompanyResponse>(
      `${process.env.NEXT_PUBLIC_HOSTNAME}/api/company/view`
    );
    return res.data;
  };

  const {isLoading, isError, data} = useQuery({
    queryKey: ['my-company'],
    queryFn: fetchCompany,
  });

  const {onCopy, hasCopied} = useClipboard(
    data?.company?.team?.map(i => i.email_address).join(', ') || ' '
  );

  const deleteCompany = () => {
    setIsDeleting(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/company/delete`)
      .then(() => {
        window.location.href = '/my-company';
        if (statusToastRef.current) {
          statusToast.close(statusToastRef.current);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <>
      <Container maxW="container.xl" mb="24">
        {/* Loading State */}
        {isLoading && (
          <Container maxW="container.xl">
            <Box mt="14">
              <VStack
                align="flex-start"
                spacing="4"
                w={{base: '100%', lg: '65%'}}
              >
                <SkeletonCircle size="16" mb="2" />
                <Skeleton
                  w={{base: '100%', lg: '50%'}}
                  h="12"
                  borderRadius="lg"
                />
                <SkeletonText
                  borderRadius="lg"
                  noOfLines={2}
                  spacing="4"
                  skeletonHeight="2"
                  mt="4"
                  w={{base: '100%', lg: '60%'}}
                />
                <Skeleton
                  w={{base: '100%', lg: '70%'}}
                  h="36"
                  borderRadius="lg"
                />
                <SkeletonText
                  borderRadius="lg"
                  noOfLines={6}
                  spacing="4"
                  skeletonHeight="2"
                  mt="4"
                  w={{base: '100%', lg: '60%'}}
                />
              </VStack>
            </Box>
          </Container>
        )}

        {/* Error state */}
        {isError && (
          <Container maxW="container.xl" mb="24">
            <VStack mt="8" justifyContent="center" w="100%">
              <Icon as={FiAlertCircle} fontSize="32" color="red.400" />
              <Text color="gray.600" textAlign="center" w="48">
                An unexpected error has occurred
              </Text>
            </VStack>
          </Container>
        )}

        {/* Data State */}
        {data?.status === 'FOUND' && (
          <Container maxW="container.xl">
            <Flex
              flexDirection={{base: 'column', lg: 'row'}}
              alignItems="flex-start"
              gap="12"
              mt="14"
              pb="14"
            >
              <Box w={{base: '100%', lg: '50%'}}>
                <Img
                  src={data.company.profile}
                  maxW={{base: 'auto', sm: '48'}}
                  h="12"
                  mb="2"
                  objectFit="fill"
                />
                <Heading as="h1">{data.company.company_name}</Heading>
                <Text mt="2" color="brand.400" fontWeight="bold">
                  {data.company.type_of_business.map(i => i.name).join(' • ')}
                </Text>
                <Badge
                  mt="3"
                  fontSize="14"
                  whiteSpace="unset"
                  colorScheme={
                    data.company.less_than_2_years ? 'gray' : 'brand'
                  }
                >
                  {data.company.less_than_2_years
                    ? 'Less than 2 years in business'
                    : `${data.company.years_in_business} years in business`}
                </Badge>
                <Divider my="4" />
                <Flex
                  alignItems={{base: 'flex-start', sm: 'center'}}
                  gap="2"
                  color="gray.500"
                  mb="2"
                  flexDirection={{base: 'column', sm: 'row'}}
                >
                  <FiMapPin />
                  <Box
                    display={{base: 'flex', sm: 'inline-block'}}
                    flexDirection="column"
                  >
                    <Text fontWeight="bold" color="gray.500" display="inline">
                      Headquarters Location:{' '}
                    </Text>
                    <Text color="gray.500" display="inline">
                      {data.company.headquarters_location.label}
                    </Text>
                  </Box>
                </Flex>

                <Box display="inline-block">
                  <Flex
                    color="gray.500"
                    flexWrap="wrap"
                    alignItems={{base: 'flex-start', sm: 'center'}}
                    gap="2"
                    flexDirection={{base: 'column', sm: 'row'}}
                    mt={{base: '4', sm: '0'}}
                  >
                    <FiMap />
                    <Text fontWeight="bold" color="gray.500" display="inline">
                      Operating Regions:
                    </Text>
                    {data.company.operating_regions.map((i, idx) => (
                      <Text whiteSpace="nowrap" display="inline">
                        {idx === data.company.operating_regions.length - 1
                          ? i
                          : `${i}, `}
                      </Text>
                    ))}
                  </Flex>
                </Box>
                <Divider my="4" />
                <Text color="gray.600">{data.company.description}</Text>
                <Divider my="4" />

                <Flex flexDirection="column" gap={{base: '4', sm: '1'}}>
                  <PartnersDataLine partners={data.company.partners} />
                  <GenerateDataLine
                    icon={FiRadio}
                    title="Market Focus"
                    arr={data.company.market_focus}
                  />
                  <GenerateDataLine
                    icon={FiPackage}
                    title="Services"
                    arr={data.company.services}
                  />
                  <GenerateDataLine
                    icon={FiTool}
                    title="Technologies"
                    arr={data.company.technologies}
                  />
                </Flex>
              </Box>
              <Flex
                justifyContent={{base: 'flex-start', lg: 'center'}}
                w={{base: '100%', lg: '50%'}}
                mb={{base: '0', lg: '56'}}
              >
                <Flex flexDirection="column">
                  <Box mb="4">
                    <Flex flexDirection="row">
                      <Button
                        size="md"
                        colorScheme="brand"
                        rightIcon={<Icon as={FiArrowRight} />}
                        as={NextLink}
                        href="/my-company/update"
                      >
                        Update Page
                      </Button>
                      <Button
                        size="md"
                        colorScheme="red"
                        rightIcon={<Icon as={FiTrash} />}
                        ml="2"
                        onClick={onOpenDelete}
                        variant="outline"
                      >
                        Delete Company
                      </Button>
                    </Flex>
                  </Box>
                  <Modal isOpen={isOpenDelete} onClose={onCloseDelete}>
                    <ModalOverlay />
                    <ModalContent textAlign="center">
                      <ModalCloseButton />
                      <Flex
                        position="relative"
                        justifyContent="center"
                        alignItems="center"
                        mt="12"
                      >
                        <Box
                          w="12"
                          h="12"
                          position="absolute"
                          bg="red.500"
                          borderRadius="full"
                        />
                        <Icon
                          as={FiTrash}
                          fontSize="24"
                          color="white"
                          zIndex={2}
                        />
                      </Flex>

                      <ModalHeader fontSize="24">Are you sure?</ModalHeader>
                      <ModalBody color="gray.500">
                        This action cannot be undone and will notify everyone on
                        your team and permenantly remove all partnerships you
                        have with other companies.
                      </ModalBody>

                      <ModalFooter mb="8">
                        <Flex
                          justifyContent="center"
                          alignItems="center"
                          w="100%"
                        >
                          <Button
                            size="md"
                            colorScheme="gray"
                            ml="2"
                            onClick={onCloseDelete}
                            disabled={isDeleting}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="md"
                            colorScheme="red"
                            ml="2"
                            variant="outline"
                            onClick={deleteCompany}
                            loadingText="Deleting Company"
                            isLoading={isDeleting}
                          >
                            Delete Company
                          </Button>
                        </Flex>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                  <Card variant="outline" p="3" maxW="lg">
                    <CardBody>
                      <Heading size="md" mb="2">
                        Your team
                      </Heading>
                      <Button
                        size="xs"
                        colorScheme="brand"
                        variant="outline"
                        leftIcon={<Icon as={hasCopied ? FiCheck : FiCopy} />}
                        mb="4"
                        onClick={onCopy}
                      >
                        {hasCopied ? 'Copied' : 'Copy all emails'}
                      </Button>
                      <TableContainer>
                        <Table variant="striped" size="sm">
                          <Thead>
                            <Tr>
                              <Th>Role</Th>
                              <Th>Email</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {data.company.team.slice(0, TEAM_LIMIT).map(i => (
                              <Tr>
                                <Td>{i.role}</Td>
                                <Td>{i.email_address}</Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                      {data.company.team.length - TEAM_LIMIT > 0 && (
                        <>
                          <Button
                            variant="outline"
                            colorScheme="blue"
                            size="xs"
                            mt="4"
                            leftIcon={<Icon as={FiUsers} />}
                            onClick={onOpenTeam}
                          >
                            View {data.company.team.length - TEAM_LIMIT} more
                          </Button>
                          <Modal
                            isOpen={isOpenTeam}
                            onClose={onCloseTeam}
                            scrollBehavior="inside"
                          >
                            <ModalOverlay />
                            <ModalContent>
                              <ModalHeader display="flex" alignItems="center">
                                All team members
                              </ModalHeader>
                              <ModalCloseButton />
                              <ModalBody>
                                <TableContainer>
                                  <Table variant="striped" size="sm">
                                    <Thead>
                                      <Tr>
                                        <Th>Role</Th>
                                        <Th>Email</Th>
                                      </Tr>
                                    </Thead>
                                    <Tbody>
                                      {data.company.team.map(i => (
                                        <Tr>
                                          <Td>{i.role}</Td>
                                          <Td>{i.email_address}</Td>
                                        </Tr>
                                      ))}
                                    </Tbody>
                                  </Table>
                                </TableContainer>
                              </ModalBody>
                            </ModalContent>
                          </Modal>
                        </>
                      )}
                    </CardBody>
                  </Card>
                </Flex>
              </Flex>
            </Flex>
          </Container>
        )}

        {/* No company found state */}
        {data?.status === 'NOT_FOUND' && (
          <Container maxW="container.xl" mb="24">
            <SlideFade in={!isLoading} offsetY="24">
              <VStack px="4" align="center" mt="24">
                <Heading as="h1" mx="center" textAlign="center">
                  Register your company
                </Heading>
                <Subheader textAlign="center" mb="1">
                  List your company on bridges
                </Subheader>
                <Text maxW="md" textAlign="center" color="gray.700">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Atque. Lorem ipsum dolor sit amet.
                </Text>
                <Button
                  mt="3"
                  colorScheme="brand"
                  size="lg"
                  as={NextLink}
                  href="/my-company/register"
                >
                  Get Started
                </Button>
              </VStack>
            </SlideFade>
          </Container>
        )}
      </Container>
    </>
  );
};

interface DataLine {
  icon: IconType;
  title: string;
  arr: Array<FormOptionData>;
}

const GenerateDataLine = ({icon, title, arr}: DataLine) => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const CUTOFF = 2;
  return (
    <>
      <Flex
        alignItems="flex-start"
        gap="1"
        color="gray.500"
        my="2"
        flexDirection="column"
      >
        <Flex alignItems="center" gap="2" mr="-1">
          {React.createElement(icon)}
          <Text fontWeight="bold" color="gray.500" display="inline">
            {title}:
          </Text>
        </Flex>
        <Box
          color="gray.500"
          display={{base: 'flex', sm: 'inline-block'}}
          flexDirection={{base: 'column', sm: 'row'}}
        >
          {arr.length > CUTOFF ? (
            <Box
              display={{base: 'flex', sm: 'block'}}
              flexDirection="column"
              alignItems="flex-start"
              gap="2"
            >
              {arr.slice(0, CUTOFF).map(i =>
                i.description ? (
                  <Tooltip label={i.description} borderRadius="lg" p="3">
                    <Text
                      display={{base: 'block', sm: 'inline'}}
                    >{`${i.name}, `}</Text>
                  </Tooltip>
                ) : (
                  <Text
                    display={{base: 'block', sm: 'inline'}}
                  >{`${i.name}, `}</Text>
                )
              )}
              <Button variant="link" colorScheme="blue" onClick={onOpen}>
                View {arr.length - CUTOFF} more
              </Button>
            </Box>
          ) : (
            <Box
              display={{base: 'flex', sm: 'block'}}
              flexDirection="column"
              alignItems="flex-start"
              gap="2"
            >
              {arr.map((i, idx) =>
                i.description ? (
                  <Tooltip label={i.description} borderRadius="lg" p="3">
                    <Text display={{base: 'block', sm: 'inline'}}>
                      {idx === arr.length - 1 ? i.name : `${i.name}, `}
                    </Text>
                  </Tooltip>
                ) : (
                  <Text display={{base: 'block', sm: 'inline'}}>
                    {idx === arr.length - 1 ? i.name : `${i.name}, `}
                  </Text>
                )
              )}
            </Box>
          )}
        </Box>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display="flex" alignItems="center" gap="2">
            {React.createElement(icon, {fontSize: '18'})}
            {title}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <UnorderedList listStyleType="none" m="0" p="0">
              {arr.map((i, idx) => (
                <>
                  {i.description ? (
                    <Tooltip
                      label={i.description}
                      borderRadius="lg"
                      p="3"
                      placement="left"
                    >
                      <ListItem my="2">{i.name}</ListItem>
                    </Tooltip>
                  ) : (
                    <ListItem my="2">{i.name}</ListItem>
                  )}
                  {idx !== arr.length - 1 && <Divider />}
                </>
              ))}
            </UnorderedList>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const PartnersDataLine = ({partners}: {partners: Array<ViewPartner>}) => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const CUTOFF = 2;

  if (partners.length === 0) return <></>;

  return (
    <>
      <Flex
        alignItems="flex-start"
        gap="1"
        color="gray.500"
        my="2"
        flexDirection="column"
      >
        <Flex alignItems="center" gap="2" mr="-1">
          <FiUsers />
          <Text fontWeight="bold" color="gray.500" display="inline">
            Partners:
          </Text>
        </Flex>
        <Box
          color="gray.500"
          display={{base: 'flex', sm: 'inline-block'}}
          flexDirection={{base: 'column', sm: 'row'}}
        >
          {partners.length > CUTOFF ? (
            <Box
              display={{base: 'flex', sm: 'block'}}
              flexDirection="column"
              alignItems="flex-start"
              gap="2"
            >
              {partners.slice(0, CUTOFF).map(i => (
                <Link
                  as={NextLink}
                  href={`/company/detail/${i._id}`}
                  _hover={{textDecoration: 'none'}}
                >
                  <Text
                    display={{base: 'block', sm: 'inline'}}
                    textDecoration="none"
                    color="brand.300"
                    fontWeight="medium"
                    _hover={{color: 'brand.600'}}
                  >
                    {`${i.company_name}, `}
                  </Text>
                </Link>
              ))}
              <Button variant="link" colorScheme="blue" onClick={onOpen}>
                View {partners.length - CUTOFF} more
              </Button>
            </Box>
          ) : (
            <Box
              display={{base: 'flex', sm: 'block'}}
              flexDirection="column"
              alignItems="flex-start"
              gap="2"
            >
              {partners.map((i, idx) => (
                <Link
                  as={NextLink}
                  href={`/company/detail/${i._id}`}
                  _hover={{textDecoration: 'none'}}
                >
                  <Text
                    display={{base: 'block', sm: 'inline'}}
                    textDecoration="none"
                    color="brand.300"
                    fontWeight="medium"
                    _hover={{color: 'brand.600'}}
                  >
                    {idx === partners.length - 1
                      ? i.company_name
                      : `${i.company_name}, `}
                  </Text>
                </Link>
              ))}
            </Box>
          )}
        </Box>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display="flex" alignItems="center" gap="2">
            <FiUsers fontSize="18" />
            Partners
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <UnorderedList listStyleType="none" m="0" p="0">
              {partners.map((i, idx) => (
                <>
                  <ListItem my="2">
                    <Link
                      as={NextLink}
                      href={`/company/detail/${i._id}`}
                      _hover={{textDecoration: 'none'}}
                    >
                      <Text
                        textDecoration="none"
                        color="brand.300"
                        fontWeight="medium"
                        _hover={{color: 'brand.600'}}
                      >
                        {i.company_name}
                      </Text>
                      <Text color="gray.500">
                        {i.operating_regions.length} Operating regions
                      </Text>
                    </Link>
                  </ListItem>
                  {idx !== partners.length - 1 && <Divider />}
                </>
              ))}
            </UnorderedList>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MyCompany;
