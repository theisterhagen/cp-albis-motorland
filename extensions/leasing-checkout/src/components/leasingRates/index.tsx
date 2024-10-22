import {
  BlockLayout,
  Grid,
  InlineLayout,
  Spinner,
  Text,
  View,
} from "@shopify/ui-extensions-react/checkout";
import { useLeasingCtx } from "../../hooks/useLeasingCtx";
import type { Rate } from "../../types/albisMethods";
import { formatToEuro } from "../../utils/formatValues";
import { LeasingRateColumn } from "./components/leasingRateColumn";

type SectionLeasingRatesProps = {
  shippingPrice?: string;
  handleClickRateOpt: (itemRate: Rate) => void;
};

export const SectionLeasingRates = ({
  shippingPrice,
  handleClickRateOpt,
}: SectionLeasingRatesProps) => {
  const { leasingData, calcFormData } = useLeasingCtx();
  const leasingValue = (
    Number(calcFormData.finanzierungsbetragNetto) -
    Number(calcFormData.anzahlung)
  ).toFixed(2);

  const headers = [
    "Vertragslaufzeit",
    "Monatliche rate",
    "Versicherung",
    "Gesamtleasingrate",
  ];

  return leasingData.leasingRate ? (
    <BlockLayout rows={[30, "auto"]}>
      <InlineLayout inlineAlignment={"center"}>
        <Text size="large">
          Leasingraten (Finanzierungsbetrag:{" "}
          {Number(leasingValue) < 100.0
            ? leasingValue
            : formatToEuro(leasingValue)}
          €)
        </Text>
      </InlineLayout>
      {Number(leasingValue) >= 500.0 ? (
        <Grid
          columns={headers.map(() => "auto")}
          border={"base"}
          borderWidth={"base"}
          // spacing={"base"}
        >
          {headers.map((header, index) => (
            <LeasingRateColumn
              key={index}
              header={header}
              index={index}
              leasingRate={leasingData.leasingRate.result.raten}
              shippingPrice={shippingPrice}
              handleClickRateOpt={handleClickRateOpt}
            />
          ))}
        </Grid>
      ) : (
        <InlineLayout
          blockAlignment={"center"}
          inlineAlignment={"center"}
          minBlockSize={280}
          minInlineSize={550}
          border={"base"}
          borderWidth={"base"}
        >
          <Spinner size="large" />
        </InlineLayout>
      )}
      <View background={"subdued"} padding={"tight"}>
        <BlockLayout rows={[55, 20, 55, 25]}>
          <Text size="small">
            WICHTIG: Bitte achten Sie darauf, dass die Lieferzeiten zum
            Zeitpunkt der Antragstellung gelten. Bis Sie den Leasingvertrag
            unterschreiben und sich ausweisen, können sich die Lieferzeiten
            ändern.
          </Text>
          <Text size="small" appearance="info">
            {`(1) in EUR zzgl. MwSt. Im Monat bei quartalsweiser oder monatlicher Zahlung.`}
          </Text>
          <Text
            size="small"
            appearance="info"
          >{`(2) Der Leasingnehmer kann durch Vorlage eines auf die ALBIS HiTec Leasing GmbH ausgestellten Sicherungsscheins die ausreichende Deckung durch eine bestehende oder neu abzuschließende Versicherung bei jedem beliebigen Versicherungsgeber nachweisen.`}</Text>
          <Text size="small" appearance="info">
            {`(1s) Eine zusätzliche einmalige Gebühr in Höhe von 67,50 € netto wird berechnet.`}
          </Text>
        </BlockLayout>
      </View>
    </BlockLayout>
  ) : (
    <InlineLayout
      blockAlignment={"center"}
      inlineAlignment={"center"}
      maxBlockSize={"fill"}
      maxInlineSize={"fill"}
      border={"base"}
      borderWidth={"base"}
    >
      <Spinner />
    </InlineLayout>
  );
};
