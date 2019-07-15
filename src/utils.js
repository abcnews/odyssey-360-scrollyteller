function createRef() {
  const ref = function(x) {
    ref.current = x;
  };

  ref(null);

  return ref;
}

module.exports = {
  createRef
};
