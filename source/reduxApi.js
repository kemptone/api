import api from './minimalApi'
import { SubmissionError } from 'redux-form'

export default settings => (d, g) => new Promise((resolve, reject) => 
  api(settings)(d, g)
    .catch(reject)
    .then(resolve)
  ).catch(({ errors, customReduxErrorHandling, e }) => {
    const outputErrors = {}
    errors.forEach( ({ code, description }) => outputErrors[ code ] = description )
    customReduxErrorHandling && customReduxErrorHandling({ outputErrors, errors, e })
    throw new SubmissionError( outputErrors )
  })