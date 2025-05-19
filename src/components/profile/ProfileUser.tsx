"use client"

import type React from "react"

import Image from "next/image"
import { useProfileUser } from "@/hooks/profile/useProfileUser"
import { Loader2, Camera, User, Mail, Phone, MapPin, Building } from "lucide-react"
import { ProfileUserSkeleton } from "./skeleton/ProfileUserSkeleton"
import { Button } from "../ui/button"
import { useTranslations } from "next-intl"

interface ProfileUserProps {
  clientId: number
  token: string
  updateUserData?: (data: { fullName?: string; avatarSrc?: string; ruc?: string | null }) => void
}

export function ProfileUser({ clientId, token, updateUserData }: ProfileUserProps) {
  const t = useTranslations("ProfileUser");
  const b= useTranslations("Button");
  const e= useTranslations("Error");
  const c = useTranslations("ClientForm");
  const ph = useTranslations ("Placeholder");

  const { 
    userData, 
    isEditing, 
    loading, 
    updateLoading, 
    previewImage, 
    imageError,
    register, 
    errors, 
    handleSubmit, 
    handleFileChange, 
    handleEdit, 
    handleCancel,
  } = useProfileUser(clientId, token, updateUserData)

  if (loading) {
    return <ProfileUserSkeleton />
  }

  if (!userData) {
    return (
          <p className="mt-4 text-gray-500 text-center">{e("notFound")}</p>
    )
  }

  return (
    <div className="py-6 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-violet-300 via-violet-500 to-fuchsia-300 h-24 relative px-4 flex items-center text-white">
          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-16">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-white">
                <Image
                  src={
                    previewImage ||
                    userData.image?.originalUrl ||
                    "/blank-profile-picture-973460_1280.png" ||
                    "/placeholder.svg"
                  }
                  alt="Foto de perfil"
                  width={128}
                  height={128}
                  className="rounded-full object-cover w-full h-full"
                />
              </div>
              {isEditing && (
                <div className="relative">
                  <label className="absolute bottom-0 right-0 bg-violet-600 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-violet-700 transition-colors duration-200">
                    <Camera size={18} />
                    <input 
                      type="file" 
                      accept="image/jpeg,image/png,image/webp,image/gif" 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />
                  </label>
                  {imageError && (
                    <div className="absolute -right-32 bottom-2 bg-red-100 text-red-600 text-xs p-2 rounded-lg shadow-md w-48">
                      {imageError}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-20 pb-6 px-6">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="space-y-4">
                <FormField
                  label={c("name")}
                  icon={<User size={18} className="text-violet-500" />}
                  error={errors.fullName?.message}
                >
                  <input
                    {...register("fullName")}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 transition-all duration-200"
                    placeholder={ph("name")}
                  />
                </FormField>

                <FormField
                  label={c("email")}
                  icon={<Mail size={18} className="text-violet-500" />}
                  error={errors.email?.message}
                >
                  <input
                    {...register("email")}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 transition-all duration-200"
                    placeholder={ph("email")}
                  />
                </FormField>

                <FormField
                  label={c("phone")}
                  icon={<Phone size={18} className="text-violet-500" />}
                  error={errors.phoneNumber?.message}
                >
                  <input
                    {...register("phoneNumber")}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 transition-all duration-200"
                    placeholder={ph("phone")}
                  />
                </FormField>

                <FormField
                  label={c("address")}
                  icon={<MapPin size={18} className="text-violet-500" />}
                  error={errors.adress?.message}
                >
                  <input
                    {...register("adress")}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 transition-all duration-200"
                    placeholder={ph("address")}
                  />
                </FormField>

                <FormField
                  label={c("ruc")}
                  icon={<Building size={18} className="text-violet-500" />}
                  error={errors.ruc?.message}
                >
                  <input
                    {...register("ruc")}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 cursor-not-allowed"
                    disabled
                  />
                </FormField>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
              <Button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2.5 rounded-lg border border-gray-300 hover:bg-white text-gray-700 font-medium bg-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                disabled={updateLoading}
              >
                {b("cancel")}
              </Button>
                <Button
                  type="submit"
                  className="bg-pink-500 text-white flex items-center gap-2 hover:bg-pink-600 px-5 py-2.5 rounded-lg font-medium transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={updateLoading}
                >
                  {updateLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin mr-2" />
                      {b("saving")}
                    </>
                  ) : (
                    b("save")
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <>
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">{userData.fullName}</h2>
                <p className="text-violet-600">{userData.email}</p>
              </div>

              <div className="space-y-4 bg-gray-50 rounded-xl p-5">
                <InfoField
                  icon={<Phone size={18} className="text-violet-500" />}
                  label={c("phone")}
                  value={userData.phoneNumber || e("noSpecified")}
                />
                <div className="border-t border-gray-200 pt-4"></div>
                <InfoField
                  icon={<MapPin size={18} className="text-violet-500" />}
                  label={c("address")}
                  value={userData.adress || e("noSpecified")}
                />
                <div className="border-t border-gray-200 pt-4"></div>
                <InfoField
                  icon={<Building size={18} className="text-violet-500" />}
                  label={c("ruc")}
                  value={userData.ruc || e("noSpecified")}
                />
              </div>

              <div className="mt-6 flex justify-center">
              <Button
                onClick={handleEdit}
                className="bg-pink-500 text-white flex items-center gap-2 hover:bg-pink-600 px-5 py-2.5 rounded-lg font-medium transition-colors duration-200"
              >
                {b("edit")}
              </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function FormField({ label, icon, error, children,
}: {
  label: string
  icon: React.ReactNode
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block mb-1.5">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          {icon}
          {label}
        </div>
      </label>
      {children}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

function InfoField({ icon, label, value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-start">
      <div className="mr-3 mt-0.5">{icon}</div>
      <div>
        <p className="text-sm text-gray-500 mb-0.5">{label}</p>
        <p className="font-medium text-gray-800">{value}</p>
      </div>
    </div>
  )
}