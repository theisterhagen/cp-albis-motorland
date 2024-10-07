async function clearCartData() {
  const cartPromise = await fetch("/cart/clear.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const clearCartData = await cartPromise.json();
  return clearCartData;
}

function backendUrl() {
  return "https://cp-consorsfinanz.cpro-server.de";
}

function consorsNotifyUrl(order_id) {
  return `${backendUrl()}/notify/${order_id}`;
}

function returnToCustomCheckoutUrl(shop) {
  return `${shop}/checkout`;
}

async function fetchDraftOrder(draftOrderId) {
  const shop = document.getElementById("shopDomain")?.textContent;
  const res = await fetch(`${backendUrl()}/api/getDraftOrder`, {
    method: "POST",
    body: JSON.stringify({
      shop: shop,
      draftOrderId: draftOrderId,
    }),
  });
  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }
  const data = await res.json();
  return data;
}

async function getPluginConfData() {
  const shop = document.getElementById("shopDomain")?.textContent;
  try {
    const parameters = new URLSearchParams({ shop });
    const requestUrl = `${backendUrl()}/api/getPluginConfData?${parameters}`;

    const response = await fetch(requestUrl, { method: "GET" });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching AppConfig:", error);
  }
}

async function getConsorsLink(draftOrder, storeFrontUrl, draftOrderId) {
  const shop = document.getElementById("shopDomain")?.textContent;
  const { city, firstName, lastName, address1, zip } =
    draftOrder.draftOrderResponseData.draftOrder.shippingAddress;
  const index = address1.search(/\d/);
  const street = address1.slice(0, index).trim();
  const housenumber = address1.slice(index).trim();
  const email = draftOrder.draftOrderResponseData.draftOrder.email;
  const phone = draftOrder.draftOrderResponseData.draftOrder.phone;
  const orderAmount =
    draftOrder.draftOrderResponseData.draftOrder.totalPriceSet.shopMoney.amount;
  const name = draftOrder.draftOrderResponseData.draftOrder.name;

  const formattedName = name.substring(1);

  const pluginConfigData = await getPluginConfData();

  const defaultUrlParams = {
    vendorid: pluginConfigData.pluginCredentials.vendorId,
    order_amount: orderAmount,
    firstname: firstName ?? "",
    lastname: lastName,
    email,
    zip,
    city,
    mobile: phone,
    street,
    housenumber,
    shopbrandname: shop,
    cancelURL: returnToCustomCheckoutUrl(storeFrontUrl),
    failureURL: returnToCustomCheckoutUrl(storeFrontUrl),
    notifyURL: consorsNotifyUrl(formattedName),
    successURL: `https://cp-consorsfinanz.myshopify.com/pages/consors-redirect?do=${draftOrderId}`,
  };

  // console.log("defaultURl params", defaultUrlParams);

  const consorsParams = new URLSearchParams(defaultUrlParams);

  return consorsParams;
}

async function consorsRedirect(draftOrderId, storeFrontUrl) {
  const draftOrderResponse = await fetchDraftOrder(draftOrderId);
  const consorsParams = await getConsorsLink(
    draftOrderResponse,
    storeFrontUrl,
    draftOrderId,
  );
  window.location.href = `https://finanzieren.consorsfinanz.de/web/ecommerce/gewuenschte-rate?${consorsParams}`;
}

/* ----- orderDetailsRedirect ----- */

const extractNumberFromUrl = (url) => {
  const match = url.match(/\d+/);
  // console.log("match", match);
  return match ? match[0] : "";
};

function showModal() {
  const modal = document.getElementById("loadingModal");
  modal.style.display = "flex";
}

function hideModal() {
  const modal = document.getElementById("loadingModal");
  modal.style.display = "none";
}

async function getEfiNotifications(draftOrderId) {
  try {
    const parameters = new URLSearchParams({ draftOrderId });
    const requestUrl = `${backendUrl()}/api/getNotifications?${parameters}`;

    const response = await fetch(requestUrl, { method: "GET" });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching AppConfig:", error);
  }
}

async function orderDetailsRedirect(responseDraftOrderIdConsors) {
  const modalElement = document.getElementById("loadingModal");
  document.body.appendChild(modalElement);

  const loadingMessageElement = document.getElementById("loadingMessage");
  showModal();

  const shopId = document.getElementById("shopId")?.textContent;
  // console.log("responseDraftOrderIdConsors", responseDraftOrderIdConsors);
  // console.log("shopId", shopId);

  let attemptCount = 0;
  const maxAttempts = 4;

  const checkForEfiNotification = async () => {
    attemptCount++;
    // console.log(`Attempt ${attemptCount} to get EFI notification.`);

    const efiNotifications = await getEfiNotifications(
      responseDraftOrderIdConsors,
    );
    // console.log("efiNotifications", efiNotifications);

    if (efiNotifications && efiNotifications.data.orderId) {
      const { data } = efiNotifications;
      const orderIdAsNumber = extractNumberFromUrl(data.orderId);
      // console.log("window.location", orderIdAsNumber);
      loadingMessageElement.textContent =
        "Vielen Dank für Ihre Geduld. Ihre Anfrage wurde erfolgreich bearbeitet.";
      await clearCartData();
      window.location.href = `https://shopify.com/${shopId}/account/orders/${orderIdAsNumber}?locale=en-DE`;
      return;
    } else if (attemptCount < maxAttempts) {
      // console.log("Order ID not yet available, retrying in 30 seconds...");
      setTimeout(checkForEfiNotification, 30000);
    } else {
      // console.log("Max attempts reached. Stopping further checks.");
    }
  };
  checkForEfiNotification();
}

document.addEventListener("DOMContentLoaded", async function () {
  hideModal();
  const currentPageUrl = document.URL;
  const url = new URL(currentPageUrl);
  const draftOrderId = url.searchParams.get("orderId") ?? "";
  const responseDraftOrderIdConsors = url.searchParams.get("do") ?? "";

  // console.log("url.searchParams", url.searchParams);
  const storeFrontUrl = window.location.origin;

  if (draftOrderId) {
    await consorsRedirect(draftOrderId, storeFrontUrl);
    return;
  }
  if (responseDraftOrderIdConsors) {
    await orderDetailsRedirect(responseDraftOrderIdConsors);
    return;
  }
});
