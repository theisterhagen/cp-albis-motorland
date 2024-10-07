const getPluginConfData = async () => {
  try {
    const shop = document.getElementById("ah-shop-domain").textContent;
    const parameters = new URLSearchParams({ shop });
    const requestUrl = `https://${shop}/api/getPluginConfData?${parameters}`;

    const response = await fetch(requestUrl, { method: "GET" });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching AppConfig:", error);
  }
};

const getAlbisMethodsData = async (method, werte) => {
  try {
    const shop = document.getElementById("ah-shop-domain").textContent;
    const response = await fetch(`https://${shop}/api/getMethodsData`, {
      method: "POST",
      body: JSON.stringify({ method, shop, werte }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching AppConfig:", error);
  }
};

function toCurrency(rate) {
  let cent = rate.toString().slice(-2);
  let euro = rate.toString().slice(0, -2);

  return `${euro}.${cent}`;
}

async function getLeasingRateTable() {
  const pluginConfData = await getPluginConfData();

  const cartPrice = Math.round(
    parseInt(document.getElementById("ah-cart-price").textContent) / 1.19,
  );

  const productValues = {
    kaufpreis: toCurrency(cartPrice),
    prodgrp: pluginConfData.modulEinstellungen.produktgruppe,
    mietsz: "0.00",
    vertragsart: pluginConfData.modulEinstellungen.vertragsart,
    zahlweise: pluginConfData.modulEinstellungen.zahlungsweisen,
    provision: Number(pluginConfData.modulEinstellungen.provisionsangabe),
  };
  const leasingRates = await getAlbisMethodsData("getRate", productValues);

  let table = document
    .getElementById("preview-table")
    .getElementsByTagName("tbody")[0];

  for (const rate of leasingRates.result.raten) {
    let newRow = table.insertRow();
    let laufzeitCell = newRow.insertCell();
    let rateCell = newRow.insertCell();
    laufzeitCell.innerHTML = `${rate.laufzeit} Monate`;
    rateCell.innerHTML = `${rate.rate.toFixed(2)}€`;
  }

  return table;
}

document.addEventListener("DOMContentLoaded", async () => {
  await getLeasingRateTable();
});
