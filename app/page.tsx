import SpotTheBallGame from "@/components/spot-the-ball-game"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">Spot the Ball</h1>
        <p className="text-center mb-8 text-muted-foreground">
          Click where you think the ball is in each image. Try to get as close as possible!
        </p>
        <SpotTheBallGame />
      </div>
    </main>
  )
}

