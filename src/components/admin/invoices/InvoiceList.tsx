"use client";
import InvoiceTable from "./InvoiceTable";

interface InvoiceListProps {
  token: string;
}

const InvoiceList = ({ token }: InvoiceListProps) => {
  return (
    <div className="p-4 mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">Facturas</h2>
      </div>
      <InvoiceTable token={token} />
    </div>
  );
};

export default InvoiceList;
