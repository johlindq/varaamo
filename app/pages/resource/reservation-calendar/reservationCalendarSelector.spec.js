import { expect } from 'chai';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import Resource, { availableHours, openingHoursMonth } from 'utils/fixtures/Resource';
import * as timeUtils from 'utils/timeUtils';
import reservationCalendarSelector from './reservationCalendarSelector';

function getState(resource) {
  return {
    api: Immutable({
      activeRequests: [],
    }),
    auth: {
      token: null,
      userId: null,
    },
    data: Immutable({
      resources: { [resource.id]: resource },
      users: {},
    }),
    ui: Immutable({
      modals: {
        open: [],
      },
      reservations: {
        selected: [],
        toEdit: ['mock-reservation'],
      },
    }),
  };
}

function getProps(id = 'some-id', date = '2015-10-10') {
  return {
    location: {
      query: {
        date,
        time: '2015-10-10T12:00:00+03:00',
      },
      hash: '#some-hash',
    },
    params: {
      id,
    },
  };
}

describe('pages/resource/reservation-calendar/reservationCalendarSelector', () => {
  const resource = Resource.build({
    availableHours,
    minPeriod: '01:00:00',
    openingHours: openingHoursMonth,
    reservations: [
      {
        begin: '2015-10-10T12:00:00+03:00',
        end: '2015-10-10T18:00:00+03:00',
        state: 'confirmed',
      },
    ],
  });

  it('returns date', () => {
    const state = getState(resource);
    const props = getProps(resource.id);
    const selected = reservationCalendarSelector(state, props);

    expect(selected.date).to.exist;
  });

  it('returns isFetchingResource', () => {
    const state = getState(resource);
    const props = getProps(resource.id);
    const selected = reservationCalendarSelector(state, props);

    expect(selected.isFetchingResource).to.exist;
  });

  it('returns isAdmin', () => {
    const state = getState(resource);
    const props = getProps(resource.id);
    const selected = reservationCalendarSelector(state, props);

    expect(selected.isAdmin).to.exist;
  });

  it('returns isEditing based on reservationsToEdit', () => {
    const state = getState(resource);
    const props = getProps(resource.id);
    const selected = reservationCalendarSelector(state, props);
    const expected = Boolean(state.ui.reservations.toEdit);

    expect(selected.isEditing).to.equal(expected);
  });

  it('returns isLoggedIn', () => {
    const state = getState(resource);
    const props = getProps(resource.id);
    const selected = reservationCalendarSelector(state, props);

    expect(selected.isLoggedIn).to.exist;
  });

  it('returns isMakingReservations', () => {
    const state = getState(resource);
    const props = getProps(resource.id);
    const selected = reservationCalendarSelector(state, props);

    expect(selected.isMakingReservations).to.exist;
  });

  it('returns isStaff', () => {
    const state = getState(resource);
    const props = getProps(resource.id);
    const selected = reservationCalendarSelector(state, props);

    expect(selected.isStaff).to.exist;
  });

  it('returns the reservation.selected from the state', () => {
    const state = getState(resource);
    const props = getProps(resource.id);
    const selected = reservationCalendarSelector(state, props);
    const expected = state.ui.reservations.selected;

    expect(selected.selected).to.equal(expected);
  });

  it('returns resource', () => {
    const state = getState(resource);
    const props = getProps(resource.id);
    const selected = reservationCalendarSelector(state, props);

    expect(selected.resource).to.exist;
  });

  it('returns time', () => {
    const state = getState(resource);
    const props = getProps(resource.id);
    const selected = reservationCalendarSelector(state, props);

    expect(selected.time).to.exist;
  });

  describe('timeSlots', () => {
    it('uses resource properties to calculate correct time slots', () => {
      const mockSlots = ['slot-1', 'slot-2'];
      simple.mock(timeUtils, 'getTimeSlots').returnWith(mockSlots);

      const state = getState(resource);
      const props = getProps(resource.id);
      const selected = reservationCalendarSelector(state, props);
      const actualArgs = timeUtils.getTimeSlots.lastCall.args;

      expect(actualArgs[0]).to.equal('2015-10-10T12:00:00+03:00');
      expect(actualArgs[1]).to.equal('2015-10-10T18:00:00+03:00');
      expect(actualArgs[2]).to.equal(resource.minPeriod);
      expect(actualArgs[3]).to.deep.equal(resource.reservations);
      expect(selected.timeSlots).to.deep.equal(mockSlots);
      simple.restore();
    });

    it('returns timeSlots as an empty array when date not in resource', () => {
      const state = getState(resource);
      const props = getProps(resource.id, '2015-10-15');
      const selected = reservationCalendarSelector(state, props);

      expect(selected.timeSlots).to.deep.equal([]);
    });

    it('returns timeSlots as an empty array when resource is not found', () => {
      const state = getState(resource);
      const props = getProps('unfetched-resource-id');
      const selected = reservationCalendarSelector(state, props);

      expect(selected.timeSlots).to.deep.equal([]);
    });
  });

  it('returns urlHash', () => {
    const state = getState(resource);
    const props = getProps(resource.id);
    const expected = props.location.hash;
    const selected = reservationCalendarSelector(state, props);

    expect(selected.urlHash).to.equal(expected);
  });

  describe('AvailabilitySelector', () => {
    let availability;

    before(() => {
      const thisResource = Resource.build({
        availableHours: [
          // Day 2015-10-01 is completely available
          {
            starts: '2015-10-01T10:00:00+03:00',
            ends: '2015-10-01T15:00:00+03:00',
          },
          {
            starts: '2015-10-01T16:00:00+03:00',
            ends: '2015-10-01T20:00:00+03:00',
          },
          // Day 2015-10-10 is partially available
          {
            starts: '2015-10-10T12:00:00+03:00',
            ends: '2015-10-10T15:00:00+03:00',
          },
          // Day 2015-10-11 is fully booked
          {
            starts: '2015-10-11T20:00:00+03:00',
            ends: '2015-10-11T20:00:00+03:00',
          },
        ],
        minPeriod: '01:00:00',
        openingHours: openingHoursMonth,
        reservations: [
          // Day 2015-10-01 is completely available
          // Day 2015-10-10 is partially available
          {
            begin: '2015-10-10T15:00:00+03:00',
            end: '2015-10-10T18:00:00+03:00',
            state: 'confirmed',
          },
          // Day 2015-10-11 is fully booked
          {
            begin: '2015-10-11T10:00:00+03:00',
            end: '2015-10-11T20:00:00+03:00',
            state: 'confirmed',
          },
          // Day 2015-10-30 is available with canceled reservation
          {
            begin: '2015-10-11T19:00:00+03:00',
            end: '2015-10-11T20:00:00+03:00',
            state: 'cancelled',
          },
          // Day 2015-10-31 is available with denied reservation
          {
            begin: '2015-10-11T19:00:00+03:00',
            end: '2015-10-11T20:00:00+03:00',
            state: 'denied',
          },
        ],
      });
      const state = getState(thisResource);
      const props = getProps(thisResource.id);
      const selected = reservationCalendarSelector(state, props);
      availability = selected.availability;
    });

    it('calculates correct percentages for completely available', () => {
      expect(availability['2015-10-01'].percentage).to.equal(100);
    });

    it('calculates correct percentages for partially available', () => {
      expect(availability['2015-10-10'].percentage).to.equal(50);
    });

    it('calculates correct percentages for fully booked', () => {
      expect(availability['2015-10-11'].percentage).to.equal(0);
    });

    it('calculates correct percentages if reservation is cancelled', () => {
      expect(availability['2015-10-30'].percentage).to.equal(100);
    });

    it('calculates correct percentages if reservation is cancelled', () => {
      expect(availability['2015-10-31'].percentage).to.equal(100);
    });
  });
});
