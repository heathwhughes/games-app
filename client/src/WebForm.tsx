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
