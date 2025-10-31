// frontend/src/app/quiz/page.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '@/services/api';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// This is a placeholder for the actual style questions
const styleQuestions = [
    { id: 1, text: "Which weekend look?", options: [{ p: 'Classic', s: 'Preppy' }, { p: 'Edgy', s: 'Street' }] },
    { id: 2, text: "Which night out look?", options: [{ p: 'Glamorous', s: 'Chic' }, { p: 'Romantic', s: 'Bohemian' }] },
    { id: 3, text: "Which casual look?", options: [{ p: 'Street', s: 'Contemporary' }, { p: 'Classic', s: 'Chic' }] },
];

function QuizForm() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        
        // This is a simplified way to collect form data. A real app would use a state management library.
        const quizData = {
            primary_body_type: formData.get('primary_body_type'),
            weekday_lifestyle: formData.get('weekday_lifestyle'),
            weekend_lifestyle: formData.getAll('weekend_lifestyle'),
            seasonality_answer: '3-months', // Placeholder
            style_selections: styleQuestions.map(q => {
                const selection = formData.get(`style_q_${q.id}`) as string || '';
                return selection.split(',');
            }),
        };

        try {
            await apiService.postAuth('api/quiz/submit/', quizData);
            router.push('/results');
        } catch (err: unknown) {
            // --- START OF NEW, MORE ROBUST CATCH BLOCK ---------
            setError('Failed to submit quiz. Please check your answers and try again.');
            console.error("Quiz Submission Error:", err);
            
            // Try to parse a more specific message if the backend sent one
            if (err instanceof Error) {
                try {
                    const errorData = JSON.parse(err.message);
                    if (errorData.message) {
                        setError(errorData.message);
                    }
                } catch {
                    // If parsing fails, it's a network error or a simple string
                    // The original error message is good enough in this case.
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // --- START OF UPDATED JSX ---
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl mx-auto my-10 p-8 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Your Style Quiz</h1>
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Body Type */}
                    <div>
                        <label htmlFor="body-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">What is your primary body type?</label>
                        <select
                            id="body-type"
                            name="primary_body_type"
                            className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option>Pear</option>
                            <option>Apple</option>
                            <option>Rectangle</option>
                            <option>Hourglass</option>
                            <option>Inverted Triangle</option>
                        </select>
                    </div>

                    {/* Lifestyle */}
                    <div>
                        <label htmlFor="weekday-lifestyle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">What is your weekday lifestyle?</label>
                        <select
                            id="weekday-lifestyle"
                            name="weekday_lifestyle"
                            className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option>Business Formal</option>
                            <option>Business Casual</option>
                            <option>Smart Casual</option>
                        </select>
                    </div>

                    {/* Style Questions */}
                    <fieldset>
                        <legend className="text-base font-medium text-gray-900 dark:text-white">Choose your preferred styles:</legend>
                        <div className="mt-4 space-y-4">
                            {styleQuestions.map(q => (
                                <div key={q.id}>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{q.text}</p>
                                    <div className="flex items-center gap-x-6 mt-2">
                                        <label className="flex items-center gap-x-2">
                                            <input type="radio" name={`style_q_${q.id}`} value={`${q.options[0].p},${q.options[0].s}`} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                                            <span className="text-sm">Option A ({q.options[0].p})</span>
                                        </label>
                                        <label className="flex items-center gap-x-2">
                                            <input type="radio" name={`style_q_${q.id}`} value={`${q.options[1].p},${q.options[1].s}`} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                                            <span className="text-sm">Option B ({q.options[1].p})</span>
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </fieldset>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed">
                        {isLoading ? 'Submitting...' : 'Get My Recommendations'}
                    </button>
                </form>
            </div>
        </div>
        // --- END OF UPDATED JSX ---
    );
}

// Wrap the form with the ProtectedRoute component
export default function QuizPage() {
    return (
        <ProtectedRoute>
            <QuizForm />
        </ProtectedRoute>
    );
}