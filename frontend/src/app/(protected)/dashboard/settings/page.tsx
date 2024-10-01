"use client";
import { trpc } from "@/trpc/client";
import {
  Card,
  HStack,
  Heading,
  Spinner,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { InputControl, SubmitButton } from "formik-chakra-ui";

function Settings() {
  const toast = useToast();

  const zerodhaSettingsMutation = trpc.user.zerodhaUpdateSettings.useMutation({
    onSuccess() {
      toast({
        title: "Zerodha settings updated",
        status: "success",
      });
    },
    onError(error) {
      toast({
        title: "Failed to update Zerodha settings",
        status: "error",
      });
    },
  });

  const zerodaSettingsQuery = trpc.user.zerodhaSettings.useQuery();

  return (
    <Stack>
      <Card p={4}>
        <Heading fontSize="2xl" color="gray.600">
          Zerodha Settings
        </Heading>
        {zerodaSettingsQuery.isPending ? (
          <Spinner />
        ) : (
          <Formik
            initialValues={{
              encToken: zerodaSettingsQuery.data?.enc_token || "",
              zerodhaUserId: zerodaSettingsQuery.data?.zerodha_id || "",
            }}
            onSubmit={(values) => {
              zerodhaSettingsMutation.mutate(values);
            }}
          >
            <Form>
              <Stack mt="8">
                <InputControl name="encToken" label="ENC TOKEN" />
                <InputControl name="zerodhaUserId" label="Zerodha User Id" />
                <HStack justify="end">
                  <SubmitButton isLoading={zerodhaSettingsMutation.isPending}>
                    Save
                  </SubmitButton>
                </HStack>
              </Stack>
            </Form>
          </Formik>
        )}
      </Card>
    </Stack>
  );
}
export default Settings;
