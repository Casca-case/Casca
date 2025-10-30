import { db } from "@/db";
import { notFound } from "next/navigation";
import DesignPreview from "./DesignPreview";

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}
const Page = async ({ searchParams }: PageProps) => {
  const { id } = searchParams;

  if (!id || typeof id !== "string") {
    return notFound();
  }

  // For temporary configs from gallery, create a mock configuration
  if (id.startsWith('temp-')) {
    const imageUrl = typeof searchParams.imageUrl === 'string' ? searchParams.imageUrl : '/placeholder.jpg';
    const mockConfiguration = {
      id,
      imageUrl,
      width: 1000,
      height: 2000,
      color: 'black' as const,
      model: 'iphonex' as const,
      material: 'silicone' as const,
      finish: 'smooth' as const,
      croppedImageUrl: imageUrl,
    };
    return <DesignPreview configuration={mockConfiguration} />;
  }

  const configuration = await db.configuration.findUnique({
    where: { id },
  });

  if (!configuration) {
    return notFound();
  }

  return <DesignPreview configuration={configuration} />;
};
export default Page;