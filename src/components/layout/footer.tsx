'use server';

import { getServices } from "@/lib/firestore";
import FooterClient from "./footer-client";

export default async function Footer() {
    const services = await getServices();
    // In the future, you could fetch other data like social media links here
    return <FooterClient services={services} />;
}
