import React, { useState, useEffect } from "react";
import Popup from "./components/Popup";
import { FaPen, FaTimes } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import NoteCard from "./components/NoteCard"; // Import the new NoteCard component

export default function App() {
  const [notes, setNotes] = useState(
    JSON.parse(localStorage.getItem("notes")) || []
  );
  const [popupVisible, setPopupVisible] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");

  useEffect(() => {
    const storedSortOrder = localStorage.getItem("sortOrder");
    if (storedSortOrder) setSortOrder(storedSortOrder);
  }, []);

  const saveNotesToLocalStorage = (updatedNotes) => {
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  const addOrUpdateNote = (note) => {
    if (editNote) {
      const updatedNotes = notes.map((n) =>
        n.id === editNote.id ? { ...n, ...note } : n
      );
      saveNotesToLocalStorage(updatedNotes);
      setFeedback({ message: "Note updated successfully!", type: "normal" });
    } else {
      saveNotesToLocalStorage([
        ...notes,
        {
          ...note,
          id: uuidv4(),
          date: new Date().toISOString(),
          pinned: false,
        },
      ]);
      setFeedback({ message: "Note added successfully!", type: "normal" });
    }
    setPopupVisible(false);
    setEditNote(null);
    setTimeout(() => setFeedback({ message: "", type: "" }), 2000);
  };

  const deleteNote = (id) => {
    const confirmDel = window.confirm(
      "Are you sure you want to delete this note?"
    );
    if (confirmDel) {
      const updatedNotes = notes.filter((note) => note.id !== id);
      saveNotesToLocalStorage(updatedNotes);
      setFeedback({ message: "Note deleted successfully!", type: "normal" });
      setTimeout(() => setFeedback({ message: "", type: "" }), 2000);
    }
  };

  const togglePin = (id) => {
    const confirmPin = window.confirm("Do you want to change the pin status?");
    if (confirmPin) {
      const updatedNotes = notes.map((note) =>
        note.id === id ? { ...note, pinned: !note.pinned } : note
      );
      saveNotesToLocalStorage(updatedNotes);
      const pinnedStatus = updatedNotes.find((note) => note.id === id).pinned
        ? "pinned"
        : "unpinned";
      setFeedback({
        message: `Note ${pinnedStatus} successfully!`,
        type: "highlight",
      });
      setTimeout(() => setFeedback({ message: "", type: "" }), 2000);
    }
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    localStorage.setItem("sortOrder", e.target.value); // Persist sort order in local storage
  };

  const sortNotes = (notes) => {
    return [...notes].sort((a, b) => {
      if (a.pinned !== b.pinned) return b.pinned - a.pinned; // Pin status sorting
      return sortOrder === "latest"
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date);
    });
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedNotes = sortNotes(filteredNotes);

  return (
    <div className="min-h-screen bg-blue-200 p-5 relative">
      {feedback.message && (
        <div
          aria-live="polite"
          className={`${
            feedback.type === "highlight"
              ? "bg-yellow-200 border-yellow-500 text-yellow-700"
              : "bg-green-100 border-green-500 text-green-700"
          } px-4 py-3 rounded relative mb-4 border`}
        >
          {feedback.message}
        </div>
      )}
      <div className="flex flex-col justify-center items-center">
        <p className="text-3xl">Note Taking App</p>
        <p className="text-sm text-gray-500">
          "Actively take notes and organize them when you're studying."
        </p>
      </div>
      <div className="flex sm:flex-row mt-4 sm:items-center gap-4">
        <input
          type="text"
          placeholder="Search notes"
          className="w-full sm:w-2/3 p-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="text-gray-500 ml-2"
          >
            ✕
          </button>
        )}
        <select
          value={sortOrder}
          onChange={handleSortChange}
          className="w-full sm:w-1/3 p-2 border border-gray-300 rounded-md"
        >
          <option value="latest">Sort by Latest</option>
          <option value="oldest">Sort by Oldest</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-6 mt-4 sm:justify-center md:justify-center lg:justify-start">
        <div
          onClick={() => setPopupVisible(true)}
          className="hidden md:flex w-full sm:w-64 h-64 bg-white flex-col items-center justify-center rounded shadow cursor-pointer hover:bg-blue-100 transition"
        >
          <div className="w-20 h-20 flex items-center justify-center border-dotted border-2 rounded-full text-blue-200 text-4xl">
            +
          </div>
          <p className="mt-4 text-blue-600 font-semibold text-lg">
            Add new note
          </p>
        </div>

        {sortedNotes.length > 0 ? (
          sortedNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={(note) => {
                setEditNote(note);
                setPopupVisible(true);
              }}
              onDelete={deleteNote}
              onTogglePin={togglePin}
            />
          ))
        ) : (
          <div className="text-gray-600 text-lg mt-6">
            No notes available. Click the "Add new note" button to get started!
          </div>
        )}
      </div>

      <button
        onClick={() => setPopupVisible(true)}
        className="fixed bottom-4 right-4 md:hidden bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full p-4 shadow-lg flex items-center space-x-2 hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
      >
        {/* <i className="fas fa-plus"></i>  */}+
        <span className="font-semibold">New Note</span>
      </button>

      {popupVisible && (
        <Popup
          onSave={addOrUpdateNote}
          onClose={() => setPopupVisible(false)}
          editNote={editNote}
        />
      )}
    </div>
  );
}
