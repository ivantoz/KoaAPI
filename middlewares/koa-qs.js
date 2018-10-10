/* eslint-disable no-multi-assign */

const qs = require('qs');

module.exports = (app) => {
  const updated = {
    /**
     * Get parsed query-string.
     *
     * @return {Object}
     * @api public
     */

    get query() {
      const str = this.querystring;

      const c = this._querycache = this._querycache || {};

      let query = c[str];
      if (!query) {
        c[str] = query = qs.parse(str, { allowDots: true, arrayLimit: 100 });
      }
      return query;
    },

    /**
     * Set query-string as an object.
     *
     * @param {Object} obj
     * @api public
     */

    set query(obj) {
      this.querystring = qs.stringify(obj, { allowDots: true });
    },
  };

  const descriptor = Object.getOwnPropertyDescriptor(updated, 'query');
  Object.defineProperty(app.request, 'query', descriptor);

  return app;
};
