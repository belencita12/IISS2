interface ServiceCardProps {
    title: string;
    description: string;
    image: string;
  }
  
  export default function ServiceCard({ title, description, image }: ServiceCardProps) {
    return (
      <div className="border rounded-lg overflow-hidden shadow-lg flex">
        <img src={image} alt={title} className="w-1/3 object-cover" />
        <div className="p-4 w-2/3">
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    );
  }
