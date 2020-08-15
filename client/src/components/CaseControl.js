import React, {useEffect, useState} from 'react';
import Modal from 'react-modal';
import {modalStyles} from '../constants';
import {useHttp} from '../hooks/http.hook';
import {useMessage} from '../hooks/message.hook';

function CaseControl({projectId, getCases}) {
  const {loading, request, error, clearError} = useHttp()
  const message = useMessage()

  useEffect(() => {
    message(error)
    clearError()
  }, [error, message, clearError])

  const boxStyle = {
    marginTop: '1rem'
  }

  const btnStyles = {
    display: 'flex',
    alignItems: 'center',
    margin: '0 auto'
  }

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [caseForm, setCaseForm] = useState({
    login: '',
    password: '',
    link: ''
  })

  function openModal() {
    setModalIsOpen(true)
  }

  function closeModal() {
    setModalIsOpen(false)
  }

  async function addNewCase(event) {
    event.preventDefault()
    try {
      const data = await request('http://localhost:5000/api/case', 'POST', {...caseForm, projectId})
      setCaseForm({
        login: '',
        password: '',
        link: ''
      })
      message(data.message)
      getCases()
    } catch (e) {}
  }

  return (
    <>
      <div style={boxStyle}>
        <button className="btn" style={btnStyles} onClick={openModal}>
          <i className="material-icons">add</i>&nbsp;Добавить запись
        </button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={modalStyles}
        contentLabel="Добавить запись"
      >
        <div className="modalTitle">Добавить запись</div>
        <form onSubmit={addNewCase}>
          <div style={{margin: '1rem 0', padding: '0 15% 1rem 15%'}}>
            <div className="input-field">
              <input
                type="text"
                placeholder="Логин"
                value={caseForm.login}
                onChange={event => setCaseForm({...caseForm, login: event.target.value})}
                disabled={loading}
              />
            </div>
            <div className="input-field">
              <input
                type="text"
                placeholder="Пароль"
                value={caseForm.password}
                onChange={event => setCaseForm({...caseForm, password: event.target.value})}
                disabled={loading}
              />
            </div>
            <div className="input-field">
              <input
                type="text"
                placeholder="Ссылка"
                value={caseForm.link}
                onChange={event => setCaseForm({...caseForm, link: event.target.value})}
                disabled={loading}
              />
            </div>
          </div>

          <div className="row">
            <button
              className="btn col s3 offset-s2"
              type="submit"
              disabled={loading}
            >Добавить</button>

            <button
              className="btn col s3 offset-s2 red accent-1"
              onClick={closeModal}>Закрыть
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}

export default CaseControl