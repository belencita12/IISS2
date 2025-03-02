'use client'
import { useEffect, useState } from 'react';
import { Card } from '../../components/global/Card'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Grid, List } from 'lucide-react';

interface IPet {
    id: number
    name: string
    specie: string
    race: string
    weight: number
    sex: string
    profileImg: string
    dateOfBirth: string
}

const pets: IPet[] = [
    {
        id:  1,
        name: "Bonnie",
        specie: "Canino",
        race: "Caniche",
        weight: 5,
        sex: "Hembra",
        profileImg: "/imagen-mascota/perro-caniche.jpg",
        dateOfBirth: "2021-05-18T00:00:00.000z"
    },
    {
        id:  2,
        name: "Coco",
        specie: "Ave",
        race: "Amazona Autumnalis",
        weight: 0.420,
        sex: "Macho",
        profileImg: "/imagen-mascota/loro-verde.jpg",
        dateOfBirth: "2023-07-21T00:00:00.000z"
    },
    {
        id:  3,
        name: "Enrique",
        specie: "Canino",
        race: "Labrador",
        weight: 34,
        sex: "Macho",
        profileImg: "/imagen-mascota/perro-labrador.jpg",
        dateOfBirth: "2022-06-14T00:00:00.000z"
    },
    {
        id:  4,
        name: "Manchitas",
        specie: "Felino",
        race: "Bombay",
        weight: 4,
        sex: "Hembra",
        profileImg: "/imagen-mascota/gato-negro.jpg",
        dateOfBirth: "2023-10-28T00:00:00.000z"
    },
    {
        id:  5,
        name: "Coco",
        specie: "Ave",
        race: "Amazona Autumnalis",
        weight: 0.420,
        sex: "Macho",
        profileImg: "/imagen-mascota/loro-verde.jpg",
        dateOfBirth: "2023-07-21T00:00:00.000z"
    },
] 

const PetList = () => {
  // const [pets, setPets] = useState<IPet[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState('');

  // useEffect(() => {
    // const fetchPets = async () => {
      // try {
        // const response = await fetch('https://actual-maribeth-fiuni-9898c42e.koyeb.app/api/pet', {
          // headers: {
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          // }
        // });
        
        // if (!response.ok) throw new Error('Error al obtener mascotas');
        
        // const data = await response.json();

        // setPets(pets);
      // } catch (err) {
        // setError('No se pudieron cargar las mascotas');
      // } finally {
        // setLoading(false);
      // }
    // };

    // fetchPets();
  // }, []);

  // if (loading) return <div className="text-center mt-8">Cargando...</div>;
  // if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;

  return (
    <div className="flex-col">
        <h1 className="bg-gray-500 w-full p-4 text-3xl font-bold mb-8 text-white">Mis Mascotas</h1>
        <div className='grid  px-16 gap-4'>
            <div className='flex md:flex-row justify-around items-center'>
                <div className='flex justify-start items-center w-full px-4 gap-4'>
                    <Input className='w-full' type='text' placeholder='Busca el nombre de tu mascota...'/>
                    <Button>Buscar</Button>
                </div>
                <div className='w-auto flex gap-4 items-center justify-end '>
                    <a>
                        <Grid className='w-9 h-9'/>
                    </a>
                    <a>
                        <List className='w-9 h-9'/>
                    </a>
                </div>
            </div> 
            <hr />
            <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
                { pets.map((pet: IPet) => {
                    return (
                        <Card
                            key={pet.id}
                            alt={`Imagen de un/a ${pet.specie}`}
                            title={pet.name}
                            image={pet.profileImg}
                            description={`Especie: ${pet.specie}\nRaza: ${pet.race}\nSexo: ${pet.sex}`}
                            ctaText='Ver detalles'
                            ctaLink='/detalle-mascota'
                        />
                    )
                })}
            </div>
        </div>
    </div>
  );
};

export default PetList;