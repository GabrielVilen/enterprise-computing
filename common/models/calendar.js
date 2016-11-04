var moment = require('moment');

(function(moment) {
    var STRINGS = {
        nodiff: '',
        year: 'year',
        years: 'years',
        month: 'month',
        months: 'months',
        day: 'day',
        days: 'days',
        hour: 'hour',
        hours: 'hours',
        minute: 'minute',
        minutes: 'minutes',
        second: 'second',
        seconds: 'seconds',
        delimiter: ' '
    };
    moment.fn.preciseDiff = function(d2) {
        return moment.preciseDiff(this, d2);
    };
    moment.preciseDiff = function(d1, d2) {
        var m1 = moment(d1), m2 = moment(d2);
        if (m1.isSame(m2)) {
            return STRINGS.nodiff;
        }
        if (m1.isAfter(m2)) {
            var tmp = m1;
            m1 = m2;
            m2 = tmp;
        }

        var yDiff = m2.year() - m1.year();
        var mDiff = m2.month() - m1.month();
        var dDiff = m2.date() - m1.date();
        var hourDiff = m2.hour() - m1.hour();
        var minDiff = m2.minute() - m1.minute();
        var secDiff = m2.second() - m1.second();

        if (secDiff < 0) {
            secDiff = 60 + secDiff;
            minDiff--;
        }
        if (minDiff < 0) {
            minDiff = 60 + minDiff;
            hourDiff--;
        }
        if (hourDiff < 0) {
            hourDiff = 24 + hourDiff;
            dDiff--;
        }
        if (dDiff < 0) {
            var daysInLastFullMonth = moment(m2.year() + '-' + (m2.month() + 1), "YYYY-MM").subtract(1, 'M').daysInMonth();
            if (daysInLastFullMonth < m1.date()) { // 31/01 -> 2/03
                dDiff = daysInLastFullMonth + dDiff + (m1.date() - daysInLastFullMonth);
            } else {
                dDiff = daysInLastFullMonth + dDiff;
            }
            mDiff--;
        }
        if (mDiff < 0) {
            mDiff = 12 + mDiff;
            yDiff--;
        }

        function pluralize(num, word) {
            return num + ' ' + STRINGS[word + (num === 1 ? '' : 's')];
        }
        var result = [];

        if (yDiff) {
            result.push(pluralize(yDiff, 'year'));
        }
        if (mDiff) {
            result.push(pluralize(mDiff, 'month'));
        }
        if (dDiff) {
            result.push(pluralize(dDiff, 'day'));
        }
        if (hourDiff) {
            result.push(pluralize(hourDiff, 'hour'));
        }
        if (minDiff) {
            result.push(pluralize(minDiff, 'minute'));
        }
        if (secDiff) {
            result.push(pluralize(secDiff, 'second'));
        }

        return result.join(STRINGS.delimiter);
    };
}(moment));

module.exports = function(Calendar) {
    Calendar.timeToDate = function(eventName, cb) {

        // TODO:
        // implement a search ("findOne") operation where the name matches the "eventName"
        // and the response should be human readable (for example with momemt and the plugin preciseDiff)
        // keep in mind that the string could also not be found in the DB

        /*        function search() {
            var res;
            try {
                res = findOne(eventName); // TODO: find eventName in db?
                alert("res = "+ res);

                if(res.toString() === eventName) {
                    res = preciseDiff(Calendar, res);
                } else {
                    res = preciseDiff(Calendar);
                    Calendar.add(eventName); // TODO: store eventName in db?
                }

            } catch (e) {
                throw e;
            }
            return res;
        }


        cb(null, search());
*/
        cb(null, "NOT YET IMPLEMENTED");
    };

    Calendar.setup = function() {
        Calendar.base.setup.apply(this, arguments);

        this.remoteMethod('timeToDate', {
            description: 'Give Back the days, hours and minutes till a specific time',
            accepts: [
                {arg: 'eventName', type: 'String', required: true,
                    description: 'Event name (i.e.: chrismas'}
            ],
            returns: {arg: 'TimeToEvent', type: 'Object'},
            http: { verb: 'GET' }
        });
    };

    Calendar.setup();
};