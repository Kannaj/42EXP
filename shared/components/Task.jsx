import React from 'react';

class Task extends React.Component{
  render(){
    return (
      <div className="task">
        <div className="task__header">
          <h3 onClick={() => this.props.handleFocus(this.props.task)} className="header">
            {this.props.task.name}
          </h3>
        </div>

        <div className="task__actions">
          <button className="ion-ios-trash"></button>
          <button className="ion-edit"></button>
        </div>
      </div>
    )
  }
}

export default Task;
