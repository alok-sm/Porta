'use strict';

describe('Controller: AggregateCtrl', function () {

  // load the controller's module
  beforeEach(module('viewerApp'));

  var AggregateCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AggregateCtrl = $controller('AggregateCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AggregateCtrl.awesomeThings.length).toBe(3);
  });
});
