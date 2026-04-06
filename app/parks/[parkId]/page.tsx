export default async function ParkPage({ 
  params 
}: { 
  params: Promise<{ parkId: string }> 
}) {
  const { parkId } = await params
  return (
    <div style={{ padding: '40px', color: 'white', background: '#0f172a', minHeight: '100vh' }}>
      <h1>Park: {parkId}</h1>
      <p>Coming soon...</p>
      <a href="/parks" style={{ color: '#60a5fa' }}>← Back to Parks</a>
    </div>
  )
}