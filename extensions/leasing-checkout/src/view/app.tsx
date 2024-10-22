import {
  Banner,
  BlockLayout,
  BlockSpacer,
  Button,
  Image,
  InlineLayout,
  Modal,
  Spinner,
  Text,
  useApi,
  useCartLines,
  useEmail,
  useShippingAddress,
  useTotalAmount,
} from "@shopify/ui-extensions-react/checkout";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLeasingCtx } from "../hooks/useLeasingCtx";
import { LeasingRequest } from "../sections/leasingRequest";
import { LeasingSelection } from "../sections/leasingSelection";
import type { CalcData, Steps } from "../types";
import type {
  GetZahlungsweisen,
  JsonRpcErrorResponse,
  LeasingRate,
  Rate,
} from "../types/albisMethods";
import type { DraftOrderInput } from "../types/draftOrder";
import type { PluginConfig } from "../types/pluginConfig";
import type {
  AlbisDraftOrderResponse,
  CreateLeasingApplication,
} from "../types/shopifyResponse";
import { createAlbisApplication } from "../utils/createAlbisApplication";
import {
  createAlbisDraftOrder,
  type CreateAlbisDraftOrderProps,
} from "../utils/createAlbisDraftOrder";
import { createAntragsDatenObj } from "../utils/createAntragsDatenObj";
import { createDraftOrderObj } from "../utils/createDraftOrderObj";
import {
  formatToNetValue,
  isJsonRpcErrorResponse,
} from "../utils/formatValues";
import { getAlbisMethodsData } from "../utils/getAlbisMethodsData";
// import { clearCartData } from "../utils/shopifyAjaxApi";

type AppProps = {
  pluginConfData: PluginConfig;
  shopId: string;
};

export function App({ pluginConfData, shopId }: AppProps) {
  const { shop, cost } = useApi();
  const email = useEmail();
  const checkoutCartLines = useCartLines();
  const { amount } = useTotalAmount();

  const {
    calcFormData,
    updateCalcFormData,
    clientFormData,
    leasingData,
    updateLeasingRate,
    updateLeasingSelectedOpt,
    updateManagerData,
    updateFirmaData,
  } = useLeasingCtx();
  const [leasingBtnClicked, setLeasingBtnClicked] = useState(false);
  const { city, address1, zip, lastName, firstName, phone } =
    useShippingAddress();
  const [createAlbisApp, setCreateAlbisApp] = useState({
    responseSuccess: false,
    responseText: "",
  });
  const [step, setStep] = useState<Steps>(1);
  const [draftOrderData, setDraftOrderData] = useState({
    id: "",
    name: "",
  });
  const [leasingLoading, setLeasingLoading] = useState(false);
  // const [errorMsg, setErrorMsg] = useState("");
  const [zahlungsweisen, setZahlungsweisen] = useState<
    GetZahlungsweisen | undefined
  >();

  useEffect(() => {
    if (pluginConfData?.modulEinstellungen) {
      const getZahlungsweisen = async () => {
        const zahlungsweisenData: GetZahlungsweisen = await getAlbisMethodsData(
          shop.myshopifyDomain,
          "getZahlungsweisen",
        );
        setZahlungsweisen(zahlungsweisenData);
        const zahlungsweiseLabel =
          pluginConfData.modulEinstellungen.zahlungsweisen === "1"
            ? zahlungsweisenData.result[0].bezeichnung
            : zahlungsweisenData.result[1].bezeichnung;
        const updatedCalcFormData: CalcData = {
          objektVersicherungVorhanden: "nein",
          finanzierungsbetragNetto: formatToNetValue(amount),
          anzahlung: "0.0",
          zahlungsweise: `${pluginConfData.modulEinstellungen.zahlungsweisen}`,
          zahlungsweiseLabel,
        };
        updateCalcFormData(updatedCalcFormData);
        handleGetRate(updatedCalcFormData);
      };
      getZahlungsweisen();
    }
  }, [pluginConfData]);

  const handleGetRate = useCallback(
    async (calcData: CalcData) => {
      const werte = {
        kaufpreis: calcData.finanzierungsbetragNetto,
        prodgrp: pluginConfData?.modulEinstellungen.produktgruppe,
        mietsz: calcData.anzahlung,
        vertragsart: pluginConfData?.modulEinstellungen.vertragsart,
        zahlweise: calcData.zahlungsweise,
        provision: pluginConfData?.modulEinstellungen.provisionsangabe,
      };

      console.log("werte", werte);

      const leasingRateData: LeasingRate | JsonRpcErrorResponse =
        await getAlbisMethodsData(shop.myshopifyDomain, "getRate", werte);

      if (isJsonRpcErrorResponse(leasingRateData)) {
        console.log("isJsonRpcErrorResponse leasingRateData", leasingRateData);
        // setErrorMsg(leasingRateData.error.message);
      } else {
        // setErrorMsg("");
        console.log("else leasingRateData", leasingRateData);
        updateLeasingRate(leasingRateData);
      }
    },
    [pluginConfData],
  );

  const handleCreateDraftOrder = async () => {
    const cartLines = checkoutCartLines.map((line) => ({
      variantId: line.merchandise.id,
      quantity: line.quantity,
    }));

    const draftOrderInput: DraftOrderInput = createDraftOrderObj({
      email: email,
      phone: phone,
      address: {
        address1: address1,
        city: city,
        lastName: lastName,
        zip: zip,
      },
      lineItems: cartLines,
    });
    const albisDraftOrderData: CreateAlbisDraftOrderProps = {
      shop: shop.myshopifyDomain,
      albisDraftOrderData: draftOrderInput,
    };

    console.log("albisDraftOrderData", albisDraftOrderData);

    const albisDraftOrderResponse: AlbisDraftOrderResponse =
      await createAlbisDraftOrder({
        ...albisDraftOrderData,
      });
    setDraftOrderData({
      id: albisDraftOrderResponse.draftOrder.id,
      name: albisDraftOrderResponse.draftOrder.name,
    });

    console.log("AlbisDraftOrderResponse", albisDraftOrderResponse);
  };

  const handleClickRateOpt = async (itemRate: Rate) => {
    if (!draftOrderData.id) {
      await handleCreateDraftOrder();
    }
    setStep(2);
    updateLeasingSelectedOpt(itemRate);
  };

  const handleLeasingRequestSubmit = async (datenschutz: boolean) => {
    if (!draftOrderData.name) {
      setStep(2);
      setCreateAlbisApp({
        responseSuccess: false,
        responseText: "Error on saving data on shopify, please try again later",
      });
      return;
    }
    setLeasingLoading(true);

    const antragsDatenObj = createAntragsDatenObj({
      objekt: draftOrderData.name,
      calcData: calcFormData,
      firmaFormData: clientFormData.firma,
      managerFormData: clientFormData.manager,
      leasingRate: leasingData.selectedRateOpt,
      modulEinstellungen: pluginConfData.modulEinstellungen,
      datenschutz,
    });

    console.log("antragsDatenObj", antragsDatenObj);

    const response:
      | CreateLeasingApplication
      | JsonRpcErrorResponse
      | undefined = await createAlbisApplication(
      shop.myshopifyDomain,
      antragsDatenObj,
      draftOrderData,
    );
    console.log("CreateLeasingApplication response", response);
    console.log("clientFormData", clientFormData);
    if (!response) {
      setCreateAlbisApp({
        responseSuccess: false,
        responseText: "Error creating Application",
      });
      setStep(2);
      return;
    }
    if (isJsonRpcErrorResponse(response)) {
      if (response.draftOrder?.id) {
        setDraftOrderData({
          id: response.draftOrder.id,
          name: response.draftOrder.name,
        });
      }
      setCreateAlbisApp({
        responseSuccess: false,
        responseText: response
          ? response.error.message
          : "Error creating Application",
      });
      setStep(2);
    } else {
      setCreateAlbisApp({
        responseSuccess: true,
        responseText: `Ihre Leasing Anfrage an Albis wurde erfolgreich versendet!\n\nWeitere Informationen erhalten Sie per Mail`,
      });
      setLeasingLoading(false);
      return;
    }
  };

  const handleZuruckClick = () => {
    setStep(1);
    updateLeasingSelectedOpt(null);
  };

  const isModalDisabled: string | null = useMemo(() => {
    const isValidMail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email);
    const isValidAddress = /^(?=.*[A-Za-z])(?=.*\d).+$/.test(address1);

    if (
      !city ||
      !address1 ||
      !zip ||
      !lastName ||
      !isValidMail ||
      !isValidAddress
    )
      return "Bitte füllen Sie alle erforderlichen Adress- und Kontaktdaten aus!";

    if (!cost.totalShippingAmount.current)
      return "Bitte berechnen Sie die Versandkosten!";

    if (amount < 500.0)
      return "Der Mindestbetrag für das Leasing beträgt €500,00.";

    updateManagerData({
      strasseGF: address1,
      vorname: firstName ?? "",
      nachname: lastName,
    });
    updateFirmaData({ email: email });

    return null;
  }, [city, address1, email, zip, lastName, cost.totalShippingAmount, amount]);

  return (
    <BlockLayout border={"base"} background={"subdued"}>
      <InlineLayout
        columns={["35%", "65%"]}
        blockAlignment={"center"}
        inlineAlignment={"end"}
        padding={["none", "extraLoose", "none", "none"]}
        maxInlineSize={"100%"}
        maxBlockSize={"100%"}
      >
        <BlockLayout maxBlockSize={140} maxInlineSize={140}>
          <Image
            source="https://cdn.shopify.com/s/files/1/0849/2666/0952/files/albis_logo.png?v=1724838319"
            fit={"contain"}
            loading="lazy"
          />
        </BlockLayout>
        {isModalDisabled ? (
          <Button>Jetzt Leasing mit Albis Leasing</Button>
        ) : (
          <Button
            onPress={() => setLeasingBtnClicked(true)}
            overlay={
              <Modal
                id="my-modal"
                title="Leasing by Albis Leasing"
                padding
                onClose={() => {
                  // console.log("onCLose");
                  // handleZuruckClick();
                  setLeasingBtnClicked(false);
                }}
              >
                {!leasingData?.selectedRateOpt && step === 1 && (
                  <LeasingSelection
                    cost={cost.totalShippingAmount.current.amount.toString()}
                    handleClickRateOpt={handleClickRateOpt}
                    handleGetRate={handleGetRate}
                    modulEinstellungen={pluginConfData.modulEinstellungen}
                    zahlungsweisen={zahlungsweisen}
                  />
                )}
                {step === 2 && leasingData?.selectedRateOpt && (
                  <LeasingRequest
                    handleStepChange={(newStep: Steps) => setStep(newStep)}
                    shopDomain={shop.myshopifyDomain}
                    handleLeasingRequestSubmit={handleLeasingRequestSubmit}
                    step={step}
                    handleZuruckClick={handleZuruckClick}
                    createAlbisAppResponse={createAlbisApp}
                  />
                )}

                {step === 0 && (
                  <BlockLayout
                    inlineAlignment={"center"}
                    rows={["auto", "auto"]}
                  >
                    {leasingLoading && (
                      <Text>
                        Wir senden ihre Anfrage an ALBIS, bitte warten Sie einen
                        Moment.
                      </Text>
                    )}
                    {createAlbisApp.responseSuccess ? (
                      <BlockLayout
                        rows={[180, 50]}
                        spacing={"tight"}
                        padding={["none", "none", "tight", "none"]}
                      >
                        <BlockLayout rows={[50, 10, 50, 10, 50]}>
                          <Banner
                            status="success"
                            title="Ihre Leasing Anfrage an Albis wurde erfolgreich
                          versendet!"
                          />
                          <BlockSpacer spacing="extraTight" />
                          <Banner
                            status="success"
                            title="Alle Artikel in deinem Warenkorb wurden gespeichert!"
                          />
                          <BlockSpacer spacing="extraTight" />
                          <Banner
                            status="info"
                            title="Weitere Informationen erhalten Sie per Mail."
                          />
                        </BlockLayout>

                        <BlockLayout inlineAlignment={"end"}>
                          <BlockLayout maxBlockSize={50} maxInlineSize={80}>
                            <Button
                              onPress={() => console.log(shop.myshopifyDomain)}
                              to={`https://${shop.myshopifyDomain}/pages/albis-redirect`}
                            >
                              Beenden
                            </Button>
                          </BlockLayout>
                        </BlockLayout>
                      </BlockLayout>
                    ) : (
                      <BlockLayout padding={["base", "none"]}>
                        <Spinner size="large" />
                      </BlockLayout>
                    )}
                  </BlockLayout>
                )}
              </Modal>
            }
          >
            Jetzt Leasing mit Albis Leasing
          </Button>
        )}
      </InlineLayout>
      {leasingBtnClicked && isModalDisabled && (
        <InlineLayout inlineAlignment={"center"} blockAlignment={"center"}>
          {" "}
          <Banner title={isModalDisabled} status="critical" />
        </InlineLayout>
      )}
    </BlockLayout>
  );
}
