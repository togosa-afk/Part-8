import { useState } from "react"
import { useMutation, useQuery } from "@apollo/client/react"
import { ALL_AUTHORS, UPDATE_AUTHOR } from "../queries"


const EditAuthor =() => {
    const [name,setName] = useState('')
    const [born,setBorn] = useState('')
    const result = useQuery(ALL_AUTHORS)

    const authors = result.data?.allAuthors ?? []
    
    const [editAuthor] = useMutation(UPDATE_AUTHOR,{
        refetchQueries: [{ query: ALL_AUTHORS }]
    })

    if (result.loading) {
        return <div>Loading ...</div>
    }

    if(result.error){
        return <div>{result.error.message}</div>
    }

    const submit = (event) =>{
        event.preventDefault()

        editAuthor({variables : {name, setBornTo: Number(born)}})

        setBorn('')
        setName('')
    }

    return(
        <>
            <form onSubmit={submit}>
                <div>
                    name
                    <select value={name} onChange={({target})=> setName(target.value)}>
                        <option value="">chose author</option>
                        {authors.map((a) => (
                                <option key={a.id} value={a.name}> {a.name} </option>
                            ))}
                    </select>
                </div> 
                <div>
                    born
                    <input type="text" value={born} onChange={({ target }) => setBorn(target.value)} />
                </div>
                <button type="submit">update author</button>
            </form>
        </>
    )
}

export default EditAuthor