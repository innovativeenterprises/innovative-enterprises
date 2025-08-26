
'use client';

import { useStaffData } from "@/app/admin/staff-table";
import { useServicesData } from "@/app/admin/service-table";
import { useProductsData } from "@/app/admin/product-table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CompanyProfileDownloader() {
    const { leadership } = useStaffData();
    const { services } = useServicesData();
    const { products } = useProductsData();
    const { toast } = useToast();

    const generateProfileContent = () => {
        const enabledServices = services.filter(s => s.enabled);
        const enabledProducts = products.filter(p => p.enabled);
        const enabledLeadership = leadership.filter(l => l.enabled);

        let content = `INNOVATIVE ENTERPRISES - COMPANY PROFILE\n`;
        content += `Generated on: ${new Date().toLocaleDateString()}\n`;
        content += `==================================================\n\n`;

        content += `1. ABOUT US\n`;
        content += `------------------------\n`;
        content += `Innovative Enterprises is a leading Omani SME dedicated to delivering cutting-edge solutions in emerging technology and digital transformation. We empower businesses and government entities to thrive in the digital age.\n\n`;

        content += `2. LEADERSHIP TEAM\n`;
        content += `------------------------\n`;
        enabledLeadership.forEach(member => {
            content += `- ${member.name.toUpperCase()}, ${member.role}\n`;
        });
        content += `\n`;

        content += `3. CORE SERVICES\n`;
        content += `------------------------\n`;
        enabledServices.forEach(service => {
            content += `* ${service.title}:\n  ${service.description}\n`;
        });
        content += `\n`;
        
        content += `4. DIGITAL PRODUCTS\n`;
        content += `------------------------\n`;
        enabledProducts.forEach(product => {
            content += `* ${product.name} [${product.stage}]:\n  ${product.description}\n`;
        });
        content += `\n`;

        content += `5. CONTACT\n`;
        content += `------------------------\n`;
        content += `For investment inquiries, please contact our team via the form on our website at https://innovative-oman.com/invest or email us at invest@innovative.om.\n`;

        return content;
    };

    const handleDownload = () => {
        const content = generateProfileContent();
        const element = document.createElement("a");
        const file = new Blob([content], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "Innovative-Enterprises-Company-Profile.txt";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        toast({ title: 'Profile Downloaded!', description: `Your company profile has been downloaded.` });
    };

    return (
        <Button onClick={handleDownload} variant="outline" size="lg" className="bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 hover:text-primary">
            <Download className="mr-2 h-5 w-5" /> Dynamic Company Profile
        </Button>
    );
}
