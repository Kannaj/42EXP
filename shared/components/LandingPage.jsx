import React from 'react';
import { Link } from 'react-router';

export default class LandingPage extends React.Component{
  render(){
    return(
      <div id ="landing_page">
        <section className="landing intro">
          <div className="title">
            <img src = "/images/42exp_logo_landing_page.svg"/>
          </div>
          <div className="explanation">
            <p>A place to find a team for your software projects.</p>
          </div>
          <div className="action_buttons">


            <a href= "/auth/github" className="action login_github">
              <span className="ion-social-octocat logo"></span>
                    Login with Github
            </a>


            <a href= "https://github.com/kannaj/42exp" className="action source_code">
              <span className="ion-social-octocat logo"></span>
                    View Source Code
            </a>

            <Link to="/projects" className="action explore">
              <span className="ion-search logo"></span>
                    Explore Projects
            </Link>

          </div>
        </section>

        <section className="landing project_idea">
          <div className="explanation">
            <div className="content">
              <span className="icon ion-android-bulb"/>
              <h3> Find a team for your project idea </h3>
              <p> Are you a backend developer who would love to work with a frontend dev or vice versa ? Have a project idea but are too overwhelmed with all the stuff you need to do?</p>
              <p> 42exp helps you find a team of interested developers to work with on your project.</p>
            </div>
            <div className="snapshot">
              <a href="/images/project_list_snapshot.png"><img src="/images/project_list_snapshot.png"/></a>
            </div>
          </div>
        </section>

        <section className="landing new_dev">
          <div className="explanation">
            <span className="icon ion-android-list"/>
            <h3> Build your portfolio </h3>
            <p>
              Are you a new developer looking for intresting projects that could use your skills? 42exp contains a number of intresting projects you can contribute to.
            </p>

            <div className="explore_button">
              <Link to="/projects" className="action explore">
                <span className="ion-search logo"></span>
                      Explore Projects
              </Link>
            </div>

          </div>
        </section>

      </div>
    )
  }
}
