var moment = require('moment');
var xml = require('xml');

function getHeader(minBufferTime, mediaPresentationDuration) {
  return {
    _attr: {
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'xmlns': 'urn:mpeg:dash:schema:mpd:2011',
      'xmlns:xlink': 'http://www.w3.org/1999/xlink',
      'xsi:schemaLocation': 'urn:mpeg:DASH:schema:MPD:2011 http://standards.iso.org/ittf/PubliclyAvailableStandards/MPEG-DASH_schema_files/DASH-MPD.xsd',
      'profiles': 'urn:mpeg:dash:profile:isoff-live:2011',
      'type': 'static',
      minBufferTime,
      mediaPresentationDuration
    }
  };
}

function getSegment(index, start, session, segments) {
  const periodArchiveDuration =
    segments.reduce((result, current) => {
      return result + current.duration;
    }, 0);

  const SegmentTimeline = [];
  const median = periodArchiveDuration / segments.length;
  const publishTimeOffset =
    (periodArchiveDuration / session.mpdProps.SegmentTemplate.timescale) - 5;
  const publishTime = moment(session.mpdProps.availabilityStartTime)
    .add(publishTimeOffset, 'seconds').format('YYYY-MM-DDTHH:mm:ss');
  const first = parseInt(median);
  const it = segments.length - 2;
  // const last = periodArchiveDuration - parseInt(median) * it;

  for (var i = 0; i < segments.length; i++) {
    SegmentTimeline.push({
      S: [{
        _attr: {
          d: segments[i].duration | 0
        }
      }]
    });
  }

  // SegmentTimeline.push({
  //   S: [{
  //     _attr: {
  //       t: 0,
  //       d: 0
  //     }
  //   }]
  // });
  //
  // SegmentTimeline.push({
  //   S: [{
  //     _attr: {
  //       r: it,
  //       d: first
  //     }
  //   }]
  // });

  // if (last > 0) {
  //   SegmentTimeline.push({
  //     S: [{
  //       _attr: {
  //         d: last
  //       }
  //     }]
  //   });
  // }

  const representationAttr = Object.assign(session.mpdProps.Representation, { frameRate: '25/1', id: 0 });

  const segmentInitialization = `${session.sessionGuid}_init-stream$RepresentationID$.m4s`;

  const segmentMedia = `${session.sessionGuid}_$Number%05d$.m4s`;

  const section = {
    Period: [
      {_attr: {
        id: index,
        'start': `PT${start}S`
      }},
      {AdaptationSet: [
        {
          _attr: {
            contentType: "video",
            segmentAlignment: "true",
            bitstreamSwitching: "true",
            frameRate: '25/1'
          }
        },
        {Representation: [
          {
            _attr: representationAttr
          },
          {
            SegmentTemplate: [
              {
                _attr: {
                  timescale: session.mpdProps.SegmentTemplate.timescale,
                  initialization: segmentInitialization,
                  media: segmentMedia,
                  startNumber: '0'
                }
              },
              {
                SegmentTimeline: SegmentTimeline
              }
            ]
          }
        ]}
      ]}
    ]
  };

  return section;
}

function generateManifest(
  sessions,
  segments
) {
  const archiveDuration =
    segments.reduce((result, current) => result + current.duration, 0);

  const formattedDuration =
    `PT${(archiveDuration/sessions[0].mpdProps.SegmentTemplate.timescale).toFixed(2)}S`;

  const xmlHeader = getHeader(
    sessions[0].mpdProps.minBufferTime, formattedDuration
  );

  const raw = {
    MPD: [
      xmlHeader,
      {ProgramInformation: [
        {
          'Title': 'Media Presentation'
        }
      ]}
    ]
  };

  for (var i = 0; i < sessions.length; i++) {
    var periodArchiveDuration;
    var startTime = 0;

    if ((i - 1) >= 0) {
      periodArchiveDuration =
        segments
          .filter(segment => segment.sessionGuid === sessions[i-1].sessionGuid)
          .reduce((result, current) => {
          return result + current.duration;
        }, 0);

      startTime =
        (periodArchiveDuration / sessions[i-1].mpdProps.SegmentTemplate.timescale).toFixed(2);
    }

    const offset = periodArchiveDuration /

    raw.MPD.push(getSegment(
      i,
      startTime,
      sessions[i],
      segments.filter(
        segment => segment.sessionGuid === sessions[i].sessionGuid
      )
    ));
  }

  return xml(
    [raw],
    {
      declaration: {
        encoding: 'UTF-8'
      }
    }
  );
}

module.exports = generateManifest;
