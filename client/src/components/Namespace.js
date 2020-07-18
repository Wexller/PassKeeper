import React, {useEffect, useState} from 'react';
import '../styles/nameapce.scss'
import {useHttp} from '../hooks/http.hook';
import {useMessage} from '../hooks/message.hook';

function Namespace({namespace}) {
  const [active, setActive] = useState(false)

  return (
    <div className="namespace">
      <div className="namespace-title" onClick={() => setActive(!active)}>
        {namespace.name}
      </div>
      <ul className={ active ? 'project-list active' : 'project-list'}>
        { namespace.projects.map(project => (
          <li className="project-list-item" key={project._id}>{project.name}</li>
        )) }
      </ul>
    </div>
  )
}

export default Namespace