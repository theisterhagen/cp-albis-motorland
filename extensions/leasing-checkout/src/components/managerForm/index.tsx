import {
  BlockLayout,
  Select,
  Text,
  TextField,
  View,
} from "@shopify/ui-extensions-react/checkout";

import { useLeasingCtx } from "../../hooks/useLeasingCtx";

export const ManagerForm = () => {
  const { clientFormData, updateManagerData } = useLeasingCtx();

  const formatDate = (dateString: string) => {
    const digitsOnly = dateString.replace(/\D/g, "").trim();

    if (digitsOnly.length !== 8) {
      return "Invalid input, must contain exactly 8 digits.";
    }

    const day = digitsOnly.substring(0, 2);
    const month = digitsOnly.substring(2, 4);
    const year = digitsOnly.substring(4, 8);

    const formattedDate = `${day}-${month}-${year}`;

    updateManagerData({ geburtsdatum: formattedDate });
  };

  return (
    <BlockLayout
      rows={"auto"}
      padding={"extraTight"}
      spacing={["tight", "none"]}
    >
      <View inlineAlignment={"center"}>
        <Text size="large" emphasis="bold">
          Angaben zum Geschäftsführer
        </Text>
      </View>
      <View
        padding={"extraTight"}
        border={["base", "none", "none", "none"]}
        borderWidth={"base"}
      />
      <Select
        label="anrede"
        onChange={(value) => updateManagerData({ anrede: value })}
        value={clientFormData.manager.anrede}
        options={[
          { value: "1", label: "Herr" },
          { value: "2", label: "Frau" },
        ]}
      />
      <TextField
        label="vorname"
        onChange={(value) => updateManagerData({ vorname: value })}
        value={clientFormData.manager.vorname}
      />
      <TextField
        label="nachname"
        onChange={(value) => updateManagerData({ nachname: value })}
        value={clientFormData.manager.nachname}
      />
      <TextField
        label="strasse und hausnummer"
        onChange={(value) => {
          updateManagerData({ strasseGF: value });
        }}
        value={clientFormData.manager.strasseGF}
      />
      <TextField
        label="plzGF"
        onChange={(value) => updateManagerData({ plzGF: value })}
        value={clientFormData.manager.plzGF}
      />
      <TextField
        label="ortGF"
        onChange={(value) => updateManagerData({ ortGF: value })}
        value={clientFormData.manager.ortGF}
      />
      <TextField
        label="telGF"
        onChange={(value) => updateManagerData({ telGF: value })}
        value={clientFormData.manager.telGF}
        type="telephone"
      />
      <TextField
        label="geburtsdatum DD-MM-YYYY"
        onChange={(value) => updateManagerData({ geburtsdatum: value })}
        onBlur={() => formatDate(clientFormData.manager.geburtsdatum)}
        value={clientFormData.manager.geburtsdatum}
      />
    </BlockLayout>
  );
};
