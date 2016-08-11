import validate from '../../../shared/utils/validation.js';
import chai,{expect} from 'chai';
// console.log(validation)

describe('Form Validation',() => {

  let submittedValues,errorObject

  beforeEach(() => {
    submittedValues = {name:'',description:'',category:'',link:''}
    errorObject = {}
  })

  it('should return multiple errors if empty form is submitted is submitted',() => {
    errorObject = validate(submittedValues)
    expect(errorObject.name).to.equal('Please provide a proper name without spaces and no special characters')
    expect(errorObject.description).to.equal('Required')
    expect(errorObject.category).to.equal('Required')
    expect(errorObject.link).to.be.undefined;
  })

  it('should return error if only specfic field is not submitted',() => {
    submittedValues.description = 'Lorem ipsum'
    errorObject = validate(submittedValues)
    expect(errorObject.name).to.equal('Please provide a proper name without spaces and no special characters')
    expect(errorObject.category).to.equal('Required')
  })

  it('should return an error if the link provided is not a valid https link',() => {
    submittedValues.link = 'www.pornhub.com'
    errorObject = validate(submittedValues)
    expect(errorObject.link).to.equal('Url must be a fully valid github url (be sure to include https as well)')
  })

  it('should return error if incorrect (non-github) domain is provided as link',() => {
    submittedValues.link = 'https://www.pornhub.com'
    errorObject = validate(submittedValues);
    expect(errorObject.link).to.equal('Url must be a fully valid github url (be sure to include https as well)')
  })

  it('should return valid if github domain is specified',() => {
    submittedValues.link = 'https://www.github.com/kannaj/xanadu'
    errorObject = validate(submittedValues);
    expect(errorObject.link).to.be.undefined;
  })
})
