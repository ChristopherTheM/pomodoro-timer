import React, { useState } from "react";
import useInterval from "../utils/useInterval";
import { minutesToDuration } from "../utils/duration";
import SessionInformation from "./SessionInformation";
import DurationSetting from "./DurationSettings";
import ControlPanel from "./ControlPanel";

const BREAK_MAX = 15;
const BREAK_MIN = 1;
const BREAK_STEP = 1;
const FOCUS_MAX = 60;
const FOCUS_MIN = 5;
const FOCUS_STEP = 5;

// These functions are defined outside of the component to insure they do not have access to state
// and are, therefore more likely to be pure.

function nextTick(prevState) {
  const timeRemaining = Math.max(0, prevState.timeRemaining - 1);
  const elapsedSeconds = prevState.timeTotal - timeRemaining;
  return {
    ...prevState,
    timeRemaining,
    percentComplete: (elapsedSeconds / prevState.timeTotal) * 100,
  };
}

function nextSession(focusDuration, breakDuration) {
  return (currentSession) => {
    if (currentSession.label === "Focusing") {
      return {
        label: "On Break",
        duration: minutesToDuration(breakDuration),
        timeTotal: breakDuration * 60,
        timeRemaining: breakDuration * 60,
        percentComplete: 0,
      };
    }
    return {
      label: "Focusing",
      duration: minutesToDuration(focusDuration),
      timeTotal: focusDuration * 60,
      timeRemaining: focusDuration * 60,
      percentComplete: 0,
    };
  };
}

function Pomodoro() {
  // Timer starts out paused
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [session, setSession] = useState(null);

  function playPause() {
    setIsTimerRunning((prevState) => {
      const nextState = !prevState;

      if (nextState) {
        setSession((prevStateSession) => {
          if (prevStateSession === null) {
            return {
              label: "Focusing",
              duration: minutesToDuration(focusDuration),
              timeTotal: focusDuration * 60,
              timeRemaining: focusDuration * 60,
              percentComplete: 0,
            };
          }
          return prevStateSession;
        });
      }
      return nextState;
    });
  }

  function decreaseFocus() {
    setFocusDuration((prevState) =>
      Math.max(FOCUS_MIN, prevState - FOCUS_STEP)
    );
  }

  function increaseFocus() {
    setFocusDuration((prevState) =>
      Math.min(FOCUS_MAX, prevState + FOCUS_STEP)
    );
  }

  function decreaseBreak() {
    setBreakDuration((prevState) =>
      Math.max(BREAK_MIN, prevState - BREAK_STEP)
    );
  }

  function increaseBreak() {
    setBreakDuration((prevState) =>
      Math.min(BREAK_MAX, prevState + BREAK_STEP)
    );
  }

  function stopSession() {
    setIsTimerRunning(false);
    setSession(null);
  }

  useInterval(
    () => {
      // ToDo: Implement what should happen when the timer is running
      if (session.timeRemaining === 0) {
        new Audio(`https://bigsoundbank.com/UPLOAD/mp3/1482.mp3`).play();
        return setSession(nextSession(focusDuration, breakDuration));
      }
      return setSession(nextTick);
    },
    isTimerRunning ? 1000 : null
  );

  return (
    <div className="pomodoro">
      <div className="row">
        <div className="col">
          <DurationSetting
            label={`Focus Duration: ${minutesToDuration(focusDuration)}`}
            onDecrease={decreaseFocus}
            onIncrease={increaseFocus}
            testid="focus"
          />
        </div>
        <div className="col">
          <div className="float-right">
            <DurationSetting
              label={`Break Duration: ${minutesToDuration(breakDuration)}`}
              onDecrease={decreaseBreak}
              onIncrease={increaseBreak}
              testid="break"
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <ControlPanel
            onPlayPause={playPause}
            isPlaying={isTimerRunning}
            onStop={stopSession}
          />
        </div>
      </div>
      <SessionInformation session={session} isPaused={!isTimerRunning} />
    </div>
  );
}

export default Pomodoro;
