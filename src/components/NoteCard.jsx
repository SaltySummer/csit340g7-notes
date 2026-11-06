import { useState } from "react"; // 1. Don't forget to import useState

function NoteCard({ title, body }) {
    const [visible, setVisible] = useState(false);

  return (
    <div>
      <h3 className="pr-8 text-[22px] font-normal break-words">{title}</h3>

      {visible && 
        <p className="mt-3 text-[17px] break-words whitespace-pre-wrap text-[#4d4d4d]">
            {body}
        </p>
      }
      <button
        type="button"
        onClick={() => setVisible(!visible)} // 2. Toggle the visibility state on click
        className="mt-3 cursor-pointer text-[15px] font-normal text-[#b83f45] underline"
      >
        {visible ? "Show less" : "Show more"} {/* 3. Swap text dynamically */}
      </button>
    </div>
  )
}

export default NoteCard;