import React, { useState, useEffect } from "react";
import './App.css'

const WebForm: React.FC = () => {
  // Form state
  const [formData, setFormData] = useState({
    winner: "",
    winnerCharacter: "",
    loser: "",
    loserCharacter: "",
  });

  // State for users
  const [players, setPlayers] = useState<{ id: number; name: string }[]>([]);
  const [characters, setCharacters] = useState<{ id: number; name: string }[]>([]);

  // Fetch users from the API
  useEffect(() => {
    fetch("http://localhost:3000/games/users")
      .then((response) => response.json())
      .then((data) => setPlayers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  // Fetch characters from the API
  useEffect(() => {
    fetch("http://localhost:3000/games/characters")
      .then((response) => response.json())
      .then((data) => setCharacters(data))
      .catch((error) => console.error("Error fetching characters:", error));
  }, []);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form submitted:", formData);

    // Find the selected player & character IDs
    const winnerId = players.find((player) => player.name === formData.winner)?.id;
    const loserId = players.find((player) => player.name === formData.loser)?.id;
    const winnerCharacterId = characters.find((char) => char.name === formData.winnerCharacter)?.id;
    const loserCharacterId = characters.find((char) => char.name === formData.loserCharacter)?.id;

    if (!winnerId || !loserId || !winnerCharacterId || !loserCharacterId) {
      alert("Please select valid players and characters.");
      return;
    }

    const requestBody = {
      winner_id: winnerId,
      loser_id: loserId,
      winner_character_id: winnerCharacterId,
      loser_character_id: loserCharacterId,
    };

    console.log("Submitting:", requestBody);

    try {
      const response = await fetch("http://localhost:3000/games/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        alert("Game submitted successfully!");
      } else {
        alert("Error submitting game.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit game.");
    }
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
            <option key={player.id} value={player.name}>
              {player.name}
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
            <option key={character.id} value={character.name}>
              {character.name}
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
            <option key={player.id} value={player.name}>
              {player.name}
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
            <option key={character.id} value={character.name}>
              {character.name}
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
