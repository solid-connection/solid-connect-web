"use client";

import dynamic from "next/dynamic";

const ClientModal = dynamic(() => import("./ClientModal"), {
  ssr: false,
  loading: () => null
});

const ClientModalWrapper = () => {
  return <ClientModal />;
};

export default ClientModalWrapper;
