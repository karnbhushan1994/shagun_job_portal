export const preSaveMiddleware = function(next) {
    this.applicantsCount = this.applicants.length;
    next();
  };
  