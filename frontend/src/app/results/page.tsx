// frontend/src/app/results/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { apiService } from '@/services/api';

// Re-use the Product type from our old home page
interface Product {
  item_id: string;
  item_name: string;
  image_url: string;
  category: string;
}

function ResultsDisplay() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const data = await apiService.getAuth('api/recommendations/');
                setProducts(data);
            } catch (err) {
                setError('Could not fetch recommendations. Have you completed the quiz?');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecommendations();
    }, []); // Empty array means this runs once on component mount

    if (isLoading) {
        return <div className="text-center my-10"><h1>Generating your personalized recommendations...</h1></div>;
    }

    if (error) {
        return <div className="text-center my-10 text-red-600"><h1>Error: {error}</h1></div>;
    }

    return (
        <main className="p-8">
            <h1 className="text-3xl font-bold text-center mb-8">Your Personalized Recommendations</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {products.map((product) => (
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