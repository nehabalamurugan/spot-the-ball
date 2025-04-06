"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Trophy, ArrowRight, Target } from "lucide-react"
import { FeedbackForm } from "@/components/feedback-form"

// First, define the interface for our ball position data
interface BallPosition {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

// Create a map of all ball positions using the data from your key
const ballPositions: { [key: string]: BallPosition } = {
  "0": { id: 0, x: 380.0, y: 227.109375, width: 20, height: 35 },
  "2": { id: 2, x: 213.75, y: 236.953125, width: 14, height: 25 },
  "3": { id: 3, x: 330.0, y: 243.984375, width: 24, height: 40 },
  "4": { id: 4, x: 288.75, y: 319.21875, width: 28, height: 47 },
  "5": { id: 5, x: 163.75, y: 315.0, width: 31, height: 57 },
  "9": { id: 9, x: 242.5, y: 92.8125, width: 20, height: 32 },
  "12": { id: 12, x: 367.5, y: 225.703125, width: 23, height: 34 },
  "13": { id: 13, x: 236.25, y: 229.921875, width: 23, height: 34 },
  "21": { id: 21, x: 358.75, y: 196.875, width: 23, height: 41 },
  "24": { id: 24, x: 402.5, y: 316.40625, width: 26, height: 37 },
  "28": { id: 28, x: 387.5, y: 234.140625, width: 23, height: 36 },
  "30": { id: 30, x: 280.0, y: 161.71875, width: 23, height: 37 },
  "31": { id: 31, x: 306.25, y: 249.609375, width: 28, height: 44 },
  "32": { id: 32, x: 522.5, y: 305.859375, width: 27, height: 45 },
  "36": { id: 36, x: 163.75, y: 300.9375, width: 15, height: 22 },
  "39": { id: 39, x: 400.0, y: 253.828125, width: 22, height: 38 },
  "44": { id: 44, x: 260.0, y: 243.984375, width: 20, height: 41 },
  "45": { id: 45, x: 180.0, y: 236.25, width: 7, height: 10 },
  "46": { id: 46, x: 153.75, y: 287.578125, width: 33, height: 52 },
  "53": { id: 53, x: 425.0, y: 236.953125, width: 7, height: 9 },
  "56": { id: 56, x: 47.5, y: 199.6875, width: 10, height: 14 },
  "62": { id: 62, x: 386.25, y: 189.84375, width: 8, height: 12 },
  "66": { id: 66, x: 395.0, y: 220.078125, width: 11, height: 21 },
  "71": { id: 71, x: 160.0, y: 303.75, width: 31, height: 50 },
  "73": { id: 73, x: 171.25, y: 277.03125, width: 19, height: 31 },
  "75": { id: 75, x: 265.0, y: 308.671875, width: 20, height: 33 },
  "78": { id: 78, x: 317.5, y: 142.03125, width: 15, height: 27 },
  "79": { id: 79, x: 152.5, y: 252.421875, width: 4, height: 6 },
  "94": { id: 94, x: 326.25, y: 135.703125, width: 19, height: 33 },
  "154": { id: 154, x: 353.75, y: 251.71875, width: 22, height: 31 },
  "163": { id: 163, x: 130.0, y: 191.25, width: 27, height: 44 },
  "190": { id: 190, x: 302.5, y: 287.578125, width: 32, height: 57 },
  "212": { id: 212, x: 470.0, y: 136.40625, width: 11, height: 17 },
  "217": { id: 217, x: 391.25, y: 289.6875, width: 23, height: 39 },
  "222": { id: 222, x: 385.0, y: 237.65625, width: 18, height: 31 },
  "223": { id: 223, x: 340.0, y: 115.3125, width: 14, height: 23 },
  "224": { id: 224, x: 212.5, y: 81.5625, width: 12, height: 16 },
  "226": { id: 226, x: 323.75, y: 271.40625, width: 28, height: 51 },
  "230": { id: 230, x: 300.0, y: 279.140625, width: 26, height: 42 },
  "245": { id: 245, x: 426.25, y: 286.875, width: 31, height: 55 },
  "250": { id: 250, x: 276.25, y: 88.59375, width: 18, height: 30 },
  "277": { id: 277, x: 246.25, y: 288.984375, width: 25, height: 38 },
  "291": { id: 291, x: 412.5, y: 252.421875, width: 22, height: 40 },
  "302": { id: 302, x: 253.75, y: 267.1875, width: 25, height: 43 },
  "303": { id: 303, x: 493.75, y: 263.671875, width: 15, height: 25 },
  "309": { id: 309, x: 210.0, y: 279.140625, width: 25, height: 44 },
  "312": { id: 312, x: 327.5, y: 106.875, width: 12, height: 17 },
  "347": { id: 347, x: 316.25, y: 291.796875, width: 25, height: 43 },
  "354": { id: 354, x: 338.75, y: 282.65625, width: 24, height: 45 },
  "371": { id: 371, x: 210.0, y: 227.109375, width: 21, height: 38 },
  "389": { id: 389, x: 395.0, y: 208.125, width: 7, height: 12 },
  "464": { id: 464, x: 472.5, y: 278.4375, width: 26, height: 43 }
};

// Function to get random images
function getRandomImages() {
  const imageIds = Object.keys(ballPositions);
  const shuffled = [...imageIds].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 10);
  
  return selected.map((id, index) => ({
    id: index + 1,
    imageWithoutBall: `/${id}.jpg`,
    ballPosition: {
      x: ballPositions[id].x,
      y: ballPositions[id].y
    },
    description: "Spot the ball in this soccer scene"
  }));
}

// Add these constants for clarity
const IMAGE_WIDTH = 640;
const IMAGE_HEIGHT = 360;

// Calculate distance between two points
const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

// Calculate score based on distance (max 100 points per round)
const calculateScore = (distance: number) => {
  const maxDistance = Math.sqrt(IMAGE_WIDTH * IMAGE_WIDTH + IMAGE_HEIGHT * IMAGE_HEIGHT) / 2
  const score = Math.max(0, 100 - Math.round((distance / maxDistance) * 100))
  return score
}

export default function SpotTheBallGame() {
  const [currentRound, setCurrentRound] = useState(0)
  const [gameState, setGameState] = useState<"intro" | "playing" | "feedback" | "research-feedback" | "final-feedback" | "completed">("intro")
  const [userGuess, setUserGuess] = useState<{ x: number; y: number } | null>(null)
  const [totalScore, setTotalScore] = useState(0)
  const [roundScore, setRoundScore] = useState(0)
  const [distance, setDistance] = useState(0)
  const imageRef = useRef<HTMLDivElement>(null)
  const [gameData, setGameData] = useState(() => getRandomImages())
  const [userId] = useState(() => {
    // Generate a random user ID for this session
    return Math.random().toString(36).substring(2, 15)
  });

  const currentGame = gameData[currentRound]
  const progress = (currentRound / gameData.length) * 100

  const handleImageClick = async (e: React.MouseEvent<HTMLDivElement>) => {
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

    // Save click data to database
    try {
      await fetch('/api/clicks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageId: currentGame.imageWithoutBall.replace('/', '').replace('.jpg', ''),
          userId: userId,
          clickX: x,
          clickY: y,
          actualX: ballPos.x,
          actualY: ballPos.y,
          score: score,
          distance: clickDistance,
        })
      })
    } catch (error) {
      console.error('Failed to save click data:', error)
    }
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
      if ((currentRound + 1) % 5 === 0) {
        setGameState("research-feedback")
      } else {
        setGameState("playing")
      }
    } else {
      setGameState("final-feedback")
    }
  }

  const restartGame = () => {
    setGameData(getRandomImages())
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

  // Add function to handle feedback submission
  const handleFeedbackSubmit = async (feedback: string) => {
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          roundNumber: currentRound + 1,
          feedback: feedback
        })
      })
      setGameState("playing")
    } catch (error) {
      console.error('Failed to save feedback:', error)
    }
  }

  // Add final feedback handler
  const handleFinalFeedback = async (feedback: string) => {
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          roundNumber: currentRound + 1,
          feedback: feedback,
          isFinal: true
        })
      })
      setGameState("completed")
    } catch (error) {
      console.error('Failed to save feedback:', error)
    }
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

  if (gameState === "research-feedback") {
    return (
      <div className="max-w-2xl mx-auto">
        <FeedbackForm 
          onSubmit={handleFeedbackSubmit}
          currentRound={currentRound + 1}
          totalScore={totalScore}
          totalRounds={gameData.length}
        />
      </div>
    )
  }

  if (gameState === "final-feedback") {
    return (
      <div className="max-w-2xl mx-auto">
        <FeedbackForm 
          onSubmit={handleFinalFeedback}
          currentRound={currentRound + 1}
          totalScore={totalScore}
          totalRounds={gameData.length}
          isFinal={true}
        />
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

      <div className="mt-4 relative bg-muted rounded-lg overflow-hidden flex justify-center">
        <div 
          ref={imageRef} 
          className="relative w-[640px] h-[360px] cursor-crosshair bg-slate-200" 
          onClick={handleImageClick}
        >
          <Image
            src={currentGame.imageWithoutBall}
            alt={currentGame.description}
            fill
            className="object-contain"
            priority
          />

          {/* Debug coordinates display
          <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm p-3 rounded-lg space-y-2 z-20">
            <p className="text-xs">
              Image: {currentGame.imageWithoutBall}
            </p>
            <p className="text-xs">
              Ball: ({Math.round(currentGame.ballPosition.x)}, {Math.round(currentGame.ballPosition.y)})
            </p>
            {userGuess && (
              <p className="text-xs">
                Click: ({Math.round(userGuess.x)}, {Math.round(userGuess.y)})
              </p>
            )}
          </div> */}

          {/* Rest of the markers code */}
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

        {/* {gameState === "playing" && (
          <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm p-3 rounded-lg">
            <p className="text-sm font-medium">{currentGame.description}</p>
            <p className="text-xs text-muted-foreground mt-1">Click where you think the ball is</p>
          </div>
        )} */}
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
          <Button className="mt-4 flex items-center gap-2" onClick={nextRound}>
            {currentRound < gameData.length - 1 ? "Next Round" : "See Final Score"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

