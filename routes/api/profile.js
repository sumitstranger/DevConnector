const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const request = require('request');
const config = require('config');

const Profile = require('../../models/Profile');
const USer = require('../../models/User');

// @router GET api/profile/me
// @desc   get profile
// @access private

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      return res.status(400).json({ msg: 'there is no profile' });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// @router POST api/profile
// @desc   Crete profile or update
// @access private

router.post(
  '/',
  [
    auth,
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      twitter,
      facebook,
      instagram,
      linkedin,
    } = req.body;

    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;

    // Skills - Spilt into array
    if (typeof skills !== 'undefined') {
      profileFields.skills = skills.split(',');
    }

    // Social
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        //Update profile
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        res.json(profile);
      }

      //Create
      profile = new Profile(profileFields);
      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
);

// @router GET api/profile
// @desc   show all profile
// @access public

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @router GET api/profile/user/:user_id
// @desc   get profile by id
// @access public

router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);
    if (!profile) return res.status(400).json({ msg: 'Profile not found ' });
    res.json(profile);
  } catch (err) {
    if (err.kind == 'ObjectId')
      return res.status(400).json({ msg: 'Profile not found ' });

    res.status(500).send('Server Error');
  }
});

// @router DELETE api/profile
// @desc   delete profile,user & post
// @access private

router.delete('/', auth, async (req, res) => {
  try {
    //Delete profile
    await Profile.findOneAndRemove({ user: req.user.id });

    //Delete user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'profile deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @router PUT api/profile/experience
// @desc   Add proflie experience
// @access private

router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'title is required').not().isEmpty(),
      check('company', 'company is required').not().isEmpty(),
      check('from', 'from date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const {
      title,
      company,
      from,
      location,
      to,
      current,
      description,
    } = req.body;

    const newExp = {
      title,
      company,
      from,
      location,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);
      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
);

// @router DELETE api/profile/experience/:exp_id
// @desc   delete experience from profile
// @access private

router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) return res.status(404).json({ msg: 'Not found' });

    const experienceIndex = profile.experience
      .map((item) => item.id.toString())
      .indexOf(req.params.exp_id);

    if (experienceIndex === -1)
      return res.status(404).json({ msg: 'Not found' });
    console.log(experienceIndex);
    profile.experience.splice(experienceIndex, 1);
    await profile.save();
    //console.log(experienceIndex);
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @router PUT api/profile/education
// @desc   Add proflie education
// @access private

router.put(
  '/education',
  [
    auth,
    [
      check('school', 'school is required').not().isEmpty(),
      check('degree', 'degree is required').not().isEmpty(),
      check('fieldofstudy', 'field of study is required').not().isEmpty(),
      check('from', 'from is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
);

// @router DELETE api/profile/education/:edu_id
// @desc   delete education from profile
// @access private

router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) return res.status(404).json({ msg: 'Not availble' });

    const eduIndex = profile.education
      .map((item) => item._id.toString())
      .indexOf(req.params.edu_id);

    if (eduIndex === -1) return res.status(404).json({ msg: 'Not found' });

    profile.education.splice(eduIndex, 1);
    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @router GET api/profile/github/:username
// @desc   get gtihub repo
// @access public

router.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?
      per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}
      &client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      header: { 'user-agent': 'node.js' },
    };
    request(options, (error, response, body) => {
      if (error) console.error(error);
      if (response.statusCode !== 200) {
        console.log(response.statusCode);
        return res.status(400).json({ msg: 'No Github profile found' });
      }
      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
