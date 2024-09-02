const { Sequelize } = require('sequelize');

export default {

  /**
   * Get Boat By location
   */
  getBoatByLocation(latitudeCoordinate, longitudeCoordinate) {
    const boatLatitude = '(SELECT latitude FROM boats WHERE boats.id = boat.id)';
    const boatLongitude = '(SELECT longitude FROM boats WHERE boats.id = boat.id)';
    return [
      Sequelize.literal(
        `SELECT id FROM boats HAVING (3959 * ACOS( COS( RADIANS(${latitudeCoordinate})) * COS( RADIANS(${boatLatitude}) ) * COS( RADIANS(${boatLongitude}) - RADIANS(${longitudeCoordinate})) + SIN(RADIANS(${latitudeCoordinate})) * SIN(RADIANS(${boatLatitude})))) < 30`,
      ),
    ];
  },

  /**
   * Get Event By location
   */
  getEventByLocation(latitudeCoordinate, longitudeCoordinate) {
    const eventLatitude = '(SELECT latitude FROM events WHERE events.id = event.id)';
    const eventLongitude = '(SELECT longitude FROM events WHERE events.id = event.id)';
    return [
      Sequelize.literal(
        `SELECT id FROM events HAVING (3959 * ACOS( COS( RADIANS(${latitudeCoordinate})) * COS( RADIANS(${eventLatitude}) ) * COS( RADIANS(${eventLongitude}) - RADIANS(${longitudeCoordinate})) + SIN(RADIANS(${latitudeCoordinate})) * SIN(RADIANS(${eventLatitude})))) < 30`,
      ),
    ];
  },

};
