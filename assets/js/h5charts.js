// Generated by CoffeeScript 1.6.2
(function() {
  var chart1, chart2, chart3, chart4, chart5, chart6, chart7, chart8, chart9, curDay, curMonth, curYear, estados, i, knob1, knob2, knob3, months, periodos, rest, spark1, spark2, tableAlerta, tableNuvens, tableProdes, today, totalPeriodos, _i;

  H5.Charts.state = "Todos";

  today = new Date();

  totalPeriodos = today.getFullYear() - 2005;

  periodos = new Array(totalPeriodos);

  curYear = today.getMonth() < 6 ? today.getFullYear() : today.getFullYear() + 1;

  curMonth = new Date().getMonth();

  curDay = new Date().getDate();

  for (i = _i = 0; 0 <= totalPeriodos ? _i <= totalPeriodos : _i >= totalPeriodos; i = 0 <= totalPeriodos ? ++_i : --_i) {
    periodos[i] = (today.getFullYear() - i - 1) + "-" + (today.getFullYear() - i);
  }

  months = {
    0: "Ago",
    1: "Set",
    2: "Out",
    3: "Nov",
    4: "Dez",
    5: "Jan",
    6: "Fev",
    7: "Mar",
    8: "Abr",
    9: "Mai",
    10: "Jun",
    11: "Jul"
  };

  estados = ["AC", "AM", "AP", "MA", "MT", "PA", "RO", "RR", "TO"];

  tableAlerta = {
    init: function() {
      var estado, _j, _len, _results;

      this.states = {};
      _results = [];
      for (_j = 0, _len = estados.length; _j < _len; _j++) {
        estado = estados[_j];
        _results.push(this.states[estado] = {});
      }
      return _results;
    },
    populate: function(state, date, value) {
      var convertDate, self;

      convertDate = function(dateStr) {
        var dArr;

        dateStr = String(dateStr);
        dArr = dateStr.split("-");
        return new Date(dArr[0], dArr[1] - 1, dArr[2]);
      };
      self = this.states[state];
      self[date] = {};
      self[date].area = value;
      self[date].date = convertDate(date);
      self[date].year = convertDate(date).getFullYear();
      self[date].month = convertDate(date).getMonth();
      return self[date].day = convertDate(date).getDate();
    }
  };

  rest = new H5.Rest({
    url: "../painel/rest",
    table: "alerta_acumulado_diario"
  });

  tableAlerta.init();

  $.each(rest.request(), function(i, properties) {
    return tableAlerta.populate(properties.estado, properties.data, parseFloat(properties.total));
  });

  tableProdes = {
    init: function() {
      var estado, period, _j, _len, _results;

      this.states = {};
      _results = [];
      for (_j = 0, _len = estados.length; _j < _len; _j++) {
        estado = estados[_j];
        this.states[estado] = {};
        _results.push((function() {
          var _k, _len1, _results1;

          _results1 = [];
          for (_k = 0, _len1 = periodos.length; _k < _len1; _k++) {
            period = periodos[_k];
            _results1.push(this.states[estado][period] = {});
          }
          return _results1;
        }).call(this));
      }
      return _results;
    },
    populate: function(period, ac, am, ap, ma, mt, pa, ro, rr, to) {
      var self;

      self = this.states;
      self.AC[period].area = ac;
      self.AM[period].area = am;
      self.AP[period].area = ap;
      self.MA[period].area = ma;
      self.MT[period].area = mt;
      self.PA[period].area = pa;
      self.RO[period].area = ro;
      self.RR[period].area = rr;
      return self.TO[period].area = to;
    }
  };

  rest = new H5.Rest({
    url: "../painel/rest",
    table: "taxa_prodes"
  });

  tableProdes.init();

  $.each(rest.request(), function(i, properties) {
    return tableProdes.populate(properties.ano_prodes.replace('/', '-'), parseFloat(properties.ac), parseFloat(properties.am), parseFloat(properties.ap), parseFloat(properties.ma), parseFloat(properties.mt), parseFloat(properties.pa), parseFloat(properties.ro), parseFloat(properties.rr), parseFloat(properties.to));
  });

  tableNuvens = {
    init: function() {
      return this.nuvem = {};
    },
    populate: function(date, value) {
      var convertDate, self;

      convertDate = function(dateStr) {
        var dArr;

        dateStr = String(dateStr);
        dArr = dateStr.split("-");
        return new Date(dArr[0], dArr[1] - 1, dArr[2]);
      };
      self = this.nuvem;
      self[date] = {};
      self[date].value = value;
      self[date].date = convertDate(date);
      self[date].year = convertDate(date).getFullYear();
      self[date].month = convertDate(date).getMonth();
      return self[date].day = convertDate(date).getDate();
    }
  };

  rest = new H5.Rest({
    url: "../painel/rest",
    table: "nuvem_deter"
  });

  tableNuvens.init();

  $.each(rest.request(), function(i, properties) {
    return tableNuvens.populate(properties.data, properties.percent);
  });

  chart1 = new H5.Charts.GoogleCharts({
    type: "Line",
    container: "chart1",
    title: "Alerta DETER: Índice Diário",
    buttons: {
      minimize: true,
      maximize: true
    },
    selects: {
      months: {
        0: 'Jan',
        1: 'Fev',
        2: 'Mar',
        3: 'Abr',
        4: 'Mai',
        5: 'Jun',
        6: 'Jul',
        7: 'Ago',
        8: 'Set',
        9: 'Out',
        10: 'Nov',
        11: 'Dez'
      },
      years: {
        2004: '2004',
        2005: '2005',
        2006: '2006',
        2007: '2007',
        2008: '2008',
        2009: '2009',
        2010: '2010',
        2011: '2011',
        2012: '2012',
        2013: '2013'
      }
    }
  });

  chart1.createContainer();

  chart1._yearsSlct.options[totalPeriodos + 1].selected = true;

  chart1._monthsSlct.options[curMonth].selected = true;

  $("#yearsSlct").on("change", function(event) {
    chart8.drawChart();
    knob1.drawChart();
    knob2.drawChart();
    knob3.drawChart();
    spark1.drawChart();
    return spark2.drawChart();
  });

  $("#monthsSlct").on("change", function(event) {
    chart3.drawChart();
    chart8.drawChart();
    knob1.drawChart();
    knob2.drawChart();
    knob3.drawChart();
    spark1.drawChart();
    return spark2.drawChart();
  });

  chart1.drawChart = function() {
    var createTable, data, day, daysInMonth, firstPeriod, options, secondPeriod, _j,
      _this = this;

    createTable = function(state) {
      var day, sum, _j, _results;

      sum = 0;
      _results = [];
      for (day = _j = 1; 1 <= daysInMonth ? _j <= daysInMonth : _j >= daysInMonth; day = 1 <= daysInMonth ? ++_j : --_j) {
        $.each(tableAlerta.states[state], function(key, reg) {
          var _ref;

          if ((firstPeriod <= (_ref = reg.date) && _ref <= secondPeriod) && reg.day === day) {
            sum += reg.area;
            return false;
          }
        });
        _results.push(_this.data.setValue(day - 1, 1, Math.round((_this.data.getValue(day - 1, 1) + sum) * 100) / 100));
      }
      return _results;
    };
    this.createChart();
    this.createDataTable();
    this.data.addColumn("number", "Dia");
    this.data.addColumn("number", "Área");
    daysInMonth = new Date(this._yearsSlct.value, this._monthsSlct.value + 1, 0).getDate();
    firstPeriod = new Date(this._yearsSlct.value, this._monthsSlct.value, 1);
    secondPeriod = new Date(this._yearsSlct.value, this._monthsSlct.value, daysInMonth);
    data = [];
    for (day = _j = 1; 1 <= daysInMonth ? _j <= daysInMonth : _j >= daysInMonth; day = 1 <= daysInMonth ? ++_j : --_j) {
      data[0] = day;
      data[1] = 0;
      this.data.addRow(data);
    }
    if (H5.Charts.state === "Todos") {
      $.each(tableAlerta.states, function(state, value) {
        return createTable(state);
      });
    } else {
      createTable(H5.Charts.state);
    }
    options = {
      title: "",
      titleTextStyle: {
        color: "#333",
        fontSize: 13
      },
      backgroundColor: "transparent",
      legend: "none",
      chartArea: {
        width: "70%",
        height: "70%"
      },
      colors: ['#3ABCFC'],
      vAxis: {
        title: "Área Km2"
      },
      hAxis: {
        title: "Dias",
        gridlines: {
          color: "#CCC",
          count: daysInMonth / 5
        }
      },
      animation: {
        duration: 500,
        easing: "inAndOut"
      }
    };
    return this.chart.draw(this.data, options);
  };

  chart2 = new H5.Charts.GoogleCharts({
    type: "Area",
    container: "chart2",
    period: 2,
    title: "Alerta DETER: Índice Mensal",
    buttons: {
      minusplus: true,
      minimize: true,
      maximize: true
    }
  });

  chart2.createContainer();

  chart2._addBtn.onclick = function() {
    chart2.options.period++;
    return chart2.drawChart();
  };

  chart2._delBtn.onclick = function() {
    chart2.options.period--;
    return chart2.drawChart();
  };

  chart2.drawChart = function() {
    var data, month, options, sumValues, _j, _k, _ref, _ref1, _ref2,
      _this = this;

    sumValues = function(year, month) {
      var firstPeriod, secondPeriod, sum;

      sum = 0;
      firstPeriod = new Date(year - 1, 7, 1);
      secondPeriod = new Date(year, 7, 0);
      if (H5.Charts.state === "Todos") {
        $.each(tableAlerta.states, function(key, state) {
          return $.each(state, function(key, reg) {
            var _ref;

            if ((firstPeriod <= (_ref = reg.date) && _ref <= secondPeriod) && reg.month === month) {
              return sum += reg.area;
            }
          });
        });
      } else {
        $.each(tableAlerta.states[H5.Charts.state], function(key, reg) {
          var _ref;

          if ((firstPeriod <= (_ref = reg.date) && _ref <= secondPeriod) && reg.month === month) {
            return sum += reg.area;
          }
        });
      }
      return Math.round(sum * 100) / 100;
    };
    this.createChart();
    this.createDataTable();
    this.data.addColumn("string", "mes");
    for (i = _j = 0, _ref = this.options.period; 0 <= _ref ? _j < _ref : _j > _ref; i = 0 <= _ref ? ++_j : --_j) {
      this.data.addColumn("number", periodos[i]);
    }
    for (month in months) {
      data = [months[month]];
      month = parseInt(month);
      if ((7 <= (_ref1 = month + 7) && _ref1 <= 11)) {
        month += 7;
      } else {
        month -= 5;
      }
      for (i = _k = 1, _ref2 = this.options.period; 1 <= _ref2 ? _k <= _ref2 : _k >= _ref2; i = 1 <= _ref2 ? ++_k : --_k) {
        data[i] = sumValues(curYear - i + 1, month);
      }
      this.data.addRow(data);
    }
    options = {
      title: "",
      titleTextStyle: {
        color: "#333",
        fontSize: 13
      },
      backgroundColor: "transparent",
      focusTarget: "category",
      chartArea: {
        width: "70%",
        height: "80%"
      },
      colors: ['#3ABCFC', '#FC2121', '#D0FC3F', '#FCAC0A', '#67C2EF', '#FF5454', '#CBE968', '#FABB3D', '#77A4BD', '#CC6C6C', '#A6B576', '#C7A258'],
      vAxis: {
        title: "Área Km2"
      },
      animation: {
        duration: 500,
        easing: "inAndOut"
      }
    };
    this._addBtn.disabled = true;
    this._delBtn.disabled = true;
    google.visualization.events.addListener(this.chart, "ready", function() {
      _this._addBtn.disabled = _this.options.period > totalPeriodos;
      return _this._delBtn.disabled = _this.options.period < 2;
    });
    return this.chart.draw(this.data, options);
  };

  chart3 = new H5.Charts.GoogleCharts({
    type: "Bar",
    container: "chart3",
    period: 1,
    title: "Alerta DETER: Índice Períodos",
    buttons: {
      minusplus: true,
      minimize: true,
      maximize: true
    }
  });

  chart3.createContainer();

  chart3._addBtn.onclick = function() {
    chart3.options.period++;
    return chart3.drawChart();
  };

  chart3._delBtn.onclick = function() {
    chart3.options.period--;
    return chart3.drawChart();
  };

  chart3.drawChart = function() {
    var data, options, sumAvg, sumAvgValues, sumTotal, sumTotalValues, sumValues, _j, _ref,
      _this = this;

    sumValues = function(firstPeriod, secondPeriod) {
      var sum;

      sum = 0;
      if (H5.Charts.state === "Todos") {
        $.each(tableAlerta.states, function(key, state) {
          return $.each(state, function(key, reg) {
            var _ref;

            if ((firstPeriod <= (_ref = reg.date) && _ref <= secondPeriod)) {
              return sum += reg.area;
            }
          });
        });
      } else {
        $.each(tableAlerta.states[H5.Charts.state], function(key, reg) {
          var _ref;

          if ((firstPeriod <= (_ref = reg.date) && _ref <= secondPeriod)) {
            return sum += reg.area;
          }
        });
      }
      return Math.round(sum * 100) / 100;
    };
    sumTotalValues = function(year) {
      var firstPeriod, secondPeriod;

      firstPeriod = new Date(year - 1, 7, 1);
      secondPeriod = new Date(year, 7, 0);
      return sumValues(firstPeriod, secondPeriod);
    };
    sumAvgValues = function(year) {
      var firstPeriod, month, secondPeriod;

      month = parseInt(chart1._monthsSlct.value);
      firstPeriod = new Date(year - 1, 7, 1);
      if (month > 6) {
        secondPeriod = new Date(year - 1, month + 1, 0);
      } else if (month !== curMonth) {
        secondPeriod = new Date(year, month + 1, 0);
      } else {
        secondPeriod = new Date(year, month, curDay);
      }
      return sumValues(firstPeriod, secondPeriod);
    };
    this.createChart();
    this.createDataTable();
    this.data.addColumn("string", "Ano");
    this.data.addColumn("number", "Parcial");
    this.data.addColumn("number", "Diferença");
    for (i = _j = 0, _ref = this.options.period; 0 <= _ref ? _j <= _ref : _j >= _ref; i = 0 <= _ref ? ++_j : --_j) {
      data = [periodos[i]];
      sumTotal = sumTotalValues(curYear - i);
      sumAvg = sumAvgValues(curYear - i);
      data[1] = sumAvg;
      data[2] = Math.round((sumTotal - sumAvg) * 100) / 100;
      this.data.addRow(data);
    }
    options = {
      title: "",
      titleTextStyle: {
        color: "#333",
        fontSize: 13
      },
      backgroundColor: "transparent",
      focusTarget: "category",
      chartArea: {
        width: "68%",
        height: "76%"
      },
      colors: ['#3ABCFC', '#FC2121'],
      vAxis: {
        title: "Periodos"
      },
      hAxis: {
        title: "Área Km2"
      },
      bar: {
        groupWidth: "80%"
      },
      isStacked: true,
      animation: {
        duration: 500,
        easing: "inAndOut"
      }
    };
    this._addBtn.disabled = true;
    this._delBtn.disabled = true;
    google.visualization.events.addListener(this.chart, "ready", function() {
      _this._addBtn.disabled = _this.options.period > totalPeriodos - 1;
      return _this._delBtn.disabled = _this.options.period < 2;
    });
    return this.chart.draw(this.data, options);
  };

  chart4 = new H5.Charts.GoogleCharts({
    type: "Column",
    container: "chart4",
    period: 2,
    title: "Alerta DETER: UFs",
    buttons: {
      minusplus: true,
      minimize: true,
      maximize: true
    }
  });

  chart4.createContainer();

  chart4._addBtn.onclick = function() {
    chart4.options.period++;
    return chart4.drawChart();
  };

  chart4._delBtn.onclick = function() {
    chart4.options.period--;
    return chart4.drawChart();
  };

  chart4.drawChart = function() {
    var data, j, options, sumValues, _j, _k, _ref, _ref1,
      _this = this;

    sumValues = function(state, year) {
      var firstPeriod, secondPeriod, sum;

      sum = 0;
      firstPeriod = new Date(year - 1, 7, 1);
      secondPeriod = new Date(year, 7, 0);
      $.each(tableAlerta.states[state], function(key, reg) {
        var _ref;

        if ((firstPeriod <= (_ref = reg.date) && _ref <= secondPeriod)) {
          return sum += reg.area;
        }
      });
      return Math.round(sum * 100) / 100;
    };
    this.createChart();
    this.createDataTable();
    this.data.addColumn("string", "mes");
    for (i = _j = 0, _ref = this.options.period; 0 <= _ref ? _j < _ref : _j > _ref; i = 0 <= _ref ? ++_j : --_j) {
      this.data.addColumn("number", periodos[i]);
    }
    if (H5.Charts.state === "Todos") {
      $.each(tableAlerta.states, function(state, reg) {
        var data, j, _k, _ref1;

        data = [state];
        for (j = _k = 1, _ref1 = _this.options.period; 1 <= _ref1 ? _k <= _ref1 : _k >= _ref1; j = 1 <= _ref1 ? ++_k : --_k) {
          data[j] = sumValues(state, curYear - j + 1);
        }
        return _this.data.addRow(data);
      });
    } else {
      data = [H5.Charts.state];
      for (j = _k = 1, _ref1 = this.options.period; 1 <= _ref1 ? _k <= _ref1 : _k >= _ref1; j = 1 <= _ref1 ? ++_k : --_k) {
        data[j] = sumValues(H5.Charts.state, curYear - j + 1);
      }
      this.data.addRow(data);
    }
    options = {
      title: "",
      titleTextStyle: {
        color: "#333",
        fontSize: 13
      },
      backgroundColor: "transparent",
      focusTarget: "category",
      chartArea: {
        width: "70%",
        height: "76%"
      },
      colors: ['#3ABCFC', '#FC2121', '#D0FC3F', '#FCAC0A', '#67C2EF', '#FF5454', '#CBE968', '#FABB3D', '#77A4BD', '#CC6C6C', '#A6B576', '#C7A258'],
      bar: {
        groupWidth: "100%"
      },
      vAxis: {
        title: "Área Km2"
      },
      animation: {
        duration: 500,
        easing: "inAndOut"
      }
    };
    this._addBtn.disabled = true;
    this._delBtn.disabled = true;
    google.visualization.events.addListener(this.chart, "ready", function() {
      _this._addBtn.disabled = _this.options.period > totalPeriodos;
      return _this._delBtn.disabled = _this.options.period < 2;
    });
    return this.chart.draw(this.data, options);
  };

  chart5 = new H5.Charts.GoogleCharts({
    type: "Area",
    container: "chart5",
    title: "Taxa PRODES|Alerta DETER: Acumulado Períodos",
    buttons: {
      minimize: true,
      maximize: true
    }
  });

  chart5.createContainer();

  chart5.drawChart = function() {
    var data, options, sumDeter, sumProdes;

    sumDeter = function(year) {
      var firstPeriod, secondPeriod, sum;

      sum = 0;
      firstPeriod = new Date(year - 1, 7, 1);
      secondPeriod = new Date(year, 7, 0);
      if (H5.Charts.state === "Todos") {
        $.each(tableAlerta.states, function(key, state) {
          return $.each(state, function(key, reg) {
            var _ref;

            if ((firstPeriod <= (_ref = reg.date) && _ref <= secondPeriod)) {
              return sum += reg.area;
            }
          });
        });
      } else {
        $.each(tableAlerta.states[H5.Charts.state], function(key, reg) {
          var _ref;

          if ((firstPeriod <= (_ref = reg.date) && _ref <= secondPeriod)) {
            return sum += reg.area;
          }
        });
      }
      if (sum >= 0) {
        return Math.round(sum * 100) / 100;
      }
    };
    sumProdes = function(period) {
      var sum;

      sum = 0;
      if (H5.Charts.state === "Todos") {
        $.each(tableProdes.states, function(key, state) {
          return sum += state[period].area;
        });
      } else {
        sum = tableProdes.states[H5.Charts.state][period].area;
      }
      if (sum >= 0) {
        return sum;
      }
    };
    this.createChart();
    this.createDataTable();
    this.data.addColumn("string", "Ano");
    this.data.addColumn("number", "Alerta DETER");
    this.data.addColumn("number", "Taxa PRODES");
    i = totalPeriodos;
    while (i >= 0) {
      data = [periodos[i]];
      data[1] = sumDeter(curYear - i);
      data[2] = sumProdes(periodos[i]);
      this.data.addRow(data);
      i--;
    }
    options = {
      title: "",
      titleTextStyle: {
        color: "#333",
        fontSize: 13
      },
      backgroundColor: "transparent",
      focusTarget: "category",
      chartArea: {
        width: "70%",
        height: "80%"
      },
      colors: ['#3ABCFC', '#D0FC3F'],
      vAxis: {
        title: "Área Km2"
      },
      hAxis: {
        title: "Periodos"
      },
      animation: {
        duration: 500,
        easing: "inAndOut"
      }
    };
    return this.chart.draw(this.data, options);
  };

  chart6 = new H5.Charts.GoogleCharts({
    type: "Column",
    container: "chart6",
    period: 1,
    title: "Taxa PRODES|Alerta DETER: UFs",
    buttons: {
      minimize: true,
      maximize: true,
      arrows: true
    }
  });

  chart6.createContainer();

  chart6.changeTitle(periodos[chart6.options.period]);

  chart6._leftBtn.onclick = function() {
    chart6.options.period++;
    return chart6.drawChart();
  };

  chart6._rightBtn.onclick = function() {
    chart6.options.period--;
    return chart6.drawChart();
  };

  chart6.drawChart = function() {
    var data, options, sumDeter, sumProdes,
      _this = this;

    sumDeter = function(state, year) {
      var firstPeriod, secondPeriod, sum;

      sum = 0;
      firstPeriod = new Date(year - 1, 7, 1);
      secondPeriod = new Date(year, 7, 0);
      $.each(tableAlerta.states[state], function(key, reg) {
        var _ref;

        if ((firstPeriod <= (_ref = reg.date) && _ref <= secondPeriod)) {
          return sum += reg.area;
        }
      });
      return Math.round(sum * 100) / 100;
    };
    sumProdes = function(state, year) {
      var period, sum;

      sum = 0;
      period = (year - 1) + "-" + year;
      $.each(tableProdes.states[state], function(key, reg) {
        if (key === period) {
          if (reg.area != null) {
            return sum += reg.area;
          }
        }
      });
      return Math.round(sum * 100) / 100;
    };
    this.createChart();
    this.createDataTable();
    this.data.addColumn("string", "Estado");
    this.data.addColumn("number", "Alerta DETER");
    this.data.addColumn("number", "Taxa PRODES");
    if (H5.Charts.state === "Todos") {
      $.each(tableAlerta.states, function(state, reg) {
        var data;

        data = [state];
        data[1] = sumDeter(state, curYear - _this.options.period);
        data[2] = sumProdes(state, curYear - _this.options.period);
        return _this.data.addRow(data);
      });
    } else {
      data = [H5.Charts.state];
      data[1] = sumDeter(H5.Charts.state, curYear - this.options.period);
      data[2] = sumProdes(H5.Charts.state, curYear - this.options.period);
      this.data.addRow(data);
    }
    options = {
      title: "",
      titleTextStyle: {
        color: "#333",
        fontSize: 13
      },
      backgroundColor: "transparent",
      focusTarget: "category",
      chartArea: {
        width: "70%",
        height: "76%"
      },
      colors: ['#3ABCFC', '#D0FC3F'],
      bar: {
        groupWidth: "100%"
      },
      vAxis: {
        title: "Área Km2"
      },
      animation: {
        duration: 500,
        easing: "inAndOut"
      }
    };
    this.changeTitle("Taxa PRODES|Alerta DETER: UFs [" + periodos[this.options.period] + "]");
    this._rightBtn.disabled = true;
    this._leftBtn.disabled = true;
    google.visualization.events.addListener(this.chart, "ready", function() {
      _this._rightBtn.disabled = _this.options.period < 2;
      return _this._leftBtn.disabled = _this.options.period >= totalPeriodos;
    });
    return this.chart.draw(this.data, options);
  };

  chart7 = new H5.Charts.GoogleCharts({
    type: "Pie",
    container: "chart7",
    period: 0,
    buttons: {
      arrows: true,
      minimize: true,
      maximize: true
    }
  });

  chart7.createContainer();

  chart7.changeTitle(periodos[chart7.options.period]);

  chart7._leftBtn.onclick = function() {
    chart7.options.period++;
    return chart7.drawChart();
  };

  chart7._rightBtn.onclick = function() {
    chart7.options.period--;
    return chart7.drawChart();
  };

  chart7.drawChart = function() {
    var data, estado, options, sumValues, _j, _ref,
      _this = this;

    sumValues = function(state, year) {
      var firstPeriod, secondPeriod, sum;

      sum = 0;
      firstPeriod = new Date(year - 1, 7, 1);
      secondPeriod = new Date(year, 7, 0);
      $.each(tableAlerta.states[state], function(key, reg) {
        var _ref;

        if ((firstPeriod <= (_ref = reg.date) && _ref <= secondPeriod)) {
          return sum += reg.area;
        }
      });
      return Math.round(sum * 100) / 100;
    };
    this.createChart();
    this.createDataTable();
    this.data.addColumn("string", "mes");
    this.data.addColumn("number", periodos[totalPeriodos]);
    for (i = _j = 0, _ref = estados.length; 0 <= _ref ? _j < _ref : _j > _ref; i = 0 <= _ref ? ++_j : --_j) {
      estado = estados[i];
      data = [estado];
      data[1] = sumValues(estados[i], curYear - this.options.period);
      this.data.addRow(data);
    }
    options = {
      title: "",
      titleTextStyle: {
        color: "#333",
        fontSize: 13
      },
      chartArea: {
        width: "90%",
        height: "80%"
      },
      colors: ['#3ABCFC', '#FC2121', '#D0FC3F', '#FCAC0A', '#67C2EF', '#FF5454', '#CBE968', '#FABB3D', '#77A4BD', '#CC6C6C', '#A6B576', '#C7A258'],
      backgroundColor: "transparent"
    };
    this.changeTitle(periodos[this.options.period]);
    this._rightBtn.disabled = true;
    this._leftBtn.disabled = true;
    google.visualization.events.addListener(this.chart, "ready", function() {
      _this._rightBtn.disabled = _this.options.period < 1;
      return _this._leftBtn.disabled = _this.options.period >= totalPeriodos;
    });
    return this.chart.draw(this.data, options);
  };

  chart8 = new H5.Charts.GoogleCharts({
    type: "Pie",
    container: "chart8",
    period: 1,
    buttons: {
      minimize: true,
      maximize: true
    }
  });

  chart8.createContainer();

  chart8.drawChart = function() {
    var data, daysInMonth, estado, firstPeriod, options, pieText, pieTooltip, secondPeriod, sumValues, _j, _ref;

    sumValues = function(state) {
      var sum;

      sum = 0;
      $.each(tableAlerta.states[state], function(key, reg) {
        var _ref;

        if ((firstPeriod <= (_ref = reg.date) && _ref <= secondPeriod)) {
          return sum += reg.area;
        }
      });
      if (firstPeriod > today) {
        return 1;
      } else {
        return Math.round(sum * 100) / 100;
      }
    };
    this.createChart();
    this.createDataTable();
    this.data.addColumn("string", "Estado");
    this.data.addColumn("number", "Área Total");
    daysInMonth = new Date(chart1._yearsSlct.value, chart1._monthsSlct.value + 1, 0).getDate();
    firstPeriod = new Date(chart1._yearsSlct.value, chart1._monthsSlct.value, 1);
    secondPeriod = new Date(chart1._yearsSlct.value, chart1._monthsSlct.value, daysInMonth);
    if (firstPeriod > today) {
      pieText = "none";
      pieTooltip = "none";
    } else {
      pieText = "percent";
      pieTooltip = "focus";
    }
    for (i = _j = 0, _ref = estados.length; 0 <= _ref ? _j < _ref : _j > _ref; i = 0 <= _ref ? ++_j : --_j) {
      estado = estados[i];
      data = [estado];
      data[1] = sumValues(estados[i]);
      this.data.addRow(data);
    }
    this.changeTitle(chart1._monthsSlct.options[chart1._monthsSlct.value].label + ", " + chart1._yearsSlct.value);
    options = {
      title: "",
      titleTextStyle: {
        color: "#333",
        fontSize: 13
      },
      backgroundColor: "transparent",
      focusTarget: "category",
      pieSliceText: pieText,
      tooltip: {
        trigger: pieTooltip
      },
      chartArea: {
        width: "90%",
        height: "80%"
      },
      colors: ['#3ABCFC', '#FC2121', '#D0FC3F', '#FCAC0A', '#67C2EF', '#FF5454', '#CBE968', '#FABB3D', '#77A4BD', '#CC6C6C', '#A6B576', '#C7A258'],
      bar: {
        groupWidth: "100%"
      },
      vAxis: {
        title: "Área Km2"
      },
      animation: {
        duration: 500,
        easing: "inAndOut"
      }
    };
    return this.chart.draw(this.data, options);
  };

  chart9 = new H5.Charts.GoogleCharts({
    type: "Line",
    container: "chart9",
    period: 2,
    title: "Alerta DETER: Taxa(%) de Nuvens",
    buttons: {
      minusplus: true,
      minimize: true,
      maximize: true
    }
  });

  chart9.createContainer();

  chart9._addBtn.onclick = function() {
    chart9.options.period++;
    return chart9.drawChart();
  };

  chart9._delBtn.onclick = function() {
    chart9.options.period--;
    return chart9.drawChart();
  };

  chart9.drawChart = function() {
    var data, month, options, sumValues, _j, _k, _ref, _ref1, _ref2,
      _this = this;

    sumValues = function(year, month) {
      var firstPeriod, percent, secondPeriod;

      percent = 0;
      firstPeriod = new Date(year - 1, 7, 1);
      secondPeriod = new Date(year, 7, 0);
      $.each(tableNuvens.nuvem, function(key, nuvem) {
        if (nuvem.date >= firstPeriod && nuvem.date <= secondPeriod && nuvem.month === month) {
          percent = nuvem.value;
          return false;
        }
      });
      return Math.round(percent * 100);
    };
    this.createChart();
    this.createDataTable();
    this.data.addColumn("string", "mes");
    for (i = _j = 0, _ref = this.options.period; 0 <= _ref ? _j < _ref : _j > _ref; i = 0 <= _ref ? ++_j : --_j) {
      this.data.addColumn("number", periodos[i]);
    }
    for (month in months) {
      data = [months[month]];
      month = parseInt(month);
      if ((7 <= (_ref1 = month + 7) && _ref1 <= 11)) {
        month += 7;
      } else {
        month -= 5;
      }
      for (i = _k = 1, _ref2 = this.options.period; 1 <= _ref2 ? _k <= _ref2 : _k >= _ref2; i = 1 <= _ref2 ? ++_k : --_k) {
        data[i] = sumValues(curYear - i + 1, month);
      }
      this.data.addRow(data);
    }
    options = {
      title: "",
      titleTextStyle: {
        color: "#333",
        fontSize: 13
      },
      backgroundColor: "transparent",
      focusTarget: "category",
      chartArea: {
        width: "70%",
        height: "80%"
      },
      colors: ['#3ABCFC', '#FC2121', '#D0FC3F', '#FCAC0A', '#67C2EF', '#FF5454', '#CBE968', '#FABB3D', '#77A4BD', '#CC6C6C', '#A6B576', '#C7A258'],
      vAxis: {
        title: "Porcentagem"
      },
      animation: {
        duration: 500,
        easing: "inAndOut"
      }
    };
    this._addBtn.disabled = true;
    this._delBtn.disabled = true;
    google.visualization.events.addListener(this.chart, "ready", function() {
      _this._addBtn.disabled = _this.options.period > totalPeriodos - 4;
      return _this._delBtn.disabled = _this.options.period < 2;
    });
    return this.chart.draw(this.data, options);
  };

  spark1 = new H5.Charts.Sparks({
    container: "spark1",
    title: "Total Mensal"
  });

  spark1.createContainer();

  spark1.drawChart = function() {
    var createTable, data, day, daysInMonth, firstPeriod, secondPeriod, value, _j,
      _this = this;

    createTable = function(state) {
      var day, dayValue, _j, _results;

      dayValue = 0;
      _results = [];
      for (day = _j = 1; 1 <= daysInMonth ? _j <= daysInMonth : _j >= daysInMonth; day = 1 <= daysInMonth ? ++_j : --_j) {
        $.each(tableAlerta.states[state], function(key, reg) {
          var _ref;

          if ((firstPeriod <= (_ref = reg.date) && _ref <= secondPeriod) && reg.day === day) {
            dayValue += reg.area;
            return false;
          }
        });
        _results.push(data[day - 1] = Math.round((data[day - 1] + dayValue) * 100) / 100);
      }
      return _results;
    };
    daysInMonth = new Date(chart1._yearsSlct.value, chart1._monthsSlct.value + 1, 0).getDate();
    firstPeriod = new Date(chart1._yearsSlct.value, chart1._monthsSlct.value, 1);
    secondPeriod = new Date(chart1._yearsSlct.value, chart1._monthsSlct.value, daysInMonth);
    data = [];
    for (day = _j = 1; 1 <= daysInMonth ? _j <= daysInMonth : _j >= daysInMonth; day = 1 <= daysInMonth ? ++_j : --_j) {
      data[day - 1] = 0;
    }
    if (H5.Charts.state === "Todos") {
      $.each(tableAlerta.states, function(state, value) {
        return createTable(state);
      });
    } else {
      createTable(H5.Charts.state);
    }
    value = data[daysInMonth - 1];
    return this.updateInfo(data, value);
  };

  spark2 = new H5.Charts.Sparks({
    container: "spark2",
    title: "Total Período"
  });

  spark2.createContainer();

  spark2.drawChart = function() {
    var data, sumValues, value,
      _this = this;

    sumValues = function(year, month) {
      var firstPeriod, secondPeriod, sum;

      sum = 0;
      firstPeriod = new Date(year - 1, 7, 1);
      secondPeriod = new Date(year, 7, 0);
      if (H5.Charts.state === "Todos") {
        $.each(tableAlerta.states, function(key, state) {
          return $.each(state, function(key, reg) {
            if (reg.date >= firstPeriod && reg.date <= secondPeriod && reg.month === month) {
              return sum += reg.area;
            }
          });
        });
      } else {
        $.each(tableAlerta.states[H5.Charts.state], function(key, reg) {
          if (reg.date >= firstPeriod && reg.date <= secondPeriod && reg.month === month) {
            return sum += reg.area;
          }
        });
      }
      return Math.round(sum * 100) / 100;
    };
    data = [];
    $.each(months, function(number, month) {
      var _ref;

      i = number;
      number = parseInt(number);
      if ((7 <= (_ref = number + 7) && _ref <= 11)) {
        number += 7;
      } else {
        number -= 5;
      }
      return data[i] = sumValues(chart1._yearsSlct.value, number);
    });
    value = 0;
    $.each(data, function() {
      return value += this;
    });
    return this.updateInfo(data, Math.round(value * 100) / 100);
  };

  knob1 = new H5.Charts.Knobs({
    container: "knob1",
    title: "Taxa VAA",
    popover: "Taxa de variação em relação ao mesmo mês do ano anterior"
  });

  knob1.createContainer();

  knob1.drawChart = function() {
    var periodDeforestationRate, value;

    periodDeforestationRate = function(year, month) {
      var curDate, curValue, preDate, preValue, sumValues;

      sumValues = function(date) {
        var reg, state, sum, _ref, _ref1;

        sum = 0;
        if (H5.Charts.state === "Todos") {
          for (state in tableAlerta.states) {
            for (reg in tableAlerta.states[state]) {
              reg = tableAlerta.states[state][reg];
              if ((date.getFullYear() <= (_ref = reg.year) && _ref <= date.getFullYear()) && reg.month === date.getMonth()) {
                sum += reg.area;
              }
            }
          }
        } else {
          for (reg in tableAlerta.states[H5.Charts.state]) {
            reg = tableAlerta.states[H5.Charts.state][reg];
            if ((date.getFullYear() <= (_ref1 = reg.year) && _ref1 <= date.getFullYear()) && reg.month === date.getMonth()) {
              sum += reg.area;
            }
          }
        }
        return sum;
      };
      curDate = new Date(year, month);
      preDate = new Date(year - 1, month);
      curValue = sumValues(curDate);
      preValue = sumValues(preDate);
      if (preValue === 0) {
        return 0;
      } else {
        return Math.round((curValue - preValue) / preValue * 100);
      }
    };
    value = periodDeforestationRate(parseInt(chart1._yearsSlct.value), parseInt(chart1._monthsSlct.value));
    return this.updateInfo(value);
  };

  knob2 = new H5.Charts.Knobs({
    container: "knob2",
    title: "Taxa VMA",
    popover: "Taxa de variação em relação ao mês anterior"
  });

  knob2.createContainer();

  knob2.drawChart = function() {
    var periodDeforestationRate, value;

    periodDeforestationRate = function(year, month) {
      var curDate, curValue, preDate, preValue, sumValues;

      sumValues = function(date) {
        var reg, state, sum, _ref, _ref1;

        sum = 0;
        if (H5.Charts.state === "Todos") {
          for (state in tableAlerta.states) {
            for (reg in tableAlerta.states[state]) {
              reg = tableAlerta.states[state][reg];
              if ((date.getFullYear() <= (_ref = reg.year) && _ref <= date.getFullYear()) && reg.month === date.getMonth()) {
                sum += reg.area;
              }
            }
          }
        } else {
          for (reg in tableAlerta.states[H5.Charts.state]) {
            reg = tableAlerta.states[H5.Charts.state][reg];
            if ((date.getFullYear() <= (_ref1 = reg.year) && _ref1 <= date.getFullYear()) && reg.month === date.getMonth()) {
              sum += reg.area;
            }
          }
        }
        return sum;
      };
      curDate = new Date(year, month);
      preDate = new Date(year, month - 1);
      curValue = sumValues(curDate);
      preValue = sumValues(preDate);
      if (preValue === 0) {
        return 0;
      } else {
        return Math.round((curValue - preValue) / preValue * 100);
      }
    };
    value = periodDeforestationRate(parseInt(chart1._yearsSlct.value), parseInt(chart1._monthsSlct.value));
    return this.updateInfo(value);
  };

  knob3 = new H5.Charts.Knobs({
    container: "knob3",
    title: "Taxa VPA",
    popover: "Taxa de variação em relação ao período PRODES anterior"
  });

  knob3.createContainer();

  knob3.drawChart = function() {
    var periodDeforestationAvgRate, value;

    periodDeforestationAvgRate = function(year, month) {
      var curValue, preValue, sumPeriods, sumValues;

      sumValues = function(firstPeriod, secondPeriod) {
        var sum;

        sum = 0;
        if (H5.Charts.state === "Todos") {
          $.each(tableAlerta.states, function(key, state) {
            return $.each(state, function(key, reg) {
              var _ref;

              if ((firstPeriod <= (_ref = reg.date) && _ref <= secondPeriod)) {
                return sum += reg.area;
              }
            });
          });
        } else {
          $.each(tableAlerta.states[H5.Charts.state], function(key, reg) {
            var _ref;

            if ((firstPeriod <= (_ref = reg.date) && _ref <= secondPeriod)) {
              return sum += reg.area;
            }
          });
        }
        return Math.round(sum * 100) / 100;
      };
      if (month > 6) {
        year++;
      } else {
        year;
      }
      sumPeriods = function(year, month) {
        var firstPeriod, secondPeriod;

        firstPeriod = new Date(year - 1, 7, 1);
        secondPeriod = new Date(year, month + 1, 0);
        return sumValues(firstPeriod, secondPeriod);
      };
      curValue = sumPeriods(year, month);
      preValue = sumPeriods(year - 1, month);
      if (preValue === 0) {
        return 0;
      } else {
        return Math.round((curValue - preValue) / preValue * 100);
      }
    };
    value = periodDeforestationAvgRate(parseInt(chart1._yearsSlct.value), parseInt(chart1._monthsSlct.value));
    return this.updateInfo(value);
  };

  this.reloadCharts = function() {
    chart1.drawChart();
    chart2.drawChart();
    chart3.drawChart();
    chart4.drawChart();
    chart5.drawChart();
    chart6.drawChart();
    chart7.drawChart();
    chart8.drawChart();
    chart9.drawChart();
    knob1.drawChart();
    knob2.drawChart();
    knob3.drawChart();
    spark1.drawChart();
    return spark2.drawChart();
  };

}).call(this);
