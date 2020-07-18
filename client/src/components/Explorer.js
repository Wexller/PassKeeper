import React, {useCallback, useEffect, useState} from 'react'
import '../styles/explorer.scss'
import Namespace from './Namespace'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import Modal from 'react-modal'
import Loader from './elements/Loader'
import NamespaceControl from './NamespaceControl';
import ProjectControl from './ProjectControl';


function Explorer() {
  const {loading, request, error, clearError} = useHttp()

  const message = useMessage()

  useEffect(() => {
    message(error)
    clearError()
  }, [error, message, clearError])

  const [namespaces, setNamespaces] = useState([])
  const [displayAddForm, setDisplayAddForm] = useState(true)
  const [modalType, setModalType] = useState('')

  const fetchNamespaces = useCallback(async () => {
    try {
      const fetched = await request('http://localhost:5000/api/namespace/')
      setNamespaces(fetched)
    } catch (e) {}
  }, [request])

  useEffect(() => {
    fetchNamespaces()
  }, [fetchNamespaces])

  async function addNewProject(event) {
    event.preventDefault()
    try {

      fetchNamespaces()
    } catch (e) {}
  }

  async function removeProject(event) {
    event.preventDefault()
    try {

      fetchNamespaces()
    } catch (e) {}
  }

  function openProjectsModal() {
    // setModalTitle('Управление Проектами')
    // setModalType('projects')
    // setModalContent(getProjectsControlForm())
    // openModal()
  }

  function getProjectsControlForm() {
    return (
      <div>
        {displayAddForm && <form onSubmit={addNewProject}>

        </form>}
        {!displayAddForm && <form onSubmit={removeProject}>

        </form>}
      </div>
    )
  }

  return (
    <div className="explorer" style={{position: 'relative'}}>
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
        !loading &&
        <div style={{marginTop: '1rem'}}>
          { namespaces.map(namespace => <Namespace
            key={namespace._id}
            namespace={namespace}
            fetchNamespaces={fetchNamespaces}/>) }
        </div>
      }
    </div>
  )
}

export default Explorer