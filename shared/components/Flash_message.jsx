import React from 'react';
import PropTypes from 'prop-types';

class Flash_message extends React.Component{

  render(){
    return(
      <div className="notification_wrapper">
        <div className={`heading ${this.props.heading}`}> {this.props.heading} </div>
        <div className="message"> {this.props.message} </div>
        <button className="close" onClick={ () => this.props.remove(this.props.id) }> Close </button>
      </div>
    )
  }
}

Flash_message.PropTypes = {
  id: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  remove: PropTypes.func.isRequired,
  unread: PropTypes.bool.isRequired
}

export default Flash_message;
