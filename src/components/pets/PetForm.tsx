'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function PetForm() {
    const [petName, setPetName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [breed, setBreed] = useState('');
    const [animalType, setAnimalType] = useState('');
    const [gender, setGender] = useState('');
    const [isApproximateDate, setIsApproximateDate] = useState(true);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
    };

    return (
        <div className="max-w-5xl mx-auto p-8">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                    <h1 className="text-3xl font-bold mb-4">Registro de Mascota</h1>
                    <p className="text-gray-600 mb-6">Ingresa los datos de la mascota</p>
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
                            <div className="relative">
                                <input
                                    type="text"
                                    value={petName}
                                    onChange={(e) => setPetName(e.target.value)}
                                    placeholder="Ej. Luna"
                                    className="w-full p-3 border border-gray-200 rounded-lg pl-3"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Fecha de nacimiento</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                    className="w-full p-3 border border-gray-200 rounded-lg"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Raza</label>
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
                            <div className="relative">
                                <select
                                    value={animalType}
                                    onChange={(e) => setAnimalType(e.target.value)}
                                    className="w-full p-3 border border-gray-200 rounded-lg appearance-none"
                                >
                                    <option value="">Seleccionar</option>
                                    <option value="dog">Perro</option>
                                    <option value="cat">Gato</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Fecha de Nacimiento</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                    className="w-full p-3 border border-gray-200 rounded-lg"
                                    placeholder="01/11/2023"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center space-x-4 mt-2">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="dateType"
                                        checked={isApproximateDate}
                                        onChange={() => setIsApproximateDate(true)}
                                        className="mr-2 h-4 w-4"
                                    />
                                    <span>Fecha Aproximada</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="dateType"
                                        checked={!isApproximateDate}
                                        onChange={() => setIsApproximateDate(false)}
                                        className="mr-2 h-4 w-4"
                                    />
                                    <span>Fecha Real</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Género</label>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setGender('female')}
                                    className={cn(
                                        "py-2 px-4 rounded-lg border border-gray-200",
                                        gender === 'female' ? "bg-gray-100" : "bg-white"
                                    )}
                                >
                                    Hembra
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setGender('male')}
                                    className={cn(
                                        "py-2 px-4 rounded-lg border border-gray-200",
                                        gender === 'male' ? "bg-gray-100" : "bg-white"
                                    )}
                                >
                                    Macho
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end mt-8">
                            <button
                                type="submit"
                                className="bg-black text-white py-3 px-8 rounded-lg font-medium hover:bg-gray-800 transition-colors"
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