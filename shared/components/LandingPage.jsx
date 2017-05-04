import React from 'react';

export default class LandingPage extends React.Component{
  render(){
    return(
      <div id ="landing_page">
        <section className="landing intro">
          <div className="title">
            <img src = "/images/42exp_logo.svg"/>
          </div>
          <div className="explanation">
            <p>A new way to gain experience in software development</p>
          </div>
          <a href= "/auth/github" className="login_github">
          <span className="ion-social-octocat logo"></span>
                  Register with Github
          </a>
        </section>
      </div>
    )
  }
}
