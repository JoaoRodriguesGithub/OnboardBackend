module.exports = function forbiddenError(message = 'Access denied') {
  this.name = 'forbiddenError';
  this.message = message;
};
