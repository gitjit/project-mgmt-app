import { useState } from "react";
import { useQuery,gql } from "@apollo/client";
import ClientRow from "./ClientRow";
import {GET_CLIENTS} from './queries/clientQueries'
import AddClientForm from "./AddClientForm";
import { FaPlus } from 'react-icons/fa';



function Client() {
  const {loading, error, data} = useQuery(GET_CLIENTS);
  const [showAddClientForm, setShowAddClientForm] = useState(false); // State to control visibility
  if(loading) return <p>Loading...</p>;
  if(error) return <p>`Error: ${error}`</p>
  
  return (
   <>
   <h2>Clients</h2>
   <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {data && data.clients.map((client) => (
            <ClientRow key={client.id} client={client}/>
          ))}
        </tbody>
      </table>
      <div style={{ textAlign: 'right', marginTop: '10px' }}>
        <button style={{ backgroundColor: '#4CAF50' }}  onClick={() => setShowAddClientForm(!showAddClientForm)}><FaPlus /> </button>
      </div>
      {showAddClientForm && <AddClientForm/>}
   </>);
   

}

export default Client;
