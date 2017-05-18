import React from 'react';


class FaqXP extends React.Component{
  render(){
    return (
      <div className="faq">
        <div className="faq__header">
          <h3> The Skill/XP system </h3>
        </div>
        <div className="faq__content">
          <p> The skill/XP system is an experimental feature which aims to provide an accurate record of a user's expertise in any given skill. </p>

          <p> Currently , a user can gain XP through "commends" recieved on each of his/her skills. </p>
          <p> Commends are recieved from members of the project/community the user is part of.  </p>

          <p> A required number of XP points is required to progress to the next level. </p>
          {/* TO-DO : Add xp.level scales*/ }

          <p>The Amount of xp recieved from each commend is determined by (level of the commender * 5) </p>
        </div>
      </div>
    )
  }
}

export default FaqXP;
