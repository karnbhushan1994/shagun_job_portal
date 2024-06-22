export const preFindOneAndUpdateMiddleware = function(next) {
    const update = this.getUpdate();
    if (update.$push && update.$push.applicants) {
      this.update({}, { $inc: { applicantsCount: 1 } });
    } else if (update.$pull && update.$pull.applicants) {
      this.update({}, { $inc: { applicantsCount: -1 } });
    }
    next();
  };
  