import React, { useState } from 'react';

const PaginatedPetsTable = ({ token, id }: { token: string; id: number }) => {
  // Datos simulados de las mascotas (hardcodeados)
  const pets = [
    { id: 1, name: "Firulais", species: "Perro", breed: "Labrador", age: 5 },
    { id: 2, name: "Mittens", species: "Gato", breed: "Siames", age: 3 },
  ];

  return (
    <div>
      {pets.length === 0 ? (
        <div>No hay mascotas registradas</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Especie</th>
              <th>Raza</th>
              <th>Edad</th>
            </tr>
          </thead>
          <tbody>
            {pets.map((pet) => (
              <tr key={pet.id}>
                <td>{pet.name}</td>
                <td>{pet.species}</td>
                <td>{pet.breed}</td>
                <td>{pet.age}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PaginatedPetsTable;



