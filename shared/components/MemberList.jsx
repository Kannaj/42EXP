import React, { Component } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

class MemberList extends Component{

  constructor(props){
    super(props)
    this.state = {
      memberList : []
    }
  }

  componentDidMount(){
    if(socket){
      socket.emit('project:member_list',{ name: this.props.project_name },function(err,data){
        if(data){
          this.setState({ memberList : data })
        }else{
          throw(err)
        }
      }.bind(this))
    }
  }

  render(){
    return(
      <div className="member_list" >
        <h3 onClick={ this.props.close } className="member_list__close">X</h3>
        <h2 className="member_list__header"> Members </h2>
        {
          this.state.memberList.length > 0 ?
            this.state.memberList.map((member,i) => {
              return (
                <Link to ={`/user/${member.username}`} className="member_list__member" key={i} onClick={this.props.close}>
                  <img src={`https://avatars1.githubusercontent.com/${ member.username }`}/>
                  <p>{ member.username }</p>
                </Link>
              )
            })
          :
          <h1> Loading ... </h1>
        }

      </div>
    )
  }
}

MemberList.PropTypes = {
  project_name: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired
}


export default MemberList;
