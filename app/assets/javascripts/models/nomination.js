Resistance.Nomination = DS.Model.extend({
  mission: DS.belongsTo('mission'),
  players: DS.hasMany('player'),
  votes: DS.hasMany('vote')
});
