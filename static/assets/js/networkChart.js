var NetworkChart = function(placeholder, opts) {
  this.placeholder = placeholder;

  this.points = [{
    data: [],
    color: '#F77A52',
    name: 'TX (Bytes)'
  }, {
    data: [],
    color: '#BDF271',
    name: 'RX (Bytes)'
  }];
};

NetworkChart.prototype.init = function() {
  var self = this;

  this.graph = new Rickshaw.Graph({
    element: document.getElementById(self.placeholder),
    renderer: 'line',
    series: self.points
  });

  this.xAxis = new Rickshaw.Graph.Axis.Time({
    graph: self.graph,
    ticksTreatment: 'glow'
  });

  this.yAxis = new Rickshaw.Graph.Axis.Y({
    graph: self.graph,
    tickFormat: function(y) {
      var abs_y = Math.abs(y);
      if (abs_y >= 1125899906842624) {
        return parseInt(y / 1125899906842624) + "PB";
      } else if (abs_y >= 1099511627776) {
        return parseInt(y / 1099511627776) + "TB";
      } else if (abs_y >= 1073741824) {
        return parseInt(y / 1073741824) + "GB";
      } else if (abs_y >= 1048576) {
        return parseInt(y / 1048576) + "MB";
      } else if (abs_y >= 1024) {
        return parseInt(y / 1024) + "KB";
      } else if (abs_y < 1 && y > 0) {
        return parseInt(y);
      } else if (abs_y === 0) {
        return '';
      } else {
        return parseInt(y);
      }
    },
    ticks: 5,
    ticksTreatment: 'glow'
  });

  self.hoverDetail = new Rickshaw.Graph.HoverDetail({
    graph: self.graph,
    formatter: function(series, x, y) {
      var date = '<span class="date">' + new Date(x * 1000).toUTCString() + '</span>';
      var swatch = '<span class="detail_swatch" style="background-color: ' + series.color + '"></span>';
      var content = swatch + series.name + ": " + parseInt(y) + '<br>' + date;
      return content;
    }
  });
};

NetworkChart.prototype.draw = function() {
  var self = this;
  this.graph.configure({
    width: $('#' + self.placeholder).width(),
    height: $('#' + self.placeholder).height()
  });
  this.graph.render();
  this.xAxis.render();
  this.yAxis.render();
};

NetworkChart.prototype.appendData = function(data, nulls) {
  this.formatData(data);
  this.draw();
};

NetworkChart.prototype.formatData = function(data) {
  this.points[0].data = [];
  for (var i = 0; i < data.length; i++) {
    var reading = data[i];
    this.points[0].data.push({
      'x': parseInt(reading.time),
      'y': parseInt(reading.nettx)
    });
    this.points[1].data.push({
      'x': parseInt(reading.time),
      'y': parseInt(reading.netrx)
    });
  }
};
