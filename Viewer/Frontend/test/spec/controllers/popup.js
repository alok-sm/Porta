'use strict';

describe('Controller: PopupCtrl', function () {

  // load the controller's module
  beforeEach(module('viewerApp'));

  var PopupCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PopupCtrl = $controller('PopupCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PopupCtrl.awesomeThings.length).toBe(3);
  });
});
