'use server';

import { getServices } from "@/lib/firestore";
import FooterClient from "./footer-client";

export default async function Footer() {
    const services = await getServices();
    return <FooterClient services={services} />;
}
