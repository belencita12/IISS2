'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PetData, Race, Species } from '@/lib/pets/IPet';
import { getRacesBySpecies, getSpecies } from '@/lib/pets/getRacesAndSpecies';
import { registerPet } from '@/lib/pets/registerPet';
import { useRouter } from 'next/navigation';

const petFormSchema = z.object({
    petName: z.string().min(1, 'El nombre es obligatorio'),
    birthDate: z.string().min(1, 'La fecha de nacimiento es obligatoria'),
    breed: z.string().min(1, 'La raza es obligatoria'),
    animalType: z.string().min(1, 'Debes seleccionar un tipo de animal'),
    gender: z.string().min(1, 'Debes seleccionar un género'),
    weight: z.union([z.string(), z.number()])
        .refine((val) => !isNaN(parseFloat(String(val))) && parseFloat(String(val)) > 0, {
            message: 'El peso debe ser un número válido mayor a 0',
        })
        .transform((val) => parseFloat(String(val))),
    imageFile: z.any().optional(),
});

type PetFormValues = z.infer<typeof petFormSchema>;
interface PetFormProps {
    userId?: number;
    token?: string;
}

export default function PetForm({ userId, token }: PetFormProps) {
    const [species, setSpecies] = useState<Species[]>([]);
    const [races, setRaces] = useState<Race[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<PetFormValues>({
        resolver: zodResolver(petFormSchema),
        defaultValues: {
            petName: '',
            birthDate: '',
            breed: '',
            animalType: '',
            gender: '',
            weight: 0,
            imageFile: ''
        },
    });

    //Obtiene las especies
    useEffect(() => {
        const fetchSpecies = async () => {
            if (!token) {
                toast.error("No tienes permisos para ver esta información.");
                return;
            }

            try {
                const speciesData = await getSpecies(token);
                setSpecies(speciesData);
            } catch {
                toast.error("Error al obtener las especies.");
            }
        };

        fetchSpecies();
    }, [token]);

    //Obtiene las razas a partir de las especies
    const handleSpeciesChange = async (speciesId: string) => {
        setRaces([]);

        if (!speciesId) return;

        try {
            const racesData = await getRacesBySpecies(parseInt(speciesId), token!);
            setRaces(racesData);
        } catch {
            toast.error("Error al obtener las razas.");
        }
    };

    const onSubmit = async (data: PetFormValues) => {
        if (!userId || !token) {
            toast.error("Debes estar autenticado para registrar una mascota.");
            return;
        }

        const petData: PetData = {
            name: data.petName,
            userId,
            speciesId: parseInt(data.animalType),
            raceId: parseInt(data.breed),
            weight: data.weight,
            sex: data.gender,
            profileImg: data.imageFile || null,
            dateOfBirth: new Date(data.birthDate).toISOString(),
        };

        setIsSubmitting(true);

        try {
            await registerPet(petData, token);
            toast.success("Mascota registrada con éxito!", {
                duration: 2000,
                onAutoClose: () => {
                    router.push('/user-profile');
                }
            });
        } catch {
            toast.error("Hubo un error al registrar la mascota.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-8">
            <div className="flex flex-col md:flex-row gap-16">
                <div className="flex flex-col items-center space-y-4 w-80">
                    <h1 className="text-3xl font-bold self-start">Registro de Mascota</h1>
                    <p className="text-gray-600 self-start">Ingresa los datos de la mascota</p>

                    <div className="w-full flex flex-col items-start">
                        <Label className="text-sm font-semibold">Imagen (Opcional)</Label>
                        <Input
                            id="pet-image-file"
                            {...register('imageFile')}
                            className='mt-2'
                            placeholder='Subir url imagen de la mascota'
                            type='text'
                        />
                    </div>
                </div>

                <div className="md:w-2/3 w-80">
                    <form
                        id="petForm"
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <div>
                            <Label>Nombre</Label>
                            <Input
                                id="petName"
                                {...register('petName')}
                                placeholder="Ej. Luna"
                            />
                            {errors.petName && <p className="text-red-500">{errors.petName.message}</p>}
                        </div>

                        <div>
                            <Label>Fecha de nacimiento</Label>
                            <Input
                                id="birthDate"
                                type="date"
                                {...register('birthDate')}
                                max={new Date().toISOString().split("T")[0]}
                            />
                            {errors.birthDate && <p className="text-red-500">{errors.birthDate.message}</p>}
                        </div>

                        <div>
                            <Label>Animal</Label>
                            <Select
                                onValueChange={(value) => {
                                    setValue('animalType', value);
                                    handleSpeciesChange(value);
                                }}
                            >
                                <SelectTrigger id="animalType">
                                    <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent>
                                    {species.map((specie) => (
                                        <SelectItem
                                            key={specie.id}
                                            value={specie.id.toString()}
                                        >
                                            {specie.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.animalType && <p className="text-red-500">{errors.animalType.message}</p>}
                        </div>

                        <div>
                            <Label>Raza</Label>
                            <Select
                                onValueChange={(value) => setValue('breed', value)}
                            >
                                <SelectTrigger id="breed">
                                    <SelectValue placeholder={races.length > 0 ? "Seleccionar" : "Selecciona una especie primero"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {races.map((race) => (
                                        <SelectItem
                                            key={race.id}
                                            value={race.id.toString()}
                                        >
                                            {race.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.breed && <p className="text-red-500">{errors.breed.message}</p>}
                        </div>

                        <div>
                            <Label>Peso (kg)</Label>
                            <Input
                                id="weight"
                                type="number"
                                {...register('weight')}
                            />
                            {errors.weight && <p className="text-red-500">{errors.weight.message}</p>}
                        </div>

                        <div>
                            <Label>Género</Label>
                            <div className="flex gap-4">
                                <Button
                                    id="genderFemale"
                                    type="button"
                                    variant={watch('gender') === "F" ? "default" : "outline"}
                                    onClick={() => setValue('gender', "F")}
                                >
                                    Hembra
                                </Button>
                                <Button
                                    id="genderMale"
                                    type="button"
                                    variant={watch('gender') === "M" ? "default" : "outline"}
                                    onClick={() => setValue('gender', "M")}
                                >
                                    Macho
                                </Button>
                            </div>
                            {errors.gender && <p className="text-red-500">{errors.gender.message}</p>}
                        </div>

                        <div className="flex justify-start gap-4 mt-8">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push('/user-profile')}
                            >
                                Cancelar
                            </Button>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Registrando..." : "Registrar Mascota"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}