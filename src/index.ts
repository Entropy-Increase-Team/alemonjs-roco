import router from './router';

export default defineChildren({
  register() {
    return {
      responseRouter: router
    };
  },
  onCreated() {
    logger.info('洛克王国助手 Server Done');
  }
});
