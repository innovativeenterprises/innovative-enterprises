
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

        const sectionSeparator = "======================================================================\n";
        const subHeaderSeparator = "----------------------------------------------------------------------\n";

        let content = "";

        content += sectionSeparator;
        content += "           INNOVATIVE ENTERPRISES - OFFICIAL COMPANY PROFILE\n";
        content += sectionSeparator;
        content += `\nGenerated on: ${new Date().toUTCString()}\n\n`;

        content += "1.  ABOUT US\n";
        content += subHeaderSeparator;
        content += "Innovative Enterprises is a leading Omani SME dedicated to delivering\n";
        content += "cutting-edge solutions in emerging technology and digital transformation.\n";
        content += "We empower businesses and government entities to thrive in the digital age.\n\n";

        content += "2.  LEADERSHIP TEAM\n";
        content += subHeaderSeparator;
        enabledLeadership.forEach(member => {
            content += `    - ${member.name.toUpperCase()}\n`;
            content += `      ${member.role}\n\n`;
        });
        
        content += "\n3.  CORE SERVICES\n";
        content += subHeaderSeparator;
        enabledServices.forEach(service => {
            content += `    ■  ${service.title.toUpperCase()}\n`;
            content += `       ${service.description}\n\n`;
        });

        content += "\n4.  DIGITAL PRODUCTS\n";
        content += subHeaderSeparator;
        enabledProducts.forEach(product => {
            content += `    ■  ${product.name.toUpperCase()} [Status: ${product.stage}]\n`;
            content += `       ${product.description}\n\n`;
        });

        content += "\n5.  CONTACT & INQUIRIES\n";
        content += subHeaderSeparator;
        content += "For investment inquiries, partnership proposals, or more information,\n";
        content += "please contact our team via the form on our website or email us directly.\n\n";
        content += "    - Website: https://innovative-oman.com/invest\n";
        content += "    - Email:   invest@innovative.om\n\n";
        content += sectionSeparator;

        return content;
    };

    const handleDownload = () => {
        const content = generateProfileContent();
        const element = document.createElement("a");
        const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
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
