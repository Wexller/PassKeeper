import React, {useCallback, useEffect, useState} from 'react';
import '../styles/body.scss';
import Explorer from './Explorer';
import CaseControl from './CaseControl';
import {useHttp} from '../hooks/http.hook';
import {useMessage} from '../hooks/message.hook';
import CaseList from './CaseList';

function Body() {
  const {request, error, clearError} = useHttp()
  const message = useMessage()

  useEffect(() => {
    message(error)
    clearError()
  }, [error, message, clearError])

  const [caseList, setCaseList] = useState([])
  const [currentProjectId, setCurrentProject] = useState('')

  function project(projectId) {
    setCurrentProject(projectId)
  }

  const getCases = useCallback(async () => {
    if (currentProjectId) {
      try {
        const cases = await request(`http://localhost:5000/api/case/${currentProjectId}`)
        setCaseList(cases)
      } catch (e) {}
    }
  }, [currentProjectId, request])

  useEffect(() => {
    getCases()
  }, [currentProjectId, getCases])

  return (
    <div className="body">
      <Explorer project={project} />
      {currentProjectId &&
        <div className="data-block" style={{paddingLeft: '20px'}}>
          <CaseList caseList={caseList} getCases={getCases} />
          <CaseControl projectId={currentProjectId} getCases={getCases} />
        </div>
      }
    </div>
  )
}


export default Body
