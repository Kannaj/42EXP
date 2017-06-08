import React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import NewTask from '../components/NewTask';
import loader from '../components/Loader';
import Task from '../components/Task';

class TaskList extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      tasks: [],
      isFetching: true,
      isModalOpen: false,
      description: "",
      taskName: ""
    }
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }

  componentDidMount(){
    if(socket){
      socket.emit('project:get_tasks',{ id: this.props.params.projectId, name: this.props.params.projectName }, function(err,data){
        if(err){
          console.log('err')
          this.setState({ isFetching: false})
        } else {
          console.log('data', data)
          this.setState({ tasks: data, isFetching: false, description: data[0].description, taskName: data[0].name })
        }
      }.bind(this))
    }
  }

  openModal(){
    console.log('clicked')
    this.setState({ isModalOpen: true })
  }

  closeModal(){
    this.setState({ isModalOpen: false })
  }

  addTask(data){
    this.setState({ tasks: this.state.tasks.concat(data), taskName: data[0].name, description: data[0].description})
  }

  handleFocus(task){
    console.log('handleFocus')
    this.setState({ taskName: task.name, description: task.description })
  }

  render(){
    if(this.state.isFetching){
      return (
        <div className="tasklist_container">
          {loader()}
        </div>
      )
    } else if (this.state.tasks.length == 0) {
      return (
        <div className="tasklist_container">
          <div className="no_tasks_added">
            <div className="action_buttons">
              <h2 className="header">No Tasks added</h2>
              {this.props.canEdit && <button className="ion-add" onClick={this.openModal}> + Add new task</button> }
            </div>
          </div>
          <Modal isOpen={this.state.isModalOpen}
                 onRequestClose={this.closeModal}
                 className="new_task__form"
                 overlayClassName="new_task" >
                <NewTask id={this.props.params.projectId} name={this.props.params.projectName} addTask={this.addTask.bind(this)} close={this.closeModal}/>
          </Modal>
        </div>
      )
    }
    return(
      <div className="tasklist_container">
        <div className="task_names">
          <h1> Tasks </h1>
          {
            this.state.tasks.map((task,i) => {
              return (
                <Task  handleFocus={this.handleFocus} task={task} key={i} />
              )
            })
          }
          {this.props.canEdit && <button className="ion-add" onClick={this.openModal}> + Add new task</button> }
        </div>

        <div className="task_description">
          <h3> {this.state.taskName}   </h3>
          <p>  {this.state.description}</p>
        </div>

        <Modal isOpen={this.state.isModalOpen}
               onRequestClose={this.closeModal}
               className="new_task__form"
               overlayClassName="new_task" >
              <NewTask id={this.props.params.projectId} name={this.props.params.projectName} addTask={this.addTask.bind(this)} close={this.closeModal}/>
        </Modal>

      </div>
    )
  }
}

const mapStateToProps = (state,ownProps) => {
  let canEdit = false
  const project = state.Projects.filter((proj) => {
    return parseInt(ownProps.params.projectId) === proj.id
  })
  if (project.length > 0) {
    canEdit = project[0].role === 'owner'
  }

  return {
    canEdit
  }

}

const TaskListContainer = connect(mapStateToProps)(TaskList)

export default TaskListContainer;
