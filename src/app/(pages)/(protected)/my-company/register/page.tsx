'use client';
import React, {useEffect, useState} from 'react';
import {FieldValues, useForm, DefaultValues} from 'react-hook-form';
import {Container, Stack, Box, Text, useToast, ToastId} from '@chakra-ui/react';
import {FormRegistration, FormEvent, StepForm} from '@types';
import z, {ZodType} from 'zod';
import stages, {steps} from '../form-stages';
// stepper components & hooks
import {
  useSteps,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepTitle,
  StepDescription,
  StepSeparator,
  StepIcon,
  StepNumber,
} from '@chakra-ui/react';
import {zodResolver} from '@hookform/resolvers/zod';
import axios from 'axios';
import {FormContext} from '@contexts';

const Register = () => {
  // registration consists of a 5 part multi-stage form
  const {activeStep, setActiveStep} = useSteps({index: 0, count: steps.length});
  const [globalFormState, setGlobalFormState] = useState({});
  const [completedForm, setCompletedForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const statusToast = useToast();
  const statusToastRef = React.useRef<ToastId>();

  function mergeWithGlobalForm<T extends FieldValues>(values: T) {
    // shallow merge values to global form state
    setGlobalFormState(prev => Object.assign({}, prev, values));
  }

  // functions reserved for every individual step form
  function nextFormState<T extends FieldValues>(values: T) {
    mergeWithGlobalForm(values);
    setActiveStep(prev => Math.min(prev + 1, steps.length - 1));
  }

  function prevFormState<T extends FieldValues>(values: T) {
    mergeWithGlobalForm(values);
    setActiveStep(prev => Math.max(prev - 1, 0));
  }

  async function onSubmit<T extends FieldValues>(values: T) {
    mergeWithGlobalForm(values);
    setCompletedForm(true);
  }

  useEffect(() => {
    const controller = new AbortController();
    if (completedForm) {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_HOSTNAME}/api/company/create`,
          globalFormState,
          {
            signal: controller.signal,
          }
        )
        .then(() => {
          window.location.href = '/my-company';
          if (statusToastRef.current) {
            statusToast.close(statusToastRef.current);
          }
        })
        .catch(e => console.log(e));
    }
    return () => {
      controller.abort();
    };
  }, [completedForm]);

  function registerForm<T extends FieldValues>(
    schema: ZodType<T>
  ): FormRegistration<T> {
    const formControl = useForm<T>({
      resolver: zodResolver(schema),
      defaultValues: globalFormState as DefaultValues<T>,
    });
    const formNavigation = {
      back: () => formControl.handleSubmit(prevFormState)(),
      next: (e: FormEvent) => {
        e.preventDefault();
        formControl.handleSubmit(nextFormState)();
      },
      submit: () => {
        setSubmitting(true);
        formControl.handleSubmit(onSubmit)();
      },
    };
    return {formControl, formNavigation};
  }

  function renderStage<T extends FieldValues>(stage: StepForm<T>) {
    const stageForm = registerForm(stage.schema);
    React.useEffect(() => {
      stageForm.formControl.reset({...(globalFormState as DefaultValues<T>)}); // set local form to global form values on reset.
    }, [activeStep]);

    // have to pass in global form context because react-hook-form
    // fails to provide isSubmitting state on such a complex multi-step
    // form
    React.useEffect(() => {
      if (submitting && !statusToast.isActive('update-toast')) {
        statusToastRef.current = statusToast({
          title: 'Please be patient while we register your company',
          status: 'info',
          colorScheme: 'brand',
          position: 'bottom',
          isClosable: false,
          id: 'update-toast',
          variant: 'subtle',
        });
      }
    }, [submitting]);
    return (
      <FormContext.Provider value={{submitting}}>
        {React.createElement(stage.component, stageForm)}
      </FormContext.Provider>
    );
  }

  const GlobalFormRender = () => {
    // set non-index step variable
    const currentStep = (activeStep + 1) as keyof typeof stages;
    const stepSchema = stages[currentStep].schema;
    type Form = z.infer<typeof stepSchema>;
    // render form stage with given step
    return renderStage(stages[currentStep] as StepForm<Form>);
  };

  return (
    <Container maxW="container.xl" py={{base: '32', lg: '20'}} px="8">
      <Stack
        spacing={{base: '16', lg: '92'}}
        align={{base: 'center', lg: 'flex-start'}}
        direction={{base: 'column', lg: 'row'}}
      >
        {/* Desktop Stepper */}
        <Stepper
          index={activeStep}
          orientation="vertical"
          h="xl"
          gap="0"
          colorScheme="brand"
          display={{base: 'none', lg: 'flex'}}
        >
          {steps.map((step, index) => (
            <Step key={index}>
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>

              <Box flexShrink="0">
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </Box>

              <StepSeparator />
            </Step>
          ))}
        </Stepper>

        {/* Mobile Stepper */}
        <Stack spacing="4" display={{base: 'flex', lg: 'none'}} w="100%">
          <Stepper size="sm" index={activeStep} gap="0" colorScheme="brand">
            {steps.map((_, index) => (
              <Step key={index}>
                <StepIndicator>
                  <StepStatus complete={<StepIcon />} />
                </StepIndicator>
                <StepSeparator />
              </Step>
            ))}
          </Stepper>
          <Text>
            Step {activeStep + 1}: <b>{steps[activeStep].description}</b>
          </Text>
        </Stack>

        <GlobalFormRender />
      </Stack>
    </Container>
  );
};

export default Register;
