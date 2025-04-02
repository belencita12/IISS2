"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

interface Purchase {
    id: number;
    provider: string;
    totalCost: number;
    taxCost: number;
    itemsCount: number;
    date: string;
}

export default function PurchaseList() {
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [filteredPurchases, setFilteredPurchases] = useState<Purchase[]>([]);

    useEffect(() => {
        const data = [
            { id: 1, provider: "ProveedorA 5699229", totalCost: 700000, taxCost: 63636, itemsCount: 87, date: "2023-08-27T09:20:23" },
            { id: 2, provider: "ProveedorA 563229", totalCost: 500000, taxCost: 45454, itemsCount: 75, date: "2023-08-26T11:30:10" },
            { id: 3, provider: "ProveedorA 5611229", totalCost: 900000, taxCost: 81818, itemsCount: 102, date: "2023-08-25T14:45:50" },
        ];
        setPurchases(data);
        setFilteredPurchases(data);
    }, []);

    return (
        <div className="p-4 mx-auto">
            <div className="flex gap-4 mb-4">
                <Select>
                    <SelectTrigger className="border p-2 w-32">
                        <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="categoria1">Categoría 1</SelectItem>
                        <SelectItem value="categoria2">Categoría 2</SelectItem>
                        <SelectItem value="categoria3">Categoría 3</SelectItem>
                    </SelectContent>
                </Select>
                <Select>
                    <SelectTrigger className="border p-2 w-32">
                        <SelectValue placeholder="Proveedor" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="proveedor1">Proveedor 1</SelectItem>
                        <SelectItem value="proveedor2">Proveedor 2</SelectItem>
                        <SelectItem value="proveedor3">Proveedor 3</SelectItem>
                    </SelectContent>
                </Select>
                <Select>
                    <SelectTrigger className="border p-2 w-32">
                        <SelectValue placeholder="Sucursal" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="sucursal1">Sucursal 1</SelectItem>
                        <SelectItem value="sucursal2">Sucursal 2</SelectItem>
                        <SelectItem value="sucursal3">Sucursal 3</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">Compras</h2>
                <Button className="px-6">Registrar Compra</Button>
            </div>


            <div className="space-y-4">
                {filteredPurchases.map((purchase) => (
                    <div key={purchase.id} className="border p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg">{purchase.provider}</h3>
                            <p>Costo Total: {purchase.totalCost.toLocaleString()} Gs.</p>
                            <p>Costo IVA Total: {purchase.taxCost.toLocaleString()} Gs.</p>
                            <p className="font-semibold">{purchase.itemsCount} Items</p>
                        </div>
                        <p className="text-gray-500">{new Date(purchase.date).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
