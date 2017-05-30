import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { skillOptions, categoryOptions } from '../utils/Autocomplete.js';
import validate from '../utils/validation.js';
import slugify from '../utils/slugify.js'
import update from 'react-addons-update';
import categoryOpt from '../utils/categoryOptions';
import _ from 'lodash';
import loader from './Loader';
import PropTypes from 'prop-types';

class ProjectForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      name: "",
      description: "",
      github_link: "",
      category: "",
      skill: [],
      errors: {},
      pinned: false,
      submitting: false
    }
    this.togglePinnedStatus = this.togglePinnedStatus.bind(this)
  }

  componentDidMount() {
    const { category, name, project_link, description, skills } = this.props
    if(category) {
      this.setState({ category: { value: category, label: category } })
    }
    if(name) {
      this.setState({ name: slugify('deslugify', name) })
    }
    if(project_link) {
      this.setState({ github_link: project_link })
    }
    if(description) {
      this.setState({ description: description })
    }
    if(skills) {
      let skill_list = []
      skills.map((skill) => {
        skill_list.push({ value: skill.name, label: skill.name })
      })
      this.setState({ skill: this.state.skill.concat(skill_list) })
    }
  }


  getOptions(name,input,callback) {
    let opt;
    if(socket) {

      socket.emit(`${name}:suggestions`,{[name]:input},(err,data) => {

        if (name=="category") {
          opt = categoryOptions(data)
        } else {
          opt = skillOptions(data)
        }
        callback(null,{ options: opt, complete: true })
      })
    }
  }

  togglePinnedStatus(){
    this.setState({ pinned : !this.state.pinned})
  }

  handleChange(name,input) {
    if(name=='category') {
      this.setState({ [name]: input.value })
    } else {
      this.setState({ [name]: input })
    }
  }

  handlename(name,event) {
    this.setState({ [name]: event.target.value })
  }

  handleBlur(event) {
    const projectName =  event.target.value
    if(socket && projectName.length >= 1) {
      socket.emit('project:check_name', { name: projectName }, function(err,data) {
        if(err) {
          this.setState({ errors: update(this.state.errors, {
            ['name']: {
              $set: 'Project already exists'
            }
          })})
        } else {
          this.setState({ errors: update(this.state.errors,{
            ['name']: {
              $set:''
            }
          })})
        }
      }.bind(this))
    }
  }

  handleSubmit() {
    if (socket) {
    let errors = validate(this.state);
    if( Object.keys(errors).length > 0 ) {
      this.setState({ errors: errors })
    } else {
      if (this.props.create_project) {
        this.props.create_project(slugify("slugify",this.state))
      }else{
        this.props.edit_project({ project: slugify("slugify",this.state), id: this.props.id })
      }
      this.props.close();
    }
  }
}

  render() {
    return(
      <div className="project_form">
        <div className="project_form__title">
          {this.props.create_project ? <h1> New Project </h1> : <h1> { this.state.name }</h1>}
        </div>

        <div className="close_button" onClick={this.props.close}>X</div>
        <div className="primary_content">
          <div className="project_form__details">
            <div className="project_form__name item">
              <h3> Name <span> (Spaces allowed but no non alpha-numeric characters. Character Limit @ 40 )</span> </h3>
              <input id="name" type="text" value={this.state.name} onChange={this.handlename.bind(this,'name')} onBlur={this.handleBlur.bind(this)} placeholder="Project Name"/>
              { this.state.errors.name ? <div className="error"> {this.state.errors.name} </div> : null }
            </div>

            <div className="project_form__github_link item">
              <h3>Repo link <span>(A link to your public repo if available.)</span></h3>
              <input id="github_link" type="text" value={this.state.github_link} onChange={this.handlename.bind(this,'github_link')} placeholder="Repo Link"/>
              {this.state.errors.github_link ? <div className="error"> {this.state.errors.github_link} </div> : null}
            </div>

            <div className="project_form__category item">
              <h3> Category <span>(Communication,Entertainment etc.)</span></h3>
              <Select name="project_category"
                placeholder="Select a Category"
                options={categoryOpt}
                onChange={this.handleChange.bind(this,'category')}
                value={this.state.category} />
                {this.state.errors.category ? <div className="error">{this.state.errors.category} </div> : null}
            </div>

            <div className="project_form__skills item">
              <h3>Skills <span>(Skills you're looking for from other contributors.)</span></h3>
              <Select.Async name="project_skills"
                placeholder="Pick the skills required for the project"
                minimumInput={ 1 }
                loadOptions={ _.debounce(this.getOptions.bind(this,'skill'),1000) }
                onChange={ this.handleChange.bind(this,'skill') }
                value={ this.state.skill }
                multi={ true }
                autoload={ false }
                />
                { this.state.errors.skill ? <div className="error">{this.state.errors.skill} </div> : null }
            </div>

            {
              this.props.admin ?
              <div className="project_form__pin">
                <input className="pin" type="checkbox" value={this.state.pinned} onClick={this.togglePinnedStatus}/>
                Pin
              </div>
               :
               null
            }

            <div className="form_submit">
              <button className="submit" onClick={ this.handleSubmit.bind(this) }>
                {
                  this.state.submitting ?
                  loader()
                  :
                  "Submit"
                }

              </button>
            </div>
          </div>
          </div>

          <div className="secondary_content">
            <div className="project_form__description item">
              <h3> Details <span>(Explain as much as you can about your idea/project.)</span> </h3>
              <textarea cols="40" rows="25" id="description" value={this.state.description} onChange={this.handlename.bind(this,'description')} placeholder="Project Description"/>
              {this.state.errors.description ? <div className="error"> {this.state.errors.description} </div> : null}
            </div>
          </div>

        </div>
    )
  }
}

ProjectForm.PropTypes = {
  admin: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  create_project: PropTypes.func,
  category: PropTypes.string,
  description: PropTypes.string,
  edit_project: PropTypes.func,
  github_link: PropTypes.string,
  id: PropTypes.number,
  name: PropTypes.string,
  owner: PropTypes.string,
  skills: PropTypes.array
}

export default ProjectForm;
