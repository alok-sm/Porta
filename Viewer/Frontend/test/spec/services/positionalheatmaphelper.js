'use strict';

describe('Service: positionalHeatmapHelper', function () {

  // load the service's module
  beforeEach(module('viewerApp'));

  // instantiate service
  var positionalHeatmapHelper;
  beforeEach(inject(function (_positionalHeatmapHelper_) {
    positionalHeatmapHelper = _positionalHeatmapHelper_;
  }));

  it('should do something', function () {
    expect(!!positionalHeatmapHelper).toBe(true);
  });

});
