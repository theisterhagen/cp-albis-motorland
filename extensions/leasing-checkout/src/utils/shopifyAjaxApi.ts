export const clearCartData = async () => {
  const cartPromise = await fetch("/cart/clear.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const clearCartData = await cartPromise.json();
  return clearCartData;
};
