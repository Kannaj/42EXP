import React from 'react';

export default class LandingPage extends React.Component{
  render(){
    return(
      <div id ="landing_page">
        <section className="why__42">
          <div className="title">
            <h2>Gain Experience by working on open source software! </h2>
          </div>
          <div className="explanation">
            <p>42exp was built with the aim of helping developers gain experience in software development by helping them find open source projects to contribute to. </p>
          </div>
        </section>
        <section className="why__42">
          <div className="title">
            <h2>Find projects based on your interests and skillset!</h2>
          </div>
          <div className="explanation">
            <p>Projects are classified by the skills required (languages/technologies used) and the category which they fall under (Gaming,Frameworks etc)</p>
          </div>
        </section>
        <section className="why__42">
          <div className="title">
            <h2>Find other programmers to help you on your project!</h2>
          </div>
          <div className="explanation">
            <p>Are you a backend developer who requires a front end guy for your project? Post your skill requirements along with your project to find the right people.</p>
            <p>All users have an option to specify their skillset in their profile. Each of these skills are capable of being commended by other members of the community. Commends lead XP gain for the user.</p>
          </div>
        </section>
        <section className="why__42">
          <div className="title">
            <h2>Track your progress from n00b to the widely sought after Ninja-Rockstar Programmer!</h2>
          </div>
          <div className="explanation">
            <p>42exp aims to provide an objective way of helping a user track his growth as a developer in his skillset.</p>
            <p>All members start at level 1 with 0 XP points and gain levels as they start contributing to projects.  XP points are earned when team members commend the user on his skills.</p>
          </div>
        </section>
      </div>
    )
  }
}
