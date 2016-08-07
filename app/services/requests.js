import Ember from 'ember';

export default Ember.Service.extend({
  common: Ember.inject.service('common'),
  connection: Ember.inject.service('connection'),
  store: Ember.inject.service(),

  all_requests: [],
  sorted_requests: Ember.computed.sort('all_requests', function(request) {
    return request.get('timestamp').unix();
  }),
  active_requests: Ember.computed('sorted_requests.@each.isActive', 'sorted_requests.@each.isCurrent', function() {
    return this.get('sorted_requests').filter(function(request) {
      return request.get('isActive') && !request.get('isCurrent');
    });
  }),

  allowRequests: true,

  enable() {
    this.initialDataSetup();
    this.setupListeners();
  },

  initialDataSetup() {
    this.set('all_requests', []);
    this.addMyRequest();
    this.commandNext();
  },

  setupListeners() {
    var self = this;

    this.get('connection').client.on('chat', function (channel, user, message) {
      self.onChat(user, message);
    });
  },

  onChat(user, message) {
    // Song Request
    // E.g. !play Artist - Title
    var is_request = message.match(/^!play (.{2,})/i);
    if(is_request) {
      this.commandRequest({
        user: user,
        request: is_request[1]
      });
      return;
    }

    // Cancel Request
    // E.g. !cancel
    var is_cancel = message.match(/!cancel/i);
    if(is_cancel) {
      this.commandCancel(user);
      return;
    }

    // Request Status
    // E.g. !myrequest
    var is_my_request = message.match(/!myrequest/i);
    if(is_my_request) {
      this.commandMyRequest(user);
      return;
    }

    // Play Instead
    // E.g. !playinstead
    var is_play_instead = message.match(/!playinstead (.{2,})/i);
    if(is_play_instead) {
      this.commandPlayInstead({
        user: user,
        request: is_play_instead[1]
      });
      return;
    }

    // List Requests
    // E.g. !list
    // E.g. !list 2 5
    var is_list = message.match(/!list\s?(\d+)?\s?(\d+)?/i);
    if(is_list) {
      this.commandList(is_list);
      return;
    }

    // ----------------
    // PRIVATE COMMANDS
    // ----------------
    if(this.isAdmin(user)) {
      // Next Song
      // E.g. !next
      var is_next = message.match(/!next/i);
      if(is_next) {
        this.commandNext();
        return;
      }

      // Pause
      // E.g. !pause
      var is_pause = message.match(/!pause/i);
      if(is_pause) {
        this.commandPause();
        return;
      }

      // Stop Requests
      // E.g. !stoprequests
      var is_stop_requests = message.match(/!stoprequests/i);
      if(is_stop_requests) {
        this.commandStopRequests();
        return;
      }

      // Start Requests
      // E.g. !startrequests
      var is_start_requests = message.match(/!startrequests/i);
      if(is_start_requests) {
        this.commandStartRequests();
        return;
      }

      // Clear Requests
      // E.g. !clearrequests
      var is_clear = message.match(/!clear/i);
      if(is_clear) {
        this.commandClear();
        return;
      }
    }
  },

  isAdmin(user) {
    return this.get('common').isAdmin(user["username"]);
  },

  commandPlayInstead(request) {
    var previous_request = this.getUsersRequest(request.user);

    if(previous_request) {
      previous_request.set('request', request.request);
    }
  },

  commandList(range) {
    var requests_batch = [];

    var has_range = range[2] > 0;
    var range_start = range[1] || 0;
    var range_end = range[2] || range_start || 9999;

    var self = this;
    this.get('active_requests').forEach(function(request, n) {
      var request_index = n + 1;

      if(has_range && request_index < range_start) { return; }
      if(request_index > range_end) { return; }

      var request_item = `${n+1}: ${request.get('request')}`;
      requests_batch.push(request_item);

      if(n > 0 && n % 5 === 4) {
        let message = requests_batch.join(" || ");
        self.get('common').say(message);

        requests_batch = [];
      }
    });

    if(requests_batch.length) {
      var message = requests_batch.join(" || ");
      this.get('common').say(message);
    }
  },

  commandClear() {
    this.set('all_requests', []);
  },

  commandStartRequests() {
    this.set('allowRequests', true);

    var message = `
        I am now taking requests! You can request a song by typing
        '!play Artist - Title' in the chat.
    `;

    this.get("common").say(message);
  },

  commandStopRequests() {
    this.set('allowRequests', false);

    var message = `
        I have stopped requests from being added. Maybe next time!
    `;

    this.get("common").say(message);
  },

  commandRequest(data) {
    var user = data.user;

    if(!this.canRequest(user)) { return false; }

    this.addRequest(data);

    var queue_spot = this.get('active_requests').length

    var message = `Your request has been added, it is currently request #${queue_spot}.`;
    this.get('common').mentionSay(user, message);
  },

  canRequest(user) {
    if (!this.get('allowRequests')) {
      var message = `I am sorry, but I am not currently accepting requests.`;
      this.get('common').mentionSay(user, message);
      return false;
    }

    if (this.getUsersRequest(user) && !this.isAdmin(user)) {
      var message = `I am sorry, but you already have a request in the queue.`;
      this.get('common').mentionSay(user, message);
      return false;
    }

    return true;
  },

  commandMyRequest(user) {
    var request = this.getUsersRequest(user);
    var message = '';
    var request_user = request.user;

    if(request) {
      var index = this.get('active_requests').indexOf(request) + 1;

      if(index > 0) {
        message = `your request is currently at position ${index}`;
      } else if(request.get('isCurrent')) {
        message = `your request is currently being played!`;
      }
    } else {
      message = `you do not have a request.`;
      request_user = user;
    }

    this.get('common').mentionSay(request_user, message);
  },

  commandCancel(user) {
    var request = this.getUsersRequest(user);

    this.get('all_requests').removeObject(request);

    var message = `Your request has successfully been removed.`;
    this.get('common').mentionSay(user, message);
  },

  commandNext() {
    this.clearCurrentRequest();
    this.addNextRequest();
  },

  commandPause() {
    this.clearCurrentRequest();
  },

  clearCurrentRequest() {
    var current = this.getCurrentRequest();
    if(current) {
      this.finishRequest(current);
    }
  },

  addNextRequest() {
    var next = this.getNextRequest();
    if(next) {
      this.setCurrentRequest(next);
    } else {
      this.addMyRequest();
      this.commandNext();
    }
  },

  setCurrentRequest(request) {
    request.set('isCurrent', true);

    var message = `
      your request for "${request.get('request')}" is going to be played next!
    `;

    this.get('common').mentionSay(request.user, message);
  },

  finishRequest(request) {
    request.set('isActive', false);
    request.set('isCurrent', false);
    request.set('isHidden', true);
  },

  addRequest(data) {
    var user = this.get('store').createRecord('twitch-user', {
      username: data.user["username"],
      display: data.user["display-name"]
    });

    var request = Ember.Object.create({
      user: user,
      request: data.request,
      timestamp: moment(),
      isActive: true,
      isCurrent: false
    });

    this.get('all_requests').pushObject(request);
  },

  addMyRequest() {
    var request = {
      user: {
        username: this.get('connection.username'),
        "display-name": this.get('connection.username')
      },
      request: "My Choice"
    };

    this.addRequest(request);
  },

  userRequestAllowed() {
    return true;
  },

  getUsersRequest(user) {
    return this.get('all_requests')
        .filterBy('user.username', user["username"])
        .findBy('isActive', true);
  },

  getCurrentRequest() {
    return this.get('all_requests').findBy('isCurrent', true);
  },

  getNextRequest() {
    return this.get('all_requests').findBy('isActive', true);
  }
});
