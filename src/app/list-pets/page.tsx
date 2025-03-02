'use client'
import { useEffect, useMemo, useState } from 'react';
import { Card } from '../../components/global/Card'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Grid, List } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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


const GridView = ( { pets }: { pets: IPet[] } ) => {
    return (
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
            { pets.map((pet: IPet) => {
                return (
                    <Card
                        key={pet.id}
                        alt={`Imagen de un/a ${pet.specie}`}
                        title={pet.name}
                        image={pet.profileImg}
                        description={`${pet.specie} - ${pet.race}, ${pet.sex}`}
                        ctaText='Ver detalles'
                        ctaLink='/detalle-mascota'
                    />
                )
            })}
        </div>
    )
}


const ListView = ( { pets }: { pets: IPet[] } ) => {
    return (
        <div className="flex flex-col space-y-4 pb-10">
            {pets.map((pet: IPet) => (
                <div 
                    key={pet.id} 
                    className="flex items-center gap-4 p-4 border rounded-lg shadow-sm hover:bg-gray-100 transition"
                >
                    <Avatar className="w-16 h-16 overflow-hidden rounded-full">
                        <AvatarImage className='w-full h-full object-cover' src={pet.profileImg} alt={pet.name} />
                        <AvatarFallback>{pet.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                        <h3 className="text-lg font-semibold">{pet.name}</h3>
                        <p className="text-gray-600">{pet.specie} - {pet.race}</p>
                        <p className="text-sm text-gray-500">{pet.sex}</p>
                    </div>

                    <Button variant="outline">Ver detalles</Button>
                </div>
            ))}
        </div>
    )
}


const PetList = () => {
    const [isGridView, setIsGridView] = useState(true)
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


    const petListView = useMemo(() => {
        return isGridView ? <GridView pets={pets} /> : <ListView pets={pets} />;
    }, [isGridView]);

    return (
        <div className="flex-col">
            <h1 className="bg-gray-500 w-full p-4 text-3xl font-bold mb-8 text-white">Mis Mascotas</h1>
            <div className='grid  px-16 gap-6'>
                <div className='flex justify-around items-center gap-16 px-4'>
                    <div className='flex justify-start items-center w-full gap-4'>
                        <Input className='w-full' type='text' placeholder='Busca el nombre de tu mascota...'/>
                        <Button>Buscar</Button>
                    </div>
                    <div className='w-auto flex gap-2 items-center justify-end '>
                        <button onClick={ () => {setIsGridView(true)} } disabled={isGridView}>
                            <Grid className={`w-9 h-9 ${isGridView ? 'text-gray-400' : ''}`}/>
                        </button>
                        <button onClick={ () => {setIsGridView(false)} } disabled={!isGridView}>
                            <List className={`w-9 h-9 ${!isGridView ? 'text-gray-400' : ''}`}/>
                        </button>
                    </div>
                </div> 
                <hr />
                {petListView}
            </div>
        </div>
    );
};

export default PetList;