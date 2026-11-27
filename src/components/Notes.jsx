import NoteCard from "./NoteCard.jsx";
import { useState, useEffect, useRef, useMemo, useCallback } from "react"

const API_URL = import.meta.env.VITE_API_URL;

const initialFormData = {
    title: "",
    body: ""
}

function Notes(){
    const [notes, setNotes] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [formData, setFormData] = useState(()=>{
        const savedDraft = localStorage.getItem("draft");
        return savedDraft ? JSON.parse(savedDraft):initialFormData;
    });

    const [searchTerm, setSearchTerm] = useState("");
    const titleRef = useRef(null);

    useEffect(() => {
        let ignore = false
        async function loadNotes(){
             try {
        const res = await fetch(API_URL + '/notes')
        if (!res.ok) {
          throw new Error('The server answered ' + res.status)
        }
        const data = await res.json()
        if (!ignore) setNotes(data)
      } catch (err) {
        if (!ignore) setError(err.message)
      }
      if (!ignore) setLoading(false)
     }
  
     loadNotes()
    return () => {
      ignore = true
    }
   }, [])

   
    useEffect(() => {
        const id = setTimeout(() => {
            localStorage.setItem("draft", JSON.stringify(formData));
        }, 1000);
        return () => clearTimeout(id);
    },[formData])

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    async function handleSubmit(e) {
        e.preventDefault();
        const title = formData.title.trim();
        const body = formData.body.trim();

        if (!title || !body) return
        try {
            const res = await fetch(API_URL+'/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, body }),
            })
            if (!res.ok) {
                throw new Error('The server answered ' + res.status)
            }
            const newNote = await res.json()
            setNotes([...notes, newNote])
            setFormData({ title: '', body: '' })
            titleRef.current.focus()
            } catch (err) {
            setError(err.message)
            }
    }

    const filteredNotes = useMemo(() =>{
        return notes.filter((note) =>
            note.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    },[notes, searchTerm]);

    const handleSearch=(e) => {
       setSearchTerm(e.target.value);
    };

    const handleDelete = useCallback((id) => {
        setNotes((notes.filter((note) => note.id !== id)));
    }, [notes]);

    return (
        <>
            <div className="grid min-h-screen grid-cols-[420px_1fr]">
                <aside className="sticky top-0 flex h-screen flex-col gap-5 bg-white px-8 py-9 shadow-[0_2px_4px_0_rgba(0,0,0,0.2),0_25px_50px_0_rgba(0,0,0,0.1)]">
                    <h1 className="text-[72px] leading-none font-extralight text-[#b83f45]">
                    notes
                    </h1>

                    <div>
                        <p className="mb-2 text-[13px] font-normal tracking-wide text-[#949494]">SEARCH</p>
                          <input
                            name="search"
                            value={formData.search}
                            placeholder="Search by title"
                            className="h-[52px] w-full border border-[#e6e6e6] px-4 text-lg outline-none placeholder:text-black/40 placeholder:italic focus:border-[#cf7d7d]"
                            onChange={handleSearch}
                          />
                    </div>

                    <form onSubmit={handleSubmit} className="grid gap-3">
                      <p className="text-[13px] font-normal tracking-wide text-[#949494]">NEW NOTE</p>
                      <input
                        ref={titleRef}
                        name="title"
                        value={formData.title}
                        placeholder="Title"
                        className="h-[52px] w-full border border-[#e6e6e6] px-4 text-lg outline-none placeholder:text-black/40 placeholder:italic focus:border-[#cf7d7d]"
                        onChange={handleChange}
                      />
                      <textarea 
                        name="body"
                        value={formData.body}
                        placeholder="Write your note"
                        className="h-[120px] w-full resize-none py-3 border border-[#e6e6e6] px-4 text-lg outline-none placeholder:text-black/40 placeholder:italic focus:border-[#cf7d7d]"
                        onChange={handleChange}
                      />
                      <button
                            type="submit"
                            className="h-[50px] cursor-pointer bg-[#b83f45] text-[17px] font-normal text-white hover:bg-[#a33439]"
                      >
                        Add note
                      </button>
                    </form>
                </aside>
                <section className="px-12 py-11">
                    <h2 className="mb-6 text-3xl">All notes</h2>
                    <ul className="grid grid-cols-3 items-start gap-5">
                        {filteredNotes.map((note) => (
                            <li key={note.id} className="relative min-h-32 bg-white px-6 py-5 shadow-[0_2px_4px_0_rgba(0,0,0,0.2),0_25px_50px_0_rgba(0,0,0,0.1)]">
                                <NoteCard 
                                    id={note.id}
                                    title={note.title} 
                                    body={note.body}
                                    onDelete={handleDelete}
                                />
                            </li>
                        ))}
                    </ul>
                    {loading && <p className="text-lg text-[#949494]">Loading notes...</p>}
                    {error && <p className="text-lg text-[#b83f45]">{error}</p>}
                    {!loading && !error && filteredNotes.length === 0 && (
                        <p className="text-lg text-[#949494]">No notes found</p>
                    )}
                </section>
            </div>
        </>
    )
}

export default Notes;