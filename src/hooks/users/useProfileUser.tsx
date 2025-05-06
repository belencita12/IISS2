"use client";
import { useEffect, useState, ChangeEvent } from "react";
import { useFetch } from "@/hooks/api/useFetch";
import { toast } from "@/lib/toast";
import { AUTH_API, CLIENT_API } from "@/lib/urls";
import { IUserProfile, FormClient } from "@/lib/client/IUserProfile";

export function useProfileUser(clientId: number, token: string) {
  const [userData, setUserData] = useState<IUserProfile | null>(null);
  const [editData, setEditData] = useState<FormClient>({
    fullName: "",
    adress: "",
    phoneNumber: "",
    ruc: "",
    email: "",
  });
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { data, loading, error, execute: fetchUser } = useFetch<IUserProfile>(
    `${AUTH_API}/me`,
    token,
    { immediate: true }
  );

  const { loading: updateLoading, execute: updateUser } = useFetch<IUserProfile>(
    `${CLIENT_API}/${clientId}`,
    token,
    { method: "PATCH" }
  );

  useEffect(() => {
    if (data) {
      setUserData(data);
      setEditData({
        fullName: data.fullName,
        adress: data.adress || "",
        phoneNumber: data.phoneNumber || "",
        ruc: data.ruc || "",
        email: data.email,
      });
    }
  }, [data]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileFile(e.target.files[0]);
    }
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    if (userData) {
      setEditData({
        fullName: userData.fullName,
        adress: userData.adress || "",
        phoneNumber: userData.phoneNumber || "",
        ruc: userData.ruc || "",
        email: userData.email,
      });
      setProfileFile(null);
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!userData) return;

    const formData = new FormData();
    formData.append("fullName", editData.fullName);
    formData.append("email", editData.email);
    formData.append("adress", editData.adress || "");
    formData.append("phoneNumber", editData.phoneNumber || "");
    formData.append("ruc", editData.ruc || "");
    if (profileFile) formData.append("profileImg", profileFile);

    const response = await updateUser(formData);
    if (response.ok && response.data) {
      setUserData(response.data);
      toast("success", "Datos actualizados correctamente");
      setIsEditing(false);
    }
  };

  return {
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
  };
}
