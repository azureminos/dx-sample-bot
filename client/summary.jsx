/* ----------  External Libraries  ---------- */

import React from 'react';
import {Article} from 'react-weui';


/*
 * Tour Summary based on the user added list items
 */
const TourSummary = ({
  items,
  title,
}) => {
  console.log('>>>>TourSummary', items);
  let count = 0;
  const itemList = items.filter(Boolean).map((item) => {
    count++;
    return (
      <section>
        <h3>Day {count}</h3>
        <p>{item.name}</p>
      </section>
    );
  });

  return (
    <div id='summary'>
      <Article>
        <h1>{title}</h1>
        <section>
          <h2 className="title">Itinerary</h2>
          {itemList}
        </section>
      </Article>
    </div>
  );
};

export default TourSummary;
