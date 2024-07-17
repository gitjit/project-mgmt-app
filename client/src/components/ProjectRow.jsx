import React from 'react';
import { FaTrash } from 'react-icons/fa';

function onDelete(id){
    console.log(`Deleting client : ${id}`);
}

function ProjectRow({project}) {
    console.log(project.name);
  return (
    <tr>
      <td>{project.name}</td>
      <td>{project.description}</td>
      <td>{project.client.name}</td>
      <td>
        <button onClick={() => onDelete(project.id)}>
          <FaTrash />
        </button>
      </td>
    </tr>
  );
}

export default ProjectRow;
