var moment = require('moment');
var xml = require('xml');

function getDuration (duration, timescale) {
  return 'PT' + (duration / timescale).toFixed(2) + 'S';
}

function getAttr (props, mediaPresentationDuration) {
  var _attr = {};
  const {
    minBufferTime,
    minimumUpdatePeriod,
    suggestedPresentationDelay,
    availabilityStartTime
  } = props;

  var schema = {
    'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
    'xmlns': 'urn:mpeg:dash:schema:mpd:2011',
    'xmlns:xlink': 'http://www.w3.org/1999/xlink',
    'xsi:schemaLocation': 'urn:mpeg:DASH:schema:MPD:2011 http://standards.iso.org/ittf/PubliclyAvailableStandards/MPEG-DASH_schema_files/DASH-MPD.xsd',
    'profiles': 'urn:mpeg:dash:profile:isoff-live:2011',
    'type': 'dynamic',
    minBufferTime
  };

  if (!mediaPresentationDuration) {
    _attr = Object.assign(schema, {
      minimumUpdatePeriod,
      suggestedPresentationDelay,
      availabilityStartTime,
      publishTime: props.publishTime,
    });
  } else {
    _attr = Object.assign(schema, {
      type: 'static',
      mediaPresentationDuration,
    });
  }

  return { _attr };
}

function getSegmentDuration (connection, expression, props, done) {
  connection.Segment.findAll(expression)
    .then((segments) => {
      const duration =
        segments.reduce((result, current) => {
          return result + current.duration;
        }, 0);

      const timeline = [];
      const median = duration / segments.length;
      const publishTimeOffset = (duration / props.SegmentTemplate.timescale) - 5;
      const publishTime = moment(props.availabilityStartTime)
        .add(publishTimeOffset, 'seconds').format('YYYY-MM-DDTHH:mm:ss');
      const first = parseInt(median);
      const it = segments.length - 1;
      const last = duration - first - parseInt(median) * it;

      // for (var i = 0; i < segments.length; i++) {
      //   timeline.push({
      //     S: [{
      //       _attr: {
      //         d: segments[i].duration
      //       }
      //     }]
      //   });
      // }

      timeline.push({
        S: [{
          _attr: {
            t: 0,
            d: first
          }
        }]
      });

      timeline.push({
        S: [{
          _attr: {
            r: it,
            d: parseInt(median)
          }
        }]
      });

      if (last > 0) {
        timeline.push({
          S: [{
            _attr: {
              d: last
            }
          }]
        });
      }

      return done(null, timeline, duration, publishTime);
    })
  ;
}

function generateMpd({ attr, props, SegmentTimeline, sessionGuid }) {
  var representation = {
    Representation: [
      {
        _attr: Object.assign(props.Representation, { frameRate: '25/1' })
      },
      {
        SegmentTemplate: [
          {
            _attr: {
              timescale: props.SegmentTemplate.timescale,
              initialization: sessionGuid + '_init-stream$RepresentationID$.m4s',
              media: sessionGuid + '_$Number%05d$.m4s',
              startNumber: '0'
            }
          },
          {
            SegmentTimeline
          }
        ]
      }
    ]
  };

  var adaptationSet = {
    AdaptationSet: [
      {
        _attr: {
          contentType: "video",
          segmentAlignment: "true",
          bitstreamSwitching: "true",
          frameRate: '25/1'
        }
      },
      representation
    ]
  };

  var _attr = {
    _attr: {
      'start': 'PT0.0S'
    }
  };

  var periodSection = {
    Period: [
      _attr,
      adaptationSet
    ]
  };

  var programSection = {
    ProgramInformation: [
      {
        'Title': 'Media Presentation'
      }
    ]
  };

  var sections = [
    attr,
    programSection,
    periodSection
  ];

  var ret = [
    {
      MPD: sections
    }
  ];

  return ret;
}

function generateManifest ({ connection, sessionGuid, query = {} }, done) {
  connection.Session.findOne({ where: { sessionGuid } })
    .then((session) => {
      const props = session.mpdProps;
      const { startTime, endTime } = query;
      const live = !Object.keys(query).length > 0;
      var attr;
      var expression;

      if (live) {
        expression = {
          order: '"chunkNumber" ASC',
          where: {
            sessionGuid,
            createdAt: {
              $lt: moment().subtract(30, 'seconds').valueOf()
            }
          }
        };
      } else {
        if (!startTime || !endTime) {
          return done(
            new Error('Неверный параметр в query: startTime или endTime')
          );
        }
        const s = moment(startTime).valueOf();
        const e = moment(endTime).valueOf();
        expression = { where: { createdAt: { $lt: e, $gt: s } } };
      }
      getSegmentDuration(connection, expression, props, (err, SegmentTimeline, duration, publishTime) => {
        if (live) {
          props.publishTime = publishTime;
          attr = getAttr(props);
        } else {
          attr = getAttr(
            props, getDuration(duration, props.SegmentTemplate.timescale)
          );
        }

        return done(null,
          xml(generateMpd({ attr, props, SegmentTimeline, sessionGuid }),
            { declaration: { encoding: 'UTF-8' } })
        );
      })
    })
    .catch(done)
  ;
}

module.exports = generateManifest;
