const axios = require('axios');
const dayjs = require('dayjs')
const store = require('store');
const _ = require('lodash');
const global_constants = require('../global-constants');
require('dotenv').config();

const userJSON = process.env.USER_DATA_URL;
const userProfileJSON = process.env.USER_PROFILE_URL;

const dataOperation = async (request) => {
  const userData = await axios.get(userJSON);
  const userProfileData = await axios.get(userProfileJSON);
  const mergedArray = _.map(userData.data, (userObj) => {
    const userProfileObj = _.find(userProfileData.data, { userUid: userObj.uid });
    return _.merge(userObj, userProfileObj);
  });
  store.set('mergedUserArray', mergedArray);
  return new Promise( resolve => {
    mergedArray.forEach(element => {
      if (element.username === request.body.username && dayjs().diff(element.birthdate, "year") < 10) {
        store.set(element.uid, element);
        resolve({msg: global_constants.user_noted});
      } else {
        resolve({msg: global_constants.user_validated});
      }
    });
    resolve({msg: global_constants.user_not_found});
  })
}

module.exports = { dataOperation };