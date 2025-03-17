import { IUserProfile } from '@/lib/client/IUserProfile';
import Image from 'next/image';

export default function ClientProfileSection({ fullName,email,image}: IUserProfile) {
  return (
    <section className="flex flex-wrap items-center gap-4 px-16 mx-auto md:gap-16 md:px-24 py-12">
      <Image
        src={image?.originalUrl || "/default-avatar.png"}
        alt={fullName}
        width={250}
        height={250}
        className="rounded-full bg-cover md:w[250px] md:h[250px]"
      />
      <div>
        <h1 className="text-xl md:text-3xl font-bold text-gray-800">
          {fullName}
        </h1>
        <p className=" text-gray-600 text-wrap">{email}</p>
      </div>
    </section>
  );
}