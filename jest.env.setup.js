const sinon = require('sinon');

beforeEach(() => {
  global.chrome = {
    declarativeContent: {
      onPageChanged: {
        addRules: sinon.stub()
      },
      PageStateMatcher: sinon.stub(),
      ShowPageAction: sinon.stub()
    },
    pageAction: {
      onClicked: {
        addListener: sinon.stub()
      },
      setTitle: sinon.stub(),
      setIcon: sinon.stub()
    },
    runtime: {
      sendMessage: sinon.stub(),
      onMessage: {
        addListener: sinon.stub()
      },
      onInstalled: {
        addListener: sinon.stub()
      }
    },
    storage: {
      local: {
        get: sinon.stub(),
        set: sinon.stub()
      },
      runtime: {
        lastError: undefined
      }
    },
    tabs: {
      sendMessage: sinon.stub()
    }
  }
  window.fetch = sinon.stub();
  window.___INITIAL_STATE___ = {
    test: 'state'
  };
});

afterEach(() => {
  sinon.reset();
});