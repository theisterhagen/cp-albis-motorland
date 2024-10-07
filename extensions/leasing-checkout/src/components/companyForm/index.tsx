import {
  BlockLayout,
  Select,
  Text,
  TextField,
  View,
} from "@shopify/ui-extensions-react/checkout";
import { useEffect, useState } from "react";
import { useLeasingCtx } from "../../hooks/useLeasingCtx";
import type { Rechtsformen } from "../../types/albisMethods";
import { getAlbisMethodsData } from "../../utils/getAlbisMethodsData";

type CompanyFormProps = {
  shopDomain: string;
};

type RechtsFormOptions = {
  label: string;
  value: string;
};

export const CompanyForm = ({ shopDomain }: CompanyFormProps) => {
  const { clientFormData, updateFirmaData } = useLeasingCtx();
  const [rechtsformenOpts, setRechtsformenOpts] = useState<
    RechtsFormOptions[] | null
  >();

  useEffect(() => {
    const fetchRechtsformen = async () => {
      const data: Rechtsformen = await getAlbisMethodsData(
        shopDomain,
        "getRechtsformen",
      );
      const rechtsOpts = data.result.map((item) => ({
        label: item.text,
        value: item.id.toString(),
      }));
      setRechtsformenOpts(rechtsOpts);
    };
    fetchRechtsformen();
  }, []);

  return (
    <BlockLayout
      rows={"auto"}
      padding={"extraTight"}
      spacing={["tight", "none"]}
    >
      <View inlineAlignment={"center"}>
        <Text size="large" emphasis="bold">
          Angaben über die Firma
        </Text>
      </View>
      <View
        padding={"extraTight"}
        border={["base", "none", "none", "none"]}
        borderWidth={"base"}
      />
      <Select
        label="Rechtsform"
        onChange={(value) => updateFirmaData({ rechtsform: value })}
        value={clientFormData.firma.rechtsform}
        options={rechtsformenOpts ?? []}
      />
      <TextField
        label="Firmenname"
        onChange={(value) => updateFirmaData({ firmenname: value })}
        value={clientFormData.firma.firmenname}
      />
      <TextField
        label="Strasse"
        onChange={(value) => updateFirmaData({ strasse: value })}
        value={clientFormData.firma.strasse}
      />
      <TextField
        label="Postleitzahl"
        onChange={(value) => updateFirmaData({ plz: value })}
        value={clientFormData.firma.plz}
      />
      <TextField
        label="Ort"
        onChange={(value) => updateFirmaData({ ort: value })}
        value={clientFormData.firma.ort}
      />
      <TextField
        label="Telefon"
        onChange={(value) => updateFirmaData({ telefon: value })}
        value={clientFormData.firma.telefon}
      />
      <TextField
        label="E-Mail"
        onChange={(value) => updateFirmaData({ email: value })}
        value={clientFormData.firma.email}
        autocomplete
        type="email"
      />
      <TextField
        label="Bankverbindung"
        onChange={(value) => updateFirmaData({ bank: value })}
        value={clientFormData.firma.bank}
      />
    </BlockLayout>
  );
};
