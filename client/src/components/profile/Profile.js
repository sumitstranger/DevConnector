import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';

import Spinner from '../layout/Spinner';
import { getProfileByID } from '../../actions/profile';
import { Link } from 'react-router-dom';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileExperience from './ProfileExperience';
import ProfileEducation from './ProfileEducation';

const Profile = ({
  getProfileByID,
  match,
  auth,
  profile: { profile, loading },
}) => {
  useEffect(() => {
    getProfileByID(match.params.id);
  }, [getProfileByID, match.params.id]);

  return (
    <Fragment>
      {profile === null || loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <Link className='btn btn-light' to='/profiles'>
            Back To Profiles
          </Link>
          {auth.isAuthenticated &&
            auth.loading === false &&
            auth.user._id === profile.user._id && (
              <Link to='/edit-profile' className='btn btn-dark'>
                Edit Profile
              </Link>
            )}
          <div className='profile-grid my-1'>
            <ProfileTop profile={profile} />
            <ProfileAbout profile={profile} />
            <div class='profile-exp bg-white p-2'>
              <h2 class='text-primary'>Experience</h2>
              {profile.experience.length > 0 ? (
                <Fragment>
                  {profile.experience.map((exps) => (
                    <ProfileExperience key={exps._id} experience={exps} />
                  ))}
                </Fragment>
              ) : (
                <h4>No experience credentials</h4>
              )}
            </div>
            <div class='profile-edu bg-white p-2'>
              <h2 class='text-primary'>Education</h2>
              {profile.education.length > 0 ? (
                <Fragment>
                  {profile.education.map((edu) => (
                    <ProfileEducation key={edu._id} education={edu} />
                  ))}
                </Fragment>
              ) : (
                <h4>No education credentials</h4>
              )}
            </div>
            {/* {profile.githubusername && (
              <ProfileGithub username={profile.githubusername} />
            )} */}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

const mapStateToProp = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProp, { getProfileByID })(Profile);
