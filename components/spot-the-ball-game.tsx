"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Trophy, ArrowRight, Target } from "lucide-react"

// Game data with 10 rounds
const gameData = [
  {
    id: 1,
    imageWithoutBall: "/0.jpg",
    ballPosition: { x: 320, y: 250 },
    description: "Soccer match with players jumping for a header",
  },
  {
    id: 2,
    imageWithoutBall: "/2.jpg",
    ballPosition: { x: 600, y: 180 },
    description: "Tennis player at the baseline preparing to return",
  },
  {
    id: 3,
    imageWithoutBall: "/3.jpg",
    ballPosition: { x: 400, y: 320 },
    description: "Basketball game with players near the hoop",
  },
  {
    id: 4,
    imageWithoutBall: "/4.jpg",
    ballPosition: { x: 250, y: 150 },
    description: "Golf player mid-swing on the fairway",
  },
  {
    id: 5,
    imageWithoutBall: "/5.jpg",
    ballPosition: { x: 500, y: 220 },
    description: "Cricket batsman playing a shot",
  },
  {
    id: 6,
    imageWithoutBall: "/9.jpg",
    ballPosition: { x: 350, y: 280 },
    description: "Volleyball players at the net",
  },
  {
    id: 7,
    imageWithoutBall: "/12.jpg",
    ballPosition: { x: 420, y: 190 },
    description: "Baseball pitcher in mid-throw",
  },
  {
    id: 8,
    imageWithoutBall: "/13.jpg",
    ballPosition: { x: 280, y: 350 },
    description: "Rugby players in a scrum",
  },
  {
    id: 9,
    imageWithoutBall: "/21.jpg",
    ballPosition: { x: 550, y: 270 },
    description: "Table tennis player serving",
  },
  {
    id: 10,
    imageWithoutBall: "/24.jpg",
    ballPosition: { x: 380, y: 230 },
    description: "Hockey players fighting for the puck",
  },
]

// Calculate distance between two points
const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

// Calculate score based on distance (max 100 points per round)
const calculateScore = (distance: number) => {
  // Max distance possible is roughly the diagonal of the image (sqrt(800^2 + 500^2) ≈ 943)
  // We'll use 500 as a reasonable max distance for scoring
  const maxDistance = 500
  const score = Math.max(0, 100 - Math.round((distance / maxDistance) * 100))
  return score
}

export default function SpotTheBallGame() {
  const [currentRound, setCurrentRound] = useState(0)
  const [gameState, setGameState] = useState<"intro" | "playing" | "feedback" | "completed">("intro")
  const [userGuess, setUserGuess] = useState<{ x: number; y: number } | null>(null)
  const [totalScore, setTotalScore] = useState(0)
  const [roundScore, setRoundScore] = useState(0)
  const [distance, setDistance] = useState(0)
  const imageRef = useRef<HTMLDivElement>(null)

  const currentGame = gameData[currentRound]
  const progress = (currentRound / gameData.length) * 100

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameState !== "playing" || !imageRef.current) return

    const rect = imageRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setUserGuess({ x, y })

    // Calculate distance and score
    const ballPos = currentGame.ballPosition
    const clickDistance = calculateDistance(x, y, ballPos.x, ballPos.y)
    const score = calculateScore(clickDistance)

    setDistance(Math.round(clickDistance))
    setRoundScore(score)
    setTotalScore((prev) => prev + score)
    setGameState("feedback")
  }

  const startGame = () => {
    setGameState("playing")
    setCurrentRound(0)
    setTotalScore(0)
  }

  const nextRound = () => {
    if (currentRound < gameData.length - 1) {
      setCurrentRound((prev) => prev + 1)
      setUserGuess(null)
      setGameState("playing")
    } else {
      setGameState("completed")
    }
  }

  const restartGame = () => {
    setCurrentRound(0)
    setTotalScore(0)
    setUserGuess(null)
    setGameState("intro")
  }

  // Get feedback message based on distance
  const getFeedbackMessage = () => {
    if (distance < 20) return "Perfect! Right on target!"
    if (distance < 50) return "Excellent! Very close!"
    if (distance < 100) return "Good job! Pretty close!"
    if (distance < 200) return "Not bad! Getting there!"
    return "Keep trying! You'll get better!"
  }

  if (gameState === "intro") {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 p-8 bg-muted rounded-xl">
        <Target className="w-16 h-16 text-primary" />
        <h2 className="text-2xl font-bold text-center">Welcome to Spot the Ball!</h2>
        <p className="text-center max-w-md">
          Test your sports observation skills by guessing where the missing ball is in each image. You'll play 10 rounds
          and earn points based on how close your guess is.
        </p>
        <Button size="lg" onClick={startGame}>
          Start Game
        </Button>
      </div>
    )
  }

  if (gameState === "completed") {
    // Calculate max possible score
    const maxScore = gameData.length * 100
    const percentage = Math.round((totalScore / maxScore) * 100)

    let message = ""
    if (percentage >= 90) message = "Amazing! You have eagle eyes!"
    else if (percentage >= 70) message = "Great job! You're really observant!"
    else if (percentage >= 50) message = "Good effort! You've got potential!"
    else message = "Nice try! Keep practicing to improve!"

    return (
      <div className="flex flex-col items-center justify-center space-y-6 p-8 bg-muted rounded-xl">
        <Trophy className="w-16 h-16 text-yellow-500" />
        <h2 className="text-2xl font-bold text-center">Game Completed!</h2>
        <div className="text-center">
          <p className="text-4xl font-bold mb-2">
            {totalScore} / {maxScore}
          </p>
          <p className="text-xl">{message}</p>
        </div>
        <Button size="lg" onClick={restartGame}>
          Play Again
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <span className="font-medium">Round: {currentRound + 1}/10</span>
        </div>
        <div>
          <span className="font-medium">Score: {totalScore}</span>
        </div>
      </div>

      <Progress value={progress} className="h-2" />

      <div className="mt-4 relative bg-muted rounded-lg overflow-hidden">
        <div ref={imageRef} className="relative w-full h-[500px] cursor-crosshair" onClick={handleImageClick}>
          <Image
            src={currentGame.imageWithoutBall || "/placeholder.svg"}
            alt={currentGame.description}
            fill
            className="object-cover"
          />

          {gameState === "feedback" && userGuess && (
            <>
              {/* User's guess */}
              <div
                className="absolute w-8 h-8 -ml-4 -mt-4 rounded-full border-4 border-red-500 z-10"
                style={{
                  left: userGuess.x,
                  top: userGuess.y,
                }}
              />

              {/* Actual ball position */}
              <div
                className="absolute w-8 h-8 -ml-4 -mt-4 rounded-full bg-green-500 z-10 animate-pulse"
                style={{
                  left: currentGame.ballPosition.x,
                  top: currentGame.ballPosition.y,
                }}
              />

              {/* Line connecting guess to actual */}
              <svg className="absolute top-0 left-0 w-full h-full z-5" style={{ pointerEvents: "none" }}>
                <line
                  x1={userGuess.x}
                  y1={userGuess.y}
                  x2={currentGame.ballPosition.x}
                  y2={currentGame.ballPosition.y}
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              </svg>
            </>
          )}
        </div>

        {gameState === "playing" && (
          <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm p-3 rounded-lg">
            <p className="text-sm font-medium">{currentGame.description}</p>
            <p className="text-xs text-muted-foreground mt-1">Click where you think the ball is</p>
          </div>
        )}
      </div>

      {gameState === "feedback" && (
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-bold text-lg">{getFeedbackMessage()}</h3>
          <p>
            You were <span className="font-medium">{distance} pixels</span> away from the ball.
          </p>
          <p>
            Points earned this round: <span className="font-medium">{roundScore}</span>
          </p>
          <Button className="mt-4" onClick={nextRound} rightIcon={<ArrowRight className="ml-2 h-4 w-4" />}>
            {currentRound < gameData.length - 1 ? "Next Round" : "See Final Score"}
          </Button>
        </div>
      )}
    </div>
  )
}

