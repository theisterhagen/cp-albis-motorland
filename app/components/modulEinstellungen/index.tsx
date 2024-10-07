import { Form, useSubmit } from "@remix-run/react";
import type { ChangeEvent } from "react";
import { useState } from "react";

import type {
  ModulEinstellungenData,
  PluginConfData,
} from "~/types/pluginConfigurator";
import { getOptionsMethodData } from "~/utils/formatData";
import { Divider } from "../divider";
import { Select } from "../select";
import { Switch } from "../switch";
import { TextField } from "../textfield";
import styles from "./styles.module.css";

type ModulEinstellungenProps = {
  initialValues: ModulEinstellungenData;
  methodsData: PluginConfData["methodsData"];
};

export const ModulEinstellungen = ({
  initialValues,
  methodsData,
}: ModulEinstellungenProps) => {
  const submit = useSubmit();
  const [modulEinstellungenData, setModulEinstellungenData] =
    useState<ModulEinstellungenData>(initialValues);

  function handleSave() {
    submit(
      { ...modulEinstellungenData, _action: "einstellungen" },
      { method: "POST" },
    );
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setModulEinstellungenData((prev) => ({ ...prev, [name]: value }));
  }

  const updateModulEinstellungenDataAndSubmit = (
    updates: Partial<ModulEinstellungenData>,
  ) => {
    const updatedModulEinstellungenData: ModulEinstellungenData = {
      ...modulEinstellungenData,
      ...updates,
    };
    setModulEinstellungenData(updatedModulEinstellungenData);
    submit(
      { ...updatedModulEinstellungenData, _action: "einstellungen" },
      { method: "POST" },
    );
  };

  const handleSwitchOnChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, checked } = e.target;
    updateModulEinstellungenDataAndSubmit({
      [name as keyof ModulEinstellungenData]: checked,
    });
  };

  const handleSelectOnChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    const { name, value } = e.target;
    if (name === "produktgruppe") {
      const label = e.target.options[e.target.selectedIndex].text;
      updateModulEinstellungenDataAndSubmit({
        [name as keyof ModulEinstellungenData]: value,
        produktgruppeLabel: label,
      });
      return;
    }
    updateModulEinstellungenDataAndSubmit({
      [name as keyof ModulEinstellungenData]: value,
    });
  };

  return methodsData ? (
    <div className={`sectionContainer`}>
      <Divider title="Modul-Einstellungen" type="section" />
      <Form
        title="Einstellungen"
        method="POST"
        className={styles.formContainer}
      >
        <Select
          name="vertragsart"
          label="Vertragsart:"
          handleOnChange={handleSelectOnChange}
          optionsData={getOptionsMethodData(
            methodsData.vertragsarten,
            modulEinstellungenData.vertragsart,
          )}
        />
        <TextField
          name="restwertInBeiTAVertrag"
          label="Restwert in % bei TA-Vertrag:"
          type="text"
          handleOnChange={handleChange}
          handleOnBlur={handleSave}
          handleKeyDown={handleSave}
          textFieldValue={""}
          hidden={true}
        />
        <Select
          name="produktgruppe"
          label="Produktgruppe:"
          handleOnChange={handleSelectOnChange}
          optionsData={getOptionsMethodData(
            methodsData.produktgruppen,
            modulEinstellungenData.produktgruppe,
          )}
        />
        <Select
          name="zahlungsweisen"
          label="Zahlungsweisen:"
          handleOnChange={handleSelectOnChange}
          optionsData={getOptionsMethodData(
            methodsData.zahlungsweisen,
            modulEinstellungenData.zahlungsweisen,
          )}
        />
        <Switch
          name={"auswahlZahlungsweiseAnzeigen"}
          label="Auswahl Zahlungsweise anzeigen"
          handleOnChange={handleSwitchOnChange}
          checkboxValue={modulEinstellungenData.auswahlZahlungsweiseAnzeigen}
        />
        <TextField
          name="minLeasingsumme"
          label="Min. Leasingsumme: In €"
          type="text"
          handleOnChange={handleChange}
          handleOnBlur={handleSave}
          handleKeyDown={handleSave}
          textFieldValue={modulEinstellungenData.minLeasingsumme}
        />
        <TextField
          name="servicePauschaleNetto"
          label="Service Pauschale (Netto): In €"
          type="text"
          handleOnChange={handleChange}
          handleOnBlur={handleSave}
          handleKeyDown={handleSave}
          textFieldValue={modulEinstellungenData.servicePauschaleNetto}
        />
        <TextField
          name="albisServiceGebuhrNetto"
          label="Albis Service Gebühr (Netto): In €"
          type="text"
          handleOnChange={handleChange}
          handleOnBlur={handleSave}
          handleKeyDown={handleSave}
          textFieldValue={modulEinstellungenData.albisServiceGebuhrNetto}
        />
        <TextField
          name="provisionsangabe"
          label="Provisionsangabe: in %"
          type="text"
          handleOnChange={handleChange}
          handleOnBlur={handleSave}
          handleKeyDown={handleSave}
          textFieldValue={modulEinstellungenData.provisionsangabe}
        />
        <Switch
          name={"objektVersicherung"}
          label="Objekt-Versicherung:"
          handleOnChange={handleSwitchOnChange}
          checkboxValue={modulEinstellungenData.objektVersicherung}
        />
        <Switch
          name={"auswahlObjektVersicherungAnzeigen"}
          label="Auswahl Objekt-Versicherung anzeigen:"
          handleOnChange={handleSwitchOnChange}
          checkboxValue={
            modulEinstellungenData.auswahlObjektVersicherungAnzeigen
          }
        />
        <TextField
          name="mietsonderzahlung"
          label="Mietsonderzahlung: in €"
          type="text"
          handleOnChange={handleChange}
          handleOnBlur={handleSave}
          handleKeyDown={handleSave}
          textFieldValue={modulEinstellungenData.mietsonderzahlung}
        />
        <Switch
          name={"eingabeSonderzahlungErmoglichen"}
          label="Eingabe Sonderzahlung ermöglichen:"
          handleOnChange={handleSwitchOnChange}
          checkboxValue={modulEinstellungenData.eingabeSonderzahlungErmoglichen}
        />
        <Switch
          name={"pInfoseiteZeigeAlle"}
          label="P-Infoseite zeige alle Monate:"
          handleOnChange={handleSwitchOnChange}
          checkboxValue={modulEinstellungenData.pInfoseiteZeigeAlle}
        />
        <Switch
          name={"antragOhneArtikelMoglich"}
          label="Antrag ohne Artikel möglich:"
          handleOnChange={handleSwitchOnChange}
          checkboxValue={modulEinstellungenData.antragOhneArtikelMoglich}
        />
        <Switch
          name={"kundeKannFinanzierungsbetragAndern"}
          label="Kunde kann Finanzierungsbetrag ändern:"
          handleOnChange={handleSwitchOnChange}
          checkboxValue={
            modulEinstellungenData.kundeKannFinanzierungsbetragAndern
          }
        />
      </Form>
    </div>
  ) : (
    <></>
  );
};
