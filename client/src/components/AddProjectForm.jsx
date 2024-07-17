import { useState } from "react"
import { useQuery } from "@apollo/client";
import { ADD_PROJECT } from "./mutations/projectMutations";


import { GET_CLIENTS } from "./queries/clientQueries";
import { useMutation } from "@apollo/client";
import { GET_PROJECTS } from "./queries/projectQueries";

const AddProjectForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [clientId, setClientId] = useState('');

    const { loading, error, data } = useQuery(GET_CLIENTS);

    const [addProject] = useMutation(ADD_PROJECT,{
        update(cache, { data: { addProject } }) {
            // Read the current state of the GET_CLIENTS query from the cache
            const { projects } = cache.readQuery({ query: GET_PROJECTS });
    
            // Write the updated list of clients back to the cache
            cache.writeQuery({
                query: GET_PROJECTS,
                data: { projects: projects.concat([addProject]) },
            });
        },
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px', // Adds space between form fields
        width: '100%', // Ensures form takes full width of its container
    };

    const inputStyle = {
        padding: '10px',
        margin: '5px 0', // Adds margin above and below the input
        width: 'calc(100% - 20px)', // Full width minus padding
    };

    const handleSubmit = (e) =>{
        e.preventDefault(); // Prevents the default form submit action
        addProject({variables:{name:name,description:description,clientId:clientId}});
        //addClient({variables:{name:name,email:email,phone:phone}});
        //deleteClient({variables:{id:client.id}}
        console.log('Adding project ',name, description,clientId);
    }

    return (
        <form onSubmit={handleSubmit} style={formStyle}>
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={inputStyle}
                />
            </div>
            <div>
                <label>Description:</label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={inputStyle}
                />
            </div>
            <div>
                <label>Client:</label>
                <select value={clientId} onChange={(e) => setClientId(e.target.value)} style={inputStyle}>
                    <option value="">Select Client</option>
                    {data.clients.map((client) => (
                        <option key={client.id} value={client.id}>
                            {client.name}
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit" style={{ width: '100%', padding: '10px', marginTop: '10px' }}>Add Project</button>
        </form>
    )
}

export default AddProjectForm;

