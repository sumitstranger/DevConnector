import React from 'react';
import { Link } from 'react-router-dom';
const ProfileItem = ({
  profile: {
    user: { _id, name, avatar },
    status,
    comapny,
    location,
    skills,
  },
}) => {
  return (
    <div className='profile bg-light'>
      <img className='round-img' src={avatar} alt='' />
      <div>
        <h2>{name}</h2>
        <p>
          {status} {comapny && <span>at {comapny}</span>}
        </p>
        <p className='my-1'>{location && <span>{location}</span>}</p>
        <Link to={`/profile/${_id}`} className='btn btn-primary'>
          View Profile
        </Link>
      </div>
      <ul>
        {skills.slice(0, 4).map((skill, index) => (
          <li key={index} className='text-primary'>
            <i className='fas fa-check'></i> {skill}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfileItem;
