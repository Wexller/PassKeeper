import React from 'react';
import '../styles/namespace.scss'

function Namespace({namespace}) {
  return (
    <li>
      <div className="collapsible-header">
        <i className="material-icons">keyboard_arrow_right</i>
        {namespace.name}
      </div>
      <div className="collapsible-body">
        { !namespace.projects.length && 'Проектов нет' }
        { namespace.projects.map(project => (
           <div data-item="project" data-id={project._id} key={project._id}>{project.name}</div>
         )) }
      </div>
    </li>
  )
}

export default Namespace