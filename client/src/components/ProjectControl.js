import React, {useEffect, useState} from 'react';
import Modal from 'react-modal';
import {useMessage} from '../hooks/message.hook';
import {useHttp} from '../hooks/http.hook';
import {modalStyles} from '../constants';

function ProjectControl({updateList, namespaces, contentLoading}) {
  const {loading, request, error, clearError} = useHttp()
  const message = useMessage()

  useEffect(() => {
    message(error)
    clearError()
  }, [error, message, clearError])

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [displayAddForm, setDisplayAddForm] = useState(true)

  const [projectAdd, setProjectAdd] = useState({namespaceId: '', projectName: ''})
  const [projectRemove, setProjectRemove] = useState({namespaceId: '', id: ''})
  const [currentNamespace, setCurrentNamespace] = useState(0)

  function getModalContent() {
    return (
      <>
        {displayAddForm && getAddForm()}

        {!displayAddForm && getRemoveForm()}
      </>
    )
  }

  function getAddForm() {
    return (
      <form onSubmit={addNewProject}>
        {getNamespaceSelect(projectAdd.namespaceId,
          event => setProjectAdd({...projectAdd, namespaceId: event.target.value}))}

        <div className="row valign-wrapper" style={{paddingBottom: '2rem'}}>
          <div className="input-field col s8">
            <input
              name="name"
              type="text"
              placeholder="Название проекта"
              value={projectAdd.projectName}
              onChange={event => setProjectAdd({...projectAdd, projectName: event.target.value})}
              disabled={loading}
              required
            />
          </div>

          <button
            className="col s3 offset-l1 btn"
            type="submit"
            disabled={loading}
          >Добавить</button>
        </div>
      </form>
    )
  }

  function getRemoveForm() {
    return (
      <form onSubmit={removeProject}>
        {getNamespaceSelect(projectRemove.namespaceId, changeNamespaceSelectValue )}

        <div className="row valign-wrapper" style={{paddingBottom: '2rem'}}>
          <div className="input-field col s8">
            <select
              style={{height: '54px'}}
              className="browser-default"
              name="id"
              value={projectRemove.id}
              onChange={event => setProjectRemove({...projectRemove, id: event.target.value})}
            >
              <option
                value=""
                defaultValue
                disabled
              >Список проектов</option>
              {namespaces[currentNamespace].projects.map(n => <option key={n._id} value={n._id}>{n.name}</option>)}
            </select>
          </div>
          <button className="btn col s3 offset-l1 btn" type="submit">Удалить</button>
        </div>
      </form>
    )
  }

  function getNamespaceSelect(value, callback) {
    return (
      <div className="row" style={{marginBottom: 0}}>
        <div className="input-field col s12">
          <select style={{height: '54px'}}
                  className="browser-default"
                  name="namespace_id"
                  value={value}
                  onChange={callback}
          >
            <option
              value=""
              disabled
              defaultValue
            >Список объединений</option>
            {namespaces.map(n => <option key={n._id} value={n._id}>{n.name}</option>)}
          </select>
        </div>
      </div>
    )
  }

  function changeNamespaceSelectValue(event)
  {
    setProjectRemove({id: '', namespaceId: event.target.value})
    const namespace = namespaces.indexOf(namespaces.find(n => n._id === event.target.value))
    setCurrentNamespace(namespace)
  }

  async function addNewProject(event) {
    event.preventDefault()
    try {
      const data = await request('http://localhost:5000/api/project/', 'POST', {...projectAdd})
      message(data.message)
      setProjectAdd({...projectAdd, projectName: ''})
      updateList()
    } catch (e) {}
  }

  async function removeProject(event) {
    event.preventDefault()
    try {
      const data = await request('http://localhost:5000/api/project/', 'DELETE', {...projectRemove})
      message(data.message)
      updateList()

      setProjectRemove({...projectRemove, id: ''})
    } catch (e) {}
  }

  function openModal() {
    setDisplayAddForm(true)
    setModalIsOpen(true)
  }

  function closeModal() {
    setModalIsOpen(false)
  }

  function toggleDisplayedForm() {
    setDisplayAddForm(!displayAddForm)
  }

  return (
    <>
      <button
        className="btn col s5 offset-l1"
        onClick={openModal}
        disabled={contentLoading}>Проекты</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={modalStyles}
        contentLabel="Управление проектами"
      >
        <div className="modalTitle">Управление проектами</div>
        <div style={{margin: '1rem 0'}}>
          <div className="switch center-align">
            <label>
              Добавить
              <input value={displayAddForm} onChange={toggleDisplayedForm} type="checkbox"/>
              <span className="lever custom-switcher"/>
              Удалить
            </label>
          </div>
          {getModalContent()}
        </div>

        <button
          className="btn red accent-1 closeModal"
          onClick={closeModal}>Закрыть
        </button>
      </Modal>
    </>
  )
}

export default ProjectControl