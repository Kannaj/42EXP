import React from 'react';
import Select from 'react-select';
import {reduxForm} from 'redux-form';
import {skillOptions,categoryOptions} from '../utils/Autocomplete.js'


const fields = ['name','link','description','category']

const validate = values => {
  const errors = {}
  if(!values.name){
    errors.name = 'Required'
  }
  if(!values.link){
    errors.link = 'Required'
  }
  if(!values.description){
    errors.description = 'Required'
  }
  if(!values.category){
    errors.category = 'Required'
  }
  return errors;
}

const submit = (values) => {
  console.log('recieved values : ',values)
}

class CreateProjectForm extends React.Component{

  constructor(props){
    super(props);
    // this.handleSubmit = this.handleSubmit.bind(this)
  }
  getOptions(name,input,callback){
    let opt;
    if(socket && input.length > 2){

      socket.emit(`${name}:suggestions`,{[name]:input},(err,data) => {

        if(name=="category"){
          opt = categoryOptions(data)
        }else{
          opt = skillOptions(data)
        }
        callback(null,{options:opt,complete:true})
      })
    }
  }

  handleChange(name,input){
    if(name=='category'){
      this.setState({[name]:input.value})
    }else{
      this.setState({[name]:input})
    }
  }
  //
  // handleSubmit(event,data){
  //   event.preventDefault()
  //   console.log('submitting : ',data)
  // }

  render(){
    const {fields:{name,link,description,category},resetForm,submitting,handleSubmit,onBlur} = this.props;
    console.log('this.props: ',this.props.fields.category)
    return(
      <form onSubmit={handleSubmit(submit)}>
        <div>
          <label>Name</label>
          <div>
            <input type="text" placeholder="Project Name" {...name} />
          </div>
          {name.touched && name.error && <div>{name.error} </div>}
        </div>
        <div>
          <label>Link</label>
          <div>
            <input type="text" placeholder="Link to repo" {...link} />
          </div>
          {link.touched && link.error && <div>{link.error} </div>}
        </div>
        <div>
          <label>Description</label>
          <div>
            <textarea  placeholder="Description" {...description} />
          </div>
          {description.touched && description.error && <div>{description.error} </div>}
        </div>
        <div className="block">
          <label htmlFor="category">Category</label>
          <Select.Async name="project_category"
            loadOptions={this.getOptions.bind(this,'category')}
            onChange={this.handleChange.bind(this,'category')}
            value={this.props.fields.category.value}
            onBlur={() => {this.props.fields.category.onBlur(this.props.fields.category.value) }}
            {...category}
             />

        </div>
        {category.touched && category.error && <div>{category.error} </div>}
        <div>
          <button type="submit" disabled={submitting}>
            {submitting ? <i/> : <i/>} Submit
          </button>
          <button type="button" disabled={submitting} onClick={resetForm}>
            Clear Values
          </button>
        </div>
      </form>
    )
  }
}

export default reduxForm({
  form:'CreateProjectForm',
  fields,
  validate
})(CreateProjectForm)
