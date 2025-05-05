import ServiceTypeForm from '@/components/admin/settings/service-types/ServiceTypeForm';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth/options';
import { redirect, notFound } from "next/navigation";
import { getServiceTypeById } from '@/lib/service-types/getServiceTypeById';

export default async function ServiceTypeEditPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) {
      redirect("/login");
    }
    const param = await params;
    const id = param.id;

    const serviceType = await getServiceTypeById(id, session.user.token).catch(() => null);
    if (!serviceType) {
      notFound();
    }

    const initialData = {
      name: serviceType.name,
      slug: serviceType.slug,
      description: serviceType.description,
      durationMin: serviceType.duration,
      _iva: serviceType.iva,
      _price: serviceType.price,
      cost: serviceType.cost,
      maxColabs: serviceType.maxColabs ?? 0,
      isPublic: serviceType.isPublic ?? false,
      tags: serviceType.tags || [],
      img: undefined,
      imageUrl: serviceType.imageUrl || "/NotImageNicoPets.png",
    };

    return (
      <div className="space-y-6">
        <ServiceTypeForm 
          token={session?.user.token} 
          _initialData={initialData}
          _isSubmitting={false}
          id={parseInt(id)}
        />
      </div>
    );
} 