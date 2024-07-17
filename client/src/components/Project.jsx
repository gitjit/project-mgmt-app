
import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { GET_PROJECTS } from './queries/projectQueries';
import { FaPlus } from 'react-icons/fa';

import ProjectRow from './ProjectRow';
import AddProjectForm from './AddProjectForm';

 const Project = () => {
    const {loading, error, data} = useQuery(GET_PROJECTS);
    const [showAddProjectForm, setShowAddProjectForm] = useState(false); // State to control visibility
    if(loading) return <p>Loading...</p>;
    if(error) return <p>`Error: ${error}`</p>


    data.projects.forEach(project => {
        console.log(project.name, project.client.name);
    });
   
    return(
        <>
   <h2>Projects</h2>
   <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Client</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {data && data.projects.map((project) => (
            <ProjectRow key={project.id} project={project}/>
          ))}
        </tbody>
      </table>
      <div style={{ textAlign: 'right', marginTop: '10px' }}>
        <button style={{ backgroundColor: '#4CAF50' }}  onClick={() => setShowAddProjectForm(!showAddProjectForm)}><FaPlus /> </button>
      </div>
      {showAddProjectForm && <AddProjectForm/>}
   </>);
}

export default Project;