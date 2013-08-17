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
  options = options || {};
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

Mango.prototype._stories = [];

Mango.prototype._project = {};


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
  this.setToken(options.token);
  this.setProjectId(options.projectId);

  if (this._token == null) {
    console.log("Error: Missing API token");
    return;
  }

  if (this._projectId == null) {
    console.log("Error: Missing project id");
    return;
  }
};


/**
 * Returns the saved API Token
 *
 * @return {String}
 * @api public
 */

Mango.prototype.getToken = function () {
  return this._token;
};


/**
 * Sets the API Token
 *
 * @param {String} token
 * @api public
 */

Mango.prototype.setToken = function (token) {
  this._token = token;
};


/**
 * Returns the ID of the project
 *
 * @return {String}
 * @api public
 */

Mango.prototype.getProjectId = function () {
  return this._projectId;
};


/**
 * Sets the project ID
 *
 * @param {String} projectId
 * @api public
 */

Mango.prototype.setProjectId = function (projectId) {
  this._projectId = projectId;
};


/**
 * Fires a GET request to Pivotal Tracker to fetch a project given its ID
 *
 * @param {Function} cb
 * @return {Object}
 * @api public
 */

Mango.prototype.fetchProject = function (cb) {
  var that = this;

  if (!cb) {
    console.log("Error: Missing callback paramter for function fetchProject");
    return;
  }

  request
    .get(baseUrl + '/projects/' + that.getProjectId())
    .set('X-TrackerToken', that.getToken())
    .end(function (res) {
      if (res.ok) {
        that._project = res.body;
        cb(that._project);
      }
      else {
        console.log("Error: Could not get project with id " + this.getProjectId());
        return;
      }
    });
};


/**
 * Fires a GET request to Pivotal Tracker to fetch stories under a project given
 * its ID
 *
 * @param {Function} cb
 * @return {Object}
 * @api public
 */

Mango.prototype.fetchStories = function (cb) {
  var that = this;

  if (!cb) {
    console.log("Error: Missing callback paramter for function fetchStories");
    return;
  }

  request
    .get(baseUrl + '/projects/' + that.getProjectId() + '/stories')
    .set('X-TrackerToken', that.getToken())
    .end(function (res) {
      if (res.ok) {
        that._stories = res.body;
        cb(that._stories);
      }
      else {
        console.log("Error: Could not get stories of project with id " + that.getProjectId());
        return;
      }
    });
};


/**
 * Converts stories from Pivotal Tracker into Cucumber Feature files
 *
 * @param {Function} cb
 * @return {Object}
 * @api public
 */

Mango.prototype.convertStories = function (cb) {

  if (!cb) {
    console.log("Error: Missing callback paramter for function convertStories");
    return;
  }

  if (this._stories.length == 0) {
    console.log("Error: No stories to convert");
    return;
  }

  // TODO: JAEMAR CONVERT ALGO SHIZ
  cb();
};


/**
 * Returns the project returned by Pivotal Tracker via a callback
 *
 * @param {Function} cb
 * @return {Object}
 * @api public
 */

Mango.prototype.getProject = function (cb) {

  if (!cb) {
    console.log("Error: Missing callback paramter for function getProject");
    return;
  }

  this.fetchProject(function (project) {
    cb(project);
  });
};


/**
 * Returns the stories returned by Pivotal Tracker via a callback
 *
 * @param {Function} cb
 * @return {Object}
 * @api public
 */

Mango.prototype.getStories = function (cb) {

  if (!cb) {
    console.log("Error: Missing callback paramter for function getStories");
    return;
  }

  this.fetchStories(function (stories) {
    cb(stories);
  });
};


/**
 * Returns a list of stories with the given state via a callback
 *
 * Options:
 *  - `status` Status of stories to get
 *
 * @param {Object} options
 * @param {Function} cb
 * @return {Object}
 * @api public
 */

Mango.prototype.getStoriesByStatus = function (options, cb) {
  var that = this;

  if (!cb) {
    console.log("Error: Missing callback paramter for function getStoriesByStatus");
    return;
  }

  if (!options || !options.status) {
    console.log("Error: Missing options paramter for function getStoriesByStatus");
    return;
  }

  if (that.STATES.indexOf(options.status) == -1) {
    console.log("Error: Invalid status '" + options.status + "'");
    return;
  }

  // TODO: convert status to lowercase

  request
    .get(baseUrl + '/projects/' + that.getProjectId() + '/stories')
    .query({ "with_state": options.status })
    .set('X-TrackerToken', that.getToken())
    .end(function (res) {
      if (res.ok) {
        that._stories = res.body;
        cb(that._stories);
      }
      else {
        console.log("Error: Could not get stories with status " + options.status);
        return;
      }
    });
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
 * @api public
 */

Mango.prototype.setStoryStatus = function (options, cb) {
  var that = this;

  if (!cb) {
    console.log("Error: Missing callback paramter for function setStoryStatus");
    return;
  }

  if (!options) {
    console.log("Error: Missing options parameter for function setStoryStatus");
    return;
  }

  if (!options.storyId) {
    console.log("Error: Missing option storyId for function setStoryStatus");
    return;
  }

  if (!options.status) {
    console.log("Error: Missing option status for function setStoryStatus");
    return;
  }

  request
    .put(baseUrl + '/projects/' + that.getProjectId() + '/stories/' + options.storyId)
    .send({ 'current_state': options.status })
    .set('X-TrackerToken', that.getToken())
    .end(function (res) {
      console.log(res);
      if (res.ok) {
        cb(res.body);
      }
      else {
        console.log("Error: Could not update story with id " + options.storyId);
        return;
      }
    });
};


/**
 * Returns a list of tasks under a story and returns is via a callback
 *
 * Options:
 *  - `storyId` ID of the story
 *
 * @param {Object} options
 * @param {Function} cb
 * @return {Object}
 * @api public
 */

Mango.prototype.getStoryTasks = function (options, cb) {
  var that = this;

  if (!cb) {
    console.log("Error: Missing callback paramter for function getStoryTasks");
    return;
  }

  if (!options) {
    console.log("Error: Missing options parameter for function getStoryTasks");
    return;
  }

  if (!options.storyId) {
    console.log("Error: Missing option storyId for function getStoryTasks");
    return;
  }

  request
    .get(baseUrl + '/projects/' + that.getProjectId() + '/stories/' + options.storyId + '/tasks')
    .set('X-TrackerToken', that.getToken())
    .end(function (res) {
      if (res.ok) {
        cb(res.body)
      }
      else {
        console.log("Error: Could not get list of tasks under story with id " + options.storyId);
        return;
      }
    });
};
