import React from 'react';
import {connect} from 'react-redux';
import Select from 'react-select';
import {skillOptions,categoryOptions} from '../utils/Autocomplete.js';
import update from 'react-addons-update';

//known bug - in case this component is invoked for editing purposes (i.e the state is pre-filled). the react-select component is unable to pull the value
// into its box (depite having a value for this.state.category || this.state.skills). as of now , the edit form does not have pre-filled values for category & skills
// meaning the user has to manually fill in those values again.

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

class ProjectForm extends React.Component{
  constructor(props){
    super(props);
    this.state={
      name:"" || this.props.project_name,
      description:"" || this.props.project_description,
      link:"" || this.props.project_link,
      category:"" || this.props.project_category,
      skill:[],
      errors:{}
    }
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

  handlename(name,event){
    this.setState({[name]:event.target.value})
  }

  handleBlur(event){
    console.log('input : ',event.target.value)
    if(socket){
      socket.emit('project:check_name',{name:event.target.value},function(err,data){
        if(err){
          this.setState({errors:update(this.state.errors,{
            ['name']:{
              $set: 'Project already exists'
            }
          })})
        }else{
          this.setState({errors:update(this.state.errors,{
            ['name']:{
              $set:''
            }
          })})
        }
      }.bind(this))
    }
  }

  handleSubmit(){
    if(socket){
    let errors = validate(this.state);
    if(Object.keys(errors).length > 0){
      console.log(errors)
      this.setState({errors:errors})
    }else{
      // this.props.create_project(this.state)
      if (this.props.create_project){
        this.props.create_project(this.state)
      }else{
        this.props.edit_project({project:this.state,id:this.props.id})
      }
    }
  }
}

  render(){
    console.log('this.props: ',this.props);
    console.log('this.state: ',this.state);
    return(
      <div id="project_form">
        <div className="title">
          <h1>Project Form </h1>
        </div>

        <div id="project_details">
          <div className="block">
            <label htmlFor="name"> Name </label>
            <input id="name" type="text" value={this.state.name} onChange={this.handlename.bind(this,'name')} onBlur={this.handleBlur.bind(this)}/>
            {this.state.errors.name ? <div style={{color:'red'}}> {this.state.errors.name} </div> : null}
          </div>
          <div className="block">
            <label htmlFor="link"> Link </label>
            <input id="link" type="text" value={this.state.link} onChange={this.handlename.bind(this,'link')}/>
            {this.state.errors.link ? <div style={{color:'red'}}> {this.state.errors.link} </div> : null}
          </div>
          <div className="block">
            <label htmlFor="description">Description</label>
            <textarea cols="40" rows="5" id="description" value={this.state.description} onChange={this.handlename.bind(this,'description')}/>
          </div>
          <div className="block">
            <label htmlFor="category">Category</label>
            <Select.Async name="project_category"
              loadOptions={this.getOptions.bind(this,'category')}
              onChange={this.handleChange.bind(this,'category')}
              value={this.state.category} />
              {this.state.errors.category ? <div style={{color:'red'}}> {this.state.errors.category} </div> : null}
          </div>
          <div className="block">
            <label htmlFor="skills">skills</label>
            <Select.Async name="project_category"
              loadOptions={this.getOptions.bind(this,'skill')}
              onChange={this.handleChange.bind(this,'skill')}
              value={this.state.skill}
              multi={true}
              />
            </div>
        </div>

        <div className="submit_project">
          <button className="submit" onClick={this.handleSubmit.bind(this)}>Submit</button>
        </div>

      </div>
    )
  }
}

export default ProjectForm;
