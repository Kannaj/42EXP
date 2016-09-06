import React from 'react';

export default class LandingPage extends React.Component{
  render(){
    return(
      <div id ="landing_page">
        <section className="landing intro">
          <div className="title">
            <h2> 42exp </h2>
          </div>
          <div className="explanation">
            <p>A new way to gain experience in software development</p>
          </div>
          <button className="login_github">
            <a href= "/auth/github">
              Register with Github
            </a>
          </button>
        </section>
        <section className="landing portfolio">
          <div className="title">
            <h2>Build your portfolio ! </h2>
          </div>
          <div className="explanation">
            <p>Work on projects based on your intrests/preferred stack/skill level together with teams</p>
          </div>
        </section>
        <section className="landing showcase">
          <div className="title">
            <h2>Showcase your skillset to the world ! </h2>
          </div>
          <div className="explanation">
            Have your knowledge on various technologies rated by your team-mates based on your contributions to the project.
          </div>
        </section>
      </div>
    )
  }
}
