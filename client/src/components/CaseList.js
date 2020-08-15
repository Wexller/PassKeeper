import React, {useEffect, useState} from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {useHttp} from '../hooks/http.hook';
import {useMessage} from '../hooks/message.hook';
import '../styles/caseList.scss';
import {modalStyles} from '../constants';
import Modal from 'react-modal';

function CaseList({caseList, getCases}) {
  const {loading, request, error, clearError} = useHttp()
  const message = useMessage()

  useEffect(() => {
    message(error)
    clearError()
  }, [error, message, clearError])

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [caseId, setCaseId] = useState('')
  const [caseForm, setCaseForm] = useState({
    login: '',
    password: '',
    link: ''
  })
  const [passwordFieldType, setPasswordFieldType] = useState('password')

  const formStyles = {
    margin: '1rem 0',
    padding: '0 15% 1rem 15%'
  }

  function openModal() {
    setPasswordFieldType('password')
    setModalIsOpen(true)
  }

  function closeModal() {
    setModalIsOpen(false)
  }

  async function updateCase(event) {
    event.preventDefault()
    try {
      const data = await request(`http://localhost:5000/api/case/${caseId}`, 'PUT', {...caseForm})
      message(data.message)
      getCases()
    } catch (e) {}
  }

  function togglePasswordVisibility(event) {
    event.target.classList.toggle('active')
    passwordFieldType === 'password'
      ? setPasswordFieldType('text')
      : setPasswordFieldType('password')
  }

  function clickEvent(event) {
    const $el = event.target

    if ($el.dataset['type'] === 'copy') {
      const classes = ['teal-text', 'text-lighten', 'copied']
      $el.classList.add(...classes)
      setTimeout(() => {
        $el.classList.remove(...classes)
      }, 1500)

    } else if ($el.dataset['type'] === 'edit') {
      const id = $el.dataset['id']
      setCaseId(id)
      setCaseForm({...getCaseById(id)})
      openModal()

    } else if ($el.dataset['type'] === 'remove') {
      $el.classList.add('clicked')
      removeCase($el.dataset['id']).then()

    } else if ($el.dataset['type'] === 'open') {
      let url = $el.dataset['link']
      url = url.match(/^https?:/) ? url : '//' + url;
      window.open(url)
    }
  }

  function getCaseById(id) {
    return caseList.find(item => item._id === id)
  }

  async function removeCase(caseId) {
    try {
      if (caseId) {
        const data = await request(`http://localhost:5000/api/case/${caseId}`, 'DELETE')
        message(data.message)
        getCases()
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <table>
        <thead>
        <tr>
          <th width='25%'>Логин</th>
          <th width='20%'>Пароль</th>
          <th width='45%'>Ссылка</th>
          <th width='10%'>Действие</th>
        </tr>
        </thead>

        <tbody onClick={clickEvent}>
        {caseList.map(c => (
          <tr key={c._id}>
            <td>
              <CopyToClipboard text={c.login}>
              <span className='copy-text' data-type="copy">
                {c.login}
                <i className="material-icons copy-done">done</i>
              </span>
              </CopyToClipboard>
            </td>
            <td>
              <CopyToClipboard text={c.password}>
              <span className='copy-text' data-type="copy">
                *****
                <i className="material-icons copy-done">done</i>
              </span>
              </CopyToClipboard>
            </td>
            <td>
              {
                c.link &&
                <CopyToClipboard text={c.link}>
                <span className='copy-text open-link' data-type="copy">
                  {c.link}
                  <i className="material-icons" data-type='open' data-link={c.link}>open_in_new</i>
                  <i className="material-icons copy-done">done</i>
                </span>
                </CopyToClipboard>
              }
              {
                !c.link && '-'
              }
            </td>
            <td className='case-action'>
              <i className="material-icons case-edit" data-type="edit" data-id={c._id}>edit</i>
              <i className="material-icons case-remove" data-type="remove" data-id={c._id}>delete</i>
            </td>
          </tr>
        ))}
        {
          !caseList.length &&
          <tr><td colSpan='4' style={{textAlign: 'center'}}>Записей нет</td></tr>
        }
        </tbody>
      </table>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={modalStyles}
        contentLabel="Добавить запись"
      >
        <div className="modalTitle">Редактировать запись</div>
        <form onSubmit={updateCase}>
          <div style={formStyles}>
            <div className="input-field">
              <input
                type="text"
                placeholder="Логин"
                value={caseForm.login}
                onChange={event => setCaseForm({...caseForm, login: event.target.value})}
                disabled={loading}
              />
            </div>
            <div className="input-field" style={{position: 'relative'}}>
              <input
                type={passwordFieldType}
                placeholder="Пароль"
                value={caseForm.password}
                onChange={event => setCaseForm({...caseForm, password: event.target.value})}
                disabled={loading}
              />
              <div className="material-icons show-password"
                   onClick={togglePasswordVisibility}>remove_red_eye</div>
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
            >Обновить</button>

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

export default CaseList