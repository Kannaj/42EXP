import validate from '../../../shared/utils/validation.js';
import chai,{expect} from 'chai';
// console.log(validation)

describe('Form Validation',() => {

  let submittedValues,errorObject

  beforeEach(() => {
    submittedValues = {name:'',description:'',category:''}
    errorObject = {}
  })

  it('should return multiple errors if empty form is submitted is submitted',() => {
    errorObject = validate(submittedValues)
    expect(errorObject.name).to.equal('Please provide a proper name without spaces and no special characters')
    expect(errorObject.description).to.equal('Required')
    expect(errorObject.category).to.equal('Required')
  })

  it('should return error if only specfic field is not submitted',() => {
    errorObject = validate(submittedValues)
    submittedValues.description = 'Lorem ipsum'
    errorObject = validate(submittedValues)
    expect(errorObject.name).to.equal('Please provide a proper name without spaces and no special characters')
    expect(errorObject.category).to.equal('Required')
  })
})
