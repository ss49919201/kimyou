export default {
  async tail(events, env) {
    console.log(JSON.stringify(events));
    console.log(JSON.stringify(env));
  },
};
