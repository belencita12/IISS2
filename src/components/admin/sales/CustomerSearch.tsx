"use client"

import { useState } from "react"
import { Search, UserPlus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

// Datos de ejemplo para clientes
const CUSTOMERS = [
  { id: "1", name: "Juan Pérez", email: "juan@ejemplo.com", phone: "555-1234", address: "Calle Principal 123" },
  { id: "2", name: "María García", email: "maria@ejemplo.com", phone: "555-5678", address: "Avenida Central 456" },
  { id: "3", name: "Carlos López", email: "carlos@ejemplo.com", phone: "555-9012", address: "Plaza Mayor 789" },
  { id: "4", name: "Ana Martínez", email: "ana@ejemplo.com", phone: "555-3456", address: "Calle Secundaria 321" },
  { id: "5", name: "Roberto Sánchez", email: "roberto@ejemplo.com", phone: "555-7890", address: "Avenida Norte 654" },
]

type Customer = {
  id: string
  name: string
  email: string
  phone: string
  address: string
}

type CustomerSearchProps = {
  onSelectCustomer: (customer: Customer) => void
}

export default function CustomerSearch({ onSelectCustomer }: CustomerSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isNewCustomerDialogOpen, setIsNewCustomerDialogOpen] = useState(false)
  const [isCommandOpen, setIsCommandOpen] = useState(false)

  // Filtrar clientes basados en el término de búsqueda
  const filteredCustomers = CUSTOMERS.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm),
  )

  const handleSelectCustomer = (customer: Customer) => {
    onSelectCustomer(customer)
    setIsCommandOpen(false)
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar cliente..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={() => setIsCommandOpen(true)}
          />

          {isCommandOpen && (
            <div className="absolute top-full left-0 right-0 z-10 mt-1">
              <Command className="rounded-lg border shadow-md">
                <CommandList>
                  <CommandGroup heading="Clientes">
                    {filteredCustomers.map((customer) => (
                      <CommandItem
                        key={customer.id}
                        onSelect={() => handleSelectCustomer(customer)}
                        className="cursor-pointer"
                      >
                        <div>
                          <p>{customer.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {customer.email} • {customer.phone}
                          </p>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          )}
        </div>

        <Dialog open={isNewCustomerDialogOpen} onOpenChange={setIsNewCustomerDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <UserPlus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Nombre
                </label>
                <Input id="name" placeholder="Nombre completo" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Correo Electrónico
                </label>
                <Input id="email" type="email" placeholder="correo@ejemplo.com" />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Teléfono
                </label>
                <Input id="phone" placeholder="555-1234" />
              </div>
              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">
                  Dirección
                </label>
                <Input id="address" placeholder="Calle, Ciudad, Estado" />
              </div>
              <Button className="w-full" onClick={() => setIsNewCustomerDialogOpen(false)}>
                Guardar Cliente
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
