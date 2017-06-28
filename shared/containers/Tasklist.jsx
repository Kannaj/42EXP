import React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import NewTask from '../components/NewTask';
import loader from '../components/Loader';
import Task from '../components/Task';
import update from 'react-addons-update';

class TaskListContainer extends React.Component{

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
    this.fetchData = this.fetchData.bind(this)
  }

  componentDidMount(){
    this.props.tasks ? this.setState({ tasks: this.props.tasks, isFetching: false }) : this.fetchData()
  }

  fetchData(){
    if(socket){
      socket.emit('project:get_tasks',{ id: this.props.id, name: this.props.name }, function(err,data){
        if(err){
          this.props.setTasks([])
          this.setState({ isFetching: false})
        } else {
          this.props.setTasks(data)
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

  updateStatus(index,completed){
    this.setState({ tasks: update(this.state.tasks, {
      [index]: {
        completed: {
          $set: completed
        }
      }
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
              {this.props.canEdit && <button className="ion-add" onClick={this.openModal}> + Add</button> }
            </div>
          </div>
          <Modal isOpen={this.state.isModalOpen}
                 onRequestClose={this.closeModal}
                 className="new_task__form"
                 overlayClassName="new_task" >
                <NewTask id={this.props.id} name={this.props.name} addTask={this.addTask.bind(this)} close={this.closeModal}/>
          </Modal>
        </div>
      )
    }
    return(
      <div className="tasklist_container">
        <div className="task_names">
          {
            this.state.tasks.map((task,i) => {
              return (
                <Task taskUpdateStatus={this.updateStatus.bind(this)} taskDelete={this.taskDelete.bind(this)} handleEdit={this.handleEdit.bind(this)} handleFocus={this.handleFocus} canEdit={this.props.canEdit} selected={this.state.selectedTask === i} task={task} index={i} key={i} />
              )
            })
          }
          {this.props.canEdit && <button className="add_task" onClick={this.openModal}> + Add</button> }
        </div>

        <Modal isOpen={this.state.isModalOpen}
               onRequestClose={this.closeModal}
               className="new_task__form"
               overlayClassName="new_task" >
              <NewTask task={null} edit={false} projectId={this.props.id} name={this.props.name} addTask={this.addTask.bind(this)} close={this.closeModal}/>
        </Modal>

      </div>
    )
  }
}

export default TaskListContainer;
