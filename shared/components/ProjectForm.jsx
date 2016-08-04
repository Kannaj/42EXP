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
  if(!values.name || /\s/.test(values.name)){
    errors.name = 'Please provide a proper name without spaces'
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
      name:"",
      description:"",
      link:"",
      category:"",
      skill:[],
      errors:{}
    }
  }

  componentDidMount(){
    if(this.props.project_category){
      this.setState({category:{value:this.props.project_category,label:this.props.project_category}})
    }
    if(this.props.project_name){
      this.setState({name:this.props.project_name})
    }
    if(this.props.project_link){
      this.setState({link:this.props.project_link})
    }
    if(this.props.project_description){
      this.setState({description: this.props.project_description})
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
    return(
      <div id="project_form">
        <div className="title">
          <h1>Create a new Project</h1>
        </div>

        <div id="project_details">
          <div className="block">

            <input id="name" type="text" value={this.state.name} onChange={this.handlename.bind(this,'name')} onBlur={this.handleBlur.bind(this)} placeholder="Project Name"/>
            {this.state.errors.name ? <div className="error"> {this.state.errors.name} </div> : null}
          </div>
          <div className="block">

            <input id="link" type="text" value={this.state.link} onChange={this.handlename.bind(this,'link')} placeholder="Repo Link"/>
          </div>
          <div className="block">

            <textarea cols="40" rows="25" id="description" value={this.state.description} onChange={this.handlename.bind(this,'description')} placeholder="Project Description"/>
            {this.state.errors.description ? <div className="error"> {this.state.errors.description} </div> : null}
          </div>
          <div className="block">

            <Select.Async name="project_category"
              placeholder="Select a Category"
              minimumInput={2}
              loadOptions={this.getOptions.bind(this,'category')}
              onChange={this.handleChange.bind(this,'category')}
              value={this.state.category} />
              {this.state.errors.category ? <div className="error">{this.state.errors.category} </div> : null}
          </div>
          <div className="block">

            <Select.Async name="project_skills"
              placeholder="Pick the skills required for the project"
              minimumInput={2}
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
