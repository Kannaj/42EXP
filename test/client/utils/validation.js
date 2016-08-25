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
    submittedValues.github_link = 'www.pornhub.com'
    errorObject = validate(submittedValues)
    expect(errorObject.github_link).to.equal('Url must be a fully valid github url (be sure to include https as well)')
  })

  it('should return error if incorrect (non-github) domain is provided as link',() => {
    submittedValues.github_link = 'https://www.pornhub.com'
    errorObject = validate(submittedValues);
    expect(errorObject.github_link).to.equal('Url must be a fully valid github url (be sure to include https as well)')
  })

  it('should return valid if github domain is specified',() => {
    submittedValues.github_link = 'https://www.github.com/kannaj/xanadu'
    errorObject = validate(submittedValues);
    expect(errorObject.github_link).to.be.undefined;
  })

  it('should return an error if the reddit link provided is not a valid https link',() => {
    submittedValues.reddit_link = 'www.pornhub.com'
    errorObject = validate(submittedValues)
    expect(errorObject.reddit_link).to.equal('Url must be a valid link to the 42exp subreddit!')
  })

  it('should return error if incorrect (non-reddit) domain is provided as link',() => {
    submittedValues.reddit_link = 'https://www.pornhub.com'
    errorObject = validate(submittedValues);
    expect(errorObject.reddit_link).to.equal('Url must be a valid link to the 42exp subreddit!')
  })

  it('should return valid if github domain is specified',() => {
    submittedValues.reddit_link = 'https://www.reddit.com/r/42exp/'
    errorObject = validate(submittedValues);
    expect(errorObject.reddit_link).to.be.undefined;
  })
})
