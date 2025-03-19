"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface User {
  id: number;
  fullName: string;
  image: {
    previewUrl: string;
  };
}

interface UserBarProps {
  token: string;
}

const UserBar: React.FC<UserBarProps> = ({ token }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!token) return;

    const userId = parseJwt(token)?.id;
    if (!userId) return;

    fetch(`/apiURL/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((error) => console.error("Error fetching user:", error));
  }, [token]);

  const parseJwt = (token: string) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="bg-gray-300 p-4 flex items-center">
      {user ? (
        <>
          <Image
            src={user.image.previewUrl}
            alt="User Profile"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="ml-3 font-medium">{user.fullName}</span>
        </>
      ) : (
        <p>Cargando usuario...</p>
      )}
    </div>
  );
};

export default UserBar;
