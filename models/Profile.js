const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  company: {
    type: String,
  },
  website: {
    type: String,
  },
  location: {
    type: String,
  },
  status: {
    type: String,
    required: [true, 'Please add your Status'],
  },
  skills: {
    type: [String],
    required: [true, 'Please add your skills'],
  },
  bio: {
    type: String,
  },
  githubusername: {
    type: String,
  },
  experience: [
    {
      title: {
        type: String,
        required: [true, 'Please add your experience title'],
      },
      company: {
        type: String,
        required: [true, 'Please add your company name'],
      },
      location: {
        type: String,
      },
      from: {
        type: Date,
        required: [true, 'Please add start date'],
      },
      to: {
        type: Date,
      },
      current: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
      },
    },
  ],
  education: [
    {
      school: {
        type: String,
        required: [true, 'Please add your school name'],
      },
      degree: {
        type: String,
        required: [true, 'Please add your degree'],
      },
      fieldofstudy: {
        type: String,
        required: [true, 'Please add field of study'],
      },
      from: {
        type: Date,
        required: [
          true,
          'please add date when you start studying for your degree',
        ],
      },
      to: {
        type: Date,
      },
      current: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
      },
    },
  ],
  social: {
    youtube: {
      type: String,
    },
    twitter: {
      type: String,
    },
    facebook: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    instagram: {
      type: String,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('profile', profileSchema);
