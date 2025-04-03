import { useState, useContext } from "react";
import { GlobalStateContext, GlobalDispatchContext } from "@/context/GlobalContext";
import { backendAPI, showToast } from "@/utils";

const EmoteUnlockView = () => {
  const { gameState, visitor } = useContext(GlobalStateContext);
  const dispatch = useContext(GlobalDispatchContext);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUnlockAttempt = async () => {
    if (!inputValue.trim()) {
      setError("Please enter a password");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await backendAPI.post("/emote-unlock/attempt", {
        password: inputValue.trim().toLowerCase()
      });

      if (response.data.success) {
        showToast(dispatch, {
          title: "Congrats! Emote Unlocked",
          description: "You just unlocked a new emote! Click on your avatar to test it out."
        });
      } else {
        setError("Oops! That's not the right password. Try again!");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="emote-unlock-container">
      {gameState.droppedAsset.unlockData?.emote ? (
        <div className="emote-preview">
          <img 
            src={gameState.droppedAsset.unlockData.emote.previewUrl} 
            alt={gameState.droppedAsset.unlockData.emote.name}
          />
          <h3>{gameState.droppedAsset.unlockData.emote.name}</h3>
        </div>
      ) : (
        <div className="emote-placeholder">
          <img src="https://sdk-style.s3.amazonaws.com/icons/lock.svg" alt="Locked Emote" />
          <h3>Secret Emote</h3>
        </div>
      )}

      <p className="unlock-prompt">
        {gameState.droppedAsset.unlockData?.prompt || "Enter the correct password to unlock!"}
      </p>

      <div className="unlock-input-group">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter password..."
          disabled={isSubmitting}
        />
        <button
          className="btn"
          onClick={handleUnlockAttempt}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Unlocking..." : "Unlock"}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="unlock-stats">
        <p>{gameState.droppedAsset.unlockData?.successfulUnlocks || 0} users unlocked this emote</p>
      </div>
    </div>
  );
};

export default EmoteUnlockView;