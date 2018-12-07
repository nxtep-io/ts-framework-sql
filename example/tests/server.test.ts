import * as Package from 'pjson';
import * as request from 'supertest';
import MainServer from '../api/server';


describe('api.MainServer', () => {
  it('should respond to a simple status request', async () => {
    const server = new MainServer();
    // await server.listen();

    // Perform a simple request to get a 200 response
    const response = await request(server.app).get('/')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.name).toBe(Package.name);
    expect(response.body.version).toBe(Package.version);
    await server.stop();
  });
});
