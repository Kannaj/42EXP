import React from 'react';

class Flash_message extends React.Component{

  render(){
    return(
      <div className="notification_wrapper">
        <div className="heading"> {this.props.heading} </div>
        <div className="message"> {this.props.message} </div>
        <button onClick={() => this.props.remove(this.props.id)}> Close </button>
      </div>
    )
  }
}

export default Flash_message;
