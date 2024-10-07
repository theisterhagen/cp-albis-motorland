import {
  BlockLayout,
  Button,
  Grid,
  Select,
  Text,
  TextField,
} from "@shopify/ui-extensions-react/checkout";
import { useState } from "react";
import { useLeasingCtx } from "../../hooks/useLeasingCtx";
import type { CalcData } from "../../types";
import type { GetZahlungsweisen } from "../../types/albisMethods";
import type { PluginConfig } from "../../types/pluginConfig";
import { formatDecimalNumber, formatToEuro } from "../../utils/formatValues";

type SectionCalculatorProps = {
  auswahlZahlungsweiseAnzeigen: PluginConfig["modulEinstellungen"]["auswahlZahlungsweiseAnzeigen"];
  auswahlObjektVersicherungAnzeigen: PluginConfig["modulEinstellungen"]["auswahlObjektVersicherungAnzeigen"];
  kundeKannFinanzierungsbetragAndern: PluginConfig["modulEinstellungen"]["kundeKannFinanzierungsbetragAndern"];
  handleGetRate: (calcData: CalcData) => Promise<void>;
  zahlungsweisen?: GetZahlungsweisen;
};

export const SectionCalculator = ({
  auswahlObjektVersicherungAnzeigen,
  auswahlZahlungsweiseAnzeigen,
  kundeKannFinanzierungsbetragAndern,
  handleGetRate,
  zahlungsweisen,
}: SectionCalculatorProps) => {
  const [error, setError] = useState("");
  const { calcFormData, updateCalcFormData } = useLeasingCtx();
  const leasingValue =
    Number(calcFormData.finanzierungsbetragNetto) -
    Number(calcFormData.anzahlung);

  const handleFormSubmit = () => {
    console.log("formSubmitted", calcFormData);
    console.log("leasingValue", leasingValue);

    if (leasingValue < 500) {
      setError("Min. Leasingsumme €500.0");
      return;
    }
    setError("");
    const formattedCalcData: CalcData = {
      ...calcFormData,
      finanzierungsbetragNetto: formatDecimalNumber(
        calcFormData.finanzierungsbetragNetto,
      ),
      anzahlung: formatDecimalNumber(calcFormData.anzahlung),
      zahlungsweiseLabel: zahlungsweisen.result.find(
        (item) => item.id === Number(calcFormData.zahlungsweise),
      ).bezeichnung,
    };

    updateCalcFormData(formattedCalcData);
    handleGetRate(formattedCalcData);
  };

  return (
    <Grid
      rows={["auto", "auto", "auto", "auto", "auto"]}
      padding={["loose", "none", "none", "tight"]}
      spacing={"extraTight"}
    >
      {auswahlObjektVersicherungAnzeigen && (
        <BlockLayout padding={["tight", "none", "none", "none"]}>
          <Select
            name="objektVersicherungVorhanden"
            label="Objekt-Versicherung vorhanden:"
            options={[
              { value: "ja", label: "Ja" },
              { value: "nein", label: "Nein" },
            ]}
            value={calcFormData.objektVersicherungVorhanden}
            onChange={(value) =>
              updateCalcFormData({ objektVersicherungVorhanden: value })
            }
          />
        </BlockLayout>
      )}
      <TextField
        name="finanzierungsbetragNetto"
        label="Finanzierungsbetrag (netto):"
        value={formatToEuro(calcFormData.finanzierungsbetragNetto)}
        onChange={(value) =>
          updateCalcFormData({
            finanzierungsbetragNetto: formatDecimalNumber(value),
          })
        }
        disabled={!kundeKannFinanzierungsbetragAndern}
      />
      <TextField
        name="anzahlung"
        label="Anzahlung"
        type="number"
        value={calcFormData.anzahlung}
        onChange={(value) =>
          updateCalcFormData({ anzahlung: formatDecimalNumber(value) })
        }
      />
      {auswahlZahlungsweiseAnzeigen && (
        <Select
          name="zahlungsweise"
          label="Zahlungsweise:"
          options={zahlungsweisen?.result.map((option) => ({
            value: option.id.toString(),
            label: option.bezeichnung,
          }))}
          value={calcFormData.zahlungsweise}
          onChange={(value) => updateCalcFormData({ zahlungsweise: value })}
        />
      )}
      <Button accessibilityRole="button" onPress={handleFormSubmit}>
        Berechnen
      </Button>
      {error && (
        <Text size="small" appearance="critical">
          {error}
        </Text>
      )}
    </Grid>
  );
};
