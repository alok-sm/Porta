'use strict';

describe('Controller: RootCtrl', function () {

  // load the controller's module
  beforeEach(module('viewerApp'));

  var RootCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RootCtrl = $controller('RootCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RootCtrl.awesomeThings.length).toBe(3);
  });
});
