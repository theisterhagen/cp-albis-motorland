/** Listener for dynamically setting the correct variantId */
var firstTimeUrl = document.URL;
var variantId = document.getElementById("ah-variant-id").textContent;
var ahSection = document.getElementById("ah-product-section");
const productId = document.getElementById("ah-product-id").textContent;

async function getProductById(id) {
  const handle = (
    await fetch(
      `/search/suggest.json?q=id:${id}&resources[type]=product&limit=1`,
    )
      .then((response) => response.json())
      .then((response) => response.resources.results.products.shift())
  ).handle;

  return await fetch(`/products/${handle}.js`).then((response) =>
    response.json(),
  );
}

async function _getCurrentVariant() {
  const product = await getProductById(productId);

  const foundVariant = product.variants.find(
    (variant) => variant.id == variantId,
  );

  return foundVariant;
}

async function addProductToCart() {
  // const productId = document.getElementById("ah-product-id").textContent;
  console.log("addProductToCart func");
  const secureUrl = document.getElementById("ah-secure-url").textContent;

  let formData = {
    items: [
      {
        id: Number(variantId),
        quantity: 1,
      },
    ],
  };
  const fetchUrl = `${secureUrl}/cart/add.js`;

  console.log("formData", formData);
  console.log("fetchUrl", fetchUrl);

  const response = await fetch(fetchUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  if (!response.ok) {
    throw new Error(`HTTP error: Status: ${response.status}`);
  }
  const data = await response.json();
  console.log("response data", data);
  window.location.replace(`${secureUrl}/pages/albis-leasing`);
  return data;
}

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

async function getLeasingRateTable(modulEinstellungen) {
  const productPrice = Math.round(
    parseInt(document.getElementById("ah-product-price").textContent) / 1.19,
  );

  const productValues = {
    kaufpreis: toCurrency(productPrice),
    prodgrp: modulEinstellungen.produktgruppe,
    mietsz: "0.00",
    vertragsart: modulEinstellungen.vertragsart,
    zahlweise: modulEinstellungen.zahlungsweisen,
    provision: Number(modulEinstellungen.provisionsangabe),
  };
  const leasingRates = await getAlbisMethodsData("getRate", productValues);

  console.log("leasingRates", leasingRates);

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

document.addEventListener("change", async function () {
  console.log("change func");
  var currentPageUrl = document.URL;
  var url = new URL(currentPageUrl);
  var isVariantUrl = url.searchParams.get("variant");
  currentPageUrl = isVariantUrl ? currentPageUrl : isVariantUrl;
  if (currentPageUrl && firstTimeUrl != currentPageUrl) {
    firstTimeUrl = currentPageUrl;
    variantId = isVariantUrl;
    const foundVariant = await _getCurrentVariant();
    console.log("foundVariant", foundVariant);
    // if (foundVariant.price >= 50000) {
    if (!foundVariant.available) {
      ahSection.classList.add("albisHiddenInfo");
    } else {
      ahSection.classList.remove("albisHiddenInfo");
    }
    // }
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const pluginConfData = await getPluginConfData();
  console.log("pluginConfData", pluginConfData);
  const { modulAktiv, modulZugangsdaten, modulEinstellungen } = pluginConfData;

  const containerAddRedirect = document.getElementById(
    "containerAddProductAndRedirect",
  );

  if (!modulAktiv.isModulAktiv || !modulZugangsdaten.isCredentialsValid) {
    containerAddRedirect.style.display = "none";
    return;
  }

  const foundVariant = await _getCurrentVariant();
  // console.log("foundVariant", foundVariant);
  // console.log("foundVariant.price", foundVariant.price);

  if (foundVariant.price >= 50000) {
    await getLeasingRateTable(modulEinstellungen);
  }
  const addProductAndRedirect = document.getElementById(
    "addProductAndRedirect",
  );

  console.log("addProductAndRedirect", addProductAndRedirect);

  addProductAndRedirect.addEventListener("click", async (e) => {
    await addProductToCart();
  });
});
