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
            <p>A place to find and colloborate on new projects with other developers</p>
          </div>
          <div className="action_buttons">


            <a href= "/auth/github" className="action login_github">
              <span className="ion-social-octocat logo"></span>
                    Register with Github
            </a>

            <Link to="/projects" className="action explore">
              <span className="ion-search logo"></span>
                    Explore
            </Link>


            <a href= "https://github.com/kannaj/42exp" className="action source_code">
              <span className="ion-social-octocat logo"></span>
                    View Source Code
            </a>

          </div>
        </section>
      </div>
    )
  }
}
