import Image from 'next/image';
import { client, urlFor } from '../../lib/sanity';
import Link from "next/link";
import { ShoppingCart, Box } from "lucide-react"; // Import icons from lucide-react
import "./Hero.css";

async function getData() {
    const query = '*[_type == "heroPage"][0]'; // Fetch the first document of type "heroPage"
    const data = await client.fetch(query);
    return data;
}

export default async function Hero() {
    const data = await getData();

    return (
        <div className="hero-container">
            <div className="hero-images-container">
                <div className="hero-overlay"></div>
                <div className="hero-image">
                    <Image 
                        src={urlFor(data.image1).url()} // Use image1 from the schema
                        alt="Hero Background"
                        layout="fill" // Covers the entire container
                        className="h-full w-full object-cover object-center"
                    />
                </div>
                <div className="hero-text-content">
                    {data.logo && (
                        <Image
                            src={urlFor(data.logo).url()} // Use logo from the schema
                            alt="Company Logo"
                            width={1000}
                            height={1000}
                            className="hero-logo"
                        />
                    )}
                    {data.slogan && (
                        <p className="hero-subtitle">
                            {data.slogan}
                        </p>
                    )}

                    {/* Add the icons with text links */}
                    <div className="hero-links">
                        <Link href="#products-scroll" className="hero-link">
                            <ShoppingCart className="hero-icon" />
                            <span className="hero-link-text">Våre produkter</span>
                        </Link>
                        <Link href="#Abonnement-scroll" className="hero-link">
                            <Box className="hero-icon" />
                            <span className="hero-link-text">Abonnement</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
