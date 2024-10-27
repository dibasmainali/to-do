import React, { useState, useEffect } from "react";

export default function Popup({ onSave, onClose, editNote }) {
  const [title, setTitle] = useState(editNote ? editNote.title : "");
  const [description, setDescription] = useState(editNote ? editNote.description : "");

  useEffect(() => {
    if (editNote) {
      setTitle(editNote.title);
      setDescription(editNote.description);
    }
  }, [editNote]);

  // Function to check if a line is already numbered
  const isNumbered = (line) => /^\d+\.\s/.test(line);

  // Automatically format the description as a numbered list, only if not already numbered
  const handleDescriptionChange = (e) => {
    const inputText = e.target.value;
    const lines = inputText.split("\n");
    const formattedText = lines
      .map((line, index) => (isNumbered(line) ? line : `${index + 1}. ${line}`))
      .join("\n");
    setDescription(formattedText);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const date = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const note = { title, description, date };
    onSave(note);
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ease-in-out">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md transform transition-transform duration-300 ease-in-out scale-95 sm:scale-100">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          {editNote ? "Update Note" : "Add a New Note"}
        </h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter note title"
            className="border border-gray-300 w-full p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <label className="block mb-2 font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Enter note description"
            className="border border-gray-300 w-full p-3 rounded h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
            spellCheck="true"
          />
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded shadow hover:bg-blue-600 transition duration-200"
            >
              {editNote ? "Update Note" : "Add Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
