'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PetData, Race, Species } from '@/lib/pets/IPet';
import { getRacesAndSpecies } from '@/lib/pets/getRacesAndSpecies';
import { registerPet } from '@/lib/pets/registerPet';

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

export default function PetForm() {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [races, setRaces] = useState<Race[]>([]);
    const [species, setSpecies] = useState<Species[]>([]);

    const form = useForm<PetFormValues>({
        resolver: zodResolver(petFormSchema),
        defaultValues: {
            petName: '',
            birthDate: '',
            breed: '',
            animalType: '',
            gender: '',
            weight: 0,
        },
    });

    // Obtener razas y especies al montar el componente
    useEffect(() => {
        const fetchData = async () => {
            toast.success('Probando')
            try {
                const { races, species } = await getRacesAndSpecies();
                setRaces(races);
                setSpecies(species);
            } catch (error) {
                toast.error('Hubo un error al cargar los datos.');
            }
        };

        fetchData();
    }, []);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            form.setValue('imageFile', file);
            const tempUrl = URL.createObjectURL(file);
            setImagePreview(tempUrl);
        }
    };

    const onSubmit: SubmitHandler<PetFormValues> = async (data) => {
        const dateObj = new Date(data.birthDate);
        const formattedDate = `${dateObj.toISOString().split('T')[0]}T00:00:00.000Z`;
        const petData: PetData = {
            name: data.petName,
            speciesId: parseInt(data.animalType),
            raceId: parseInt(data.breed),
            weight: data.weight,
            sex: data.gender === 'male' ? 'Macho' : 'Hembra',
            profileImg: imagePreview || null,
            dateOfBirth: formattedDate,
            vaccinationBookletId: 1
        };

        try {
            const result = await registerPet(petData);
            console.log('Mascota registrada:', result);
            toast.success('Mascota registrada con éxito!');
            form.reset();
            setImagePreview(null);
        } catch (error) {
            toast.error('Hubo un error al registrar la mascota.');
        }
    };
    return (
        <div className="max-w-5xl mx-auto p-8">
            <div className="flex flex-col md:flex-row gap-16">
                <div className=" flex flex-col items-center space-y-4 w-80">
                    <h1 className="text-3xl font-bold self-start">Registro de Mascota</h1>
                    <p className="text-gray-600 self-start">Ingresa los datos de la mascota</p>

                    <div className="w-full flex flex-col items-start">
                        <Label className="text-sm font-semibold">Imagen (Opcional)</Label>
                        <Label htmlFor="image-upload" className="block mt-2 cursor-pointer">
                            <div className="w-full bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center text-gray-500 text-sm py-2 px-4">
                                Subir imagen de la mascota
                            </div>
                        </Label>
                        <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                        />
                    </div>

                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Vista previa de la mascota"
                            className="w-60 h-60 object-cover rounded-lg shadow-md"
                        />
                    )}
                </div>

                <div className="md:w-2/3 w-80">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="petName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej. Luna" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="birthDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fecha de nacimiento</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="breed"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Raza</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccionar" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {races.map((race) => (
                                                    <SelectItem key={race.id} value={race.id.toString()}>
                                                        {race.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="animalType"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Animal</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccionar" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {species.map((specie) => (
                                                    <SelectItem key={specie.id} value={specie.id.toString()}>
                                                        {specie.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="weight"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Peso</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />



                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Género</FormLabel>
                                        <div className="flex gap-4">
                                            <Button
                                                type="button"
                                                variant={field.value === 'female' ? 'default' : 'outline'}
                                                onClick={() => field.onChange('female')}
                                            >
                                                Hembra
                                            </Button>
                                            <Button
                                                type="button"
                                                variant={field.value === 'male' ? 'default' : 'outline'}
                                                onClick={() => field.onChange('male')}
                                            >
                                                Macho
                                            </Button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-start gap-4 mt-8">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => form.reset()}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit">Registrar Mascota</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}