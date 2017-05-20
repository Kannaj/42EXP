import React from 'react';
import { Link } from 'react-router';


export default class About extends React.Component{
  render(){
    return (
      <div className="static_page about">

        <div className="static_page__header">
          <h2> About 42exp</h2>
        </div>

        <div className="static_page__content">
          <div className="block">
            <h3> What is 42exp? </h3>
            <p>
                42exp was built out of a desire to make a website
                aimed at helping new developers find projects they can
                contribute to and include in their portfolio.
            </p>
            <p>
                The site is completely open sourced and can be found
                <a href="https://github.com/Kannaj/42exp"> here. </a>
                 Any sort of contribution/feedback is welcome and appreciated
            </p>
          </div>

          <div className="block">
            <h3> Why such a name? </h3>
            <p>
                The number 42 is the answer to <a href="https://en.wikipedia.org/wiki/Phrases_from_The_Hitchhiker%27s_Guide_to_the_Galaxy"> Life, the universe and everything. </a>
            </p>
            <p>
              "exp" alludes to the xp system used by the site.
            </p>
          </div>

          <div className="block">
            <h3> Who runs the site ? </h3>

            <p>
              <a href="https://github.com/Kannaj"> This guy </a>
            </p>
            <p>
              If you would like to get in touch for whatever reason. You can contact me via
              <a href="mailto:kjpacino@gmail.com"> Email </a>
            </p>
          </div>

          <div className="block legal">
            <h3> Legal</h3>

            <p>
              <Link to="/tos">Terms of service </Link>
            </p>
            <p>
              <Link to="/privacy"> Privacy Policy </Link>
            </p>
          </div>

        </div>

      </div>
    )
  }
}
