"use client"
import { useState,useRef,useEffect,ChangeEvent } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Countdown() {
    // State to manage the duration input
    const [duration, setDuration] = useState<number | string>("");
    // State to manage the countdown timer value
    const [timeLeft, setTimeLeft] = useState<number>(0);
    // State to track if the timer is active
    const [isActive, setIsActive] = useState<boolean>(false);
    // State to track if the timer is paused
    const [isPaused, setIsPaused] = useState<boolean>(false);
    // Reference to store the timer ID
    const timerRef = useRef<NodeJS.Timeout | null>(null);

//The handleSetDuration function sets the countdown time based on the user's input. It checks if the input is a positive number, sets the remaining time, and ensures the timer is not active or paused, also clearing any existing timer interval.
const handleSetDuration = ():void => {
    if(typeof duration === "number" && duration > 0){
        setTimeLeft(duration);
        setIsActive(true);
        setIsPaused(false);
        if(timerRef.current){
            clearInterval(timerRef.current);
        }
    }
}

//The handleStart function begins the countdown if there's time left. It sets the timer as active and ensures it is not paused.
const handleStart = ():void => {
    if(timeLeft > 0){
        setIsActive(true);
        setIsPaused(false);
    }
};

//The handlePause function pauses the countdown if the timer is active. It marks the timer as paused, stops it from being active, and clears any existing timer interval.
const handlePause = ():void => {
    if(isActive){
        setIsPaused(true);
        setIsActive(false);
        if(timerRef.current){
            clearInterval(timerRef.current);
        }
    }
}

//The handleReset function stops the timer and resets it to the initial duration set by the user. It sets the timer to inactive, not paused, and clears any existing timer interval.
const handleReset = ():void => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(typeof duration === "number" ? duration : 0);
    if(timerRef.current){
        clearInterval(timerRef.current);
    }
}

//useEffect: The useEffect starts a timer that decreases the time left every second when the timer is active and not paused. It also ensures the timer is cleared when the component updates or unmounts, so I know that you don’t know about these two stuffs component update and mounting and most importantly using useEffect hook. Ok, no problem let me explain these things in simple words.
useEffect(() => {
    if(isActive && !isPaused){
        timerRef.current = setInterval(() => {
            setTimeLeft((prevTime) => {
                if(prevTime <= 1){
                    clearInterval(timerRef.current!);
                    return 0
                }
                return prevTime - 1

            })
        },1000)

    }
    return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }}
},[isActive, isPaused])

//The formatTime function converts a time in seconds into a string formatted as minutes and seconds (mm). It calculates the minutes and seconds, then ensures they are displayed with two digits.
const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  //The handleDurationChange function updates the duration state when the user types a new value into the input field. It converts the input value to a number or sets it to an empty string if the input is invalid.
  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setDuration(Number(e.target.value) || "");
  };
return(
    <>
     
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      {/* Timer box container */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
        {/* Title of the countdown timer */}
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200 text-center">
          Countdown Timer
        </h1>
        {/* Input and set button container */}
        <div className="flex items-center mb-6">
          <Input
            type="number"
            id="duration"
            placeholder="Enter duration in seconds"
            value={duration}
            onChange={handleDurationChange}
            className="flex-1 mr-4 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          />
          <Button
            onClick={handleSetDuration}
            variant="outline"
            className="text-gray-800 dark:text-gray-200 shadow-custom-lg hover:shadow-custom-xl"
          >
            Set
          </Button>
        </div>
        {/* Display the formatted time left */}
        <div className="text-6xl font-bold text-gray-800 dark:text-gray-200 mb-8 text-center">
          {formatTime(timeLeft)}
        </div>
        {/* Buttons to start, pause, and reset the timer */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={handleStart}
            variant="outline"
            className="shadow-custom-lg hover:shadow-custom-xl text-gray-800 dark:text-gray-200"
          >
            {isPaused ? "Resume" : "Start"}
          </Button>
          <Button
            onClick={handlePause}
            variant="outline"
            className="shadow-custom-lg hover:shadow-custom-xl text-gray-800 dark:text-gray-200"
          >
            Pause
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="shadow-custom-lg hover:shadow-custom-xl text-gray-800 dark:text-gray-200"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
    </>
)
}
