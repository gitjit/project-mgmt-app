import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { useMutation } from '@apollo/client';
import { DELETE_CLIENT } from './mutations/clientMutations';



function ClientRow({client}) {
    const [deleteClient,{loading, error,data}] = useMutation(DELETE_CLIENT);

    if(loading) return <p>`Deleting ... ${client.name}`</p>
    if(error) return <p>`Error occurred while deleting ${client.name}`</p>
    
  return (
    <tr>
      <td>{client.name}</td>
      <td>{client.email}</td>
      <td>{client.phone}</td>
      <td>
        <button onClick={() =>deleteClient({variables:{id:client.id}})}>
          <FaTrash />
        </button>
      </td>
    </tr>
  );
}

export default ClientRow;
