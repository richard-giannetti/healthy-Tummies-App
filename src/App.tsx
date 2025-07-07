import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to Your App
        </h1>
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => setCount((count) => count + 1)}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Count is {count}
          </button>
          <p className="text-muted-foreground">
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
      </div>
    </div>
  )
}

export default App