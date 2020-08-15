import React, {useEffect, useState} from 'react';
import Modal from 'react-modal';
import {useMessage} from '../hooks/message.hook';
import {useHttp} from '../hooks/http.hook';
import {modalStyles} from '../constants';

function NamespaceControl({updateList, namespaces, contentLoading}) {
  const {loading, request, error, clearError} = useHttp()
  const message = useMessage()

  useEffect(() => {
    message(error)
    clearError()
  }, [error, message, clearError])

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [displayAddForm, setDisplayAddForm] = useState(true)

  const [namespaceAddName, setNamespaceAddName] = useState('')
  const [namespaceRemoveId, setNamespaceRemoveId] = useState('')

  function getModalContent() {
    return (
      <>
        { displayAddForm && getAddForm() }

        { !displayAddForm && getRemoveForm() }
      </>
    )
  }

  function getAddForm() {
    return (
      <form onSubmit={addNewNamespace}>
        <div className="row valign-wrapper">
          <div className="input-field col s8">
            <input
              name="name"
              type="text"
              placeholder="Название объединения"
              value={namespaceAddName}
              onChange={event => setNamespaceAddName(event.target.value)}
              disabled={loading}
              required
            />
          </div>

          <button
            className="col s3 offset-l1 btn"
            type="submit"
            disabled={loading}
          >Добавить
          </button>
        </div>
      </form>
    )
  }

  function getRemoveForm() {
    return (
      <form onSubmit={removeNamespace}>
        <div className="row valign-wrapper">
          <div className="input-field col s8">
            <select
              style={{height: '54px'}}
              className="browser-default"
              name="id"
              value={namespaceRemoveId}
              onChange={event => setNamespaceRemoveId(event.target.value)}
            >
              <option
                value=""
                disabled
                defaultValue
              >Список объединений
              </option>
              {namespaces.map(n => <option key={n._id} value={n._id}>{n.name}</option>)}
            </select>
          </div>
          <button className="btn col s3 offset-l1 btn" type="submit">Удалить</button>
        </div>
      </form>
    )
  }

  async function addNewNamespace(event) {
    event.preventDefault()
    try {
      const data = await request('http://localhost:5000/api/namespace/', 'POST', {name: namespaceAddName})
      message(data.message)
      setNamespaceAddName('')
      updateList()
    } catch (e) {}
  }

  async function removeNamespace(event) {
    event.preventDefault()
    try {
      const data = await request(`http://localhost:5000/api/namespace/${namespaceRemoveId}`, 'DELETE')
      message(data.message)
      setNamespaceRemoveId('')
      updateList()
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
      <button className="btn col s6" onClick={openModal} disabled={contentLoading}>Объединения</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={modalStyles}
        contentLabel="Управление объединениями"
      >
        <div className="modalTitle">Управление объединениями</div>
        <div style={{margin: '1rem 0'}}>
          <div className="switch center-align">
            <label>
              Добавить
              <input value={displayAddForm} onChange={toggleDisplayedForm} type="checkbox" />
              <span className="lever custom-switcher" />
              Удалить
            </label>
          </div>
          {getModalContent()}
        </div>

        <button
          className="btn red accent-1 closeModal"
          onClick={closeModal}>Закрыть</button>
      </Modal>
    </>
    )
}

export default NamespaceControl