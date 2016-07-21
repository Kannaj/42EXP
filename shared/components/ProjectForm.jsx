import React from 'react';
import {connect} from 'react-redux';
import Select from 'react-select';
import {skillOptions,categoryOptions} from '../utils/Autocomplete.js'


class ProjectForm extends React.Component{
  constructor(props){
    super(props);
    this.state={
      name:"",
      description:"",
      link:"",
      category:"",
      skill:[]
    }
    // this.handleChange = this.handleChange.bind(this)
  }

  getOptions(name,input,callback){
    let opt;
    if(socket && input.length > 4){

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

  handleSubmit(){
    if(socket){
      this.props.create_project(this.state)
    }
  }

  render(){

    return(
      <div id="project_form">
        <div className="title">
          <h1>Project Form </h1>
        </div>

        <div id="project_details">
          <div className="block">
            <label htmlFor="name"> Name </label>
            <input id="name" type="text" value={this.state.name} onChange={this.handlename.bind(this,'name')}/>
          </div>
          <div className="block">
            <label htmlFor="link"> Link </label>
            <input id="link" type="text" value={this.state.link} onChange={this.handlename.bind(this,'link')}/>
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
