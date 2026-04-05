class MockFile {
  constructor(uri) {
    this.uri = uri;
  }

  async arrayBuffer() {
    return new ArrayBuffer(0);
  }
}

module.exports = {
  File: MockFile,
};
