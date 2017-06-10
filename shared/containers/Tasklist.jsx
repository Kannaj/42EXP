import React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import NewTask from '../components/NewTask';
import loader from '../components/Loader';
import Task from '../components/Task';
import update from 'react-addons-update';

class TaskList extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      tasks: [],
      isFetching: true,
      isModalOpen: false,
      selectedTask: 0
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
          this.setState({ tasks: data, isFetching: false })
        }
      }.bind(this))
    }
  }

  openModal(){
    this.setState({ isModalOpen: true })
  }

  closeModal(){
    this.setState({ isModalOpen: false })
  }

  addTask(data){
    this.setState({ tasks: this.state.tasks.concat(data)})
  }

  handleFocus(task,index){
    this.setState({ selectedTask: index })
  }

  handleEdit(index,data){
    this.setState({ tasks: update(this.state.tasks, {
      [index]: {
        $set: data[0]
      }
    })})
  }

  taskDelete(index){
    this.setState({ tasks: update(this.state.tasks, {
      $splice: [[index,1]]
    })})
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
                <Task taskDelete={this.taskDelete.bind(this)} handleEdit={this.handleEdit.bind(this)} handleFocus={this.handleFocus} canEdit={this.props.canEdit} selected={this.state.selectedTask === i} task={task} index={i} key={i} />
              )
            })
          }
          {this.props.canEdit && <button className="add_task" onClick={this.openModal}> + Add new task</button> }
        </div>

        <Modal isOpen={this.state.isModalOpen}
               onRequestClose={this.closeModal}
               className="new_task__form"
               overlayClassName="new_task" >
              <NewTask task={null} edit={false} projectId={this.props.params.projectId} name={this.props.params.projectName} addTask={this.addTask.bind(this)} close={this.closeModal}/>
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
