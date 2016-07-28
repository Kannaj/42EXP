import React from 'react';

class Notification extends React.Component{

  render(){
    return(
      <div className="notification_wrapper">
        <div className="heading"> {this.props.heading} </div>
        <div className="message"> {this.props.message} </div>
        <button onClick={() => this.props.remove(this.props.id,this.props.server)}> Close </button>
      </div>
    )
  }
}

export default Notification;
