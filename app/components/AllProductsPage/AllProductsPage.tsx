"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import AddToBag from "@/app/components/AddToBag/AddToBag";
import { client } from "@/app/lib/sanity";
import { urlFor } from "@/app/lib/sanity";
import "./AllProductsPage.css";

async function getAllProducts() {
    const query = `
    *[_type == "product"]{
        _id,
        images,
        price,
        name,
        description,
        "slug": slug.current,
        "categoryName": category->name,
        price_id,
        naeringsinnhold,
        allergener
    }
    `; // næringsinnhold,allergener
    const data = await client.fetch(query);
    console.log(data);
    return data;
}

export default function AllProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false); // State for popup
    const [popupContent, setPopupContent] = useState({ næringsinnhold: [], allergener: [] });

    useEffect(() => {
        async function fetchProducts() {
            try {
                const data = await getAllProducts();
                setProducts(data);
            } catch (err) {
                setError("Failed to load products. Please try again later.");
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    const togglePopup = (content: { næringsinnhold: string[]; allergener: string[] }) => {
        setPopupContent(content);
        setIsPopupOpen(!isPopupOpen);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="all-products-container" id="products-scroll">
            <div className="product-grid-container">
                <div className="product-grid">
                    {products.map((product) => (
                        <div key={product._id} className="product-card">
                            <div className="product-image-container">
                                <Image
                                    src={urlFor(product.images[0]).url()}
                                    alt={product.name}
                                    className="product-image"
                                    width={400}
                                    height={500}
                                />
                                <div className="product-overlay">
                                    <div className="overlay-content">
                                        <p>{product.description}</p>
                                    </div>
                                </div>
                                <div className="product-link">
                                    <div className="product-title">
                                        <h2 className="product-title-text">{product.name}</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="product-action-buttons">
                                <AddToBag
                                    currency="USD"
                                    description={product.description}
                                    image={product.images[0]}
                                    name={product.name}
                                    price={product.price}
                                    key={`${product._id}-add-to-bag`}
                                    price_id={product.price_id}
                                />
                                <button
                                    className="info-button"
                                    onClick={() =>
                                        togglePopup({
                                            næringsinnhold: product.naeringsinnhold || [],
                                            allergener: product.allergener || [],
                                        })
                                    }
                                >
                                    Info
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {isPopupOpen && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Produkt informasjon</h3>
                        <div className="popup-columns">
                            <div className="popup-column">
                                <h4><strong>Næringsinnhold:</strong></h4>
                                <ul>
                                    {popupContent.næringsinnhold.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="popup-column">
                                <h4><strong>Allergener:</strong></h4>
                                <ul>
                                    {popupContent.allergener.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <button className="close-popup" onClick={() => setIsPopupOpen(false)}>
                            Lukk
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}