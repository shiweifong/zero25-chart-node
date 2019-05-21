'use strict';

/* Controllers */

angular.module('upApp.landingController', []).
  controller('landingController', ['$scope', '$http'
        , function ($scope, $http) {

        var dateSelected = moment();
        var dateSelectedStart = moment(dateSelected.format("YYYY-MM-DDT00:00:00Z")).toISOString();
        var dateSelectedEnd = moment(dateSelected.format("YYYY-MM-DDT23:59:59Z")).toISOString();

        // Create chart
        var chart = am4core.create("chartdiv", am4charts.XYChart);
        chart.paddingRight = 20;

        chart.dataSource.url = "/mzero25/event/getAirIonData?StartDateTime=" + dateSelectedStart + '&EndDateTime=' + dateSelectedEnd;
        chart.dataSource.parser = new am4core.JSONParser();
        chart.dataSource.parser.options.emptyAs = 0;
        chart.dataSource.events.on("parseended", function(ev) {
            var data = ev.target.data.Data;
            for (var i = 0; i < data.length; i++) {
                data[i]["create_date"] = new Date(data[i]["create_date"]);
            }
            ev.target.data = data;
        });

        // TIME BASED CHART DATA
        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.baseInterval = {
            "timeUnit": "minute",
            "count": 1
        };
        dateAxis.tooltipDateFormat = "HH:mm, d MMMM";

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;
        valueAxis.title.text = "Negative Air Ions";

        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.dateX = "create_date";
        series.dataFields.valueY = "data";
        series.tooltipText = "Negative Air Ions: [bold]{valueY}[/]";
        series.fillOpacity = 0.3;

        chart.cursor = new am4charts.XYCursor();
        chart.cursor.lineY.opacity = 0;
        chart.scrollbarX = new am4charts.XYChartScrollbar();
        chart.scrollbarX.series.push(series);

        $('#dtp').datetimepicker({
            format: 'L',
            showTodayButton : true,
            date : dateSelected
        });

        $("#dtp").on('dp.change', function(e){
            dateSelectedStart = moment(moment(e.date).format("YYYY-MM-DDT00:00:00Z")).toISOString();
            dateSelectedEnd = moment(moment(e.date).format("YYYY-MM-DDT23:59:59Z")).toISOString();
            var nUrl = "/mzero25/event/getAirIonData?StartDateTime=" + dateSelectedStart + '&EndDateTime=' + dateSelectedEnd;
            chart.dataSource.url = nUrl;
            chart.dataSource.load();
        })

    }])