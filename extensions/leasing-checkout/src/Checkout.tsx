import { reactExtension, useApi } from "@shopify/ui-extensions-react/checkout";
import { useMemo } from "react";
import { LeasingProvider } from "./context/leasingCtx";
import { useGetPluginConfData } from "./hooks/useGetPluginConfData";
import { App } from "./view/app";
export default reactExtension(
  "purchase.checkout.payment-method-list.render-before",
  () => <Extension />,
);

function Extension() {
  const { shop } = useApi();
  const pluginConfData = useGetPluginConfData({ shop: shop.myshopifyDomain });

  const isAppEnabled = useMemo(
    () =>
      !!pluginConfData &&
      !!pluginConfData?.modulAktiv &&
      !!pluginConfData?.modulEinstellungen,
    [pluginConfData],
  );

  return (
    isAppEnabled && (
      <LeasingProvider>
        <App pluginConfData={pluginConfData} shopId={shop.id} />
      </LeasingProvider>
    )
  );
}
