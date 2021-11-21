class DetailThread {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.title = payload.title;
    this.body = payload.body;
    this.date = payload.date;
    this.username = payload.username;
  }

  _verifyPayload(payload) {
    const {
      id, title, body, date, username,
    } = payload;

    [id, title, body, date, username].forEach((item) => {
      if (!item) {
        throw new Error('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
      }
      if (typeof item !== 'string') {
        throw new Error('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
      }
    });
  }
}

module.exports = DetailThread;
