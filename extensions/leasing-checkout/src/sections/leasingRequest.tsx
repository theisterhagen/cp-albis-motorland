import {
  BlockLayout,
  Button,
  Checkbox,
  InlineLayout,
  Link,
  Text,
  View,
} from "@shopify/ui-extensions-react/checkout";
import { useEffect, useState } from "react";
import { CompanyForm } from "../components/companyForm";
import { LeasingOverview } from "../components/leasingOverview";
import { ManagerForm } from "../components/managerForm";
import { useLeasingCtx } from "../hooks/useLeasingCtx";
import type { Steps } from "../types";

type LeasingRequestProps = {
  shopDomain: string;
  step: Steps;
  handleStepChange: (step: Steps) => void;
  handleLeasingRequestSubmit: (datenschutz: boolean) => void;
  handleZuruckClick: () => void;
  createAlbisAppResponse: {
    responseSuccess: boolean;
    responseText: string;
  };
};

export const LeasingRequest = ({
  shopDomain,
  step,
  handleStepChange,
  handleLeasingRequestSubmit,
  handleZuruckClick,
  createAlbisAppResponse,
}: LeasingRequestProps) => {
  const { clientFormData, updateDatenschutz } = useLeasingCtx();
  const [error, setError] = useState({
    isError: false,
    msg: "",
  });

  useEffect(() => {
    setTimeout(() => {
      setError({
        isError: false,
        msg: "",
      });
    }, 3000);
  }, [error]);

  const isSendenBtnEnable = () => {
    const isValidAddress = /^(?=.*[A-Za-z])(?=.*\d).+$/.test(
      clientFormData.manager.strasseGF,
    );
    if (!isValidAddress) {
      setError({
        isError: true,
        msg: "Bitte geben Sie eine gültige Adresse ein",
      });
      return;
    }

    const allFieldsFilled = Object.values({
      ...clientFormData.firma,
      ...clientFormData.manager,
    }).every((field) => field.trim() !== "");

    if (!allFieldsFilled || !clientFormData.datenschutz) {
      setError({
        isError: true,
        msg: "Bitte alle Felder ausfüllen",
      });
      return;
    }
    return allFieldsFilled && clientFormData.datenschutz;
  };

  return (
    <BlockLayout rows={["auto", "auto", "auto"]}>
      <LeasingOverview />
      <InlineLayout
        columns={["fill", "fill"]}
        border={"base"}
        borderWidth={"base"}
      >
        <CompanyForm shopDomain={shopDomain} />
        <ManagerForm />
      </InlineLayout>
      <BlockLayout rows={["auto", "auto", "auto"]}>
        {error.isError && (
          <Text appearance="critical">
            {error.msg.substring("server error:".length).trim()}
          </Text>
        )}
        {!createAlbisAppResponse.responseSuccess && (
          <Text appearance="critical">
            {createAlbisAppResponse.responseText}
          </Text>
        )}
        <InlineLayout padding={"extraTight"}>
          <Checkbox
            checked={clientFormData.datenschutz}
            onChange={(value) => updateDatenschutz(value)}
          >
            <Text appearance="info">
              Ich willige ein, dass die ALBIS Leasing Gruppe meine
              personenbezogenen Daten zu Zwecken der Bonitätsprüfung im Rahmen
              der (zumindest teilweise) automatisierten Kreditentscheidung
              verarbeitet. Hierzu können meine personenbezogenen Daten an
              Auskunfteien (Creditreform Hamburg von der Decken & Wall KG,
              Schufa Holding AG, und/oder infoscore Consumer Data GmbH)
              weitergegeben und von diesen verarbeitet werden. Näheres hierzu
              regelt die{" "}
              <Link to="https://www.albis-leasing.de/datenschutz">
                Datenschutzerklärung der ALBIS Leasing Gruppe.
              </Link>
            </Text>
          </Checkbox>
        </InlineLayout>

        <InlineLayout padding={["base", "none"]}>
          <View inlineAlignment={"start"}>
            <Button loading={step === 0} onPress={() => handleZuruckClick()}>
              Zurück
            </Button>
          </View>
          <View inlineAlignment={"end"}>
            <Button
              onPress={async () => {
                if (isSendenBtnEnable()) {
                  handleStepChange(0);
                  await handleLeasingRequestSubmit(clientFormData.datenschutz);
                }
              }}
            >
              Leasingantrag Senden
            </Button>
          </View>
        </InlineLayout>
      </BlockLayout>
    </BlockLayout>
  );
};
