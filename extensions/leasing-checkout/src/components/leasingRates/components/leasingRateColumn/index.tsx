import {
  BlockLayout,
  Button,
  InlineLayout,
  ScrollView,
  Text,
} from "@shopify/ui-extensions-react/checkout";
import type { LeasingRate, Rate } from "../../../../types/albisMethods";

type LeasingRateColumnProps = {
  header: string;
  index: number;
  leasingRate?: LeasingRate["result"]["raten"];
  shippingPrice?: string;
  handleClickRateOpt: (itemRate: Rate) => void;
};

export const LeasingRateColumn = ({
  header,
  index,
  leasingRate,
  shippingPrice,
  handleClickRateOpt,
}: LeasingRateColumnProps) => {
  return (
    <ScrollView maxBlockSize={1000}>
      <InlineLayout
        padding={"tight"}
        background={"subdued"}
        inlineAlignment={"center"}
        borderWidth={"base"}
        border={"base"}
      >
        <Text emphasis="bold">{header}</Text>
      </InlineLayout>
      {leasingRate &&
        leasingRate.map((itemRate, idx) => {
          switch (index) {
            case 0:
              return (
                <BlockLayout
                  border={["base", "none", "base", "base"]}
                  borderWidth={"base"}
                  spacing={"extraLoose"}
                  key={`button-${idx}`}
                  minBlockSize={50}
                  minInlineSize={125}
                  blockAlignment={"center"}
                  inlineAlignment={"center"}
                >
                  <Button
                    kind="plain"
                    onPress={() =>
                      shippingPrice && handleClickRateOpt(itemRate)
                    }
                    disabled={!shippingPrice}
                  >
                    <Text size="small" emphasis="bold">
                      {itemRate.laufzeit}
                    </Text>
                    <Text size="extraSmall" emphasis="bold">
                      Monate
                    </Text>
                  </Button>
                </BlockLayout>
              );
            case 1:
              return (
                <BlockLayout
                  key={`rate-${idx}`}
                  border={["base", "none"]}
                  borderWidth={"base"}
                  minBlockSize={50}
                  minInlineSize={125}
                  blockAlignment={"center"}
                  inlineAlignment={"center"}
                >
                  <Text>€{itemRate.rate.toFixed(2)}</Text>
                </BlockLayout>
              );
            case 2:
              return (
                <BlockLayout
                  key={`insurance-${idx}`}
                  border={["base", "none"]}
                  borderWidth={"base"}
                  minBlockSize={50}
                  minInlineSize={130}
                  blockAlignment={"center"}
                  inlineAlignment={"center"}
                >
                  <Text>€{itemRate.versicherung.toFixed(2)}</Text>
                </BlockLayout>
              );
            case 3:
              return (
                <BlockLayout
                  key={`total-${idx}`}
                  border={["base", "base", "base", "none"]}
                  borderWidth={"base"}
                  minBlockSize={50}
                  minInlineSize={170}
                  blockAlignment={"center"}
                  inlineAlignment={"center"}
                >
                  <Text>
                    €{(itemRate.rate + itemRate.versicherung).toFixed(2)}
                  </Text>
                </BlockLayout>
              );
            default:
              return null;
          }
        })}
    </ScrollView>
  );
};
