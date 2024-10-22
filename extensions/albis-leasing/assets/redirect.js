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

document.addEventListener("DOMContentLoaded", async function () {
  const shopUrl = document.getElementById("shopSecureUrl")?.textContent;
  // const shopDomain = document.getElementById("shopDomain")?.textContent;
  await clearCartData();
  window.location.href = shopUrl;
});
