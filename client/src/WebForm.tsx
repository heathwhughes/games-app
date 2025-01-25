import React, { useState } from "react";
import './App.css'

const WebForm: React.FC = () => {
  // Form state
  const [formData, setFormData] = useState({
    winner: "",
    winnerCharacter: "",
    loser: "",
    loserCharacter: "",
  });

  // Options for dropdowns (example data)
  const players = ["Player 1", "Player 2", "Player 3", "Player 4"];
  const characters = ["Character A", "Character B", "Character C", "Character D"];

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add form handling logic here (e.g., send data to a server)
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="winner" className="block text-sm font-medium">
          Winner
        </label>
        <select
          id="winner"
          name="winner"
          value={formData.winner}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-md"
          required
        >
          <option value="">Select Winner</option>
          {players.map((player) => (
            <option key={player} value={player}>
              {player}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="winnerCharacter" className="block text-sm font-medium">
          Winner Character
        </label>
        <select
          id="winnerCharacter"
          name="winnerCharacter"
          value={formData.winnerCharacter}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-md"
          required
        >
          <option value="">Select Winner Character</option>
          {characters.map((character) => (
            <option key={character} value={character}>
              {character}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="loser" className="block text-sm font-medium">
          Loser
        </label>
        <select
          id="loser"
          name="loser"
          value={formData.loser}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-md"
          required
        >
          <option value="">Select Loser</option>
          {players.map((player) => (
            <option key={player} value={player}>
              {player}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="loserCharacter" className="block text-sm font-medium">
          Loser Character
        </label>
        <select
          id="loserCharacter"
          name="loserCharacter"
          value={formData.loserCharacter}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-md"
          required
        >
          <option value="">Select Loser Character</option>
          {characters.map((character) => (
            <option key={character} value={character}>
              {character}
            </option>
          ))}
        </select>
      </div>
      <br></br>

      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">
        Submit
      </button>
    </form>
  );
};

export default WebForm;
