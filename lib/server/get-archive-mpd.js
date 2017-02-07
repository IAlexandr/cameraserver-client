var moment = require('moment');
var xml = require('xml');
var uuid = require('uuid');

function getNoVideoSegments({session, segments, hourInSeconds}) {
  var duration = 0;
  var i = 0;
  var timePassed = 0;

  while ((timePassed < hourInSeconds) || i < segments.length) {
    timePassed = duration / session.mpdProps.SegmentTemplate.timescale;
    duration += segments[i].duration;
    i++;
  }

  if (timePassed) {
    return segments.slice(0, i);
  }

  return [];
}

function getNoVideoTime(previousSession, nextSession) {
  const previousSessionDt = moment(previousSession.stoppedAt);
  const nextSessionDt = moment(nextSession.startedAt);
  var hours = 0;
  var minutes = 0;
  var seconds = 0;

  if ((nextSessionDt.get('date') - previousSessionDt.get('date')) === 0) {
    hours = (
      nextSessionDt.get('hour') - previousSessionDt.get('hour')
    ) * 3600;
    minutes = (
      nextSessionDt.get('minute') - previousSessionDt.get('minute')
    ) * 60;
    seconds = (
      nextSessionDt.get('second') - previousSessionDt.get('second')
    );
  }

  return hours + minutes + seconds;
}

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

function getSegment(start, session, segments) {
  const periodArchiveDuration =
    segments.reduce((result, current) => {
      return result + current.duration;
    }, 0);

  const SegmentTimeline = [];
  const median = periodArchiveDuration / (segments.length - 1);
  const publishTimeOffset =
    (periodArchiveDuration / session.mpdProps.SegmentTemplate.timescale) - 5;
  const publishTime = moment(session.mpdProps.availabilityStartTime)
    .add(publishTimeOffset, 'seconds').format('YYYY-MM-DDTHH:mm:ss');
  const first = 0;
  const it = segments.length - 1;
  const last = periodArchiveDuration - parseInt(median) * it;
  SegmentTimeline.push({
    S: [{
      _attr: {
        t: 0,
        d: 0
      }
    }]
  });

  SegmentTimeline.push({
    S: [{
      _attr: {
        r: it,
        d: parseInt(median)
      }
    }]
  });

  if (last > 0) {
    SegmentTimeline.push({
      S: [{
        _attr: {
          d: last
        }
      }]
    });
  }

  const representationAttr = Object.assign(session.mpdProps.Representation, { frameRate: '25/1', id: 0 });

  const segmentInitialization = `${session.sessionGuid}_init-stream$RepresentationID$.m4s`;

  const segmentMedia = `${session.sessionGuid}_$Number%05d$.m4s`;

  const section = {
    Period: [
      {_attr: {
        id: uuid.v4(),
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

function generateManifest({
  sessions,
  segments,
  noVideoSession,
  noVideoSegments,
  startDate,
  endDate
}) {
  var deltaTime = 0;

  const startDt = moment(startDate);
  const endDt = moment(endDate);
  const sessionStartedAt = moment(sessions[0].startedAt);
  var sessionStoppedAt;

  if (sessions[0].stoppedAt) {
    sessionStoppedAt = moment(sessions[0].stoppedAt);
  }

  // var hours = 0;
  // var resiude = 0;
  var startTime = 0;

  const startElapsedSeconds = Math.abs(sessionStartedAt.diff(startDt) / 1000);
  var stopElapsedSeconds = 0;

  if (sessionStoppedAt) {
    stopElapsedSeconds = endDt.diff(sessionStoppedAt) / 1000;
  }

  if (startElapsedSeconds <= 86400) {
    deltaTime = startElapsedSeconds;
  }

  if (stopElapsedSeconds <= 86400 && stopElapsedSeconds > 0) {
    deltaTime += stopElapsedSeconds;
  }

  for (var i = 1; i < sessions.length; i++) {
    deltaTime += getNoVideoTime(sessions[i - 1], sessions[i]);
  }

  const archiveDuration =
    segments.reduce((result, current) => result + current.duration, 0);

  const formattedDuration =
    `PT${(archiveDuration/sessions[0].mpdProps.SegmentTemplate.timescale + deltaTime).toFixed(2)}S`;

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

  if (startElapsedSeconds <= 86400) {
    const hoursBefore = Math.floor(startElapsedSeconds / 3600);
    const resiudeBefore = startElapsedSeconds - hoursBefore * 3600;

    if (hoursBefore) {
      for (var i = 0; i < hoursBefore; i++) {
        raw.MPD.push(getSegment(
          startTime,
          noVideoSession,
          getNoVideoSegments({
            session: noVideoSession,
            segments: noVideoSegments,
            hourInSeconds: 3600
          })
        ));
        startTime += 3600;
      }

      if (resiudeBefore) {
        raw.MPD.push(getSegment(
          startTime,
          noVideoSession,
          getNoVideoSegments({
            session: noVideoSession,
            segments: noVideoSegments,
            hourInSeconds: resiudeBefore
          })
        ));

        startTime += resiudeBefore;
      }
    } else {
      raw.MPD.push(getSegment(
        startTime,
        noVideoSession,
        getNoVideoSegments({
          session: noVideoSession,
          segments: noVideoSegments,
          hourInSeconds: resiudeBefore
        })
      ));
      startTime += resiudeBefore;
    }
  }

  for (var i = 0; i < sessions.length; i++) {
    var periodArchiveDuration;
    var noVideoElapsed = 0;

    if ((i - 1) >= 0) {
      noVideoElapsed = getNoVideoTime(sessions[i - 1], sessions[i]);

      if (noVideoElapsed) {
        const hoursBetween = Math.floor(noVideoElapsed / 3600);
        const resiudeBetween = noVideoElapsed - hoursBetween * 3600;

        if (hoursBetween) {
          for (var i = 0; i < hoursBetween; i++) {
            raw.MPD.push(getSegment(
              startTime.toFixed(2),
              noVideoSession,
              getNoVideoSegments({
                session: noVideoSession,
                segments: noVideoSegments,
                hourInSeconds: 3600
              })
            ));
            startTime += 3600;
          }

          if (resiudeBetween) {
            raw.MPD.push(getSegment(
              startTime.toFixed(2),
              noVideoSession,
              getNoVideoSegments({
                session: noVideoSession,
                segments: noVideoSegments,
                hourInSeconds: resiudeBetween
              })
            ));

            startTime += resiudeBetween;
          }
        } else {
          raw.MPD.push(getSegment(
            startTime.toFixed(2),
            noVideoSession,
            getNoVideoSegments({
              session: noVideoSession,
              segments: noVideoSegments,
              hourInSeconds: resiudeBetween
            })
          ));
          startTime += resiudeBetween;
        }
      }
    }

    raw.MPD.push(getSegment(
      startTime.toFixed(2),
      sessions[i],
      segments.filter(
        segment => segment.sessionGuid === sessions[i].sessionGuid
      )
    ));

    periodArchiveDuration =
      segments
        .filter(
          segment => segment.sessionGuid === sessions[i].sessionGuid
        )
        .reduce((result, current) => {
        return result + current.duration;
      }, 0);

    startTime +=
      periodArchiveDuration / sessions[i].mpdProps.SegmentTemplate.timescale;
  }

  if (stopElapsedSeconds <= 86400 && stopElapsedSeconds > 0) {
    const hoursAfter = Math.floor(stopElapsedSeconds / 3600);
    const resiudeAfter = stopElapsedSeconds - hoursAfter * 3600;

    if (hoursAfter) {
      for (var i = 0; i < hoursAfter; i++) {
        raw.MPD.push(getSegment(
          startTime.toFixed(2),
          noVideoSession,
          getNoVideoSegments({
            session: noVideoSession,
            segments: noVideoSegments,
            hourInSeconds: 3600
          })
        ));
        startTime += 3600;
      }

      if (resiudeAfter) {
        raw.MPD.push(getSegment(
          startTime.toFixed(2),
          noVideoSession,
          getNoVideoSegments({
            session: noVideoSession,
            segments: noVideoSegments,
            hourInSeconds: resiudeAfter
          })
        ));

        startTime += resiudeAfter;
      }
    } else {
      raw.MPD.push(getSegment(
        startTime.toFixed(2),
        noVideoSession,
        getNoVideoSegments({
          session: noVideoSession,
          segments: noVideoSegments,
          hourInSeconds: resiudeAfter
        })
      ));
      startTime += resiudeAfter;
    }
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
