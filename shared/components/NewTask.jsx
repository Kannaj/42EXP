import React from 'react';

class NewTask extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      name: "",
      description: ""
    }
  }

  handleChange(name,event){
    this.setState({ [name]: event.target.value})
  }

  handleSubmit(){
    socket.emit('project:add_task',{project: this.props.name, name: this.state.name, description: this.state.description} ,function(err,data){
      if(err) {
        console.log('err: ',err)
      } else {
        this.props.addTask(data)
        this.props.close()
      }
    }.bind(this))
  }

  render(){
    return(
      <div className="new_task">
        <h2> Add A New Task  </h2>
        <div className="new_task__name">
          <label htmlFor="task_name">Name <span> (keep it short and precise) </span> </label>
          <input type="text" id="task_name" value={this.state.name} onChange={this.handleChange.bind(this,'name')}/>
        </div>

        <div className="new_task__description">
          <label htmlFor="task_description">Description <span> (Markdown supported) </span></label>
          <textarea id="task_description" value={this.state.description} onChange={this.handleChange.bind(this,'description')}/>
        </div>
        <button className="submit" onClick={this.handleSubmit.bind(this)}> Submit </button>
      </div>
    )
  }
}

export default NewTask;
