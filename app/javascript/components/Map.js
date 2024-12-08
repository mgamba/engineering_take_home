import React from 'react';

const Map = ({latitude,longitude}) => {
  return (
    <div>
      <iframe
        frameBorder="0"
        scrolling="no"
        marginHeight="0"
        marginWidth="0"
        src="https://maps.google.com/maps?width=600&amp;height=400&amp;hl=en&amp;q={latitude},{longitude}&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed">
      </iframe>
    </div>
  );
};

export default Map;
