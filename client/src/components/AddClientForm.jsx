import { useState } from "react"
import { ADD_CLIENT } from "./mutations/clientMutations";
import { GET_CLIENTS } from "./queries/clientQueries";
import { useMutation } from "@apollo/client";

const AddClientForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [addClient] = useMutation(ADD_CLIENT,{
        update(cache, { data: { addClient } }) {
            // Read the current state of the GET_CLIENTS query from the cache
            const { clients } = cache.readQuery({ query: GET_CLIENTS });
    
            // Write the updated list of clients back to the cache
            cache.writeQuery({
                query: GET_CLIENTS,
                data: { clients: clients.concat([addClient]) },
            });
        },
    });

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
        addClient({variables:{name:name,email:email,phone:phone}});
        //deleteClient({variables:{id:client.id}}
        console.log('Adding client');
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
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                />
            </div>
            <div>
                <label>Phone:</label>
                <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={inputStyle}
                />
            </div>
            <button type="submit" style={{ width: '100%', padding: '10px', marginTop: '10px' }}>Add Client</button>
        </form>
    )
}

export default AddClientForm;