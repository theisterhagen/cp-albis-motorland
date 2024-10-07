import { InlineLayout } from "@shopify/ui-extensions-react/checkout";
import { SectionCalculator } from "../components/leasingCalculator";
import { SectionLeasingRates } from "../components/leasingRates";
import type { CalcData } from "../types";
import type { GetZahlungsweisen, Rate } from "../types/albisMethods";
import type { PluginConfig } from "../types/pluginConfig";

type LeasingSelectionProps = {
  modulEinstellungen: PluginConfig["modulEinstellungen"];
  cost: string;
  handleClickRateOpt: (itemRate: Rate) => void;
  handleGetRate: (calcData: CalcData) => Promise<void>;
  zahlungsweisen?: GetZahlungsweisen;
};
export const LeasingSelection = ({
  modulEinstellungen,
  cost,
  handleClickRateOpt,
  handleGetRate,
  zahlungsweisen,
}: LeasingSelectionProps) => {
  return (
    <InlineLayout columns={[555, 245]}>
      <SectionLeasingRates
        shippingPrice={cost}
        handleClickRateOpt={handleClickRateOpt}
      />
      <SectionCalculator
        auswahlZahlungsweiseAnzeigen={
          modulEinstellungen.auswahlZahlungsweiseAnzeigen
        }
        auswahlObjektVersicherungAnzeigen={
          modulEinstellungen.auswahlObjektVersicherungAnzeigen
        }
        kundeKannFinanzierungsbetragAndern={
          modulEinstellungen.kundeKannFinanzierungsbetragAndern
        }
        handleGetRate={handleGetRate}
        zahlungsweisen={zahlungsweisen}
      />
    </InlineLayout>
  );
};
