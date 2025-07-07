import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 py-12 text-center">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-4xl font-bold text-red-500 mb-4">404 - Puslapis nerastas</h1>
                <p className="text-gray-600 mb-6">Tokio puslapio nera.</p>
                <Link to="/" className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                    Grįžti į pagrindinį puslapį
                </Link>
            </div>
        </div>
    );
};


export default NotFound;