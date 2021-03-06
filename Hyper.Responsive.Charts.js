/*!
 * HyperResponsiveCharts.js
 * Version: 1.0.0
 *
 * Copyright 2016 BBC
 * Released under the Apache 2.0 license
 * https://github.com/bbc/news-vj-chartjs-plugin-hyper-responsiveness
 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
var Chart,
    HyperResponsiveChartsPlugin,
    privateApi;

Chart = require('Chart');
Chart = typeof (Chart) === 'function' ? Chart : window.Chart;
privateApi = {};
privateApi.selectedBreakPoint = false;
privateApi.helpers = Chart.helpers;

privateApi.getUserDefinedBreakpoints = function (config) {
    var breakPoints;

    breakPoints = false;
    if (config.options.responsiveBreakPointConfig) {
        breakPoints = Object.keys(config.options.responsiveBreakPointConfig.breakPoints);
        breakPoints = breakPoints.sort(function (a, b) {
            return a - b;
        });
    }

    return breakPoints;
};

privateApi.pluginConfigSet = function (argObj) {
    var result, config;

    if (argObj && argObj.chartInstance.options.responsiveBreakPointConfig && argObj.chartInstance.options.responsive) {
        return true;
    }
    return result;
};

privateApi.updateConfigAtBreakpoint = function (argObj) {
    var config, currentBreakPoint, i, max;

    if (privateApi.pluginConfigSet(argObj)) {
        config = argObj.chartInstance.config;

        //change config back to default at non specified breakpoints
        if (argObj.size > parseInt(argObj.breakPoints[argObj.breakPoints.length - 1], 10)) {
            config = config.options.responsiveBreakPointConfig.defaultConfig(config);
            argObj.chartInstance.update(0, false);
            return true;
        }

        //loop user defined breakpoints and update config when required
        for (i = 0, max = argObj.breakPoints.length; i < max; i += 1) {
            currentBreakPoint = argObj.breakPoints[i];
            if (argObj.size < currentBreakPoint) {
                selectedBreakPoint = currentBreakPoint;
                config.options.responsiveBreakPointConfig.breakPoints[currentBreakPoint](config);
                argObj.chartInstance.update(0, false);
                break;
            }
        }
    }
};

privateApi.deBounce = function (func, wait, argObj) {
    var timeout;

    return function () {
        var context, args, later, callNow;

        context = this;
        args = argObj;
        later = function () {
            timeout = null;
            func.apply(context, [args]);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

HyperResponsiveChartsPlugin = Chart.PluginBase.extend({
    resize: function (chartInstance, size) {
        var breakPoints, updateChart;

        breakPoints = privateApi.getUserDefinedBreakpoints(chartInstance);
        updateChart = privateApi.deBounce(privateApi.updateConfigAtBreakpoint, 400, { size: size.width, breakPoints: breakPoints, chartInstance: chartInstance });
        updateChart();
    }
});

Chart.pluginService.register(new HyperResponsiveChartsPlugin());

},{"Chart":1}]},{},[2]);
