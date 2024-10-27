import React from "react";
import { FaPen, FaTimes } from "react-icons/fa";

const NoteCard = ({ note, onEdit, onDelete, onTogglePin }) => (
  <div
    className={`bg-white w-full sm:w-64 h-auto p-4 rounded shadow transition hover:shadow-md flex flex-col cursor-pointer ${
      note.pinned ? "border border-blue-500 shadow-blue-500/70 shadow-lg" : ""
    }`}
    onClick={() => onEdit(note)}
  >
    <div className="flex justify-between items-center">
      <h2 className="text-lg font-semibold truncate">{note.title}</h2>
      <div className="flex items-center space-x-2">
        <button
          onClick={(e) => { e.stopPropagation(); onTogglePin(note.id); }}
          aria-pressed={note.pinned}
          aria-label="Pin note"
          className={`${note.pinned ? "text-blue-500" : "text-gray-400"}`}
        >
          📌
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
          className="text-red-500 hover:text-red-700 transition duration-200"
          aria-label="Delete note"
        >
          <FaTimes />
        </button>
      </div>
    </div>
    <hr />
    <p className="mt-2 text-gray-700 whitespace-pre-wrap overflow-y-auto h-[150px]">
      {note.description}
    </p>
    <hr className="my-2" />
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-500">
        {new Date(note.date).toLocaleString()}
      </span>
      <button
        onClick={(e) => { e.stopPropagation(); onEdit(note); }}
        className="text-blue-500 hover:text-blue-700 transition duration-200"
        aria-label="Edit note"
      >
        <FaPen />
      </button>
    </div>
  </div>
);

export default NoteCard;
