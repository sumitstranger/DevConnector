import React from 'react';
import Moment from 'react-moment';

const ProfileEducation = ({
  education: {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    description,
    location,
    current,
  },
}) => {
  return (
    <div>
      <h3 class='text-dark'>{school}</h3>
      <p>
        <Moment format='YYYY/MM/DD'>{from}</Moment>-{' '}
        {to ? <Moment format='YYYY/MM/DD'>{to}</Moment> : 'Now'}
      </p>
      <p>
        <strong>Position: </strong>
        {degree}
      </p>
      <p>
        <strong>Field Of Study: </strong>
        {fieldofstudy}
      </p>
      <p>
        <strong>Description: </strong>
        {description}
      </p>
    </div>
  );
};

export default ProfileEducation;
