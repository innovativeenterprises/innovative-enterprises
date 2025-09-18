
import { getProducts } from "@/lib/firestore";
import EducationTechClientPage from "./client-page";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Education Technology Solutions",
  description: "Explore a suite of AI-driven platforms to enhance learning, streamline administration, and improve student outcomes.",
};


export default async function EducationTechPage() {
    const allProducts = await getProducts();
    const edutechProductsRaw = allProducts.filter(p => p.category === "Education Tech" && p.enabled);
    
    // Manually add the "Teacher Toolkit" as it's not in the database
     const teacherToolkit = {
        id: 101,
        name: "Teacher Toolkit",
        description: "Convert any uploaded school book or lesson into a gamified, interactive experience with flashcards, quizzes, and presentations.",
        stage: "Live & Operating",
        category: "Education Tech",
        price: 0,
        image: "https://picsum.photos/seed/teachertoolkit/400/400",
        aiHint: "teacher classroom technology",
        rating: 5,
        enabled: true,
        href: "/education-tech/lesson-gamifier",
        adminStatus: 'Completed' as const,
    };
    
    const edutechProducts = [teacherToolkit, ...edutechProductsRaw];

    return <EducationTechClientPage initialProducts={edutechProducts} />;
}
