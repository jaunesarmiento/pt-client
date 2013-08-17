/**!
 * Mango.js
 * Copyright (c) Jaune Sarmiento 2013 <hawnecarlo@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies
 */

var request = require("superagent");
var baseUrl = "https://www.pivotaltracker.com/services/v5";


/**
 * Expose Mango
 */

exports = module.exports = Mango;


/**
 * Setup Mango with options
 *
 * Options:
 *  - `token` API Token from Pivotal Tracker
 *  - `projectId` ID of the project to work on
 *
 * @param {Object} options
 * @api public
 */

function Mango(options) {
  this._initialize(options);
}


/**
 * Pivotal Tracker story states
 *
 * States:
 *  - accepted
 *  - delivered
 *  - finished
 *  - started
 *  - rejected
 *  - unstarted
 *  - unscheduled
 *
 * @api public
 */

Mango.prototype.STATES = "accepted delivered finished started rejected unstarted unscheduled".split(' ');


/**
 * Initialzes instance of Mango
 *
 * Options:
 *  - `token` API Token from Pivotal Tracker
 *  - `projectId` ID of project to work on
 *
 * @param {Object} options
 * @api private
 */

Mango.prototype._initialize = function (options) {
  if (options === undefined) {
    throw new Error("Error: missing paramter options");
    return;
  }

  if (options.token === undefined) {
    throw new Error("Error: missing API token");
    return;
  }

  if (options.projectId === undefined) {
    throw new Error("Error: missing project ID");
    return;
  }

  this._setToken(options.token);
  this._setProjectId(options.projectId);
};


/**
 * Returns the saved API Token
 *
 * @return {String}
 * @api private
 */

Mango.prototype._getToken = function () {
  return this._token;
};


/**
 * Sets the API Token
 *
 * @param {String} token
 * @api private
 */

Mango.prototype._setToken = function (token) {
  this._token = token;
};


/**
 * Returns the ID of the project
 *
 * @return {String}
 * @api private
 */

Mango.prototype._getProjectId = function () {
  return this._projectId;
};


/**
 * Sets the project ID
 *
 * @param {String} projectId
 * @api private
 */

Mango.prototype._setProjectId = function (projectId) {
  this._projectId = projectId;
};


/**
 * Sets a story's state to the given state and returns it back via a callback
 *
 * Options:
 *  - `storyId` ID of the story
 *  - `status` Status to update the story to
 *
 * @param {Object} options
 * @param {Function} cb
 * @return {Object}
 * @api private
 */

Mango.prototype._setStatus = function (options, cb) {
  var that = this;

  if (options === undefined) {
    throw new Error("Error: missing options parameter");
    return;
  }

  if (options.storyId === undefined) {
    throw new Error("Error: missing option storyId");
    return;
  }

  if (this.STATES.indexOf(options.status) === -1) {
    throw new Error("Error: invalid story state");
    return;
  }

  request
    .put(baseUrl + '/projects/' + that._getProjectId() + '/stories/' + options.storyId)
    .send({ 'current_state': options.status })
    .set('X-TrackerToken', that._getToken())
    .end(function (res) {
      if (res.ok) {
        cb && cb(res.body);
      }
      else {
        throw new Error("Error: Could not update story with id " + options.storyId + " to status " + options.status);
        return;
      }
    });
};


/**
 * Sets the story given its ID to "started"
 *
 * @param {String} storyId
 * @param {Function} cb
 * @return {Object}
 * @api public
 */

Mango.prototype.start = function (storyId, cb) {
  this._setStatus({
    storyId: storyId,
    status: "started"
  }, function (story) {
    cb && cb(story);
  });
};


/**
 * Sets the story given its ID to "finished"
 *
 * @param {String} storyId
 * @param {Function} cb
 * @return {Object}
 * @api public
 */

Mango.prototype.finish = function (storyId, cb) {
  this._setStatus({
    storyId: storyId,
    status: "finished"
  }, function (story) {
    cb && cb(story);
  });
};


/**
 * Sets the story given its ID to "delivered"
 *
 * @param {String} storyId
 * @param {Function} cb
 * @return {Object}
 * @api public
 */

Mango.prototype.deliver = function (storyId, cb) {
  this._setStatus({
    storyId: storyId,
    status: "delivered"
  }, function (story) {
    cb && cb(story);
  });
};


/**
 * Sets the story given its ID to "accepted"
 *
 * @param {String} storyId
 * @param {Function} cb
 * @return {Object}
 * @api public
 */

Mango.prototype.accept = function (storyId, cb) {
  this._setStatus({
    storyId: storyId,
    status: "accepted"
  }, function (story) {
    cb && cb(story);
  });
};


/**
 * Sets the story given its ID to "rejected"
 *
 * @param {String} storyId
 * @param {Function} cb
 * @return {Object}
 * @api public
 */

Mango.prototype.reject = function (storyId, cb) {
 this._setStatus({
    storyId: storyId,
    status: "rejected"
  }, function (story) {
    cb && cb(story);
  });
};

