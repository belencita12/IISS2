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
    race?: string
    weight: number
    sex: string
    profileImg?: string
    dateOfBirth: string
}

const IMAGE_NOT_FOUND = "/imagen-mascota/default.jpg" 
const BASE_URL = process.env.NEXTAUTH_URL

// Muestra una vista en forma de Grid
const GridView = ( { pets }: { pets: IPet[] } ) => {
    return (
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
            { pets.map((pet: IPet) => {
                return (
                    <Card
                        key={pet.id}
                        alt={`Imagen de un/a ${pet.specie}` || "Imagen no encontrada"}
                        title={pet.name}
                        image={pet.profileImg || IMAGE_NOT_FOUND}
                        description={`${pet.specie} - ${pet.race} - ${pet.sex}`}
                        ctaText='Ver detalles'
                        ctaLink={`/detalle-mascota?id=${pet.id}`}
                    />
                )
            })}
        </div>
    )
}

// Muestra una vista en forma de vista
const ListView = ( { pets }: { pets: IPet[] } ) => {
    return (
        <div className="flex flex-col space-y-4 pb-10">
            {pets.map((pet: IPet) => (
                <div 
                    key={pet.id} 
                    className="flex items-center gap-4 p-4 border rounded-lg shadow-sm hover:bg-gray-100 transition"
                >
                    <Avatar className="w-16 h-16 overflow-hidden rounded-full">
                        <AvatarImage className='w-full h-full object-cover' src={pet.profileImg || IMAGE_NOT_FOUND} alt={pet.name || 'Imagen no encontrada'} />
                        <AvatarFallback>{pet.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                        <h3 className="text-lg font-semibold">{pet.name}</h3>
                        <p className="text-gray-600">{pet.specie} - {pet.race}</p>
                        <p className="text-sm text-gray-500">{pet.sex}</p>
                    </div>

                    <a href={`/detalle-mascota?id=${pet.id}`}>
                        <Button variant="outline">Ver detalles</Button>
                    </a>
                </div>
            ))}
        </div>
    )
}


const ListPets = () => {
    const [isGridView, setIsGridView] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [pets, setPets] = useState<IPet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPets = async () => {
        try {
            const response = await fetch(`${BASE_URL}/pet`);
            
            if (!response.ok) throw new Error('Error al obtener mascotas');
            
            const data = await response.json();

            setPets(data);
        } catch {
            setError('No se pudieron cargar las mascotas');
        } finally {
            setLoading(false);
        }
        };

        fetchPets();
    }, []);

    // Filtra las mascotas cada que "searchTerm" se actualice
    const filteredPets = useMemo(() => {
        return pets.filter(pet => pet.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm, pets]);

    // Deduce si mostrar vista de Grid o Lista cada que se actualicen "isGridView" y "filteredPets"
    const petListView = useMemo(() => {
        return isGridView ? <GridView pets={filteredPets} /> : <ListView pets={filteredPets} />;
    }, [isGridView, filteredPets]);

    return (
        <div className="flex-col">
            <h1 className="bg-gray-500 w-full p-4 text-3xl font-bold mb-8 text-white">Mis Mascotas</h1>
            <div className='grid  px-16 gap-6'>
                <div className='flex justify-around items-center gap-16 px-4'>
                    <div className='flex justify-start items-center w-full gap-4'>
                        <Input className='w-full' type='text' placeholder='Busca el nombre de tu mascota...' value={searchTerm} onChange={ (e) => setSearchTerm(e.target.value)}/>
                        <Button onClick={ () => setSearchTerm('')}>Limpiar</Button>
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
                {loading ? (
                    <div className="text-center mt-8">Cargando...</div>
                ) : error ? (
                    <div className="text-red-500 text-center mt-8">{error}</div>
                ) : (
                    petListView
                )}
            </div>
        </div>
    );
};

export default ListPets;