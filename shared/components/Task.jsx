import React from 'react';
import Modal from 'react-modal';
import NewTask from './NewTask';

class Task extends React.Component{
  constructor(props){

    super(props);
    this.state = {
      isModalOpen: false
    }
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal(){
    this.setState({ isModalOpen: true })
  }

  closeModal(){
    this.setState({ isModalOpen: false })
  }

  handleDelete(){
    socket.emit('project:delete_task', { id: this.props.task.id }, function(err,data) {
      if(err){
        console.log('err: ',err)
      } else {
        this.props.taskDelete(this.props.index)
      }
    }.bind(this))
  }

  handleComplete(){
    socket.emit('project:update_task_status',{ id: this.props.task.id, completed: !this.props.task.completed}, function(err,data){
      if(err){
        console.log('err: ',err)
      }else{
        console.log('data : ',data)
        this.props.taskUpdateStatus(this.props.index, !this.props.task.completed )
      }
    }.bind(this))
  }

  render(){
    console.log('task : ',this.props.task)
    return (
      <div className="task">
        <div className="task_details">
          <div className="header">
            <h3 onClick={() => this.props.handleFocus(this.props.task, this.props.index)} className="header">
              {this.props.index + 1}. <span className="task_header">{this.props.task.name} </span>
            </h3>
            { this.props.task.completed ? <button className="completed"> Done </button> : null }
          </div>

          {
            this.props.canEdit ?
            <div className="actions">
              {
                this.props.task.completed ?
                <button className="ion-reply mark_done" onClick={this.handleComplete.bind(this)}></button>
                :
                <button className="ion-checkmark mark_done" onClick={this.handleComplete.bind(this)}></button>
              }
              <button className="ion-edit edit" onClick={this.openModal.bind(this)}></button>
              <button className="ion-ios-trash trash" onClick={this.handleDelete.bind(this)}></button>
            </div>
            :
            null
          }
        </div>

        <div className={`task_description ${this.props.selected ? "show" : "hide"}`}>
          {this.props.task.description}
        </div>

        <Modal isOpen={this.state.isModalOpen}
               onRequestClose={this.closeModal}
               className="new_task__form"
               overlayClassName="new_task" >
              <NewTask index={this.props.index} handleEdit={this.props.handleEdit} edit={true} projectId={this.props.projectId} task={this.props.task} close={this.closeModal}/>
        </Modal>

      </div>
    )
  }
}

export default Task;
