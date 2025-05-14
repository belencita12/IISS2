'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from '@/lib/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Race, Species } from '@/lib/pets/IPet';
import { getRacesBySpecies, getSpecies } from '@/lib/pets/getRacesAndSpecies';
import { registerPet } from '@/lib/pets/registerPet';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { useTranslations } from 'next-intl';

const MAX_FILE_SIZE = 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

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
    imageFile: z
        .instanceof(File)
        .refine((file) => ALLOWED_IMAGE_TYPES.includes(file.type), {
            message: 'Solo se permiten imágenes en formato JPG, PNG o WEBP',
        })
        .refine((file) => file.size <= MAX_FILE_SIZE, {
            message: 'La imagen no debe superar 1MB',
        })
        .optional(),
});

type PetFormValues = z.infer<typeof petFormSchema>;
interface PetFormProps {
    clientId?: number;
    token?: string;
}

export default function PetForm({ clientId, token }: PetFormProps) {
    const e = useTranslations("Error")
    const b= useTranslations("Button");
    const p= useTranslations("PetForm");
    const ph= useTranslations("Placeholder");

    const [species, setSpecies] = useState<Species[]>([]);
    const [races, setRaces] = useState<Race[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const [previewImage, setPreviewImage] = useState<string | null>(null);
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
            imageFile: undefined
        },
    });
    //Obtiene las especies
    useEffect(() => {
        if (!token) return;
        const fetchSpecies = async () => {
            try {
                const speciesData = await getSpecies(token);
                setSpecies(speciesData);
            } catch(error:unknown) {
                toast("error", error instanceof Error ? error.message : e("error"));
            }
        };
        fetchSpecies();
    }, [token]);

    //Obtiene las razas a partir de las especies
    const handleSpeciesChange = async (speciesId: string) => {
        setRaces([]);
        if (!speciesId || !token) return;
        try {
            const racesData = await getRacesBySpecies(parseInt(speciesId), token);
            setRaces(racesData);
        } catch(error: unknown) {
            toast("error", error instanceof Error ? error.message : e("error"));
        }
    };
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPreviewImage(null);
        const file = event.target.files?.[0];
        if (!file) {
            setValue('imageFile', undefined);
            return;
        }
        setValue('imageFile', file);
        const reader = new FileReader();
        reader.onload = (e) => setPreviewImage(e.target?.result as string);
        reader.readAsDataURL(file)
    };
    const onSubmit = async (data: PetFormValues) => {
        if (!clientId || !token) {
            toast("error", "Debes estar autenticado para registrar una mascota.");
            return;
        }
        const formData = new FormData();
        Object.entries({
            name: data.petName,
            clientId: clientId.toString(),
            speciesId: data.animalType,
            raceId: data.breed,
            weight: data.weight.toString(),
            sex: data.gender,
            dateOfBirth: new Date(data.birthDate).toISOString(),
        }).forEach(([key, value]) => formData.append(key, value));
        if (data.imageFile) formData.append("profileImg", data.imageFile);
        setIsSubmitting(true);
        try {
            await registerPet(formData, token);
            toast("success", "Mascota registrada con éxito!", {
                duration: 2000,
                onAutoClose: () => {router.push('/user-profile');},
                onDismiss: () => router.push('/user-profile'),
            });
        } catch (error: unknown) {
            toast("error", error instanceof Error ? error.message : e("error"));
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="max-w-5xl mx-auto p-8">
            <div className="flex flex-col md:flex-row gap-16">
                <div className="flex flex-col items-center space-y-4 w-80">
                    <h1 className="text-3xl font-bold self-start">{p("petFormTitle")}</h1>
                    <p className="text-gray-600 self-start">{p("description")}</p>
                    <div className="w-full flex flex-col items-center">
                        <h3 className="text-sm font-semibold mb-2 text-gray-700">{p("image")}</h3>
                        <div className="w-full flex flex-col items-center relative">
                            <Label className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium text-center cursor-pointer">
                                <Input
                                    type="file"
                                    accept="image/jpeg, image/png, image/webp"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                {previewImage ? b("change") : b("upload")}
                            </Label>
                            {previewImage && (
                                <div className="w-full mt-4">
                                    <Image
                                        src={previewImage}
                                        className="w-full h-auto rounded-md"
                                        alt="Vista previa de la mascota"
                                        width={96}
                                        height={96}
                                        priority
                                    />
                                </div>
                            )}
                            {errors.imageFile && (
                                <p className="text-red-500 text-sm mt-2">{errors.imageFile.message}</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="md:w-2/3 w-80">
                    <form
                        id="petForm"
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <div>
                            <Label>{p("name")}</Label>
                            <Input
                                id="petName"
                                {...register('petName')}
                                placeholder={ph("name")}
                            />
                            {errors.petName && <p className="text-red-500">{errors.petName.message}</p>}
                        </div>
                        <div>
                            <Label>{p("born")}</Label>
                            <Input
                                id="birthDate"
                                type="date"
                                {...register('birthDate')}
                                max={new Date().toISOString().split("T")[0]}
                            />
                            {errors.birthDate && <p className="text-red-500">{errors.birthDate.message}</p>}
                        </div>
                        <div>
                            <Label>{p("specie")}</Label>
                            <Select
                                onValueChange={(value) => {
                                    setValue('animalType', value);
                                    handleSpeciesChange(value);
                                }}
                            >
                                <SelectTrigger id="animalType">
                                    <SelectValue placeholder={ph("select")} />
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
                            <Label>{p("race")}</Label>
                            <Select
                                onValueChange={(value) => setValue('breed', value)}
                            >
                                <SelectTrigger id="breed">
                                    <SelectValue placeholder={races.length > 0 ? ph("select") : p("selectFirst")} />
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
                            <Label>{p("weight")}</Label>
                            <Input
                                id="weight"
                                type="number"
                                step={0.1}
                                min="0"
                                onKeyDown={(e) => {
                                    if (e.key === "-" || e.key === "e") e.preventDefault();
                                }}
                                {...register('weight')}
                            />
                            {errors.weight && <p className="text-red-500">{errors.weight.message}</p>}
                        </div>
                        <div>
                            <Label>{p("sex")}</Label>
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