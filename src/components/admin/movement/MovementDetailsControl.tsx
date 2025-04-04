"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import GenericTable, { Column, TableAction } from "@/components/global/GenericTable";
import { MovementProductItem } from "@/lib/movement/IMovement";
import { toast } from "@/lib/toast";
import { Trash } from "lucide-react";
import { getProducts } from "@/lib/products/getProducts";
import SearchBar from "@/components/global/SearchBar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MovementDetailsControlProps {
  token: string;
  productDetails: MovementProductItem[];
  setProductDetails: React.Dispatch<React.SetStateAction<MovementProductItem[]>>;
}

type ProductResult = {
    id: number;
    name: string;
    code: string;
  };

export default function MovementDetailsControl({
  token,
  productDetails,
  setProductDetails,
}: MovementDetailsControlProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<ProductResult[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (query: string) => {
    try {
      const result = await getProducts({ page: 1, size: 100 }, token);

      const filtered: ProductResult[] = result.data
        .filter((product) =>
            product.name.toLowerCase().includes(query.trim().toLowerCase())
        )
        .map((product) => ({
            id: Number(product.id),
            name: product.name,
            code: product.code,
        }));

      if (filtered.length === 0) {
        toast("info", "No se encontraron productos");
        return;
      }

      setSearchResults(filtered);
      setIsSearching(true);
    } catch {
      toast("error", "Error al buscar productos");
    }
  };

  const handleCancelSearch = () => {
    setIsSearching(false);
    setSearchResults([]);
    setSelectedProductId("");
    setSearchQuery("");
    setQuantity(1);
  };

  const handleAddProduct = () => {
    const selected = searchResults.find((p) => p.id.toString() === selectedProductId);
    if (!selected) {
        toast("error", "Debes seleccionar un producto antes de agregar");
        return;
    }

    if (productDetails.some((p) => p.productId === selected.id.toString())) {
      toast("info", "El producto ya fue agregado");
      return;
    }

    const item: MovementProductItem = {
      productId: selected.id.toString(),
      code: selected.code,
      name: selected.name,
      quantity,
    };

    setProductDetails([...productDetails, item]);
    handleCancelSearch(); 
  };

  const tableData = productDetails.map((item, index) => ({
    ...item,
    id: index,
    rowNumber: index + 1,
  }));

  const columns: Column<(MovementProductItem & { rowNumber: number; id: number })>[] = [
    { header: "#", accessor: "rowNumber" },
    { header: "ID Producto", accessor: "productId" },
    { header: "Código", accessor: "code" },
    { header: "Nombre", accessor: "name" },
    { header: "Cantidad", accessor: "quantity" },
  ];

  const actions: TableAction<MovementProductItem & { id: number }>[] = [
    {
      icon: <Trash className="text-red-500" size={18} />,
      label: "Eliminar producto",
      onClick: (item) => {
        setProductDetails((prev) =>
          prev.filter((p) => p.productId !== item.productId)
        );
      },
    },
  ];

  return (
    <div className="w-full mt-4 space-y-2">
      <Label>Agregar Producto al Movimiento</Label>
  
      <div className="flex flex-col md:flex-row gap-2 flex-wrap items-center">
        {!isSearching ? (
          <>
            <div className="flex w-[78%] gap-2">
              <Input
                type="text"
                placeholder="Buscar producto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64"
              />
              <Button
                type="button"
                onClick={() => handleSearch(searchQuery)}
              >
                Buscar
              </Button>
            </div>
            <Input
              type="number"
              placeholder="Cantidad"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full md:w-28"
            />
            <Button type="button" onClick={handleAddProduct}>
              Agregar
            </Button>
          </>
        ) : (
          <>
            <Select
              value={selectedProductId}
              onValueChange={(value) => setSelectedProductId(value)}
            >
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Seleccionar producto..." />
              </SelectTrigger>
              <SelectContent>
                {searchResults.map((product) => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
  
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelSearch}
              className="text-red-500"
            >
              Cancelar
            </Button>
  
            <Input
              type="number"
              placeholder="Cantidad"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full md:w-28"
            />
            <Button type="button" onClick={handleAddProduct}>
              Agregar
            </Button>
          </>
        )}
      </div>
  
      {/* Tabla de productos */}
      <GenericTable
        data={tableData}
        columns={columns}
        actions={actions}
        actionsTitle="Acciones"
        emptyMessage="No hay productos agregados aún"
        className="mt-2"
      />
    </div>
  );
  
}
