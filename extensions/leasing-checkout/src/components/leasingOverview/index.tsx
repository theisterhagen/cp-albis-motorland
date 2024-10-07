import {
  BlockLayout,
  InlineLayout,
  Text,
  View,
} from "@shopify/ui-extensions-react/checkout";

import { useLeasingCtx } from "../../hooks/useLeasingCtx";
import { formatToEuro } from "../../utils/formatValues";

export const LeasingOverview = () => {
  const { calcFormData, leasingData } = useLeasingCtx();
  const { laufzeit, rate, versicherung } = leasingData?.selectedRateOpt;
  return (
    <View border={"base"} borderWidth={"base"}>
      <BlockLayout padding={"tight"}>
        <View inlineAlignment={"center"}>
          <Text size="large" emphasis="bold">
            Leasingdaten
          </Text>
        </View>
      </BlockLayout>

      <View
        border={["base", "none", "none", "none"]}
        // borderWidth={"base"}
        background={"subdued"}
        padding={"tight"}
      >
        <BlockLayout rows={["auto", "auto"]} padding={"extraTight"}>
          <Text size="small">
            WICHTIG: Bitte achten Sie darauf, dass die Lieferzeiten zum
            Zeitpunkt der Antragstellung gelten. Bis Sie den Leasingvertrag
            unterschreiben und sich ausweisen, können sich die Lieferzeiten
            ändern.
          </Text>

          <Text size="small">
            Ihre ausgewählten Daten für Ihren{" "}
            <Text emphasis="bold">unverbindlichen Leasingantrag</Text> sehen Sie
            nachfolgend. Bitte füllen Sie die unteren Formularfelder und senden
            Sie Ihre Daten über den Button "Leasingantrag Senden" um Ihren
            Leasingantrag zu stellen. Ihr Antrag wird umgehend durch die ALBIS
            HiTec Leasing GmbH bearbeitet. Wir setzen uns mit Ihnen in
            Verbindung, sobald wir die Rückmeldung von ALBIS HiTec Leasing GmbH
            bekommen.
          </Text>
        </BlockLayout>
      </View>

      <BlockLayout spacing="extraTight" padding={"extraTight"}>
        <InlineLayout columns={[280, 200]}>
          <Text size="small">Ihr eingetragener Kaufpreis (ohne MwSt): </Text>
          <Text emphasis="bold">
            €{formatToEuro(calcFormData.finanzierungsbetragNetto)}
          </Text>
        </InlineLayout>

        <InlineLayout columns={[280, 200]}>
          <Text size="small">{`Ihre ausgewählte monatliche Laufzeit: `}</Text>
          <Text emphasis="bold">{laufzeit} Monate</Text>
        </InlineLayout>

        <InlineLayout columns={[280, 200]}>
          <Text size="small">{`Die monatliche Leasingrate beträgt: `}</Text>
          <Text emphasis="bold">€{rate.toFixed(2)}</Text>
        </InlineLayout>

        <InlineLayout columns={[280, 200]}>
          <Text size="small">{`Monatliche Versicherung: `}</Text>
          <Text emphasis="bold">€{versicherung.toFixed(2)}</Text>
        </InlineLayout>

        <InlineLayout columns={[280, 200]}>
          <Text size="small">{`Ihre Zahlungsweise: `}</Text>
          <Text emphasis="bold">{calcFormData.zahlungsweiseLabel}</Text>
        </InlineLayout>

        <InlineLayout columns={[280, 200]}>
          <Text size="small">
            {`Ihre monatliche Gesamtleasingzahlung beträgt: `}
          </Text>
          <Text emphasis="bold">€{(rate + versicherung).toFixed(2)}</Text>
        </InlineLayout>
      </BlockLayout>
    </View>
  );
};
