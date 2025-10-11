// frontend/src/app/page.tsx

// Define a TypeScript interface for the expected shape of our API response.
// This is a best practice for type safety.
interface ApiResponse {
  message: string;
}

async function getData(): Promise<ApiResponse> {
  // Use an environment variable to define the API URL.
  // process.env lets us access variables in Node.js (which Next.js runs on).
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000';
  try {
    const res = await fetch(`${apiUrl}/api/hello/`, { cache: 'no-store' });

    if (!res.ok) {
      return { message: `Error from backend: ${res.statusText}` };
    }

    const data: ApiResponse = await res.json();
    return data;
  } catch (error: unknown) { // FIX 1: Use 'unknown' instead of 'any'
    console.error('Fetch error:', error);
    
    // Check if the error is an instance of Error to safely access its message property
    if (error instanceof Error) {
        return { message: `Failed to connect to backend: ${error.message}` };
    }
    
    // Fallback for other types of errors
    return { message: 'An unknown error occurred while connecting to the backend.' };
  }
}

export default async function Home() {
  const data = await getData();

  return (
    <main style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      fontFamily: 'sans-serif',
      backgroundColor: '#f0f0f0'
    }}>
      <h1 style={{ fontSize: '3rem', color: '#333' }}>
        Style Engine Test
      </h1>
      <p style={{ 
        fontSize: '1.5rem', 
        marginTop: '20px', 
        padding: '20px', 
        backgroundColor: '#fff', 
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        {/* FIX 2: Use &quot; for quotes inside the string */}
        Backend says: <strong style={{ color: '#0070f3' }}>&quot;{data.message}&quot;</strong>
      </p>
    </main>
  );
}