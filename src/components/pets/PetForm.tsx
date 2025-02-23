'use client';

import { useState } from 'react';
import { PetData } from '@/lib/pets/IPet';
import { registerPet } from '@/lib/pets/registerPet';

export default function PetForm() {
    const [petName, setPetName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [breed, setBreed] = useState('');
    const [animalType, setAnimalType] = useState('');
    const [gender, setGender] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [formErrors, setFormErrors] = useState <{[key: string]: string}>({});


    const validateForm = () => {
        const errors: {[key: string]: string} = {};

        if (!petName.trim()) errors.petName = 'El nombre es obligatorio';
        if (!birthDate) errors.birthDate = 'La fecha de nacimiento es obligatoria';
        if (!breed.trim()) errors.breed = 'La raza es obligatoria';
        if (!animalType) errors.animalType = 'Debes seleccionar un tipo de animal';
        if (!gender) errors.gender = 'Debes seleccionar un género';

        setFormErrors(errors);
        console.log(errors);
        return Object.keys(errors).length === 0;
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!validateForm()) return;

        const speciesId = animalType === 'dog' ? 1 : 2;
        const raceId = breed === 'Labrador' ? 101 : 102;

        const petData: PetData = {
            name: petName,
            speciesId,
            raceId,
            profileImg: null,
            dateOfBirth: birthDate,

        };

        try {
            const data = await registerPet(petData);
            console.log('Mascota registrada:', data);

            setPetName('');
            setBirthDate('');
            setBreed('');
            setAnimalType('');
            setGender('');
            setImagePreview(null);
            setImageFile(null);

            alert('Mascota registrada con éxito!');
        } catch (error) {
            console.error('Error al registrar la mascota:', error);
            alert('Hubo un error al registrar la mascota.');
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-8">
            <div className="flex flex-col md:flex-row gap-16">
                <div className="md:w-1/3 flex flex-col items-center justify-center">
                    <h1 className="text-3xl font-bold mb-4">Registro de Mascota</h1>
                    <p className="text-gray-600 mb-6 text-center">Ingresa los datos de la mascota</p>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Imagen (Opcional)</label>
                        <div className="relative">
                            <label htmlFor="image-upload" className="block cursor-pointer">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Vista previa de mascota"
                                        className="w-full h-64 object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center w-full h-48 border border-gray-300 rounded-lg bg-gray-50 p-4">
                                        <p className="text-sm text-gray-500">Subir imagen de la mascota</p>
                                    </div>
                                )}
                            </label>
                            <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                        </div>
                    </div>
                </div>
                <div className="md:w-2/3">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Nombre</label>
                            {formErrors.petName && <p className="text-red-500 text-sm mt-1">{formErrors.petName}</p>}
                            <input
                                type="text"
                                value={petName}
                                onChange={(e) => setPetName(e.target.value)}
                                placeholder="Ej. Luna"
                                className="w-full p-3 border border-gray-200 rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Fecha de nacimiento</label>
                            {formErrors.birthDate && <p className="text-red-500 text-sm mt-1">{formErrors.birthDate}</p>}
                            <input
                                type="date"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Raza</label>
                            {formErrors.breed && <p className="text-red-500 text-sm mt-1">{formErrors.breed}</p>}
                            <input
                                type="text"
                                value={breed}
                                onChange={(e) => setBreed(e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-lg"
                                placeholder="Ej. Labrador"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Animal</label>
                            {formErrors.animalType && <p className="text-red-500 text-sm mt-1">{formErrors.animalType}</p>}
                            <select
                                value={animalType}
                                onChange={(e) => setAnimalType(e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-lg"
                            >
                                <option value="">Seleccionar</option>
                                <option value="dog">Perro</option>
                                <option value="cat">Gato</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Género</label>
                            {formErrors.gender && <p className="text-red-500 text-sm mt-1">{formErrors.gender}</p>}
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setGender('female')}
                                    className={`py-2 px-4 rounded-lg border border-gray-200 ${gender === 'female' ? 'bg-gray-100' : 'bg-white'}`}
                                >
                                    Hembra
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setGender('male')}
                                    className={`py-2 px-4 rounded-lg border border-gray-200 ${gender === 'male' ? 'bg-gray-100' : 'bg-white'}`}
                                >
                                    Macho
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-start gap-4 mt-8">
                            <button
                                type="button"
                                onClick={() => { }}
                                className="w-40 border border-black text-black py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="w-40 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                            >
                                Registrar Mascota
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>

    );
}

