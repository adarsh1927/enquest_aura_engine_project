// frontend/src/app/page.tsx

// This function tells Next.js how to get the data for this page.
// It runs on the server, so it can securely talk to our backend.
async function getData() {
  try {
    // We use http://backend:8000 because Docker lets us use the service name 'backend'.
    const res = await fetch('http://backend:8000/api/hello/', { cache: 'no-store' });

    if (!res.ok) {
      // If the response is not OK, return an error message.
      return { message: `Error fetching data: ${res.statusText}` };
    }

    // Parse the JSON response from Django.
    return res.json();
  } catch (error: any) {
    // If the fetch itself fails (e.g., backend is down), return an error.
    console.error('Fetch error:', error);
    return { message: `Failed to connect to the backend. Is it running? Error: ${error.message}` };
  }
}


// This is our main Page component.
export default async function Home() {
  // We call our data-fetching function and wait for the result.
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
        Backend says: <strong style={{ color: '#0070f3' }}>"{data.message}"</strong>
      </p>
    </main>
  );
}