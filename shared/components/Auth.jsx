import React from 'react';
import request from 'superagent';

export default class Auth extends React.Component{
  constructor(props){
    super(props)
    this.state={
      username:'',
      password:'',
      email: '',
      errorMessage:''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event){
    this.setState({[event.target.name]:event.target.value})
  }

  handleSubmit(){
    request
      .post(this.props.url)
      .set('Accept','application/json')
      .set('Content-Type','application/json')
      .send({username:this.state.username,password:this.state.password,email:this.state.email})
      .end((err,res) => {
        if(err){
          this.setState({errorMessage:res.text})
        }else{
          console.log('res: ',res)
          window.location = '/'
        }
      })
  }

  render(){
    return(
      <div className="register">
        {
          this.state.errorMessage ? <h2>{this.state.errorMessage} </h2> : null
        }
        <div className="register_form_group">
          <label htmlFor="username"> Username </label>
          <input id="username" value={this.state.username} name="username" onChange={this.handleChange}/>
        </div>
        <div className="register_form_group">
          <label htmlFor="password">Password </label>
          <input id="password" type="password" value={this.state.password} name="password" onChange={this.handleChange}/>
        </div>
        <div className="register_form_group">
          <label htmlFor="email">Email</label>
          <input id ="email" type="email" value={this.state.email} name="email" onChange={this.handleChange}/>
        </div>
        <button className="register_submit" onClick={this.handleSubmit}> Submit </button>
        <hr/>
        <div id="github_auth">
          <a href="/auth/github" className="github_auth"> Register with Github </a>
        </div>
      </div>
    )
  }
}
