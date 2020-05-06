import React, { useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { getPosts } from '../../actions/post';
import Spinner from '../layout/Spinner';
import PostItem from './PostItem';

const Posts = ({ getPosts, post: { posts, loading } }) => {
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 class='large text-primary'>Posts</h1>
      <p class='lead'>
        <i class='fas fa-user'></i> Welcome to the community!
      </p>
      {/*POstForm */}
      <div class='posts'>
        {posts.map((post) => (
          <PostItem key={post._id} post={post} />
        ))}
      </div>
    </Fragment>
  );
};

const mapStateToProp = (state) => ({
  post: state.post,
});

export default connect(mapStateToProp, { getPosts })(Posts);
