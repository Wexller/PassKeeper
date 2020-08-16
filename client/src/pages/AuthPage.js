import React, {useContext, useEffect, useState} from 'react'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {AuthContext} from '../context/AuthContext'

export const AuthPage = () => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, request, error, clearError} = useHttp()
  const [form, setForm] = useState({
    email: '', password: ''
  })

  useEffect(() => {
    message(error)
    clearError()
  }, [error, message, clearError])

  useEffect(() => {
    window.M.updateTextFields()
  }, [])

  const changeHandler = event => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const registerHandler = async () => {
    try {
      const data = await request('/api/auth/register', 'POST', {...form})
      message(data.message)
    } catch (e) {}
  }

  const loginHandler = async (event) => {
    event.preventDefault()
    try {
      const data = await request('/api/auth/login', 'POST', {...form})
      auth.login(data.token, data.userId, data.email)
    } catch (e) {}
  }

  return (
    <div className="row">
      <div className="col s6 offset-s3">
        <form onSubmit={loginHandler}>
          <h1>PassKeeper</h1>
          <div className="card">
            <div className="card-content">
              <span className="card-title">Авторизация</span>
              <div>

                <div className="input-field">
                  <input
                    placeholder="Введите email"
                    id="email"
                    type="text"
                    name="email"
                    value={form.email}
                    onChange={changeHandler}
                  />
                  <label htmlFor="email">Email</label>
                </div>

                <div className="input-field">
                  <input
                    placeholder="Введите пароль"
                    id="password"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={changeHandler}
                  />
                  <label htmlFor="email">Пароль</label>
                </div>

              </div>
            </div>
            <div className="card-action">
              <button
                className="btn yellow darken-4"
                style={{marginRight: 10}}
                disabled={loading}
                type='submit'
              >Войти</button>
              <button
                className="btn"
                onClick={registerHandler}
                disabled={loading}
              >Регистрация</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}