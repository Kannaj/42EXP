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

  render(){
    return (
      <div className="task">
        <div className="task_details">
          <div className="header">
            <h3 onClick={() => this.props.handleFocus(this.props.task, this.props.index)} className="header">
              {this.props.index + 1}. {this.props.task.name}
            </h3>
          </div>

          {
            this.props.canEdit ?
            <div className="actions">
              <button className="ion-edit" onClick={this.openModal.bind(this)}></button>
              <button className="ion-ios-trash" onClick={this.handleDelete.bind(this)}></button>
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
