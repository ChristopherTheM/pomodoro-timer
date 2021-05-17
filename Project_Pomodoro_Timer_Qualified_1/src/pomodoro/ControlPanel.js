import classNames from "../utils/class-names";
import React from "react";
import PropTypes from "prop-types";

function ControlPanel({ isPlaying, onPlayPause, onStop }) {
  return (
    <div
      className="btn-group btn-group-lg mb-2"
      role="group"
      aria-label="Timer controls"
    >
      <button
        type="button"
        className="btn btn-primary"
        data-testid="play-pause"
        title="Start or pause timer"
        onClick={onPlayPause}
      >
        <span
          className={classNames({
            oi: true,
            "oi-media-play": !isPlaying,
            "oi-media-pause": isPlaying,
          })}
        />
      </button>
      {/* TODO: Implement stopping the current focus or break session. and disable the stop button when there is no active session */}
      {/* TODO: Disable the stop button when there is no active session */}
      <button
        type="button"
        className="btn btn-secondary"
        data-testid="stop"
        title="Stop the session"
        onClick={onStop}
        disabled={!isPlaying}
      >
        <span className="oi oi-media-stop" />
      </button>
    </div>
  );
}
ControlPanel.propTypes = {
  isPlaying: PropTypes.bool.isRequired,
  onPlayPause: PropTypes.func.isRequired,
  onStop: PropTypes.func.isRequired,
};
export default ControlPanel;
