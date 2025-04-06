"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"

interface FeedbackFormProps {
  onSubmit: (feedback: string) => void;
  currentRound: number;
  totalScore: number;
  totalRounds: number;
  isFinal?: boolean;
}

export function FeedbackForm({ onSubmit, currentRound, totalScore, totalRounds, isFinal }: FeedbackFormProps) {
  const [feedback, setFeedback] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = () => {
    if (feedback.length < 100) {
      setError("Please provide at least 100 characters of feedback")
      return
    }
    onSubmit(feedback)
  }

  return (
    <div className="space-y-4 p-6 bg-muted rounded-lg">
      {!isFinal && (
        <>
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium">Round: {currentRound}/10</span>
            <span className="font-medium">Score: {totalScore}</span>
          </div>
          <Progress value={(currentRound / totalRounds) * 100} className="h-2 mb-6" />
        </>
      )}
      <h3 className="text-lg font-semibold">
        {isFinal ? "One Last Question!" : "Quick Research Break!"}
      </h3>
      <p className="text-sm text-muted-foreground">
        {isFinal 
          ? "Now that you've completed all rounds, what strategies did you develop throughout the game? Did you get better at spotting certain clues?"
          : "We know this is a bit of a pause in the action, but it helps our research immensely! Tell us about your detective work - what clues are you using to spot the ball?"
        }
      </p>
      <p className="text-sm text-muted-foreground italic">
        {isFinal 
          ? "Your insights will help us understand how people learn this task - thanks for participating!"
          : "The game will continue right after this brief feedback - thanks for helping our research!"
        }
      </p>
      <Textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="For example: I look at x, y, z..."
        className="min-h-[150px]"
      />
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Characters: {feedback.length}/100 (minimum)
        </p>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
      <Button onClick={handleSubmit} className="w-full">
        {isFinal ? "See Final Score!" : "Back to the Game!"}
      </Button>
    </div>
  )
} 