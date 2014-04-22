var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('applications', {

    id:             { type: 'int', primaryKey: true, autoIncrement: true },

    full_name:      { type: 'string', notNull: true },
    organization:   { type: 'string' },

    email:          { type: 'string', notNull: true },
    phone:          { type: 'string', notNull: true },
    website:        { type: 'string' },

    ripple_address: { type: 'string', notNull: true },

    ripple_name:    { type: 'string', notNull: true },

    justification:  { type: 'string', notNull: true },

    destination_tag: { type: 'string', notNull: true},

    paid:           { type: 'boolean', defaultValue: false },

    createdAt:      { type: 'datetime', notNull: true },
    updatedAt:      { type: 'datetime' }

  }, callback);

};

exports.down = function(db, callback) {
  db.dropTable('applications', callback);
};

