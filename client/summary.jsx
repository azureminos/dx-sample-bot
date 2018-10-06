/* ----------  External Libraries  ---------- */

import React from 'react';
import {Article} from 'react-weui';


/*
 * Tour Summary based on the user added list items
 */
const TourSummary = ({
  items
}) => {
  console.log('>>>>TourSummary', items);

  return (
    <div id='summary'>
      <Article>
        <h1>Page 2</h1>
        <section>
          <h2 className="title">Heading</h2>
          <section>
            <h3>2.1 Title</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute</p>
          </section>
        </section>
      </Article>
    </div>
  );
};

export default TourSummary;
