var request = require("superagent")
  , baseUrl = "https://www.pivotaltracker.com/services/v5";

exports = module.exports = Mango;

function Mango(options) {
  options = options || {};
  this.initialize(options);
}

Mango.prototype.STATES = "accepted delivered finished started rejected unstarted unscheduled".split(' ');

Mango.prototype._stories = [];
Mango.prototype._project = {};

Mango.prototype.initialize = function (options) {
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

Mango.prototype.getToken = function () {
  return this._token;
};

Mango.prototype.setToken = function (token) {
  this._token = token;
};

Mango.prototype.getProjectId = function () {
  return this._projectId;
};

Mango.prototype.setProjectId = function (projectId) {
  this._projectId = projectId;
};

// Fetches the project from Pivotal Tracker
Mango.prototype.fetchProject = function (cb) {
  var that = this;
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

Mango.prototype.fetchStories = function (cb) {
  var that = this;
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

Mango.prototype.convertStories = function (cb) {
  if (this._stories.length == 0) {
    console.log("Error: No stories to convert");
    return;
  }

  // TODO: JAEMAR CONVERT ALGO SHIZ
  cb();
};

// Returns the project that was returned by Pivotal Tracker
Mango.prototype.getProject = function (cb) {
  this.fetchProject(function (project) {
    cb(project);
  });
};

Mango.prototype.getStories = function (cb) {
  this.fetchStories(function (stories) {
    cb(stories);
  });
};

Mango.prototype.getStoriesByStatus = function (options, cb) {
  var that = this;

  if (!options || !options.status) {
    console.log("Error: Options paramter missing");
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

Mango.prototype.setStoryStatus = function (options, cb) {
  var that = this;

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

// To test:
var opts = {
  "projectId": "892984",
  "token": "c0d4bc0f8ecade8f868ab1c72cccec12"
}
var mango = new Mango(opts);
//mango.getProject();
//mango.getStories(function (stories) {
  //console.log(stories);
//});

// Can pass one of the following:
// accepted, delivered, finished, started, rejected, unstarted, unscheduled
mango.getStoriesByStatus({ status: 'started' }, function (stories) {
  console.log(stories);
});

//mango.setStoryStatus({ storyId: '55340544', status: 'started' }, function (story) {
  //console.log(story);
//});
