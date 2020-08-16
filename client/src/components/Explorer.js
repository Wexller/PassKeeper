import React, {useCallback, useEffect, useState, useContext} from 'react'
import Namespace from './Namespace'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import Loader from './elements/Loader'
import NamespaceControl from './NamespaceControl';
import ProjectControl from './ProjectControl';
import {AuthContext} from '../context/AuthContext';
import '../styles/explorer.scss'

function Explorer({project}) {
  const {loading, request, error, clearError} = useHttp()
  const {token} = useContext(AuthContext)

  const message = useMessage()

  useEffect(() => {
    message(error)
    clearError()
  }, [error, message, clearError])

  const [namespaces, setNamespaces] = useState([])

  const fetchNamespaces = useCallback(async () => {
    try {
      const fetched = await request('/api/namespace/', 'GET', null, {
        Authorization: `Bearer ${token}`
      })
      setNamespaces(fetched)
      const $el = document.querySelectorAll('.collapsible')
      window.M.Collapsible.init($el, {})
    } catch (e) {}
  }, [request, token])

  useEffect(() => {
    fetchNamespaces()
  }, [fetchNamespaces])

  function projectClick(event) {
    if (event.target.dataset['item'] === 'project') {
      project(event.target.dataset['id'])
    }
  }

  return (
    <div className="explorer">
      { loading && <Loader /> }

      <div className="row">
        <NamespaceControl
          updateList={fetchNamespaces}
          namespaces={namespaces}
          contentLoading={loading}/>
        <ProjectControl
          updateList={fetchNamespaces}
          namespaces={namespaces}
          contentLoading={loading}/>
      </div>

      {
        !loading && (namespaces.length > 0) &&
        <ul className="collapsible" onClick={projectClick}>
          { namespaces.map(namespace => <Namespace
            key={namespace._id}
            namespace={namespace}
            fetchNamespaces={fetchNamespaces}/>) }
        </ul>
      }
      {
        !loading && (namespaces.length === 0) &&
          <span>Объединений нет</span>
      }
    </div>
  )
}

export default Explorer