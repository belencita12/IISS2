import ServiceTypeForm from '@/components/admin/settings/service-types/ServiceTypeForm';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth/options';
import { redirect } from "next/navigation";
import { getServiceTypeById } from '@/lib/service-types/service';

export default async function ServiceTypeEditPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) {
      redirect("/login");
    }

    const serviceType = await getServiceTypeById(session.user.token, parseInt(params.id));

    const initialData = {
      name: serviceType.name,
      slug: serviceType.slug,
      description: serviceType.description,
      durationMin: serviceType.durationMin,
      _iva: serviceType.iva,
      _price: serviceType.price,
      cost: serviceType.cost,
      maxColabs: serviceType.maxColabs,
      isPublic: serviceType.isPublic,
      tags: serviceType.tags || [],
      img: undefined,
      imageUrl: serviceType.img?.originalUrl || "/NotImageNicoPets.png",
    };

    return (
      <div className="space-y-6">
        <ServiceTypeForm 
          token={session?.user.token} 
          _initialData={initialData}
          _isSubmitting={false}
          id={parseInt(params.id)}
        />
      </div>
    );
} 