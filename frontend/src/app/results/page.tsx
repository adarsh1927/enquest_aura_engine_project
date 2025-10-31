// frontend/src/app/results/page.tsx
"use client";

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { apiService } from '@/services/api';

interface Product {
  item_id: string;
  item_name: string;
  image_url: string;
  category: string;
}

function ResultsDisplay() {
    // Initialize state with null to better represent "we haven't fetched yet"
    const [products, setProducts] = useState<Product[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const data = await apiService.getAuth('api/recommendations/');
                
                // --- THIS IS THE KEY FIX ---
                // Check if the received data is actually an array before setting it.
                if (Array.isArray(data)) {
                setProducts(data);
                } else {
                    // If it's not an array, it's probably an error object.
                    // You could also check for data.error here.
                    setError("Received an unexpected response from the server.");
                    setProducts([]); // Set to empty array to prevent map error
                }
            } catch (err: any) {
                // The existing catch block is good for network errors
                setError('Could not fetch recommendations. Have you completed the quiz?');
                console.error(err);
                setProducts([]); // Also set to empty array on error
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    if (isLoading) {
        return <div className="text-center my-10"><h1>Generating your personalized recommendations...</h1></div>;
    }

    if (error) {
        return <div className="text-center my-10 text-red-600"><h1>Error: {error}</h1></div>;
    }

    // Add a check for when products is not null but is empty
    if (products && products.length === 0) {
        return <div className="text-center my-10"><h1>No recommendations found matching your criteria.</h1></div>;
    }

    return (
        <main className="p-8">
            <h1 className="text-3xl font-bold text-center mb-8">Your Personalized Recommendations</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {/* Now this .map is safe, because we've guaranteed 'products' is an array */}
                {products?.map((product) => (
                    <div key={product.item_id} className="border rounded-lg p-2 text-center shadow">
                        <img src={product.image_url} alt={product.item_name} className="w-full h-auto object-cover aspect-square" />
                        <h3 className="mt-2 text-sm font-medium">{product.item_name}</h3>
                        <p className="text-xs text-gray-500">{product.category}</p>
                    </div>
                ))}
            </div>
        </main>
    );
}

export default function ResultsPage() {
    return (
        <ProtectedRoute>
            <ResultsDisplay />
        </ProtectedRoute>
    );
}