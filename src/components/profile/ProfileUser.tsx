"use client";
import Image from "next/image";
import { useProfileUser } from "@/hooks/users/useProfileUser";

interface ProfileUserProps {
  clientId: number;
  token: string;
}

export function ProfileUser({ clientId, token }: ProfileUserProps) {
  const {
    userData,
    editData,
    isEditing,
    loading,
    error,
    updateLoading,
    handleChange,
    handleFileChange,
    handleEdit,
    handleCancel,
    handleSave,
  } = useProfileUser(clientId, token);

  if (loading) return <div className="py-8 text-center">Cargando datos...</div>;
  if (error) return <div className="py-8 text-center text-red-500">{error.message}</div>;
  if (!userData) return <div className="py-8 text-center">No se encontraron datos del usuario</div>;

  return (
    <div className="py-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-violet-300">
            <Image
              src={userData.image?.originalUrl || "/blank-profile-picture-973460_1280.png"}
              alt="Foto de perfil"
              width={96}
              height={96}
              className="rounded-full object-cover"
            />
          </div>
        </div>

        <div className="space-y-4">
          {isEditing ? (
            <>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <Input label="Nombre completo" name="fullName" value={editData.fullName} onChange={handleChange} />
              <Input label="Email" name="email" type="email" value={editData.email} onChange={handleChange} />
              <Input label="Teléfono" name="phoneNumber" value={editData.phoneNumber} onChange={handleChange} />
              <Input label="Dirección" name="adress" value={editData.adress} onChange={handleChange} />
              <Input label="RUC" name="ruc" value={editData.ruc} disabled />
            </>
          ) : (
            <>
              <Field label="Nombre completo" value={userData.fullName} />
              <Field label="Email" value={userData.email} />
              <Field label="Teléfono" value={userData.phoneNumber || "No especificado"} />
              <Field label="Dirección" value={userData.adress || "No especificada"} />
              <Field label="RUC" value={userData.ruc || "No especificado"} />
            </>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          {isEditing ? (
            <>
              <button onClick={handleCancel} className="px-4 py-2 rounded border" disabled={updateLoading}>
                Cancelar
              </button>
              <button onClick={handleSave} className="px-4 py-2 rounded bg-violet-600 text-white" disabled={updateLoading}>
                {updateLoading ? "Guardando..." : "Guardar"}
              </button>
            </>
          ) : (
            <button onClick={handleEdit} className="px-4 py-2 rounded bg-violet-600 text-white">Editar</button>
          )}
        </div>
      </div>
    </div>
  );
}

function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <input {...props} className="w-full border rounded px-2 py-1" />
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
