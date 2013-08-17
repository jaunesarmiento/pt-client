Mango.js
===

```bash
$ npm install
```

## Usage

```javascript
var opts = {
  "projectId": "YOUR_PROJECT_ID",
  "token": "YOUR_PIVOTAK_TRACKER_API_KEY"
}

// Initialize Mango.js
var mango = new Mango(opts);

// Returns the stories under the project
mango.getStories(function (stories) {
  // do stuff with stories
});

// Returns a list of stories with status 'started' under the project
mango.getStoriesByStatus({ status: 'started' }, function (stories) {
  // do stuff with stories
});

// Sets the status of story with id 55340544 to 'started'
mango.setStoryStatus({ storyId: '55340544', status: 'started' }, function (story) {
  // do other stuff with the story
});

// Gets the list of tasks under story with id 55340544
mango.getStoryTasks({ storyId: '55340544' }, function (tasks) {
  // do stuff with tasks
});
```
